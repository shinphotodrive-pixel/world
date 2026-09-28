import React from 'react';
import { HistoryItem } from '../types/history';
import { Bookmark, Trash2, Edit3, ChevronRight, BookOpen } from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedItems: HistoryItem[];
  userNotes: Record<string, string>;
  onOpenDetail: (item: HistoryItem) => void;
  onRemoveBookmark: (item: HistoryItem) => void;
  onExploreArchive: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedItems,
  userNotes,
  onOpenDetail,
  onRemoveBookmark,
  onExploreArchive,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-900 font-serif font-semibold mb-1">
          PERSONAL SCHOLARLY ARCHIVE
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          나의 연구 보관함 & 스크랩 노트
        </h2>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          관심 있는 역사적 사건을 보관하고 기록한 나만의 연구 메모를 확인하세요. 데이터는 브라우저에 안전하게 보존됩니다.
        </p>
      </div>

      {bookmarkedItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl max-w-md mx-auto p-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
            보관된 역사 기록이 없습니다
          </h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            아카이브 열람 중 관심 있는 사건의 북마크 아이콘을 누르면 이곳에 저장되어 언제든 다시 읽고 연구 메모를 남길 수 있습니다.
          </p>
          <button
            onClick={onExploreArchive}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            아카이브 탐색하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-stone-500 mb-2 font-mono tabular-nums">
            총 {bookmarkedItems.length}개의 기록 보관 중
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookmarkedItems.map((item) => {
              const note = userNotes[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-amber-900">{item.period}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.region}</span>
                      </div>

                      <button
                        onClick={() => onRemoveBookmark(item)}
                        className="text-stone-400 hover:text-red-700 transition-colors p-1"
                        title="보관함에서 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                      {item.summary}
                    </p>

                    {/* Personal Study Note Box if exists */}
                    {note ? (
                      <div className="p-3 bg-[#FAF7EE] border border-amber-200/70 rounded-lg text-xs text-stone-800 mb-3">
                        <div className="flex items-center gap-1 font-semibold text-amber-900 mb-1">
                          <Edit3 className="w-3 h-3" />
                          <span>나의 독서 메모</span>
                        </div>
                        <p className="whitespace-pre-wrap">{note}</p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-400 italic mb-3">
                        (아직 작성된 개인 메모가 없습니다)
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-400 font-mono text-[11px]">
                      {item.category}
                    </span>

                    <button
                      onClick={() => onOpenDetail(item)}
                      className="flex items-center gap-1 text-amber-900 font-medium hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>기록 열람 및 메모 수정</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
