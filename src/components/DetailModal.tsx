import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types/history';
import { X, Bookmark, Compass, BookOpen, User, Check, Edit3 } from 'lucide-react';

interface DetailModalProps {
  item: HistoryItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (item: HistoryItem) => void;
  userNote?: string;
  onSaveNote: (itemId: string, note: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark,
  userNote = '',
  onSaveNote,
}) => {
  const [noteText, setNoteText] = useState(userNote);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  useEffect(() => {
    setNoteText(userNote);
  }, [userNote, item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleSaveNote = () => {
    onSaveNote(item.id, noteText);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-detail-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FBF9F5] border border-stone-300 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#F4EFE6]/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-600 flex-wrap">
            <span className="font-semibold text-amber-900">{item.period}</span>
            <span aria-hidden="true">·</span>
            <span>{item.region}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-500">ID: {item.id}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(item)}
              className={`p-2 rounded-lg hover:bg-stone-200/70 transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
                isBookmarked ? 'text-amber-900 font-semibold' : 'text-stone-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-900' : ''}`} />
              <span className="hidden sm:inline">
                {isBookmarked ? '보관됨' : '보관하기'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Main Title */}
          <div>
            <h3 id="history-detail-modal-title" className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight leading-snug">
              {item.title}
            </h3>
          </div>

          {/* Archival Quote if available */}
          {item.archivalQuote && (
            <div className="border-l-3 border-amber-900 pl-4 py-2 italic font-serif text-stone-700 bg-amber-50/50 rounded-r-md text-sm sm:text-base">
              "{item.archivalQuote}"
            </div>
          )}

          {/* Editorial Summary with Drop Cap */}
          <div className="prose max-w-none text-stone-800 text-sm sm:text-base leading-relaxed">
            <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-amber-950">
              {item.summary}
            </p>
          </div>

          {/* Historical Details (사건의 전개 및 주요 사실) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold">
              사건의 전개 및 핵심 팩트
            </h4>
            <div className="space-y-2.5 bg-white border border-stone-200 rounded-xl p-4 sm:p-5">
              {item.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-stone-700">
                  <span className="font-serif text-xs font-bold text-amber-900 mt-1 shrink-0">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Impact (문명사적 의의 및 영향) */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold">
              역사적 의의 및 문명사적 영향
            </h4>
            <div className="bg-[#FAF7F0] border border-amber-200/80 rounded-xl p-4 sm:p-5 text-sm leading-relaxed text-stone-800">
              {item.impact}
            </div>
          </div>

          {/* Key Figures & Concepts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {item.keyFigures && item.keyFigures.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-serif font-semibold text-stone-600 mb-2">
                  <User className="w-3.5 h-3.5 text-amber-800" />
                  <span>주요 관련 인물</span>
                </div>
                <div className="text-xs text-stone-700 leading-relaxed">
                  {item.keyFigures.join(' · ')}
                </div>
              </div>
            )}

            {item.keyConcepts && item.keyConcepts.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-serif font-semibold text-stone-600 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                  <span>핵심 사료 및 키워드</span>
                </div>
                <div className="text-xs text-stone-700 leading-relaxed">
                  {item.keyConcepts.join(' · ')}
                </div>
              </div>
            )}
          </div>

          {/* Synchronous Events (동시대 타 지역 사건) */}
          {item.synchronousEvents && item.synchronousEvents.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold">
                <Compass className="w-3.5 h-3.5 text-amber-800" />
                <span>동시대 타 지역 역사 비교 (동시대성)</span>
              </div>
              <div className="space-y-2">
                {item.synchronousEvents.map((sync, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-stone-200 rounded-lg text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <span className="font-semibold text-amber-950 sm:w-28 shrink-0">
                      {sync.region}
                    </span>
                    <span className="text-stone-700 flex-1">{sync.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Research / Study Note Area */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="user-study-note-input"
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                <span>나의 연구 독서 메모 & 스크랩 노트</span>
              </label>
              {isSavedFeedback && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  저장되었습니다
                </span>
              )}
            </div>
            <textarea
              id="user-study-note-input"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="이 사건에 대해 기억할 생각이나 독서 메모를 남겨보세요..."
              rows={3}
              className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 text-stone-900 placeholder:text-stone-400"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 text-xs font-medium text-white bg-amber-900 hover:bg-amber-800 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                메모 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
