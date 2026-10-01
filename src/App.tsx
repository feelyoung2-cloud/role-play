import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { Step1CharacterCreate } from './components/Step1CharacterCreate';
import { Step2QuestBoard } from './components/Step2QuestBoard';
import { Step3OperationTime } from './components/Step3OperationTime';
import { Step4ResultReport } from './components/Step4ResultReport';
import { Step5QuestClear } from './components/Step5QuestClear';
import { AgentProfile, Quest, MissionReport } from './types';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'peace_quest_state_v1';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [report, setReport] = useState<MissionReport | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Restore local session on first load if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.agent) setAgent(parsed.agent);
        if (parsed.selectedQuest) setSelectedQuest(parsed.selectedQuest);
        if (parsed.report) setReport(parsed.report);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          agent,
          selectedQuest,
          report,
        })
      );
    } catch {
      // Fallback
    }
  }, [currentStep, agent, selectedQuest, report]);

  const handleStartAgent = (newAgent: AgentProfile) => {
    setAgent(newAgent);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReport = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitReport = (newReport: MissionReport) => {
    setReport(newReport);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm('정말 처음 화면으로 돌아가시겠습니까?')) {
      setCurrentStep(1);
      setSelectedQuest(null);
      setReport(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Fallback
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChooseAnotherQuest = () => {
    setSelectedQuest(null);
    setReport(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col relative selection:bg-amber-400 selection:text-black">
      {/* Background Subtle Retro Grid Lines */}
      <div className="fixed inset-0 pointer-events-none scanlines-overlay opacity-40 z-30" />

      {/* Top Bar Header */}
      <HeaderNav
        currentStep={currentStep}
        agentName={agent?.name}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleReset}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-6 z-10">
        {currentStep === 1 && <Step1CharacterCreate onStart={handleStartAgent} />}

        {currentStep === 2 && agent && (
          <Step2QuestBoard agent={agent} onSelectQuest={handleSelectQuest} />
        )}

        {currentStep === 3 && agent && selectedQuest && (
          <Step3OperationTime
            quest={selectedQuest}
            agent={agent}
            onProceedToReport={handleProceedToReport}
            onBackToBoard={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && agent && selectedQuest && (
          <Step4ResultReport
            quest={selectedQuest}
            agent={agent}
            onSubmitReport={handleSubmitReport}
            onBackToScript={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && report && (
          <Step5QuestClear
            report={report}
            onRestart={handleChooseAnotherQuest}
          />
        )}
      </main>

      {/* Simple Retro Footer */}
      <footer className="w-full py-4 border-t-2 border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500 z-10">
        <p>4학년 교실 평화 수호 프로젝트 · 도덕 및 창의적 체험활동 갈등 해결 프로그램</p>
      </footer>
    </div>
  );
}
