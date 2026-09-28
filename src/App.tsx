/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HISTORY_SECTIONS,
  getAllHistoryItems,
} from './data/historyData';
import { HistoryItem } from './types/history';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SectionContainer } from './components/SectionContainer';
import { TimelineView } from './components/TimelineView';
import { SynchronousView } from './components/SynchronousView';
import { BookmarksView } from './components/BookmarksView';
import { DetailModal } from './components/DetailModal';
import { QuizModal } from './components/QuizModal';
import { SearchDialog } from './components/SearchDialog';
import { HistoricalTerrainMap } from './components/HistoricalTerrainMap';
import {
  Globe,
  Landmark,
  Compass,
  Flag,
  Activity,
  Coins,
  HelpCircle,
  ChevronUp,
  Map as MapIcon,
} from 'lucide-react';

const STORAGE_BOOKMARKS_KEY = 'history_archive_bookmarks';
const STORAGE_NOTES_KEY = 'history_archive_notes';

export default function App() {
  const [activeView, setActiveView] = useState<'archive' | 'timeline' | 'synchronous' | 'bookmarks'>('archive');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('world-europe');

  // Bookmarks & Notes state
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set(['ottoman-empire', 'korea-parallel-chronicle']);
    } catch {
      return new Set(['ottoman-empire', 'korea-parallel-chronicle']);
    }
  });

  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            'ottoman-empire': '1453년 콘스탄티노폴리스 함락과 조선 계유정난이 같은 해 일어났다는 점이 매우 인상적임.',
            'korea-parallel-chronicle': '정약용 흠흠신서의 나주 인체 자연발화 사건 다시 자세히 찾아볼 것.',
          };
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
    } catch (e) {
      console.error(e);
    }
  }, [userNotes]);

  // Global Keyboard Shortcuts (Ctrl/Cmd + K for Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intersection Observer for active section in archive view
  useEffect(() => {
    if (activeView !== 'archive') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    HISTORY_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    const mapEl = document.getElementById('terrain-map');
    if (mapEl) observer.observe(mapEl);

    return () => observer.disconnect();
  }, [activeView, searchQuery, selectedCategory]);

  // Toggle Bookmark handler
  const handleToggleBookmark = useCallback((item: HistoryItem) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  }, []);

  // Save note handler
  const handleSaveNote = useCallback((itemId: string, note: string) => {
    setUserNotes((prev) => ({
      ...prev,
      [itemId]: note,
    }));
    // automatically bookmark if note is added
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
  }, []);

  // Filter items in archive view
  const filteredSections = useMemo(() => {
    return HISTORY_SECTIONS.map((section) => {
      // If a category filter is active and doesn't match this section, skip
      if (selectedCategory !== 'all' && selectedCategory !== section.id) {
        return { ...section, items: [] };
      }

      // If search query is present, filter items
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchingItems = section.items.filter(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            it.summary.toLowerCase().includes(q) ||
            it.period.toLowerCase().includes(q) ||
            it.region.toLowerCase().includes(q) ||
            it.keyFigures?.some((f) => f.toLowerCase().includes(q)) ||
            it.keyConcepts?.some((k) => k.toLowerCase().includes(q)) ||
            it.details.some((d) => d.toLowerCase().includes(q))
        );
        return { ...section, items: matchingItems };
      }

      return section;
    });
  }, [selectedCategory, searchQuery]);

  // All bookmarked items
  const allItems = useMemo(() => getAllHistoryItems(), []);
  const bookmarkedItemsList = useMemo(() => {
    return allItems.filter((it) => bookmarkedIds.has(it.id));
  }, [allItems, bookmarkedIds]);

  const navSectionIcons: Record<string, React.ReactNode> = {
    'world-europe': <Globe className="w-4 h-4" />,
    'empires': <Landmark className="w-4 h-4" />,
    'asia-history': <Compass className="w-4 h-4" />,
    'us-history': <Flag className="w-4 h-4" />,
    'diseases': <Activity className="w-4 h-4" />,
    'wars-economy': <Coins className="w-4 h-4" />,
    'mysteries': <HelpCircle className="w-4 h-4" />,
  };

  const scrollToSection = (id: string) => {
    if (activeView !== 'archive') {
      setActiveView('archive');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      {/* Top Bar following Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToTerrainMap={() => scrollToSection('terrain-map')}
        savedCount={bookmarkedIds.size}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col">
        {activeView === 'archive' && (
          <div>
            {/* Museum Exhibition Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreTimeline={() => setActiveView('timeline')}
              onExploreSync={() => setActiveView('synchronous')}
            />

            {/* Content Body with Left Curatorial Rail on wide desktop */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Curatorial Navigation Rail */}
                <aside className="hidden lg:block lg:col-span-3 sticky top-20 bg-white/80 border border-stone-200/90 rounded-2xl p-4 shadow-2xs">
                  <div className="text-[11px] uppercase tracking-widest text-stone-500 font-serif font-semibold px-3 py-2 border-b border-stone-100">
                    역사 아카이브 목차
                  </div>
                  <nav className="mt-2 space-y-1">
                    {HISTORY_SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                          activeSectionId === sec.id
                            ? 'bg-amber-100/70 text-amber-950 font-bold'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className={
                            activeSectionId === sec.id
                              ? 'text-amber-800'
                              : 'text-stone-400'
                          }
                        >
                          {navSectionIcons[sec.id]}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </button>
                    ))}

                    <div className="pt-2 mt-2 border-t border-stone-200">
                      <button
                        onClick={() => scrollToSection('terrain-map')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2.5 cursor-pointer ${
                          activeSectionId === 'terrain-map'
                            ? 'bg-amber-100/70 text-amber-950 font-bold'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className={
                            activeSectionId === 'terrain-map'
                              ? 'text-amber-800'
                              : 'text-stone-400'
                          }
                        >
                          <MapIcon className="w-4 h-4" />
                        </span>
                        <span className="truncate font-semibold">시대별 지형 지도</span>
                      </button>
                    </div>
                  </nav>

                  <div className="mt-5 pt-4 border-t border-stone-100 px-3 text-[11px] text-stone-500 leading-relaxed">
                    단축키 <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700 font-mono text-[10px]">Ctrl+K</kbd>로 언제든 사료를 검색할 수 있습니다.
                  </div>
                </aside>

                {/* Main Archive Content Sections */}
                <main className="lg:col-span-9 space-y-16">
                  {filteredSections.map((section) => (
                    <SectionContainer
                      key={section.id}
                      section={section}
                      filteredItems={section.items}
                      onOpenDetail={(item) => setSelectedItem(item)}
                      bookmarkedIds={bookmarkedIds}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}

                  {/* Empty search state */}
                  {filteredSections.every((s) => s.items.length === 0) && (
                    <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8">
                      <p className="text-stone-600 text-sm">
                        "{searchQuery}"에 해당하는 역사 기록이 없습니다.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition cursor-pointer"
                      >
                        검색 조건 초기화
                      </button>
                    </div>
                  )}

                  {/* Historical Topographical Terrain Map at Bottom */}
                  <HistoricalTerrainMap
                    onSelectArchiveItem={(item) => setSelectedItem(item)}
                  />
                </main>
              </div>
            </div>
          </div>
        )}

        {/* Chronological Timeline View */}
        {activeView === 'timeline' && (
          <TimelineView
            onOpenDetail={(item) => setSelectedItem(item)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* Synchronous Comparator View */}
        {activeView === 'synchronous' && <SynchronousView />}

        {/* Personal Scholarly Bookmarks View */}
        {activeView === 'bookmarks' && (
          <BookmarksView
            bookmarkedItems={bookmarkedItemsList}
            userNotes={userNotes}
            onOpenDetail={(item) => setSelectedItem(item)}
            onRemoveBookmark={handleToggleBookmark}
            onExploreArchive={() => setActiveView('archive')}
          />
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-2.5 bg-stone-900 text-white rounded-full shadow-lg hover:bg-amber-900 transition-colors z-20 cursor-pointer"
        title="맨 위로 이동"
        aria-label="맨 위로 이동"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-[#F4EFE6]/70 py-10 px-4 lg:px-8 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-serif font-bold text-sm text-stone-900 mb-1">
              히스토리 아카이브 · 세계사의 모든 것
            </div>
            <p className="text-stone-500">
              고대 수메르 문명부터 제국의 흥망, 감염병, 세계 대전, 통화 패권, 그리고 미해독 고대 미스터리까지.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-stone-500">
            <button
              onClick={() => setActiveView('archive')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              아카이브 목차
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              연표 타임라인
            </button>
            <button
              onClick={() => setActiveView('synchronous')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              동서양 비교
            </button>
            <button
              onClick={() => scrollToSection('terrain-map')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              시대별 지형 지도
            </button>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              역사 퀴즈
            </button>
          </div>
        </div>
      </footer>

      {/* Deep Dive Archival Detail Modal */}
      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={selectedItem ? bookmarkedIds.has(selectedItem.id) : false}
        onToggleBookmark={handleToggleBookmark}
        userNote={selectedItem ? userNotes[selectedItem.id] : ''}
        onSaveNote={handleSaveNote}
      />

      {/* History Quiz Modal */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Quick Search Palette */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item) => setSelectedItem(item)}
        bookmarkedIds={bookmarkedIds}
      />
    </div>
  );
}
