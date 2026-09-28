import React, { useState } from 'react';
import { SYNCHRONOUS_COMPARISONS } from '../data/historyData';
import { ArrowLeftRight, Compass, Sparkles } from 'lucide-react';

export const SynchronousView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SYNCHRONOUS_COMPARISONS[0].id);

  const activeComp =
    SYNCHRONOUS_COMPARISONS.find((c) => c.id === selectedId) ||
    SYNCHRONOUS_COMPARISONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-900 font-serif font-semibold mb-1">
          SYNCHRONOUS CHRONICLES
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          동시대 동서양 세계사 비교
        </h2>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          유라시아의 동쪽 끝 한반도와 서쪽 끝 지중해·유럽에서는 같은 해, 같은 세기에 어떤 운명적 격변이 동시에 일어나고 있었을까요? 역사 속 놀라운 우연과 필연을 대조합니다.
        </p>

        {/* Tab Buttons for Key Pivot Years */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {SYNCHRONOUS_COMPARISONS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedId(comp.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                selectedId === comp.id
                  ? 'bg-amber-900 text-white border-amber-950 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <span className="font-mono font-bold mr-1.5">{comp.year}</span>
              <span className="hidden sm:inline">({comp.theme})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparative Display */}
      <div className="bg-white border border-stone-300 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        {/* Banner with Year and Theme */}
        <div className="border-b border-stone-200 pb-5 mb-6 text-center">
          <span className="text-xs font-mono font-bold text-amber-900 tracking-wide block mb-1">
            MOMENTUM OF DESTINY · {activeComp.year}
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mb-2">
            {activeComp.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            핵심 테마: <span className="font-semibold text-stone-900">{activeComp.theme}</span>
          </p>
        </div>

        {/* 2-Column Side-by-Side: West vs East */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Western / Global Theater */}
          <div className="bg-[#FAF7F2] border border-amber-200/60 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                <span className="uppercase tracking-wider font-serif font-bold text-blue-900">
                  서양 및 지중해권
                </span>
                <span className="font-mono">{activeComp.year}</span>
              </div>

              <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-3">
                {activeComp.west.title}
              </h4>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                {activeComp.west.description}
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200/60 text-xs">
              <span className="font-semibold text-stone-900 block mb-0.5">세계사적 의의:</span>
              <span className="text-stone-700">{activeComp.west.significance}</span>
            </div>
          </div>

          {/* Center Synchronous Badge for desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-amber-900 text-white items-center justify-center shadow-md">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          {/* Eastern / Korean Theater */}
          <div className="bg-[#F8F9FA] border border-stone-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                <span className="uppercase tracking-wider font-serif font-bold text-red-900">
                  동아시아 및 한반도
                </span>
                <span className="font-mono">{activeComp.year}</span>
              </div>

              <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-3">
                {activeComp.east.title}
              </h4>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                {activeComp.east.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 text-xs">
              <span className="font-semibold text-stone-900 block mb-0.5">동아시아사적 의의:</span>
              <span className="text-stone-700">{activeComp.east.significance}</span>
            </div>
          </div>
        </div>

        {/* Curatorial Synthesis Insight */}
        <div className="mt-8 p-5 bg-[#FAF7EE] border-l-4 border-amber-800 rounded-r-xl">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-900 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>역사학적 종합 통찰 (Comparative Insight)</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
            {activeComp.insight}
          </p>
        </div>
      </div>

      {/* Historical Facts Accordion List */}
      <div className="mt-10">
        <h4 className="text-base font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-800" />
          <span>기타 동시대 주요 역사적 병렬 기록</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-700">
          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <span className="font-mono font-bold text-amber-900 block mb-1">기원전 5세기경</span>
            <p className="leading-relaxed">
              그리스에서 소크라테스·플라톤이 철학을 정립할 때, 인도에서는 붓다가 불교를 창시했고 중국에서는 공자가 유교 사상을 설파했습니다 (인류 지성의 축의 시대).
            </p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-4">
            <span className="font-mono font-bold text-amber-900 block mb-1">서기 13세기</span>
            <p className="leading-relaxed">
              칭기즈칸의 몽골 기마 군단이 유라시아를 정복하며 페르시아 바그다드 함락과 고려 침략(강화도 천도)을 동시에 일으켜 전 유라시아에 역참 네트워크를 놓았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
