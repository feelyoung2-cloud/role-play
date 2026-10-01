import React, { useState } from 'react';
import { AVATAR_OPTIONS } from '../data/quests';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { AgentProfile } from '../types';
import { Shield, Sparkles } from 'lucide-react';

interface Step1CharacterCreateProps {
  onStart: (agent: AgentProfile) => void;
}

export const Step1CharacterCreate: React.FC<Step1CharacterCreateProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleNames = ['4학년 평화요원', '정의의 수호자', '배려 대장', '지혜로운 탐정'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('요원명을 꼭 적어주세요! (예: 4반 김민재, 평화요원)');
      return;
    }
    setErrorMsg('');
    onStart({
      name: trimmed,
      avatar: selectedAvatar.icon,
      title: selectedAvatar.name,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Title & Banner */}
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1.5 mb-3 bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-bold text-sm tracking-wider uppercase">
          ⚔️ 4학년 교실 평화 수비본부 ⚔️
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 mb-3 tracking-wide drop-shadow-[0_3px_0_#000]">
          너의 요원명을 알려줘!
        </h1>
        <p className="text-slate-300 text-base md:text-lg max-w-lg mx-auto">
          우리 반의 30가지 갈등을 해결할 멋진 비밀 요원이 되어주세요.
        </p>
      </div>

      <PixelCard variant="gold" className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selector */}
          <div>
            <label className="block text-amber-300 font-bold text-base md:text-lg mb-3 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              1. 캐릭터 아바타 고르기
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`flex flex-col items-center justify-center p-3 border-2 transition-transform cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/60 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'border-slate-700 bg-slate-900/80 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-3xl md:text-4xl mb-1 select-none">{avatar.icon}</span>
                    <span className="text-xs font-bold text-slate-200 text-center leading-tight">
                      {avatar.name.replace('의 ', '\n')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="agent-name-input" className="block text-amber-300 font-bold text-base md:text-lg mb-2 flex items-center gap-2">
              <Shield size={20} className="text-amber-400" />
              2. 요원명 입력하기
            </label>
            <div className="relative">
              <input
                id="agent-name-input"
                type="text"
                maxLength={15}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="예: 4학년 1반 김평화, 지혜의 요원"
                className="w-full bg-slate-950 border-4 border-amber-400/80 px-4 py-3.5 text-xl font-bold text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-300 shadow-inner"
                autoFocus
              />
              <span className="absolute right-3 top-4 text-xs font-bold text-slate-500">
                {name.length}/15
              </span>
            </div>

            {errorMsg && (
              <p className="mt-2 text-rose-400 font-bold text-sm bg-rose-950/40 p-2 border border-rose-500/50">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Quick helper buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">추천 요원명:</span>
              {sampleNames.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-colors"
                >
                  +{s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 text-center">
            <PixelButton
              type="submit"
              variant="primary"
              size="large"
              className="w-full text-xl md:text-2xl py-4 shadow-[0_6px_0_#78350f]"
            >
              🚀 퀘스트 시작하기!
            </PixelButton>
          </div>
        </form>
      </PixelCard>

      {/* Guide Note for Elementary 4th graders */}
      <div className="p-4 bg-slate-900/60 border-2 border-slate-800 text-center text-xs sm:text-sm text-slate-400">
        💡 <strong className="text-slate-200">선생님 안내:</strong> 친구들과 함께 역할을 나누고, 갈등을 멋지게 해결한 뒤 마지막에 완성 화면을 선생님께 보여주는 활동입니다.
      </div>
    </div>
  );
};
