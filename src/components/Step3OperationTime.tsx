import React, { useState, useEffect } from 'react';
import { Quest, AgentProfile } from '../types';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { soundManager } from '../utils/audio';
import { Play, Pause, RotateCcw, Clock, ArrowRight, BookOpen, Sparkles, MessageSquare } from 'lucide-react';

interface Step3OperationTimeProps {
  quest: Quest;
  agent: AgentProfile;
  onProceedToReport: () => void;
  onBackToBoard: () => void;
}

export const Step3OperationTime: React.FC<Step3OperationTimeProps> = ({
  quest,
  agent,
  onProceedToReport,
  onBackToBoard,
}) => {
  // 5-minute timer (300 seconds)
  const TOTAL_SECONDS = 300;
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [scriptMode, setScriptMode] = useState<'all' | 'dialogue'>('all');
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);

  // Assigned student names per role (optional interactive role assignment)
  const [roleAssignments, setRoleAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            soundManager.playTimerDone();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => {
    soundManager.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    soundManager.playClick();
    setIsTimerRunning(false);
    setTimeLeft(TOTAL_SECONDS);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-3 sm:px-4 space-y-5">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border-2 border-slate-700 p-3 sm:p-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <span>QUEST #{quest.id}</span>
            <span>·</span>
            <span>{quest.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2 mt-0.5">
            <span>{quest.icon}</span>
            <span>{quest.title}</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onBackToBoard}
          className="text-xs font-bold text-slate-400 hover:text-slate-200 underline text-left sm:text-right"
        >
          ◀ 다른 퀘스트 선택하기
        </button>
      </div>

      {/* Mandatory Classroom Notice Banner */}
      <div className="bg-amber-400 text-slate-950 p-4 border-4 border-black shadow-[4px_4px_0_#000] text-center">
        <div className="text-lg sm:text-xl font-black flex items-center justify-center gap-2">
          <span>📢</span>
          <span>친구들과 5분 동안 역할극을 진행하고 돌아오세요!</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
          모둠 친구들과 역할을 정한 뒤 아래 대본을 바탕으로 실감 나게 연기해 보세요.
        </p>
      </div>

      {/* 5-Minute Timer & Control Bar */}
      <div className="bg-slate-950 border-4 border-cyan-400 p-4 shadow-[4px_4px_0_#000]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-cyan-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-cyan-300">오프라인 역할극 타이머</div>
              <div className="text-3xl font-black text-amber-300 tracking-wider">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Timer Buttons */}
          <div className="flex items-center gap-2">
            <PixelButton
              variant={isTimerRunning ? 'danger' : 'success'}
              size="normal"
              onClick={toggleTimer}
              icon={isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            >
              {isTimerRunning ? '일시정지' : '5분 시작'}
            </PixelButton>
            <button
              type="button"
              onClick={resetTimer}
              title="타이머 리셋"
              className="p-3 bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-slate-300"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-700 h-3 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-amber-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Section 1: Incident Summary */}
      <PixelCard title="📜 사건 요약 (무슨 상황인가요?)" variant="dark">
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-semibold">
          {quest.summary}
        </p>
        <div className="mt-3 p-3 bg-slate-900 border-l-4 border-amber-400 text-xs sm:text-sm text-amber-200">
          ✨ <strong>핵심 배움:</strong> {quest.keyLearning}
        </div>
      </PixelCard>

      {/* Section 2: Character Roles Assignment */}
      <PixelCard title={`👥 등장인물 및 배역 정하기 (${quest.roles.length}명)`} variant="dark">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quest.roles.map((role) => (
            <div
              key={role.name}
              className="bg-slate-900 border-2 border-slate-700 p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-lg font-black text-amber-300">
                  <span className="text-2xl">{role.avatar}</span>
                  <span>{role.name}</span>
                </div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">
                  {role.roleTitle}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Optional Friend Name Input */}
              <div className="mt-3 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  맡은 친구 이름:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={roleAssignments[role.name] || ''}
                  onChange={(e) =>
                    setRoleAssignments({
                      ...roleAssignments,
                      [role.name]: e.target.value,
                    })
                  }
                  placeholder="예: 민재"
                  className="w-full bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          ))}
        </div>
      </PixelCard>

      {/* Section 3: RPG Script View */}
      <PixelCard
        title="💬 갈등 해결 가이드 대본"
        badge={scriptMode === 'all' ? '전체 보기' : '대화창 모드'}
        variant="gold"
      >
        {/* View Toggle */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => setScriptMode('all')}
            className={`px-3 py-1.5 text-xs font-bold border-2 transition-colors ${
              scriptMode === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <BookOpen size={14} className="inline mr-1" /> 대본 전체 보기
          </button>
          <button
            type="button"
            onClick={() => setScriptMode('dialogue')}
            className={`px-3 py-1.5 text-xs font-bold border-2 transition-colors ${
              scriptMode === 'dialogue'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <MessageSquare size={14} className="inline mr-1" /> RPG 대화창 모드
          </button>
        </div>

        {scriptMode === 'all' ? (
          /* Full Script View */
          <div className="space-y-3">
            {quest.script.map((line, idx) => {
              const assignedName = roleAssignments[line.speaker];
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 border-2 border-slate-800 p-3.5 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black">
                      {line.speaker}
                      {assignedName ? ` (${assignedName})` : ''}
                    </span>
                    <span className="text-xs text-cyan-400 italic">
                      ({line.actionOrTone})
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-100 font-bold leading-relaxed pl-1">
                    "{line.text}"
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Interactive RPG Dialogue Box Mode */
          <div className="bg-slate-950 border-4 border-amber-400 p-4 sm:p-6 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-3">
              <span>
                대화 진행 ({dialogueIndex + 1} / {quest.script.length})
              </span>
              <span>스페이스바나 아래 버튼으로 다음 대사 확인</span>
            </div>

            <div className="min-h-[120px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 text-sm font-black border-2 border-black">
                  {quest.script[dialogueIndex].speaker}
                  {roleAssignments[quest.script[dialogueIndex].speaker]
                    ? ` (${roleAssignments[quest.script[dialogueIndex].speaker]})`
                    : ''}
                </span>
                <span className="text-xs sm:text-sm text-cyan-300 italic font-semibold">
                  ({quest.script[dialogueIndex].actionOrTone})
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-black text-slate-100 leading-snug mt-2">
                "{quest.script[dialogueIndex].text}"
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-slate-800">
              <button
                type="button"
                disabled={dialogueIndex === 0}
                onClick={() => {
                  soundManager.playClick();
                  setDialogueIndex((prev) => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 bg-slate-900 border-2 border-slate-700 text-slate-300 font-bold text-xs disabled:opacity-30"
              >
                ◀ 이전 대사
              </button>
              <button
                type="button"
                disabled={dialogueIndex === quest.script.length - 1}
                onClick={() => {
                  soundManager.playClick();
                  setDialogueIndex((prev) => Math.min(quest.script.length - 1, prev + 1));
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-black font-bold text-xs disabled:opacity-30"
              >
                다음 대사 ▶
              </button>
            </div>
          </div>
        )}
      </PixelCard>

      {/* Primary Proceed Action Button */}
      <div className="pt-4 pb-8 text-center">
        <PixelButton
          variant="primary"
          size="large"
          onClick={() => {
            soundManager.playClick();
            onProceedToReport();
          }}
          className="w-full sm:w-auto text-xl md:text-2xl px-8 py-5 shadow-[0_6px_0_#78350f]"
          icon={<ArrowRight size={24} />}
        >
          역할극 완료! 결과 보고하기 📝
        </PixelButton>
      </div>
    </div>
  );
};
