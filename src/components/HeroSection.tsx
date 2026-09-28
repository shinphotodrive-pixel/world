import React from 'react';
import { HERO_IMAGE } from '../data/historyData';
import { Search, Compass, BookOpen, Clock } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onExploreTimeline: () => void;
  onExploreSync: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreTimeline,
  onExploreSync,
}) => {
  const categoryFilters = [
    { id: 'all', label: '전체 보기' },
    { id: 'world-europe', label: '세계사·유럽사' },
    { id: 'empires', label: '로마·오스만' },
    { id: 'asia-history', label: '중국사·한국사' },
    { id: 'us-history', label: '미국사' },
    { id: 'diseases', label: '감염병과 보건' },
    { id: 'wars-economy', label: '전쟁과 경제' },
    { id: 'mysteries', label: '미스터리와 전설' },
  ];

  return (
    <div className="relative mb-12 border-b border-[#E8E1D5] bg-[#F4EFE6]/60">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-10">
        {/* Curatorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-widest text-amber-900/80 font-serif font-semibold">
              CHRONICA MUNDI · HISTORICAL ARCHIVE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.2]">
              인류의 발자취와 문명의 전환점을 기록하다
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl font-normal">
              메소포타미아 최초의 설형문자부터 1453년 콘스탄티노폴리스와 조선 계유정난의 동시대적 조우, 인간의 욕망이 낳은 역병과 전쟁, 통화 패권의 부침, 그리고 풀리지 않은 고대 필사본의 수수께끼까지 세계사의 핵심을 집대성했습니다.
            </p>

            {/* Quick Interactive Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreTimeline}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-stone-900 bg-white border border-stone-300 hover:border-amber-800 hover:bg-stone-50 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-800" />
                <span>연대학적 타임라인 탐색</span>
              </button>
              <button
                onClick={onExploreSync}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-amber-950 bg-amber-100/70 border border-amber-300/80 hover:bg-amber-100 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-900" />
                <span>동시대 동서양 사건 비교</span>
              </button>
            </div>
          </div>

          {/* Exhibition Marquee Image Hero */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-stone-200">
              <img
                src={HERO_IMAGE}
                alt="고대 지도와 양피지, 아스트롤라베가 놓인 역사 연구 서재"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-serif italic text-stone-200">
                  Archival Study: Cartography & Ancient Chronology
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational / Archival Ribbon (Pattern A from Museum Reference) */}
        <div className="mt-8 pt-4 border-t border-stone-300/70 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-medium text-stone-900">연대 범위:</span>
            <span>기원전 4000년 ~ 서기 1976년</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-stone-900">문헌 데이터:</span>
            <span>역사 노트 7대 대분류</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-stone-900">수록 항목:</span>
            <span className="font-mono tabular-nums">25개 주요 사건 및 연구</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-900 font-serif text-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>오리지널 팟캐스트·문헌 기록 기반</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사건명, 인물(아우구스투스, 수양대군), 연도(1453), 키워드 검색..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>

          {/* Category Filter Buttons (Functional Buttons, not static pills) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
