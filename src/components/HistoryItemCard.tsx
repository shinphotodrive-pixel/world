import React from 'react';
import { HistoryItem } from '../types/history';
import { Bookmark, ChevronRight, Compass } from 'lucide-react';

interface HistoryItemCardProps {
  item: HistoryItem;
  onOpenDetail: (item: HistoryItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (item: HistoryItem) => void;
}

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({
  item,
  onOpenDetail,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <article className="group bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-stone-400/80 transition-all flex flex-col justify-between relative">
      <div>
        {/* Top Unboxed Metadata - Strictly Zero-Pill Discipline */}
        <div className="flex items-center justify-between gap-3 text-xs text-stone-500 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-amber-900">{item.period}</span>
            <span aria-hidden="true">·</span>
            <span>{item.region}</span>
          </div>

          <button
            onClick={() => onToggleBookmark(item)}
            className={`p-1.5 rounded-md hover:bg-stone-100 transition-colors cursor-pointer ${
              isBookmarked ? 'text-amber-800' : 'text-stone-400 hover:text-stone-700'
            }`}
            title={isBookmarked ? '보관함에서 제거' : '연구 보관함에 저장'}
            aria-label={isBookmarked ? '보관함에서 제거' : '연구 보관함에 저장'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-800' : ''}`} />
          </button>
        </div>

        {/* Item Title */}
        <h4 className="text-lg sm:text-xl font-bold font-serif text-stone-900 mb-2.5 group-hover:text-amber-950 transition-colors">
          {item.title}
        </h4>

        {/* Item Summary */}
        <p className="text-sm text-stone-700 leading-relaxed mb-4">
          {item.summary}
        </p>

        {/* Details Checklist */}
        <ul className="space-y-1.5 text-xs text-stone-600 mb-4 border-t border-stone-100 pt-3">
          {item.details.slice(0, 2).map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-amber-800 shrink-0 font-serif">•</span>
              <span className="line-clamp-2">{detail}</span>
            </li>
          ))}
        </ul>

        {/* Synchronous Hint if available */}
        {item.synchronousEvents && item.synchronousEvents.length > 0 && (
          <div className="bg-[#FAF7F0] border-l-2 border-amber-800/60 p-2.5 rounded-r-md text-xs text-stone-700 mb-4 flex items-start gap-2">
            <Compass className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-stone-900">
                동시대({item.synchronousEvents[0].region}):
              </span>{' '}
              <span className="text-stone-600">{item.synchronousEvents[0].event}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-2">
        {item.keyConcepts && item.keyConcepts.length > 0 ? (
          <div className="text-stone-500 truncate max-w-[200px] sm:max-w-[260px]">
            {item.keyConcepts.slice(0, 3).join(' · ')}
          </div>
        ) : (
          <div />
        )}

        <button
          onClick={() => onOpenDetail(item)}
          className="flex items-center gap-1 font-medium text-amber-900 hover:text-amber-700 transition-colors cursor-pointer shrink-0 ml-auto"
        >
          <span>심층 열람</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
