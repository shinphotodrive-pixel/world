import React, { useState, useEffect, useRef } from 'react';
import { HistoryItem } from '../types/history';
import { getAllHistoryItems } from '../data/historyData';
import { Search, X, ChevronRight, Bookmark } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: HistoryItem) => void;
  bookmarkedIds: Set<string>;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  bookmarkedIds,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const allItems = getAllHistoryItems();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // open handled by parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? allItems.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.summary.toLowerCase().includes(query.toLowerCase()) ||
          it.period.toLowerCase().includes(query.toLowerCase()) ||
          it.region.toLowerCase().includes(query.toLowerCase()) ||
          it.keyFigures?.some((f) => f.toLowerCase().includes(query.toLowerCase())) ||
          it.keyConcepts?.some((k) => k.toLowerCase().includes(query.toLowerCase())) ||
          it.details.some((d) => d.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems.slice(0, 8);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-search-dialog-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-[#FBF9F5] border border-stone-300 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            id="history-search-dialog-title"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="사건, 인물, 연도, 키워드 검색 (예: 1453, 흑사병, 아우구스투스, 수양대군, 골리앗)..."
            className="w-full text-base bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-1.5 flex-1">
          <div className="text-xs text-stone-500 px-3 py-1 font-mono tabular-nums">
            {query.trim()
              ? `검색 결과 ${filtered.length}건`
              : '추천 주요 역사 사료'}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              "{query}"에 일치하는 기록을 찾을 수 없습니다.
            </div>
          ) : (
            filtered.map((item) => {
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-stone-200 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-0.5">
                      <span className="font-semibold text-amber-900">{item.period}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.region}</span>
                      {isBookmarked && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-800 flex items-center gap-0.5">
                            <Bookmark className="w-3 h-3 fill-amber-800" />
                            보관됨
                          </span>
                        </>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate group-hover:text-amber-950">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 truncate mt-0.5">
                      {item.summary}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
