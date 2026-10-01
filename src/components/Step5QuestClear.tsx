import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MissionReport } from '../types';
import { EMOTIONS } from '../data/quests';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { soundManager } from '../utils/audio';
import { Trophy, Award, CheckCircle, RotateCcw, HeartHandshake } from 'lucide-react';

interface Step5QuestClearProps {
  report: MissionReport;
  onRestart: () => void;
}

export const Step5QuestClear: React.FC<Step5QuestClearProps> = ({ report, onRestart }) => {
  const [teacherStamp, setTeacherStamp] = useState<boolean>(false);

  useEffect(() => {
    // Play 8-bit RPG victory arpeggio
    soundManager.playVictory();

    // Trigger confetti bursts
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const beforeEmoData = EMOTIONS.find((e) => e.level === report.beforeEmotion) || EMOTIONS[0];
  const afterEmoData = EMOTIONS.find((e) => e.level === report.afterEmotion) || EMOTIONS[4];

  const handleTeacherStamp = () => {
    soundManager.playAccept();
    setTeacherStamp(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Victory Arcade Banner */}
      <div className="text-center py-4 bg-gradient-to-b from-amber-500/20 to-transparent border-4 border-amber-400 p-4 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest mb-2 border-2 border-black">
          <Trophy size={16} /> MISSION ACCOMPLISHED
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-300 tracking-wider drop-shadow-[0_4px_0_#000] animate-bounce">
          ★ QUEST CLEAR! ★
        </h1>
        <p className="text-base sm:text-lg font-bold text-slate-200 mt-1">
          교실 평화 수호 완료! 4학년 최고의 평화 요원입니다.
        </p>
      </div>

      {/* Official Summary Mission Certificate Card */}
      <div className="bg-slate-950 border-4 border-amber-400 p-5 sm:p-7 relative shadow-[6px_6px_0_#000]">
        {/* Decorative corner markers */}
        <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-mono font-bold">╔═</div>
        <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-mono font-bold">═╗</div>
        <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-mono font-bold">╚═</div>
        <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-mono font-bold">═╝</div>

        {/* Certificate Title */}
        <div className="text-center pb-4 mb-5 border-b-2 border-amber-500/40">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            국립/공립 4학년 교실 평화 수비대 인증서
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
            갈등 해결 활동 보고서
          </h2>
          <div className="text-xs text-slate-400 mt-1">
            기록 일시: {report.completedAt}
          </div>
        </div>

        {/* Summary Grid */}
        <div className="space-y-4">
          {/* Agent & Quest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-900 border-2 border-slate-700 p-3">
              <span className="text-xs font-bold text-amber-400 block mb-1">
                🎖️ 활동 요원 (학생)
              </span>
              <div className="text-lg font-black text-slate-100 flex items-center gap-2">
                <span className="text-2xl">{report.agentAvatar}</span>
                <span>{report.agentName}</span>
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-slate-700 p-3">
              <span className="text-xs font-bold text-cyan-400 block mb-1">
                ⚔️ 해결한 갈등 상황
              </span>
              <div className="text-base font-bold text-slate-100 line-clamp-1 flex items-center gap-1.5">
                <span>{report.quest.icon}</span>
                <span>{report.quest.title}</span>
              </div>
            </div>
          </div>

          {/* Emotion Transformation Display */}
          <div className="bg-slate-900 border-2 border-slate-700 p-4">
            <span className="text-xs font-bold text-amber-400 block mb-3 text-center sm:text-left">
              💖 역할극 전후 감정 변화
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-2">
              {/* Before */}
              <div className="flex flex-col items-center p-3 bg-slate-950 border-2 border-rose-500/60 w-36 text-center">
                <span className="text-xs font-bold text-rose-400 mb-1">역할극 전</span>
                <span className="text-4xl my-1">{beforeEmoData.emoji}</span>
                <span className="text-xs font-bold text-slate-200">{beforeEmoData.label}</span>
              </div>

              {/* Arrow Indicator */}
              <div className="flex flex-col items-center justify-center text-amber-400">
                <span className="text-2xl font-black">➔</span>
                <span className="text-[11px] font-bold text-emerald-400 mt-1">대화 & 화해</span>
              </div>

              {/* After */}
              <div className="flex flex-col items-center p-3 bg-slate-950 border-2 border-emerald-500/60 w-36 text-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <span className="text-xs font-bold text-emerald-400 mb-1">역할극 후</span>
                <span className="text-4xl my-1">{afterEmoData.emoji}</span>
                <span className="text-xs font-bold text-slate-200">{afterEmoData.label}</span>
              </div>
            </div>
          </div>

          {/* Reflection Quote */}
          <div className="bg-slate-900 border-2 border-amber-400/80 p-4">
            <span className="text-xs font-bold text-amber-300 block mb-1">
              📝 내가 배운 점 (한 줄 소감)
            </span>
            <p className="text-base sm:text-xl font-bold text-slate-100 leading-relaxed italic">
              "{report.reflection}"
            </p>
          </div>

          {/* Stamp Area */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-block border-2 border-emerald-500 text-emerald-400 px-3 py-1.5 text-xs font-black rotate-[-3deg] uppercase tracking-wider bg-emerald-950/60">
                ✓ 갈등 해결 미션 인증
              </div>
              {teacherStamp && (
                <div className="inline-block border-2 border-rose-500 text-rose-400 px-3 py-1.5 text-xs font-black rotate-[3deg] uppercase tracking-wider bg-rose-950/60 animate-pulse">
                  ★ 선생님 확인 완료! 참 잘했어요 ★
                </div>
              )}
            </div>

            {!teacherStamp && (
              <button
                type="button"
                onClick={handleTeacherStamp}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 border border-slate-600 transition-colors"
              >
                [선생님 전용] 확인 도장 찍기 💮
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Teacher Inspection Blinking Prompt */}
      <div className="p-4 bg-rose-950 border-4 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] text-center animate-retro-blink">
        <p className="text-xl sm:text-2xl md:text-3xl font-black text-rose-300 tracking-wider">
          📢 이 화면을 선생님께 보여주세요!
        </p>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-bold">
          태블릿 화면을 끄지 말고 그대로 선생님께 가져가 확인을 받으세요.
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-center gap-3">
        <PixelButton
          variant="secondary"
          size="normal"
          onClick={onRestart}
          icon={<RotateCcw size={18} />}
        >
          다른 퀘스트 도전하기
        </PixelButton>
      </div>
    </div>
  );
};
