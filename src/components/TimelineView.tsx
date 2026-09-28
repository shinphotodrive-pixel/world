import React, { useState, useMemo } from 'react';
import { HistoryItem } from '../types/history';
import { getChronologicalHistory } from '../data/historyData';
import { ChevronRight, Bookmark } from 'lucide-react';

interface TimelineViewProps {
  onOpenDetail: (item: HistoryItem) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (item: HistoryItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onOpenDetail,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const allChronological = useMemo(() => getChronologicalHistory(), []);

  const eras = [
    { id: 'all', label: '전체 연대기 (BC 4000 ~ 20C)' },
    { id: 'ancient', label: '고대 문명 (~ 500년)' },
    { id: 'medieval', label: '중세 시대 (500 ~ 1500년)' },
    { id: 'early-modern', label: '근세 시대 (1500 ~ 1800년)' },
    { id: 'modern', label: '근현대 (1800년 ~)' },
  ];

  const filteredItems = useMemo(() => {
    return allChronological.filter((item) => {
      if (selectedEra === 'ancient') return item.numericYear <= 500;
      if (selectedEra === 'medieval') return item.numericYear > 500 && item.numericYear <= 1500;
      if (selectedEra === 'early-modern') return item.numericYear > 1500 && item.numericYear <= 1800;
      if (selectedEra === 'modern') return item.numericYear > 1800;
      return true;
    });
  }, [allChronological, selectedEra]);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-900 font-serif font-semibold mb-1">
          CHRONOLOGICAL CONTINUUM
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          인류사의 맥박을 짚는 통사 연표
        </h2>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          기원전 수메르의 점토판에서부터 20세기 전 지구적 참화와 경제 질서의 재편까지, 시간의 물줄기를 따라 주요 분수령들을 일목요연하게 조망합니다.
        </p>

        {/* Era Segmented Control */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 p-1 bg-stone-200/70 rounded-xl max-w-xl mx-auto">
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedEra === era.id
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Vertical Rail */}
      <div className="relative border-l-2 border-stone-300 ml-4 sm:ml-32 md:ml-40 space-y-8 pb-12">
        {filteredItems.map((item, index) => {
          const isBookmarked = bookmarkedIds.has(item.id);
          const isBCE = item.numericYear < 0;
          const displayYear = isBCE
            ? `기원전 ${Math.abs(item.numericYear)}년`
            : `${item.numericYear}년`;

          return (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              {/* Year Label in Left Margin on Desktop */}
              <div className="hidden sm:block absolute -left-36 md:-left-44 top-0.5 w-32 md:w-40 text-right pr-4">
                <span className="font-mono text-xs font-bold text-amber-950 block">
                  {item.numericYear === 1453
                    ? '1453년 (세계사의 해)'
                    : item.numericYear === 1776
                    ? '1776년 (격변의 해)'
                    : displayYear}
                </span>
                <span className="text-[11px] text-stone-500 block truncate">
                  {item.period}
                </span>
              </div>

              {/* Node Dot on Rail */}
              <div
                className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[#FBF9F5] transition-transform group-hover:scale-125 ${
                  item.numericYear === 1453 || item.numericYear === 1776
                    ? 'bg-red-700 ring-2 ring-red-300'
                    : 'bg-amber-900'
                }`}
              />

              {/* Content Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all">
                {/* Mobile Year display */}
                <div className="sm:hidden text-xs font-mono font-bold text-amber-900 mb-1">
                  {displayYear} · {item.period}
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-stone-500 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-stone-900">{item.region}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(item)}
                    className={`p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer ${
                      isBookmarked ? 'text-amber-800' : 'text-stone-400 hover:text-stone-700'
                    }`}
                    title={isBookmarked ? '보관함에서 제거' : '보관함에 저장'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                  {item.summary}
                </p>

                {/* Synchronous Note Pill */}
                {item.synchronousEvents && item.synchronousEvents.length > 0 && (
                  <div className="text-xs text-amber-950 bg-amber-50/70 border border-amber-200/60 rounded-md p-2 mb-3">
                    <span className="font-semibold">동시대 사건:</span>{' '}
                    <span>{item.synchronousEvents[0].region} - {item.synchronousEvents[0].event}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="text-stone-500 hidden sm:block truncate max-w-sm">
                    {item.keyConcepts?.slice(0, 2).join(' · ')}
                  </div>

                  <button
                    onClick={() => onOpenDetail(item)}
                    className="flex items-center gap-1 text-amber-900 font-medium hover:text-amber-700 transition-colors cursor-pointer ml-auto"
                  >
                    <span>심층 열람</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
