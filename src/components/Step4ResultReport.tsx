import React, { useState } from 'react';
import { Quest, AgentProfile, EmotionLevel, MissionReport } from '../types';
import { EMOTIONS } from '../data/quests';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { soundManager } from '../utils/audio';
import { Heart, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface Step4ResultReportProps {
  quest: Quest;
  agent: AgentProfile;
  onSubmitReport: (report: MissionReport) => void;
  onBackToScript: () => void;
}

export const Step4ResultReport: React.FC<Step4ResultReportProps> = ({
  quest,
  agent,
  onSubmitReport,
  onBackToScript,
}) => {
  const [beforeEmotion, setBeforeEmotion] = useState<EmotionLevel | null>(null);
  const [afterEmotion, setAfterEmotion] = useState<EmotionLevel | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const quickReflections = [
    '친구 입장을 먼저 생각하고 배려해야겠어요.',
    '화가 날 때는 소리치기 전에 숨을 세 번 쉴래요.',
    '잘못했을 때는 솔직하게 바로 사과하는 게 멋진 용기예요.',
    '다 같이 정한 규칙은 모두를 위해 꼭 지켜야 해요.',
    '의심하기 전에 친구에게 먼저 사실을 물어볼게요.',
    '어려울 땐 혼자 끙끙 앓지 말고 친구에게 솔직히 말할래요.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!beforeEmotion) {
      setErrorMsg('역할극을 하기 전 내 감정을 골라주세요!');
      return;
    }
    if (!afterEmotion) {
      setErrorMsg('역할극을 마친 후 내 감정을 골라주세요!');
      return;
    }
    if (!reflection.trim()) {
      setErrorMsg('갈등을 해결하며 느낀 점이나 배운 점을 한 줄로 적어주세요!');
      return;
    }

    setErrorMsg('');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const report: MissionReport = {
      agentName: agent.name,
      agentAvatar: agent.avatar,
      quest,
      beforeEmotion,
      afterEmotion,
      reflection: reflection.trim(),
      completedAt: formattedDate,
    };

    onSubmitReport(report);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border-2 border-slate-700 p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-amber-400">
            {agent.avatar} {agent.name} 요원의 미션 보고서
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <span>{quest.icon}</span>
            <span>{quest.title}</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onBackToScript}
          className="text-xs font-bold text-slate-400 hover:text-slate-200 underline"
        >
          ◀ 대본 다시 보기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Emotion Section 1: Before Roleplay */}
        <PixelCard title="1. 역할극 전 나의 감정은 어땠나요?" variant="dark">
          <p className="text-xs text-slate-400 mb-3">
            갈등 상황이 처음 일어났을 때 내 마음 상태에 가장 가까운 이모티콘을 터치하세요.
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {EMOTIONS.map((emo) => {
              const isSelected = beforeEmotion === emo.level;
              return (
                <button
                  key={emo.level}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setBeforeEmotion(emo.level);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/70 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-1">{emo.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center leading-tight">
                    {emo.label}
                  </span>
                </button>
              );
            })}
          </div>
        </PixelCard>

        {/* Emotion Section 2: After Roleplay */}
        <PixelCard title="2. 역할극으로 갈등을 해결한 후 내 감정은 어떻게 변했나요?" variant="dark">
          <p className="text-xs text-slate-400 mb-3">
            친구들과 대화하고 사과와 양보를 나눈 뒤 지금 내 마음을 골라주세요.
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {EMOTIONS.map((emo) => {
              const isSelected = afterEmotion === emo.level;
              return (
                <button
                  key={emo.level}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setAfterEmotion(emo.level);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-1">{emo.emoji}</span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-200 text-center leading-tight">
                    {emo.label}
                  </span>
                </button>
              );
            })}
          </div>
        </PixelCard>

        {/* Section 3: One-line Reflection Input */}
        <PixelCard title="3. 갈등을 해결하며 느낀 점이나 배운 점을 한 줄로 적어주세요." variant="gold">
          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                maxLength={100}
                value={reflection}
                onChange={(e) => {
                  setReflection(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="예: 내 입장만 고집하지 않고 친구 말도 끝까지 경청해야겠다고 다짐했어요."
                className="w-full bg-slate-950 border-4 border-amber-400/80 p-3.5 text-base sm:text-lg text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-300 resize-none"
              />
              <span className="absolute right-3 bottom-3 text-xs font-bold text-slate-500">
                {reflection.length}/100
              </span>
            </div>

            {/* Quick Helper Chips */}
            <div>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 mb-2">
                <Sparkles size={14} /> 클릭하면 자동으로 입력되는 배움 문장:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickReflections.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setReflection(q);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 border border-slate-700 transition-colors text-left"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PixelCard>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-950 border-2 border-rose-500 text-rose-300 text-sm font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 pb-6 text-center">
          <PixelButton
            type="submit"
            variant="primary"
            size="large"
            className="w-full sm:w-auto text-xl md:text-2xl px-10 py-5 shadow-[0_6px_0_#78350f]"
            icon={<Send size={22} />}
          >
            보고서 제출 🚀
          </PixelButton>
        </div>
      </form>
    </div>
  );
};
