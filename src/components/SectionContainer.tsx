import React from 'react';
import { HistorySection, HistoryItem } from '../types/history';
import { HistoryItemCard } from './HistoryItemCard';

interface SectionContainerProps {
  section: HistorySection;
  filteredItems: HistoryItem[];
  onOpenDetail: (item: HistoryItem) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (item: HistoryItem) => void;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  section,
  filteredItems,
  onOpenDetail,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  if (filteredItems.length === 0) return null;

  return (
    <section id={section.id} className="scroll-mt-20">
      {/* Section Header */}
      <div className="mb-6 border-b border-stone-200 pb-4">
        <div className="text-xs uppercase tracking-widest text-stone-500 font-serif mb-1">
          CHAPTER {section.number}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight flex items-baseline gap-3 flex-wrap">
          <span>{section.title}</span>
          <span className="text-sm sm:text-base font-sans font-normal text-stone-600">
            {section.subTitle}
          </span>
        </h2>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          {section.description}
        </p>
      </div>

      {/* Optional Curatorial Banner Image for select sections */}
      {section.imagePath && (
        <div className="mb-6 rounded-xl overflow-hidden border border-stone-200 aspect-21/9 max-h-52 relative bg-stone-100">
          <img
            src={section.imagePath}
            alt={section.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent p-6 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-widest text-amber-200/90 font-serif">
              ARCHIVE SPOTLIGHT
            </span>
            <span className="text-lg font-serif font-semibold text-white">
              {section.title} 사료 및 회화 기록
            </span>
          </div>
        </div>
      )}

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <HistoryItemCard
            key={item.id}
            item={item}
            onOpenDetail={onOpenDetail}
            isBookmarked={bookmarkedIds.has(item.id)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </section>
  );
};
