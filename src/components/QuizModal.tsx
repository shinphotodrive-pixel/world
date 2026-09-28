import React, { useState } from 'react';
import { HISTORY_QUIZZES } from '../data/historyData';
import { X, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen) return null;

  const currentQ = HISTORY_QUIZZES[currentIndex];
  const isCorrect = selectedAnswer === currentQ?.correctAnswerIndex;

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < HISTORY_QUIZZES.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-quiz-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FBF9F5] border border-stone-300 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden z-10 text-stone-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#F4EFE6]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-stone-900">
              역사 탐구 퀴즈
            </span>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              ({currentIndex + 1} / {HISTORY_QUIZZES.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Question */}
              <div>
                <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-widest block mb-1">
                  QUESTION {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <h3 id="history-quiz-modal-title" className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle =
                    'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-800';

                  if (selectedAnswer !== null) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (idx === selectedAnswer) {
                      btnStyle = 'border-red-500 bg-red-50 text-red-950';
                    } else {
                      btnStyle = 'border-stone-100 bg-stone-50/50 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-mono text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {selectedAnswer !== null && idx === currentQ.correctAnswerIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {selectedAnswer === idx && idx !== currentQ.correctAnswerIndex && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-emerald-700">✓ 정답입니다!</span>
                    ) : (
                      <span className="text-red-700">✕ 오답입니다.</span>
                    )}
                  </div>
                  <p className="text-stone-700">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>
                      {currentIndex + 1 === HISTORY_QUIZZES.length ? '결과 보기' : '다음 문제'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center shadow-xs">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-stone-950">
                퀴즈를 완료하셨습니다!
              </h3>

              <p className="text-sm text-stone-600">
                총 {HISTORY_QUIZZES.length}문제 중{' '}
                <span className="font-bold text-amber-900 font-mono text-base tabular-nums">
                  {score}
                </span>
                문제를 맞히셨습니다.
              </p>

              <div className="p-4 bg-stone-100 rounded-xl text-xs text-stone-700 max-w-sm mx-auto">
                {score >= 7 ? (
                  <p>뛰어난 역사적 혜안을 지니셨습니다! 세계사의 맥락을 완벽히 이해하고 계십니다.</p>
                ) : score >= 5 ? (
                  <p>우수한 역사 지식입니다! 아카이브의 심층 기록을 통해 더욱 깊은 통찰을 얻어보세요.</p>
                ) : (
                  <p>아카이브의 세부 기록들을 읽어보시면 더욱 흥미로운 인과관계를 발견하실 수 있습니다.</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 풀기</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  아카이브로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
