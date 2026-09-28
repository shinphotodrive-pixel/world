import React, { useState, useMemo } from 'react';
import {
  TERRAIN_ERAS,
  HISTORICAL_TERRAIN_IMAGE,
  HistoricalNation,
  REAL_GEOGRAPHIC_FEATURES,
  COUNTRY_NAME_KO,
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
  Layers,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { HistoryItem } from '../types/history';
import { getAllHistoryItems } from '../data/historyData';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';

interface HistoricalTerrainMapProps {
  onSelectArchiveItem?: (item: HistoryItem) => void;
}

type RegionFocus = 'world' | 'east-asia' | 'europe' | 'middle-east' | 'americas' | 'south-asia';
type BorderStyle = 'crisp' | 'dashed' | 'antique';

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
  const [showSeas, setShowSeas] = useState<boolean>(true);
  const [showAllBorders, setShowAllBorders] = useState<boolean>(true);
  const [showInternalBorders, setShowInternalBorders] = useState<boolean>(true);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('crisp');
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
        return { center: [115, 36] as [number, number], scale: 640 };
      case 'europe':
        return { center: [18, 46] as [number, number], scale: 740 };
      case 'middle-east':
        return { center: [46, 30] as [number, number], scale: 760 };
      case 'americas':
        return { center: [-85, 30] as [number, number], scale: 390 };
      case 'south-asia':
        return { center: [78, 24] as [number, number], scale: 720 };
      case 'world':
      default:
        return { center: [15, 18] as [number, number], scale: 178 };
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

  // High-Resolution World Geometries from countries-50m.json
  const { countryGeomMap, allBordersPath, landFeature, landOutlinePath } = useMemo(() => {
    const rawData = worldData as any;
    const geomMap = new Map<string, any>();
    if (rawData.objects?.countries?.geometries) {
      rawData.objects.countries.geometries.forEach((g: any) => {
        if (g.properties && g.properties.name) {
          geomMap.set(g.properties.name, g);
        }
      });
    }

    // All international border lines between every country on earth
    const bordersMesh = topojson.mesh(
      rawData,
      rawData.objects.countries,
      (a: any, b: any) => a !== b
    );
    const allBordersPath = pathGenerator(bordersMesh as any) || '';

    // Landmass & Coastline outline
    const landFeature = topojson.feature(rawData, rawData.objects.land);
    const coastlinesMesh = topojson.mesh(rawData, rawData.objects.land);
    const landOutlinePath = pathGenerator(coastlinesMesh as any) || '';

    return {
      countryGeomMap: geomMap,
      allBordersPath,
      landFeature,
      landOutlinePath,
    };
  }, [pathGenerator]);

  const graticule = useMemo(() => {
    return geoGraticule()();
  }, []);

  const graticulePath = useMemo(() => {
    return pathGenerator(graticule) || '';
  }, [pathGenerator, graticule]);

  const landPath = useMemo(() => {
    return pathGenerator(landFeature as any) || '';
  }, [pathGenerator, landFeature]);

  // Compute precise historical nation territory polygons and crisp borders
  const nationTerritoryData = useMemo(() => {
    const rawData = worldData as any;
    return currentEra.nations.map((nation) => {
      const geoms = nation.countryNames
        .map((name) => countryGeomMap.get(name))
        .filter(Boolean);

      let mergedPath = '';
      let outerBorderPath = '';
      let internalBordersPath = '';

      if (geoms.length > 0) {
        try {
          // 1. Merged full territory polygon
          const mergedGeom = topojson.merge(rawData, geoms);
          mergedPath = pathGenerator(mergedGeom as any) || '';

          // 2. Exact outer frontier border line of the empire
          const outerBorderMesh = topojson.mesh(
            rawData,
            { type: 'GeometryCollection', geometries: geoms } as any,
            (a: any, b: any) => a === b || !b
          );
          outerBorderPath = pathGenerator(outerBorderMesh as any) || '';

          // 3. Internal provincial / regional division borders within the empire
          if (geoms.length > 1) {
            const internalMesh = topojson.mesh(
              rawData,
              { type: 'GeometryCollection', geometries: geoms } as any,
              (a: any, b: any) => a !== b
            );
            internalBordersPath = pathGenerator(internalMesh as any) || '';
          }
        } catch (e) {
          console.error('Territory generation warning:', nation.id, e);
        }
      }

      return {
        nation,
        mergedPath,
        outerBorderPath,
        internalBordersPath,
      };
    });
  }, [currentEra, countryGeomMap, pathGenerator]);

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

  // Convert nation's modern country names to Korean
  const modernCountriesInKorean = useMemo(() => {
    return selectedNation.countryNames.map((name) => COUNTRY_NAME_KO[name] || name);
  }, [selectedNation]);

  const hoveredNation = useMemo(() => {
    if (!hoveredNationId) return null;
    return currentEra.nations.find((n) => n.id === hoveredNationId) || null;
  }, [currentEra, hoveredNationId]);

  return (
    <section id="terrain-map" className="scroll-mt-24 border-t-2 border-stone-300 pt-12 pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-serif font-semibold mb-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-800" />
            <span>HISTORICAL GEOPOLITICAL ATLAS · 정밀 지형 지도 및 시대별 영토 경계선</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            세계 지형 지도와 시대별 국가 경계선
          </h2>
          <p className="mt-1 text-sm text-stone-600 max-w-3xl leading-relaxed">
            고해상도 자연 지형(해안선·산맥·하천)과 <strong>각 시대별 제국·국가의 정밀 국경선(외곽 국경 및 내부 영역선)</strong>을 실제 지도 데이터(Natural Earth 50m) 기반으로 세부 렌더링했습니다.
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
              시대별 영토·국경도
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
                onClick={() => setRegionFocus('south-asia')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  regionFocus === 'south-asia' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                남아시아
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

            {/* Territory Display Mode */}
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
          </div>
        </div>

        {/* Detail Layer & Border Customization Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 mb-3 border-b border-stone-200/70 text-xs text-stone-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-stone-700 flex items-center gap-1 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-800" />
              <span>국경선 및 지형 레이어:</span>
            </span>

            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAllBorders}
                onChange={(e) => setShowAllBorders(e.target.checked)}
                className="rounded text-amber-900 focus:ring-0"
              />
              <span className="font-medium text-stone-800">세계 국경선 상세</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInternalBorders}
                onChange={(e) => setShowInternalBorders(e.target.checked)}
                className="rounded text-amber-900 focus:ring-0"
              />
              <span>제국 내부 관할구역선</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="rounded text-amber-900 focus:ring-0"
              />
              <span>하천망</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showMountains}
                onChange={(e) => setShowMountains(e.target.checked)}
                className="rounded text-amber-900 focus:ring-0"
              />
              <span>산맥 능선</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSeas}
                onChange={(e) => setShowSeas(e.target.checked)}
                className="rounded text-amber-900 focus:ring-0"
              />
              <span>해양 명칭</span>
            </label>
          </div>

          {/* Border line style selector */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-stone-500">국경선 표현:</span>
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded text-[10px]">
              <button
                onClick={() => setBorderStyle('crisp')}
                className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                  borderStyle === 'crisp' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
                title="정밀 실선 국경선"
              >
                정밀 실선
              </button>
              <button
                onClick={() => setBorderStyle('dashed')}
                className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                  borderStyle === 'dashed' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
                title="역사 지도 점선 국경선"
              >
                고지도 점선
              </button>
              <button
                onClick={() => setBorderStyle('antique')}
                className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                  borderStyle === 'antique' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
                title="엔틱 잉크 풍 국경선"
              >
                앤틱 풍
              </button>
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
              /* Real World Vector Topography & Detailed Territory Boundaries Map */
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full block"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Parchment Ocean Texture Pattern */}
                  <pattern id="sea-waves" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path
                      d="M 0 14 Q 7 9 14 14 T 28 14"
                      fill="none"
                      stroke="#D5CCA9"
                      strokeWidth="0.5"
                      opacity="0.7"
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
                        strokeOpacity="0.45"
                      />
                    </pattern>
                  ))}

                  {/* Filter for Border Glow Effect */}
                  <filter id="border-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ocean Background with Archival Gradient */}
                <rect width={width} height={height} fill="#E3DAC7" />
                <rect width={width} height={height} fill="url(#sea-waves)" opacity="0.65" />

                {/* Graticule Latitude/Longitude Grid Lines */}
                <path
                  d={graticulePath}
                  fill="none"
                  stroke="#D0C5B0"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />

                {/* Latitude Reference Markers along the side */}
                <text x="8" y="275" fontSize="7.5" fill="#8C7D68" fontFamily="serif">0° 적도</text>
                <text x="8" y="165" fontSize="7.5" fill="#8C7D68" fontFamily="serif">30°N</text>
                <text x="8" y="85" fontSize="7.5" fill="#8C7D68" fontFamily="serif">60°N</text>
                <text x="8" y="380" fontSize="7.5" fill="#8C7D68" fontFamily="serif">30°S</text>

                {/* Real Continental Landmasses (Detailed Natural Earth Geography) */}
                <path
                  d={landPath}
                  fill="#DFD5C0"
                  stroke="#B0A08D"
                  strokeWidth="0.8"
                />

                {/* Antique Coastline Waterlining Halo (Double Shoreline Effect) */}
                <path
                  d={landOutlinePath}
                  fill="none"
                  stroke="#C5B6A0"
                  strokeWidth="1.6"
                  opacity="0.4"
                />
                <path
                  d={landOutlinePath}
                  fill="none"
                  stroke="#7A6852"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* DETAILED GLOBAL COUNTRY BORDERS (세부 국경선) */}
                {showAllBorders && (
                  <path
                    d={allBordersPath}
                    fill="none"
                    stroke={borderStyle === 'antique' ? '#8C7760' : '#A3927C'}
                    strokeWidth={borderStyle === 'crisp' ? '0.75' : '0.65'}
                    strokeDasharray={
                      borderStyle === 'dashed'
                        ? '2 2.5'
                        : borderStyle === 'antique'
                        ? '3 1.5 1 1.5'
                        : 'none'
                    }
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity={0.8}
                  />
                )}

                {/* HISTORICAL ERA COUNTRY TERRITORY POLYGONS & BOUNDARIES */}
                {nationTerritoryData.map(({ nation, mergedPath, outerBorderPath, internalBordersPath }) => {
                  const isSelected = selectedNation.id === nation.id;
                  const isHovered = hoveredNationId === nation.id;

                  // If user selected "selected country only", hide other polygons
                  if (territoryMode === 'selected' && !isSelected && !isHovered) {
                    return null;
                  }

                  if (!mergedPath) return null;

                  return (
                    <g
                      key={`poly-${nation.id}`}
                      className="cursor-pointer transition-all"
                      onClick={() => handleSelectNation(nation)}
                      onMouseEnter={() => setHoveredNationId(nation.id)}
                      onMouseLeave={() => setHoveredNationId(null)}
                    >
                      {/* Territory Solid Base Fill with Archival Hue */}
                      <path
                        d={mergedPath}
                        fill={nation.color}
                        fillOpacity={isSelected ? 0.42 : isHovered ? 0.35 : 0.22}
                        className="transition-all duration-200"
                      />

                      {/* Vintage Cartographic Hatch Pattern on Selected/Hovered Nation */}
                      {(isSelected || isHovered) && (
                        <path
                          d={mergedPath}
                          fill={`url(#hatch-${nation.id})`}
                          fillOpacity={isSelected ? '0.75' : '0.45'}
                          pointerEvents="none"
                        />
                      )}

                      {/* Internal Provincial Boundaries within Empire (제국 내부 관할/주 경계선) */}
                      {showInternalBorders && internalBordersPath && (
                        <path
                          d={internalBordersPath}
                          fill="none"
                          stroke={nation.color}
                          strokeWidth={isSelected ? '1.2' : '0.8'}
                          strokeDasharray="2.5 3"
                          strokeOpacity={isSelected ? '0.85' : '0.55'}
                          pointerEvents="none"
                        />
                      )}

                      {/* CRISP HISTORICAL OUTER BORDER FRONTIER LINE (제국/국가 정밀 외곽 국경선) */}
                      {outerBorderPath && (
                        <>
                          {/* Soft colored border halo/glow for maximum clarity */}
                          <path
                            d={outerBorderPath}
                            fill="none"
                            stroke={nation.color}
                            strokeWidth={isSelected ? '4' : isHovered ? '3.2' : '2.2'}
                            strokeOpacity={isSelected ? '0.55' : '0.35'}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            pointerEvents="none"
                          />

                          {/* Sharp, crisp boundary stroke */}
                          <path
                            d={outerBorderPath}
                            fill="none"
                            stroke={nation.color}
                            strokeWidth={isSelected ? '2.4' : isHovered ? '2.0' : '1.4'}
                            strokeDasharray={
                              borderStyle === 'dashed'
                                ? '4 2'
                                : borderStyle === 'antique'
                                ? '5 1.5 2 1.5'
                                : 'none'
                            }
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            pointerEvents="none"
                          />
                        </>
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
                        {/* River path with authentic hydrographic blue */}
                        <path
                          d={pathString}
                          fill="none"
                          stroke="#48758F"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {labelPoint && (
                          <text
                            x={labelPoint[0] + 4}
                            y={labelPoint[1] - 3}
                            fontSize="8"
                            fontFamily="serif"
                            fill="#2D5369"
                            fontStyle="italic"
                            fontWeight="600"
                            stroke="#FAF7F2"
                            strokeWidth="2"
                            paintOrder="stroke fill"
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
                        {/* Mountain Ridge Engraved Symbol */}
                        <path
                          d="M -10 4 L -5 -6 L 0 4 M -3 4 L 3 -8 L 9 4 M 5 4 L 9 -4 L 14 4"
                          stroke="#6A5A43"
                          strokeWidth="1.4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <text
                          x="2"
                          y="14"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontFamily="serif"
                          fontStyle="italic"
                          fontWeight="bold"
                          fill="#4E3E2A"
                          stroke="#FAF7F2"
                          strokeWidth="2.5"
                          paintOrder="stroke fill"
                        >
                          ▲ {mt.name}
                        </text>
                      </g>
                    );
                  })}

                {/* Sea & Ocean Labels in Archival Typography */}
                {showSeas &&
                  REAL_GEOGRAPHIC_FEATURES.filter((f) => f.type === 'sea').map((sea, idx) => {
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
                        fill="#587180"
                        fontWeight="500"
                        opacity="0.88"
                        stroke="#FAF7F2"
                        strokeWidth="1.5"
                        paintOrder="stroke fill"
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
                      {/* Capital City Dot & Pin */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 4.5 : isHovered ? 4 : 3}
                        fill={nation.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Historic Nameplate inscribed on the territory */}
                      <text
                        x="0"
                        y={-9}
                        textAnchor="middle"
                        fontSize={isSelected ? '12' : isHovered ? '11' : '10'}
                        fontFamily="serif"
                        fontWeight="bold"
                        fill={isSelected ? '#1c1917' : '#292524'}
                        stroke="#FAF7F2"
                        strokeWidth="3"
                        paintOrder="stroke fill"
                      >
                        {nation.shortName}
                      </text>
                      <text
                        x="0"
                        y={14}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontFamily="sans-serif"
                        fill="#44403c"
                        stroke="#FAF7F2"
                        strokeWidth="2.5"
                        paintOrder="stroke fill"
                      >
                        ★ {nation.capital.split(',')[0].split('(')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Ancient Map Compass Rose in Corner */}
                <g transform="translate(65, 480) scale(0.62)" pointerEvents="none">
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#9A8B74" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="33" fill="none" stroke="#9A8B74" strokeWidth="0.4" strokeDasharray="2 2" />
                  <path
                    d="M 0 -45 L 6 -12 L 18 -16 L 12 -6 L 45 0 L 12 6 L 18 16 L 6 12 L 0 45 L -6 12 L -18 16 L -12 6 L -45 0 L -12 -6 L -18 -16 L -6 -12 Z"
                    fill="#8A775F"
                  />
                  <path
                    d="M 0 -45 L 0 0 L 45 0 L 0 0 L 0 45 L 0 0 L -45 0 Z"
                    stroke="#2D2419"
                    strokeWidth="1"
                  />
                  <text x="-4" y="-50" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#3D3020">
                    N
                  </text>
                  <text x="50" y="4" fontSize="12" fontWeight="bold" fontFamily="serif" fill="#3D3020">
                    E
                  </text>
                </g>

                {/* Cartographic Scale Bar */}
                <g transform="translate(130, 515)" pointerEvents="none">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#5A4E3E" strokeWidth="2" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#5A4E3E" strokeWidth="1.5" />
                  <line x1="50" y1="-2" x2="50" y2="2" stroke="#5A4E3E" strokeWidth="1" />
                  <line x1="100" y1="-3" x2="100" y2="3" stroke="#5A4E3E" strokeWidth="1.5" />
                  <text x="0" y="-5" fontSize="7" fontFamily="serif" fill="#5A4E3E">0</text>
                  <text x="45" y="-5" fontSize="7" fontFamily="serif" fill="#5A4E3E">1,000</text>
                  <text x="90" y="-5" fontSize="7" fontFamily="serif" fill="#5A4E3E">2,000 km</text>
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
                  title={`${nation.name} (${nation.capital}) 영토 및 국경 선택`}
                  aria-label={`${nation.name} 영토 및 국경 선택`}
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

            {/* Hover Floating HUD info tooltip */}
            {hoveredNation && (
              <div className="absolute top-3 left-3 z-20 bg-stone-900/90 text-white backdrop-blur-xs px-3 py-2 rounded-lg shadow-md border border-stone-700 pointer-events-none text-xs flex items-center gap-2 max-w-md animate-fade-in">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white"
                  style={{ backgroundColor: hoveredNation.color }}
                />
                <div>
                  <div className="font-bold font-serif flex items-center gap-1.5">
                    <span>{hoveredNation.name}</span>
                    <span className="text-[10px] text-stone-300 font-sans font-normal">
                      ({hoveredNation.era})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-300 mt-0.5">
                    수도: ★ {hoveredNation.capital} · 국경 내 현대 국가 {hoveredNation.countryNames.length}개국 포괄
                  </div>
                </div>
              </div>
            )}

            {/* Floating Map Zoom Controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20 bg-white/95 backdrop-blur-xs border border-stone-300 rounded-lg p-1 shadow-sm">
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
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
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

              {/* Modern Sovereign Countries within the Historical Frontier */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-stone-500 font-serif font-semibold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>역사적 국경 내 포괄 현대 국가 ({modernCountriesInKorean.length}개국)</span>
                  </span>
                </h4>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-[#FAF7F2] rounded-lg border border-stone-200 text-xs">
                  {modernCountriesInKorean.map((cName, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[11px] font-medium"
                    >
                      {cName}
                    </span>
                  ))}
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
            {currentEra.title} 국가별 영토·국경 범례:
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
