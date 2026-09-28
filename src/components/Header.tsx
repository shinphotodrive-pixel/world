import React from 'react';
import { Bookmark, Sparkles, Search } from 'lucide-react';

interface HeaderProps {
  activeView: 'archive' | 'timeline' | 'synchronous' | 'bookmarks';
  setActiveView: (view: 'archive' | 'timeline' | 'synchronous' | 'bookmarks') => void;
  onOpenQuiz: () => void;
  onOpenSearch: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenQuiz,
  onOpenSearch,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E1D5] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('archive')}
            className="text-left group cursor-pointer"
          >
            <span className="font-serif-display text-xl lg:text-2xl font-bold tracking-tight text-[#1C1917] group-hover:text-amber-900 transition-colors">
              히스토리 아카이브
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveView('archive')}
            className={`cursor-pointer transition-colors py-1 ${
              activeView === 'archive'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            아카이브 열람
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`cursor-pointer transition-colors py-1 ${
              activeView === 'timeline'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            연표 타임라인
          </button>
          <button
            onClick={() => setActiveView('synchronous')}
            className={`cursor-pointer transition-colors py-1 ${
              activeView === 'synchronous'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            동시대 동서양 비교
          </button>
          <button
            onClick={() => setActiveView('bookmarks')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'bookmarks'
                ? 'text-amber-900 font-bold border-b-2 border-amber-900'
                : 'hover:text-stone-900'
            }`}
          >
            <span>연구 보관함</span>
            {savedCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-amber-900">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="기록 검색 (Ctrl+K)"
            aria-label="기록 검색"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('bookmarks')}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer relative"
            title="연구 보관함"
            aria-label="연구 보관함"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-800" />
            )}
          </button>

          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>역사 탐구 퀴즈</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-between border-t border-stone-200 mt-2.5 pt-2 text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => setActiveView('archive')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeView === 'archive' ? 'text-amber-900 font-bold border-b-2 border-amber-900' : ''
          }`}
        >
          아카이브
        </button>
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeView === 'timeline' ? 'text-amber-900 font-bold border-b-2 border-amber-900' : ''
          }`}
        >
          연표
        </button>
        <button
          onClick={() => setActiveView('synchronous')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeView === 'synchronous' ? 'text-amber-900 font-bold border-b-2 border-amber-900' : ''
          }`}
        >
          동서양 비교
        </button>
        <button
          onClick={() => setActiveView('bookmarks')}
          className={`px-2 py-1 whitespace-nowrap ${
            activeView === 'bookmarks' ? 'text-amber-900 font-bold border-b-2 border-amber-900' : ''
          }`}
        >
          보관함 ({savedCount})
        </button>
      </div>
    </header>
  );
};
