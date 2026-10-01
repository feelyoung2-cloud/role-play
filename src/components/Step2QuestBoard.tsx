import React, { useState } from 'react';
import { QUESTS_DATA } from '../data/quests';
import { Quest, AgentProfile } from '../types';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';
import { soundManager } from '../utils/audio';
import { Search, Sparkles, X, Users, AlertCircle } from 'lucide-react';

interface Step2QuestBoardProps {
  agent: AgentProfile;
  onSelectQuest: (quest: Quest) => void;
}

export const Step2QuestBoard: React.FC<Step2QuestBoardProps> = ({
  agent,
  onSelectQuest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalQuest, setActiveModalQuest] = useState<Quest | null>(null);

  const categories = ['전체', '규칙/약속', '배려/언어', '우정/소통', '협동/양보', '감정조절'];

  const filteredQuests = QUESTS_DATA.filter((q) => {
    const matchesCat = selectedCategory === '전체' || q.category === selectedCategory;
    const matchesQuery =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toString() === searchQuery.trim();
    return matchesCat && matchesQuery;
  });

  const handleOpenQuest = (quest: Quest) => {
    soundManager.playClick();
    setActiveModalQuest(quest);
  };

  const handleAcceptQuest = () => {
    if (activeModalQuest) {
      soundManager.playAccept();
      onSelectQuest(activeModalQuest);
    }
  };

  const renderStars = (diff: number) => {
    return '⭐'.repeat(diff);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-3 sm:px-4">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-slate-900 border-4 border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl p-2 bg-slate-950 border-2 border-amber-400">
            {agent.avatar}
          </div>
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              {agent.title}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100">
              {agent.name} 요원, 퀘스트를 선택하세요!
            </h2>
          </div>
        </div>
        <div className="text-right text-xs md:text-sm text-slate-400">
          총 <span className="text-amber-400 font-bold text-base">{QUESTS_DATA.length}개</span>의 사건 해결 대기 중
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-3">
        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-2 text-xs md:text-sm font-bold border-2 cursor-pointer transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[2px_2px_0_#000]'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="사건 번호 또는 키워드로 검색 (예: 1, 트로피, 피구, 급식, 샤프...)"
            className="w-full bg-slate-950 border-2 border-slate-700 pl-10 pr-4 py-2.5 text-sm md:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-200 text-xs font-bold"
            >
              지우기
            </button>
          )}
        </div>
      </div>

      {/* Quest Grid (30 Items Scrollable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[68vh] overflow-y-auto pr-1">
        {filteredQuests.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900 border-2 border-slate-800">
            <p className="text-lg font-bold">일치하는 퀘스트가 없습니다.</p>
            <p className="text-xs mt-1">다른 검색어나 카테고리를 선택해 보세요.</p>
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => handleOpenQuest(quest)}
              className="group bg-slate-900/90 border-2 border-slate-700 hover:border-amber-400 p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-[3px_3px_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#f59e0b]"
            >
              <div>
                {/* Header row: Number & Category & Difficulty */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-black text-amber-400">
                    QUEST #{quest.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-[11px] text-cyan-400 font-bold">{quest.category}</span>
                    <span>·</span>
                    <span className="text-[11px]">{renderStars(quest.difficulty)}</span>
                  </div>
                </div>

                {/* Title with Icon */}
                <h3 className="text-base md:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2 flex items-start gap-2">
                  <span className="text-xl shrink-0">{quest.icon}</span>
                  <span>{quest.title}</span>
                </h3>

                {/* Short teaser */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {quest.summary}
                </p>
              </div>

              {/* Card Footer: Roles & Action */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Users size={14} className="text-cyan-400" /> {quest.roles.length}인 역할극
                </span>
                <span className="font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  대본 확인 ▶
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quest Inspection Modal (Accept Quest Window) */}
      {activeModalQuest && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-slate-950 border-4 border-amber-400 p-5 md:p-6 shadow-[0_0_24px_rgba(245,158,11,0.5)] max-h-[92vh] flex flex-col justify-between overflow-y-auto">
            {/* Modal Header */}
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-amber-500/40">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl p-2 bg-amber-950/60 border-2 border-amber-400">
                    {activeModalQuest.icon}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-amber-400">
                      QUEST #{activeModalQuest.id} · {activeModalQuest.category} · {renderStars(activeModalQuest.difficulty)}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-amber-300 leading-tight">
                      {activeModalQuest.title}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalQuest(null)}
                  className="p-1 text-slate-400 hover:text-white border border-slate-700 bg-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4 space-y-4 text-sm">
                {/* Incident Summary */}
                <div className="p-3 bg-slate-900/90 border border-slate-700">
                  <h4 className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertCircle size={15} /> 사건 개요 (무슨 일이 일어났나요?)
                  </h4>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {activeModalQuest.summary}
                  </p>
                </div>

                {/* Character Roles */}
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Users size={15} /> 등장인물 & 역할 분담 ({activeModalQuest.roles.length}명)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeModalQuest.roles.map((r, i) => (
                      <div key={i} className="p-2.5 bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-base font-bold text-slate-100">
                          <span>{r.avatar}</span>
                          <span>{r.name}</span>
                        </div>
                        <div className="text-xs text-amber-300 font-semibold mt-0.5">
                          {r.roleTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {r.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Point */}
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-600/50 text-xs text-emerald-300 flex items-center gap-2">
                  <Sparkles size={16} className="shrink-0 text-emerald-400" />
                  <span>
                    <strong>해결 목표:</strong> {activeModalQuest.keyLearning}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t-2 border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <PixelButton
                variant="ghost"
                onClick={() => setActiveModalQuest(null)}
                className="w-full sm:w-auto"
              >
                닫기
              </PixelButton>
              <PixelButton
                variant="primary"
                size="large"
                onClick={handleAcceptQuest}
                className="w-full sm:w-auto text-lg py-3.5 shadow-[0_4px_0_#78350f]"
              >
                ⚔️ 퀘스트 수락! (대본 열기)
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
