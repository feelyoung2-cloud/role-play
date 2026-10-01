import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderNavProps {
  currentStep: number;
  agentName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStep,
  agentName,
  isMuted,
  onToggleMute,
  onReset,
}) => {
  const stepLabels = [
    '요원 생성',
    '퀘스트 보드',
    '작전 타임',
    '결과 보고',
    '최종 검사'
  ];

  return (
    <header className="w-full bg-slate-950/90 border-b-4 border-slate-800 sticky top-0 z-40 backdrop-blur px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black text-amber-400 tracking-wider flex items-center gap-1.5 drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
            <span>🛡️</span> 교실평화수비대
          </span>
          {agentName && (
            <span className="hidden sm:inline-block text-xs font-bold text-cyan-400 bg-slate-900 px-2 py-1 border border-cyan-500/40">
              요원: {agentName}
            </span>
          )}
        </div>

        {/* Zone 2: Step Indicator */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isPast = currentStep > stepNum;
            return (
              <React.Fragment key={label}>
                <span
                  className={`px-2.5 py-1 border-2 transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                      : isPast
                      ? 'bg-slate-800 text-emerald-400 border-emerald-600/50'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {isPast ? '✓ ' : `${stepNum}. `}{label}
                </span>
                {idx < stepLabels.length - 1 && (
                  <span className="text-slate-600">▶</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Mobile Mini Step Badge */}
        <div className="md:hidden text-xs font-bold text-amber-400 bg-slate-900 px-2 py-1 border border-amber-400/40">
          단계 {currentStep}/5: {stepLabels[currentStep - 1]}
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
            title={isMuted ? '소리 켜기' : '소리 끄기'}
            className="p-2 border-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>

          {currentStep > 1 && (
            <button
              type="button"
              onClick={onReset}
              aria-label="처음으로"
              title="처음으로 돌아가기"
              className="p-2 border-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
