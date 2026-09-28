import React, { useState, useMemo } from 'react';
import {
  TERRAIN_ERAS,
  HISTORICAL_TERRAIN_IMAGE,
  HistoricalNation,
  REAL_GEOGRAPHIC_FEATURES,
} from '../data/terrainMapData';
import {
  Compass,
  MapPin,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { HistoryItem } from '../types/history';
import { getAllHistoryItems } from '../data/historyData';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';

interface HistoricalTerrainMapProps {
  onSelectArchiveItem?: (item: HistoryItem) => void;
}

type RegionFocus = 'world' | 'east-asia' | 'europe' | 'middle-east' | 'americas';

export const HistoricalTerrainMap: React.FC<HistoricalTerrainMapProps> = ({
  onSelectArchiveItem,
}) => {
  const [selectedEraIndex, setSelectedEraIndex] = useState(3); // 1453 Early Modern era
  const [selectedNationId, setSelectedNationId] = useState<string>('ottoman-empire-early-modern');
  const [hoveredNationId, setHoveredNationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'vector' | 'atlas'>('vector');
  const [regionFocus, setRegionFocus] = useState<RegionFocus>('world');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showMountains, setShowMountains] = useState<boolean>(true);
  const [territoryMode, setTerritoryMode] = useState<'all' | 'selected'>('all');

  const currentEra = TERRAIN_ERAS[selectedEraIndex];
  const allHistoryItems = getAllHistoryItems();

  const selectedNation = useMemo(() => {
    return (
      currentEra.nations.find((n) => n.id === selectedNationId) ||
      currentEra.nations[0]
    );
  }, [currentEra, selectedNationId]);

  // Viewport setup based on region focus
  const viewportSettings = useMemo(() => {
    switch (regionFocus) {
      case 'east-asia':
        return { center: [115, 36] as [number, number], scale: 620 };
      case 'europe':
        return { center: [18, 46] as [number, number], scale: 720 };
      case 'middle-east':
        return { center: [48, 32] as [number, number], scale: 740 };
      case 'americas':
        return { center: [-85, 30] as [number, number], scale: 380 };
      case 'world':
      default:
        return { center: [15, 18] as [number, number], scale: 175 };
    }
  }, [regionFocus]);

  const width = 960;
  const height = 540;

  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .center(viewportSettings.center)
      .scale(viewportSettings.scale * zoomLevel)
      .translate([width / 2, height / 2]);
  }, [viewportSettings, zoomLevel]);

  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // Convert TopoJSON to GeoJSON features
  const geoLand = useMemo(() => {
    return topojson.feature(
      worldData as any,
      (worldData as any).objects.land
    );
  }, []);

  const geoCountries = useMemo(() => {
    return topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    );
  }, []);

  const graticule = useMemo(() => {
    return geoGraticule()();
  }, []);

  const handleSelectNation = (nation: HistoricalNation) => {
    setSelectedNationId(nation.id);
  };

  const handleOpenRelatedArchive = (archiveId: string) => {
    if (!onSelectArchiveItem) return;
    const item = allHistoryItems.find((it) => it.id === archiveId);
    if (item) {
      onSelectArchiveItem(item);
    }
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.7, Math.min(3.5, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setRegionFocus('world');
  };

  return (
    <section id="terrain-map" className="scroll-mt-24 border-t-2 border-stone-300 pt-12 pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-serif font-semibold mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-800" />
            <span>HISTORICAL GEOPOLITICAL ATLAS · 시대별 국가 영역 및 지형도</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            세계 지형 지도와 시대별 국가 영역
          </h2>
          <p className="mt-1 text-sm text-stone-600 max-w-3xl leading-relaxed">
            실제 대륙 해안선과 산맥·하천 위에 각 시대별 제국과 국가들의 <strong>실제 역사적 영토 경계(강역 폴리곤)</strong>를 색상별로 정확하게 구현했습니다.
          </p>
        </div>

        {/* View Mode & Map Style Toggles */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="flex items-center p-1 bg-stone-200/80 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('vector')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === 'vector'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              시대별 영토 영역도
            </button>
            <button
              onClick={() => setViewMode('atlas')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === 'atlas'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              고서화 아틀라스 뷰
            </button>
          </div>
        </div>
      </div>

      {/* Era Tabs */}
      <div className="mb-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TERRAIN_ERAS.map((era, idx) => (
          <button
            key={era.id}
            onClick={() => {
              setSelectedEraIndex(idx);
              setSelectedNationId(era.nations[0].id);
            }}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all border cursor-pointer ${
              selectedEraIndex === idx
                ? 'bg-amber-900 text-white border-amber-950 shadow-xs font-semibold'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
            }`}
          >
            <span className="font-serif block sm:inline">{era.title}</span>
            <span className="text-[11px] opacity-80 ml-1.5 hidden sm:inline">
              ({era.period})
            </span>
          </button>
        ))}
      </div>

      {/* Main Map Board */}
      <div className="bg-[#FAF7F2] border border-stone-300 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6 relative">
        {/* Controls Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-4 border-b border-stone-200 text-xs">
          {/* Era brief */}
          <div className="flex-1">
            <span className="font-bold text-amber-950 font-serif text-sm mr-2">
              {currentEra.title} ({currentEra.period})
            </span>
            <span className="text-stone-600 text-xs">{currentEra.summary}</span>
          </div>

          {/* Region focus quick buttons & Layer toggles */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-stone-500 font-medium hidden sm:inline">권역 이동:</span>
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-md">
              <button
                onClick={() => setRegionFocus('world')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'world' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                세계 전체
              </button>
              <button
                onClick={() => setRegionFocus('east-asia')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'east-asia' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                동아시아
              </button>
              <button
                onClick={() => setRegionFocus('europe')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'europe' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                유럽·지중해
              </button>
              <button
                onClick={() => setRegionFocus('middle-east')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'middle-east' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                중동·서아시아
              </button>
              <button
                onClick={() => setRegionFocus('americas')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'americas' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                아메리카
              </button>
            </div>

            {/* Layer Checkboxes */}
            <div className="flex items-center gap-2.5 ml-1 pl-2 border-l border-stone-300 text-[11px] text-stone-600">
              <div className="flex items-center bg-stone-200/60 p-0.5 rounded">
                <button
                  onClick={() => setTerritoryMode('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                    territoryMode === 'all' ? 'bg-amber-900 text-white font-semibold' : 'text-stone-600'
                  }`}
                >
                  전체 영토 표시
                </button>
                <button
                  onClick={() => setTerritoryMode('selected')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                    territoryMode === 'selected' ? 'bg-amber-900 text-white font-semibold' : 'text-stone-600'
                  }`}
                >
                  선택 국가만
                </button>
              </div>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRivers}
                  onChange={(e) => setShowRivers(e.target.checked)}
                  className="rounded text-amber-900 focus:ring-0"
                />
                <span>하천</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMountains}
                  onChange={(e) => setShowMountains(e.target.checked)}
                  className="rounded text-amber-900 focus:ring-0"
                />
                <span>산맥</span>
              </label>
            </div>
          </div>
        </div>

        {/* Map & Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Map Viewer Canvas */}
          <div className="lg:col-span-8 relative aspect-16/10 rounded-xl overflow-hidden border border-stone-300 bg-[#E8E2D5] shadow-inner select-none">
            {viewMode === 'atlas' ? (
              /* Archival Atlas Backdrop Mode */
              <div className="relative w-full h-full">
                <img
                  src={HISTORICAL_TERRAIN_IMAGE}
                  alt="역사적 세계 지형 고지도 아틀라스"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-amber-950/15 pointer-events-none" />
              </div>
            ) : (
              /* Real World Vector Topography & True Territory Map */
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full block"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Parchment Ocean Texture Pattern */}
                  <pattern id="sea-waves" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path
                      d="M 0 15 Q 7.5 10 15 15 T 30 15"
                      fill="none"
                      stroke="#D8CFBD"
                      strokeWidth="0.5"
                    />
                  </pattern>

                  {/* Territory Hatch Patterns for distinct cartographic shading */}
                  {currentEra.nations.map((nat) => (
                    <pattern
                      key={`hatch-${nat.id}`}
                      id={`hatch-${nat.id}`}
                      width="8"
                      height="8"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="8"
                        stroke={nat.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                      />
                    </pattern>
                  ))}
                </defs>

                {/* Ocean Background with Archival Gradient */}
                <rect width={width} height={height} fill="#E1D9C8" />
                <rect width={width} height={height} fill="url(#sea-waves)" opacity="0.6" />

                {/* Graticule Latitude/Longitude Grid Lines */}
                <path
                  d={pathGenerator(graticule) || ''}
                  fill="none"
                  stroke="#D0C6B2"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />

                {/* Real Continental Landmasses (Detailed Natural Earth Geography) */}
                <path
                  d={pathGenerator(geoLand as any) || ''}
                  fill="#DFD5C0"
                  stroke="#BFAFA0"
                  strokeWidth="0.8"
                />

                {/* Real Contemporary Coastline/Country Inset Lines (Faint Guide) */}
                <path
                  d={pathGenerator(geoCountries as any) || ''}
                  fill="none"
                  stroke="#C8BCA8"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 2"
                />

                {/* HISTORICAL COUNTRY TERRITORY POLYGONS (Accurate Geographic Boundaries) */}
                {currentEra.nations.map((nation) => {
                  const isSelected = selectedNation.id === nation.id;
                  const isHovered = hoveredNationId === nation.id;

                  // If user selected "selected country only", hide other polygons
                  if (territoryMode === 'selected' && !isSelected && !isHovered) {
                    return null;
                  }

                  // Generate SVG path for the territory polygon using d3-geo
                  const geoJsonFeature = {
                    type: 'Feature',
                    geometry: nation.territoryBoundary,
                  };
                  const territoryPath = pathGenerator(geoJsonFeature as any);
                  if (!territoryPath) return null;

                  return (
                    <g
                      key={`poly-${nation.id}`}
                      className="cursor-pointer transition-all"
                      onClick={() => handleSelectNation(nation)}
                      onMouseEnter={() => setHoveredNationId(nation.id)}
                      onMouseLeave={() => setHoveredNationId(null)}
                    >
                      {/* Territory Solid Base Fill */}
                      <path
                        d={territoryPath}
                        fill={nation.color}
                        fillOpacity={isSelected ? 0.38 : isHovered ? 0.3 : 0.2}
                        stroke={nation.color}
                        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {/* Vintage Cartographic Hatch Pattern on Selected Nation */}
                      {isSelected && (
                        <path
                          d={territoryPath}
                          fill={`url(#hatch-${nation.id})`}
                          fillOpacity="0.7"
                          pointerEvents="none"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Civilizational Rivers (Real Geographic Paths) */}
                {showRivers &&
                  REAL_GEOGRAPHIC_FEATURES.filter((f) => f.type === 'river').map((river, idx) => {
                    if (!river.path) return null;
                    const pathString = river.path
                      .map((coord, i) => {
                        const pt = projection(coord);
                        if (!pt) return '';
                        return `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`;
                      })
                      .join(' ');

                    const labelPoint = projection(river.coordinates);

                    return (
                      <g key={idx} pointerEvents="none">
                        <path
                          d={pathString}
                          fill="none"
                          stroke="#547E96"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {labelPoint && (
                          <text
                            x={labelPoint[0] + 4}
                            y={labelPoint[1] - 4}
                            fontSize="8"
                            fontFamily="serif"
                            fill="#33566B"
                            fontStyle="italic"
                            fontWeight="500"
                          >
                            {river.name}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* Mountain Ranges (Real Positions & Crests) */}
                {showMountains &&
                  REAL_GEOGRAPHIC_FEATURES.filter((f) => f.type === 'mountain').map((mt, idx) => {
                    const pt = projection(mt.coordinates);
                    if (!pt) return null;

                    return (
                      <g key={idx} transform={`translate(${pt[0]}, ${pt[1]})`} pointerEvents="none">
                        <path
                          d="M -9 4 L -4 -5 L 1 4 M -2 4 L 3 -7 L 8 4"
                          stroke="#7D6B52"
                          strokeWidth="1.4"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <text
                          x="0"
                          y="13"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontFamily="serif"
                          fontStyle="italic"
                          fontWeight="bold"
                          fill="#5C4D38"
                        >
                          {mt.name}
                        </text>
                      </g>
                    );
                  })}

                {/* Sea & Ocean Labels in Archival Typography */}
                {REAL_GEOGRAPHIC_FEATURES.filter((f) => f.type === 'sea').map((sea, idx) => {
                  const pt = projection(sea.coordinates);
                  if (!pt) return null;

                  return (
                    <text
                      key={idx}
                      x={pt[0]}
                      y={pt[1]}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="serif"
                      fontStyle="italic"
                      fill="#6C8391"
                      opacity="0.85"
                      pointerEvents="none"
                    >
                      {sea.name}
                    </text>
                  );
                })}

                {/* Territory Center Labels (Printed inside country territory like historical maps) */}
                {currentEra.nations.map((nation) => {
                  const pt = projection(nation.coordinates);
                  if (!pt) return null;
                  const isSelected = selectedNation.id === nation.id;
                  const isHovered = hoveredNationId === nation.id;

                  return (
                    <g
                      key={`label-${nation.id}`}
                      transform={`translate(${pt[0]}, ${pt[1]})`}
                      pointerEvents="none"
                    >
                      {/* Capital City Dot */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 4 : 3}
                        fill={nation.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Historic Nameplate inscribed on the territory */}
                      <text
                        x="0"
                        y={-9}
                        textAnchor="middle"
                        fontSize={isSelected ? '11' : isHovered ? '10' : '9.5'}
                        fontFamily="serif"
                        fontWeight="bold"
                        fill={isSelected ? '#1c1917' : '#292524'}
                        stroke="#FAF7F2"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        {nation.shortName}
                      </text>
                      <text
                        x="0"
                        y={14}
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="sans-serif"
                        fill="#57534e"
                        stroke="#FAF7F2"
                        strokeWidth="2"
                        paintOrder="stroke fill"
                      >
                        ★ {nation.capital.split(',')[0].split('(')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Ancient Map Compass Rose in Corner */}
                <g transform="translate(65, 480) scale(0.6)" pointerEvents="none">
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#A89A84" strokeWidth="0.8" />
                  <path
                    d="M 0 -45 L 6 -12 L 18 -16 L 12 -6 L 45 0 L 12 6 L 18 16 L 6 12 L 0 45 L -6 12 L -18 16 L -12 6 L -45 0 L -12 -6 L -18 -16 L -6 -12 Z"
                    fill="#8A775F"
                  />
                  <path
                    d="M 0 -45 L 0 0 L 45 0 L 0 0 L 0 45 L 0 0 L -45 0 Z"
                    stroke="#3D3327"
                    strokeWidth="1"
                  />
                  <text x="-4" y="-50" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#4A3D2A">
                    N
                  </text>
                  <text x="50" y="4" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#4A3D2A">
                    E
                  </text>
                </g>
              </svg>
            )}

            {/* Interactive Country Click Target Overlay */}
            {currentEra.nations.map((nation) => {
              const pt = projection(nation.coordinates);
              if (!pt) return null;
              if (pt[0] < -20 || pt[0] > width + 20 || pt[1] < -20 || pt[1] > height + 20) {
                return null;
              }

              const isSelected = selectedNation.id === nation.id;

              return (
                <button
                  key={`btn-${nation.id}`}
                  style={{
                    left: `${(pt[0] / width) * 100}%`,
                    top: `${(pt[1] / height) * 100}%`,
                  }}
                  onClick={() => handleSelectNation(nation)}
                  onMouseEnter={() => setHoveredNationId(nation.id)}
                  onMouseLeave={() => setHoveredNationId(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full cursor-pointer z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  title={`${nation.name} (${nation.capital}) 영토 선택`}
                  aria-label={`${nation.name} 영토 선택`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${
                      isSelected ? 'ring-2 ring-amber-950 scale-125' : ''
                    }`}
                    style={{ backgroundColor: nation.color }}
                  />
                </button>
              );
            })}

            {/* Floating Map Zoom Controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20 bg-white/90 backdrop-blur-xs border border-stone-300 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => handleZoom(0.3)}
                className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                title="지도 확대"
                aria-label="지도 확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.3)}
                className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                title="지도 축소"
                aria-label="지도 축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                title="원래 배율로 초기화"
                aria-label="원래 배율로 초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Panel: Selected Nation Scholarly Inspection Card */}
          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-stone-200 pb-3">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-mono text-amber-900 font-semibold">
                    {selectedNation.era}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                      {selectedNation.region}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: selectedNation.color }}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-stone-950 flex items-center gap-2">
                  <span>{selectedNation.name}</span>
                </h3>
                <div className="text-xs text-stone-500 font-serif italic">
                  {selectedNation.nativeName}
                </div>
                <div className="mt-1 text-xs text-stone-700 font-medium">
                  수도 / 중심지: <span className="font-semibold text-stone-900">{selectedNation.capital}</span>
                </div>
              </div>

              {/* Geographic Coordinates & Terrain */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>지형 및 지리적 환경</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#FAF7F2] p-3 rounded-lg border border-stone-200">
                  {selectedNation.terrainDescription}
                </p>
              </div>

              {/* Natural Landmarks */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold mb-1.5">
                  주요 하천 · 산맥 · 천연 방벽
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-stone-600">
                  {selectedNation.majorGeographicFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[11px]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Civilizational Significance */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-800" />
                  <span>문명사적 의의</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {selectedNation.historicalSignificance}
                </p>
              </div>

              {/* Direct Archive Link */}
              {selectedNation.relatedArchiveId && onSelectArchiveItem && (
                <div className="pt-2">
                  <button
                    onClick={() =>
                      handleOpenRelatedArchive(selectedNation.relatedArchiveId!)
                    }
                    className="w-full py-2.5 px-3 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>아카이브 심층 사료 바로보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nations Color Legend Strip (Shows actual polygon color tags) */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none">
          <span className="text-stone-500 shrink-0 font-serif font-semibold">
            {currentEra.title} 국가별 영토 범례:
          </span>
          {currentEra.nations.map((nat) => (
            <button
              key={nat.id}
              onClick={() => handleSelectNation(nat)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                selectedNation.id === nat.id
                  ? 'bg-amber-950 text-white font-semibold border-amber-950 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-400'
              }`}
            >
              <span
                className="w-3 h-3 rounded-sm shrink-0 border border-black/20"
                style={{ backgroundColor: nat.color }}
              />
              <span>{nat.shortName}</span>
              <span className="text-[10px] opacity-75">
                ({nat.capital.split(',')[0].split('(')[0]})
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
