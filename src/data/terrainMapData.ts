export interface HistoricalTerritoryPolygon {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][]; // GeoJSON polygon format [lng, lat]
}

export interface HistoricalNation {
  id: string;
  name: string;
  shortName: string;
  nativeName: string;
  capital: string;
  era: string;
  coordinates: [number, number]; // Capital coordinate [lng, lat]
  color: string;
  region: '동아시아' | '유럽' | '중동·서아시아' | '북아메리카' | '남아시아';
  terrainDescription: string;
  historicalSignificance: string;
  majorGeographicFeatures: string[];
  relatedArchiveId?: string;
  territoryBoundary: HistoricalTerritoryPolygon;
}

export interface TerrainEra {
  id: string;
  title: string;
  period: string;
  summary: string;
  nations: HistoricalNation[];
}

export const HISTORICAL_TERRAIN_IMAGE = '/src/assets/images/historical_world_terrain_map_1790561956608.jpg';

export const TERRAIN_ERAS: TerrainEra[] = [
  {
    id: 'ancient',
    title: '고대 문명기',
    period: '기원전 3500년 ~ 기원전 5세기',
    summary: '비옥한 대하천 유역(티그리스·유프라테스, 나일, 황하)을 중심으로 최초의 도시국가와 제국들이 태동한 인류 문명의 요람기입니다.',
    nations: [
      {
        id: 'sumer',
        name: '수메르 도시국가군',
        shortName: '수메르',
        nativeName: 'Sumer (𒆠𒂗𒄀)',
        capital: '우르, 우르크',
        era: '기원전 4000년 ~ 기원전 2000년',
        coordinates: [46.1, 31.0],
        color: '#b45309',
        region: '중동·서아시아',
        terrainDescription: '티그리스강과 유프라테스강 하류의 비옥한 충적평야. 매년 정기적 범람과 인공 관개수로망을 통해 고도의 집약 농경을 전개했습니다.',
        historicalSignificance: '인류 최초의 설형문자, 바퀴, 60진법 발명 및 최초의 도시 문명 형성.',
        majorGeographicFeatures: ['티그리스-유프라테스강', '비옥한 초승달 지대', '페르시아만 연안'],
        relatedArchiveId: 'sumer-civilization',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [44.0, 32.5], [45.5, 33.0], [47.5, 32.2], [48.5, 30.8], [48.0, 29.8], [46.5, 30.2], [44.8, 31.0], [44.0, 32.5]
          ]]
        }
      },
      {
        id: 'ancient-egypt',
        name: '고대 이집트 왕국',
        shortName: '고대 이집트',
        nativeName: 'Ancient Egypt (Kemet)',
        capital: '멤피스, 테베',
        era: '기원전 3100년 ~ 기원전 30년',
        coordinates: [31.25, 29.85],
        color: '#d97706',
        region: '중동·서아시아',
        terrainDescription: '나일강 정기 범람이 만든 비옥한 흑색토 지대와 나일 델타 삼각주. 동서의 광대한 사하라 사막이 천연 방벽 역할을 수행했습니다.',
        historicalSignificance: '태양력, 기하학, 피라미드 축조 및 파라오 중심의 신권 통치.',
        majorGeographicFeatures: ['나일강 삼각주', '사하라 사막', '홍해 연안'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [29.5, 31.5], [32.5, 31.5], [34.0, 27.5], [33.5, 23.5], [31.0, 23.5], [30.0, 27.0], [29.5, 31.5]
          ]]
        }
      },
      {
        id: 'gojoseon',
        name: '고조선 (단군·위만)',
        shortName: '고조선',
        nativeName: 'Gojoseon (古朝鮮)',
        capital: '아사달, 왕검성(평양)',
        era: '기원전 2333년(?) ~ 기원전 108년',
        coordinates: [125.76, 39.04],
        color: '#0284c7',
        region: '동아시아',
        terrainDescription: '요동반도 요하 유역과 한반도 서북부 대동강 유역. 비파형동검과 탁자식 고인돌이 분포하는 구릉 및 분지 지형.',
        historicalSignificance: '한민족 최초의 국가로 청동기·철기 문화를 바탕으로 독자적 세력권을 형성.',
        majorGeographicFeatures: ['요하 유역', '대동강', '낭림산맥'],
        relatedArchiveId: 'korea-parallel-chronicle',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [120.5, 41.5], [124.0, 42.5], [128.0, 41.0], [127.5, 38.0], [125.0, 37.8], [123.5, 39.5], [121.0, 40.0], [120.5, 41.5]
          ]]
        }
      },
      {
        id: 'ancient-china-shang-zhou',
        name: '상(商)·주(周) 왕조',
        shortName: '상·주(중국)',
        nativeName: 'Shang & Zhou Dynasty',
        capital: '은허(은), 호경/낙읍(주)',
        era: '기원전 1600년 ~ 기원전 256년',
        coordinates: [112.45, 34.62],
        color: '#b91c1c',
        region: '동아시아',
        terrainDescription: '황하 중하류의 광대한 황토 고원과 화북 평야. 비옥한 황토 토양과 잦은 황하 범람을 통제하며 농경 관개 발전.',
        historicalSignificance: '갑골문자 발명, 청동기 제기, 봉건제와 천명(天命) 사상 정립.',
        majorGeographicFeatures: ['황하(黃河)', '화북평야', '태행산맥'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [108.0, 36.5], [116.0, 37.5], [119.0, 35.5], [117.5, 32.5], [111.0, 32.0], [107.5, 34.0], [108.0, 36.5]
          ]]
        }
      },
      {
        id: 'ancient-greece',
        name: '고대 그리스 폴리스',
        shortName: '그리스',
        nativeName: 'Ancient Greece (Hellas)',
        capital: '아테네, 스파르타',
        era: '기원전 8세기 ~ 기원전 146년',
        coordinates: [23.73, 37.98],
        color: '#4f46e5',
        region: '유럽',
        terrainDescription: '발칸반도 남단의 험준한 산악 지형과 수많은 섬들이 흩어진 에게해 해안선. 고립된 계곡 지형이 개별 도시국가(폴리스) 분립 촉진.',
        historicalSignificance: '민주정치, 철학, 올림픽, 서양 예술과 과학의 원천.',
        majorGeographicFeatures: ['에게해', '펠로폰네소스 반도', '올림포스산'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [20.5, 39.5], [23.5, 41.0], [26.5, 39.0], [28.0, 37.0], [24.5, 35.5], [21.5, 36.5], [20.5, 39.5]
          ]]
        }
      },
      {
        id: 'achaemenid-persia',
        name: '아케메네스 페르시아 제국',
        shortName: '페르시아',
        nativeName: 'Achaemenid Empire',
        capital: '페르세폴리스, 수사',
        era: '기원전 550년 ~ 기원전 330년',
        coordinates: [52.89, 29.94],
        color: '#059669',
        region: '중동·서아시아',
        terrainDescription: '이란 고원을 중심으로 자그로스 산맥과 메소포타미아, 아나톨리아, 이집트를 잇는 거대한 대륙 교차로 지형.',
        historicalSignificance: '키루스 대제의 관용 정책, 왕의 길(Royal Road), 캄비세스 2세의 이집트 원정.',
        majorGeographicFeatures: ['이란 고원', '자그로스 산맥', '카스피해 남안'],
        relatedArchiveId: 'cambyses-lost-army',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [27.0, 40.0], [40.0, 42.0], [55.0, 42.0], [68.0, 40.0], [70.0, 30.0], [60.0, 25.0], [48.0, 28.0], [32.0, 28.0], [28.0, 36.0], [27.0, 40.0]
          ]]
        }
      }
    ]
  },
  {
    id: 'classical',
    title: '고전 제국기',
    period: '기원전 3세기 ~ 서기 5세기',
    summary: '동서양 양대 축인 로마 제국과 한(漢) 제국이 유라시아 대륙 양끝을 장악하고, 한반도에서는 삼국이 정립하며 비단길(실크로드)로 교역한 시대입니다.',
    nations: [
      {
        id: 'roman-empire-classical',
        name: '로마 제국 (팍스 로마나)',
        shortName: '로마 제국',
        nativeName: 'Imperium Romanum',
        capital: '로마, 콘스탄티노폴리스',
        era: '기원전 27년 ~ 서기 476년 (서로마)',
        coordinates: [12.50, 41.90],
        color: '#dc2626',
        region: '유럽',
        terrainDescription: '지중해(Mare Nostrum)를 내해로 감싼 삼면의 반도 지형. 알프스 산맥이 북방을 막아주고 라인강·도나우강이 천연 국경선 역할.',
        historicalSignificance: '팍스 로마나 200년, 로마법 대전, 가도망 건설, 313년 기독교 공인.',
        majorGeographicFeatures: ['지중해', '알프스산맥', '도나우강', '라인강'],
        relatedArchiveId: 'roman-empire',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [-6.0, 36.0], [-9.0, 42.0], [-1.0, 52.0], [6.0, 51.0], [14.0, 48.0], [24.0, 45.0], [36.0, 41.0], [38.0, 34.0], [33.0, 28.0], [20.0, 31.0], [-2.0, 34.0], [-6.0, 36.0]
          ]]
        }
      },
      {
        id: 'han-dynasty',
        name: '한(漢) 제국',
        shortName: '한나라',
        nativeName: 'Han Dynasty (漢)',
        capital: '장안(전한), 낙양(후한)',
        era: '기원전 202년 ~ 서기 220년',
        coordinates: [108.94, 34.34],
        color: '#ea580c',
        region: '동아시아',
        terrainDescription: '위수 분지의 천혜 요새 관중(關中) 평야에서 출발. 하서주랑(河西走廊)을 뚫어 타클라마칸 사막 가장자리 실크로드 개척.',
        historicalSignificance: '한족·한자 문화권 확립, 비단길 개척(장건), 유교 국교화.',
        majorGeographicFeatures: ['관중 평야', '하서주랑', '타림 분지', '장강'],
        relatedArchiveId: 'china-qin-han',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [85.0, 42.0], [98.0, 40.0], [112.0, 41.0], [122.0, 40.5], [120.0, 32.0], [115.0, 23.0], [106.0, 22.0], [102.0, 26.0], [100.0, 33.0], [85.0, 42.0]
          ]]
        }
      },
      {
        id: 'korean-three-kingdoms',
        name: '삼국시대 (고구려·백제·신라)',
        shortName: '삼국(한국)',
        nativeName: 'Three Kingdoms of Korea',
        capital: '평양(고구려), 사비(백제), 금성(신라)',
        era: '기원전 1세기 ~ 서기 7세기',
        coordinates: [127.5, 37.0],
        color: '#2563eb',
        region: '동아시아',
        terrainDescription: '백두대간 산줄기를 척추로 삼고, 한강·낙동강·대동강 유역의 비옥한 곡창지대를 둘러싼 치열한 쟁탈전 지형.',
        historicalSignificance: '광개토대왕·장수왕의 대륙 경영, 한강 유역 패권 교체와 신라의 삼국통일 기초.',
        majorGeographicFeatures: ['백두대간', '한강 유역', '압록강', '동해'],
        relatedArchiveId: 'korea-parallel-chronicle',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [122.0, 42.5], [126.0, 44.0], [130.0, 43.0], [130.0, 36.0], [128.5, 34.8], [126.0, 34.2], [125.0, 38.0], [123.5, 40.0], [122.0, 42.5]
          ]]
        }
      },
      {
        id: 'sassanid-persia',
        name: '사산조 페르시아 제국',
        shortName: '사산 페르시아',
        nativeName: 'Sasanian Empire',
        capital: '크테시폰(바그다드 근교)',
        era: '224년 ~ 651년',
        coordinates: [44.58, 33.09],
        color: '#059669',
        region: '중동·서아시아',
        terrainDescription: '이란 고원과 메소포타미아 저지대 사이. 로마와 국경을 맞대며 실크로드 중계 무역을 독점한 전략적 요충지.',
        historicalSignificance: '조로아스터교 국교화, 로마 제국과의 오랜 패권 대결, 화려한 페르시아 금속 공예.',
        majorGeographicFeatures: ['자그로스 산맥', '티그리스 하류', '페르시아만'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [40.0, 36.0], [48.0, 40.0], [60.0, 39.0], [68.0, 35.0], [65.0, 27.0], [55.0, 25.5], [47.0, 29.0], [40.0, 36.0]
          ]]
        }
      },
      {
        id: 'kushan-empire',
        name: '쿠샨 왕조',
        shortName: '쿠샨',
        nativeName: 'Kushan Empire',
        capital: '푸루샤푸라(페샤와르)',
        era: '30년 ~ 375년',
        coordinates: [71.52, 34.02],
        color: '#7c3aed',
        region: '남아시아',
        terrainDescription: '힌두쿠시 산맥과 인더스강 상류, 간다라 계곡. 인도와 중앙아시아, 중국을 잇는 산악 관문 지형.',
        historicalSignificance: '동서 문화 융합의 간다라 미술 탄생, 대승불교의 동아시아 전파 고속도로.',
        majorGeographicFeatures: ['힌두쿠시 산맥', '카이베르 고개', '인더스강 상류'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [66.0, 38.0], [75.0, 39.0], [78.0, 32.0], [75.0, 26.0], [68.0, 27.0], [66.0, 38.0]
          ]]
        }
      }
    ]
  },
  {
    id: 'medieval',
    title: '중세 시대',
    period: '서기 6세기 ~ 서기 14세기',
    summary: '서로마 멸망 후 비잔티움(동로마)과 이슬람 제국이 번영하고, 칭기즈칸의 몽골 유목 제국이 유라시아 대륙 전체를 통합한 격변기입니다.',
    nations: [
      {
        id: 'byzantine-empire',
        name: '동로마 제국 (비잔티움)',
        shortName: '동로마(비잔티움)',
        nativeName: 'Byzantine Empire (Βασιλεία Ῥωμαίων)',
        capital: '콘스탄티노폴리스(이스탄불)',
        era: '395년 ~ 1453년',
        coordinates: [28.98, 41.01],
        color: '#9333ea',
        region: '유럽',
        terrainDescription: '유럽과 아시아를 가르는 보스포루스 해협의 골든혼 천혜 요새. 테오도시우스 성벽으로 1천 년간 방어된 해상 무역 관문.',
        historicalSignificance: '유스티니아누스 법전, 아야 소피아 대성당, 고대 그리스·로마 고전문헌 보존.',
        majorGeographicFeatures: ['보스포루스 해협', '골든혼', '아나톨리아 고원', '발칸 반도'],
        relatedArchiveId: 'ottoman-empire',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [19.0, 42.0], [26.0, 43.5], [33.0, 41.5], [37.0, 39.0], [33.0, 36.5], [26.0, 36.0], [21.0, 38.0], [19.0, 42.0]
          ]]
        }
      },
      {
        id: 'abbasid-caliphate',
        name: '아바스 칼리프조 (이슬람 황금기)',
        shortName: '아바스 왕조',
        nativeName: 'Abbasid Caliphate',
        capital: '바그다드',
        era: '750년 ~ 1258년',
        coordinates: [44.37, 33.32],
        color: '#15803d',
        region: '중동·서아시아',
        terrainDescription: '티그리스 강변의 원형 도시 바그다드를 중심. 지중해와 인도양을 잇는 해양·육상 실크로드의 심장부.',
        historicalSignificance: '지혜의 집(지식 번역 운동), 대수학·천문학·의학 발전(아비센나), 이슬람 르네상스.',
        majorGeographicFeatures: ['티그리스강', '아라비아 사막', '페르시아만'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [25.0, 32.0], [36.0, 37.0], [48.0, 38.0], [60.0, 37.0], [68.0, 30.0], [55.0, 22.0], [42.0, 20.0], [32.0, 25.0], [25.0, 32.0]
          ]]
        }
      },
      {
        id: 'mongol-empire',
        name: '몽골 제국 (대원 울루스)',
        shortName: '몽골 제국',
        nativeName: 'Mongol Empire (ᠶᠡᠬᠡ ᠮᠣᠩᠭᠣᠯ ᠤᠯᠤᠰ)',
        capital: '카라코룸, 대도(북경)',
        era: '1206년 ~ 1368년',
        coordinates: [102.85, 47.20],
        color: '#0891b2',
        region: '동아시아',
        terrainDescription: '끝없는 몽골 초원 스텝(Steppe) 지대에서 유라시아 대륙 횡단. 혹한의 기후와 기동력을 살린 기마 군단의 무대.',
        historicalSignificance: '인류 역사상 최대의 연속 육상 제국, 팍스 몽골리카와 참치(역참제) 네트워크.',
        majorGeographicFeatures: ['몽골 고원', '고비 사막', '알타이 산맥', '유라시아 스텝'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [35.0, 52.0], [60.0, 58.0], [90.0, 56.0], [125.0, 52.0], [122.0, 32.0], [105.0, 25.0], [80.0, 32.0], [55.0, 34.0], [40.0, 38.0], [35.0, 52.0]
          ]]
        }
      },
      {
        id: 'goryeo-dynasty',
        name: '고려 왕조',
        shortName: '고려',
        nativeName: 'Goryeo Dynasty (高麗)',
        capital: '개경(개성)',
        era: '918년 ~ 1392년',
        coordinates: [126.55, 37.97],
        color: '#1d4ed8',
        region: '동아시아',
        terrainDescription: '예성강 하구 벽란도를 통해 송, 아라비아 상인과 국제 무역 전개. 산지가 많은 한반도 지형을 활용한 강화도 대몽 항쟁.',
        historicalSignificance: '금속활자 최초 발명(직지심체요절), 팔만대장경 판각, 벽란도 국제 무역(Korea 명칭 유래).',
        majorGeographicFeatures: ['예성강 벽란도', '강화도', '태백산맥'],
        relatedArchiveId: 'korea-parallel-chronicle',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [124.5, 40.0], [128.0, 40.8], [129.5, 38.5], [129.0, 35.5], [126.0, 34.5], [125.5, 38.0], [124.5, 40.0]
          ]]
        }
      },
      {
        id: 'holy-roman-empire',
        name: '신성 로마 제국',
        shortName: '신성 로마',
        nativeName: 'Sacrum Romanum Imperium',
        capital: '아헨, 뉘른베르크, 빈',
        era: '962년 ~ 1806년',
        coordinates: [8.68, 50.11],
        color: '#ca8a04',
        region: '유럽',
        terrainDescription: '라인강, 엘베강, 도나우강 유역의 중부 유럽 평원 및 삼림 지대. 수많은 제후국과 자유도시로 분할된 복합 영토.',
        historicalSignificance: '중세 봉건 기사도, 황제와 교황의 서임권 투쟁(카노사의 굴욕), 이후 종교개혁의 진앙지.',
        majorGeographicFeatures: ['라인강', '도나우강', '검은 숲(슈바르츠발트)'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [5.5, 52.5], [14.0, 54.0], [17.0, 50.0], [15.5, 46.0], [11.0, 44.5], [6.5, 46.5], [5.5, 52.5]
          ]]
        }
      }
    ]
  },
  {
    id: 'early-modern',
    title: '1453년 분수령 & 근세',
    period: '서기 1453년 ~ 서기 18세기',
    summary: '1453년 오스만의 콘스탄티노폴리스 정복과 동시기 조선의 계유정난, 유럽의 대항해시대와 르네상스, 청나라의 유라시아 평정이 맞물린 근세의 태동입니다.',
    nations: [
      {
        id: 'ottoman-empire-early-modern',
        name: '오스만 제국',
        shortName: '오스만 제국',
        nativeName: 'Ottoman Empire (دولت علیه عثمانیه)',
        capital: '이스탄불(콘스탄티노폴리스)',
        era: '1299년 ~ 1922년',
        coordinates: [28.98, 41.01],
        color: '#15803d',
        region: '유럽',
        terrainDescription: '보스포루스 해협을 장악하고 흑해와 동지중해, 홍해를 통제. 아나톨리아 산악과 발칸 산맥, 나일강 하구를 잇는 3대륙 제국.',
        historicalSignificance: '1453년 우르반 거포로 비잔티움 함락, 지중해 무역 독점으로 서양의 대항해시대 유발, 쉴레이만 대제 전성기.',
        majorGeographicFeatures: ['보스포루스 해협', '다르다넬스 해협', '토로스 산맥', '발칸 반도'],
        relatedArchiveId: 'ottoman-empire',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [17.0, 46.0], [25.0, 48.0], [38.0, 45.0], [45.0, 38.0], [48.0, 31.0], [40.0, 25.0], [32.0, 24.0], [20.0, 32.0], [15.0, 40.0], [17.0, 46.0]
          ]]
        }
      },
      {
        id: 'joseon-dynasty',
        name: '조선 왕조',
        shortName: '조선',
        nativeName: 'Joseon Dynasty (朝鮮)',
        capital: '한양(서울)',
        era: '1392년 ~ 1897년',
        coordinates: [126.98, 37.57],
        color: '#1d4ed8',
        region: '동아시아',
        terrainDescription: '북악산, 인왕산, 남산, 낙산의 내사산에 둘러싸인 한양 분지와 한강 수운. 백두대간과 압록강·두만강 국경선 확립.',
        historicalSignificance: '1453년 수양대군의 계유정난, 훈민정음 창제, 성리학적 유교 관료제, 조선왕조실록 및 정약용 흠흠신서.',
        majorGeographicFeatures: ['한양 내사산', '한강', '백두산', '압록강-두만강'],
        relatedArchiveId: 'korea-parallel-chronicle',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [124.5, 40.0], [128.0, 42.0], [130.8, 42.8], [129.5, 38.0], [129.2, 35.0], [126.5, 34.0], [125.8, 38.0], [124.5, 40.0]
          ]]
        }
      },
      {
        id: 'qing-dynasty',
        name: '청(淸) 제국',
        shortName: '청나라',
        nativeName: 'Qing Dynasty (ᡩᠠᡳᠴᡳᠩ ᡤᡠᡵᡠᠨ)',
        capital: '북경(자금성)',
        era: '1636년 ~ 1912년',
        coordinates: [116.41, 39.90],
        color: '#eab308',
        region: '동아시아',
        terrainDescription: '만주 삼림·초원에서 출발해 중원 평야와 몽골, 티베트 고원, 신장 분지까지 병합한 유라시아 동부 최대 판도.',
        historicalSignificance: '강희·옹정·건륭 3대 130년 태평성세, 팔기군 제도, 사고전서 편찬, 1840년 아편전쟁 패배.',
        majorGeographicFeatures: ['만주 평원', '자금성', '티베트 고원', '타클라마칸 사막'],
        relatedArchiveId: 'china-ming-qing',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [75.0, 38.0], [85.0, 48.0], [115.0, 52.0], [135.0, 50.0], [130.0, 42.0], [122.0, 31.0], [118.0, 24.0], [105.0, 22.0], [90.0, 28.0], [78.0, 32.0], [75.0, 38.0]
          ]]
        }
      },
      {
        id: 'spanish-empire',
        name: '스페인 제국',
        shortName: '스페인',
        nativeName: 'Spanish Empire (Imperio español)',
        capital: '마드리드, 세비야',
        era: '1492년 ~ 19세기',
        coordinates: [-3.70, 40.42],
        color: '#b91c1c',
        region: '유럽',
        terrainDescription: '이베리아 반도의 메세타 고원과 대서양 연안. 카리브해와 안데스 산맥(포토시 은광)을 잇는 거대한 해양 네트워크.',
        historicalSignificance: '1492년 콜럼버스의 신대륙 도착, 아메리카 은 유입으로 인한 유럽 가격 혁명, 무적함대.',
        majorGeographicFeatures: ['이베리아 메세타', '대서양 항로', '안데스 산맥', '포토시 은광'],
        relatedArchiveId: 'renaissance-and-exploration',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [-9.0, 43.0], [-2.0, 43.5], [3.0, 42.0], [0.0, 38.0], [-6.0, 36.0], [-9.0, 37.0], [-9.0, 43.0]
          ]]
        }
      },
      {
        id: 'mughal-empire',
        name: '무굴 제국',
        shortName: '무굴 제국',
        nativeName: 'Mughal Empire (مغلیہ سلطنت)',
        capital: '델리, 아그라',
        era: '1526년 ~ 1857년',
        coordinates: [77.21, 28.61],
        color: '#047857',
        region: '남아시아',
        terrainDescription: '히말라야 산맥 남쪽의 광대한 인도-갠지스 평원과 데칸 고원. 비옥한 농토와 향신료, 면직물 생산의 중심지.',
        historicalSignificance: '악바르 대제의 종교 융합, 타지마할 건축, 세계 최대의 면직물 생산 수출국.',
        majorGeographicFeatures: ['인도-갠지스 평원', '히말라야 산맥', '야무나강', '데칸 고원'],
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [68.0, 32.0], [78.0, 34.0], [88.0, 26.0], [86.0, 20.0], [78.0, 15.0], [72.0, 20.0], [68.0, 26.0], [68.0, 32.0]
          ]]
        }
      }
    ]
  },
  {
    id: 'modern',
    title: '근현대 및 세계대전기',
    period: '서기 19세기 ~ 서기 20세기 중반',
    summary: '산업혁명과 제국주의 열강의 식민지 팽창, 미국의 대륙 횡단과 패권 부상, 두 차례 세계대전과 1944년 브레튼우즈 체제로 이어진 현대사의 현장입니다.',
    nations: [
      {
        id: 'british-empire',
        name: '대영제국 (본토 및 식민망)',
        shortName: '영국',
        nativeName: 'British Empire',
        capital: '런던',
        era: '18세기 ~ 20세기 중반',
        coordinates: [-0.13, 51.51],
        color: '#dc2626',
        region: '유럽',
        terrainDescription: '브리튼 섬의 풍부한 석탄·철광석 매장 지대와 템스강 하구. 5대양 6대주를 아우르는 전 세계 해양 항로 독점.',
        historicalSignificance: '증기기관과 산업혁명 발상지, "해가 지지 않는 제국", 1840년 아편전쟁 도발 및 파운드화 금융 패권.',
        majorGeographicFeatures: ['템스강', '도버 해협', '수에즈 운하', '전 지구적 식민지망'],
        relatedArchiveId: 'industrial-revolution',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [-5.5, 50.0], [-1.0, 50.5], [1.5, 52.5], [-2.0, 56.0], [-5.0, 58.5], [-6.0, 55.0], [-4.5, 52.0], [-5.5, 50.0]
          ]]
        }
      },
      {
        id: 'united-states',
        name: '미합중국 (미국)',
        shortName: '미국',
        nativeName: 'United States of America',
        capital: '워싱턴 D.C.',
        era: '1776년 ~ 현재',
        coordinates: [-77.04, 38.91],
        color: '#1e40af',
        region: '북아메리카',
        terrainDescription: '애팔래치아 산맥 동부 13개 식민지에서 미시시피강 유역 대평원(Great Plains), 로키 산맥을 넘어 태평양에 이르는 광활한 대륙 영토.',
        historicalSignificance: '1776년 독립선언, 루이지애나 매입, 남북전쟁, 1·2차 대전 승리와 1944년 브레튼우즈 달러 기축통화 체제.',
        majorGeographicFeatures: ['애팔래치아 산맥', '미시시피강', '그레이트플레인스', '로키 산맥'],
        relatedArchiveId: 'us-independence',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [-124.0, 48.5], [-95.0, 49.0], [-71.0, 45.0], [-74.0, 40.0], [-80.0, 26.0], [-97.0, 26.0], [-117.0, 32.5], [-124.0, 40.0], [-124.0, 48.5]
          ]]
        }
      },
      {
        id: 'korean-empire-republic',
        name: '대한제국 / 대한민국',
        shortName: '한국',
        nativeName: 'Empire of Korea / Republic of Korea',
        capital: '한성(서울)',
        era: '1897년 ~ 현재',
        coordinates: [126.98, 37.57],
        color: '#0284c7',
        region: '동아시아',
        terrainDescription: '대륙과 해양의 교차점 한반도. 동고서저의 산악 지형과 3면의 바다, 20세기 냉전의 최전선 DMZ 분단선.',
        historicalSignificance: '1897년 대한제국 선포, 1919년 3·1 독립만세운동 및 임시정부 수립, 1950년 한국전쟁 극복.',
        majorGeographicFeatures: ['백두대간', '휴전선(DMZ)', '한강', '대한해협'],
        relatedArchiveId: 'korea-parallel-chronicle',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [124.3, 39.8], [128.0, 42.0], [130.8, 42.8], [129.5, 38.0], [129.2, 35.0], [126.5, 34.0], [125.8, 38.0], [124.3, 39.8]
          ]]
        }
      },
      {
        id: 'german-empire',
        name: '독일 제국 (프로이센 통일)',
        shortName: '독일 제국',
        nativeName: 'Deutsches Kaiserreich',
        capital: '베를린',
        era: '1871년 ~ 1918년',
        coordinates: [13.41, 52.52],
        color: '#374151',
        region: '유럽',
        terrainDescription: '북독일 평원과 라인강 루르 탄전 공업지대. 유럽 대륙 한가운데 위치해 동서 양면 전선의 지정학적 딜레마 직면.',
        historicalSignificance: '비스마르크의 철혈 정책과 통일, 급속한 중화학 공업화, 1914년 제1차 세계대전 참전 및 참호전.',
        majorGeographicFeatures: ['루르 공업지대', '라인강', '엘베강', '북독일 평원'],
        relatedArchiveId: 'world-war-one',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [6.0, 50.5], [9.0, 54.5], [19.0, 54.5], [22.0, 53.5], [19.0, 50.0], [13.0, 48.0], [7.5, 48.0], [6.0, 50.5]
          ]]
        }
      },
      {
        id: 'russian-empire-ussr',
        name: '러시아 제국 / 소련',
        shortName: '러시아/소련',
        nativeName: 'Russian Empire / USSR',
        capital: '상트페테르부르크, 모스크바',
        era: '1721년 ~ 1991년',
        coordinates: [37.62, 55.76],
        color: '#991b1b',
        region: '유럽',
        terrainDescription: '광대한 동유럽 평원, 우랄 산맥 동쪽의 시베리아 툰드라와 타이가 침엽수림, 흑해와 발트해를 잇는 거대한 내륙 유라시아.',
        historicalSignificance: '표트르 대제의 서구화, 1917년 볼셰비키 혁명과 소련 탄생, 2차 대전 승전과 냉전의 한 축.',
        majorGeographicFeatures: ['볼가강', '우랄 산맥', '시베리아 평원', '바이칼호'],
        relatedArchiveId: 'world-war-two',
        territoryBoundary: {
          type: 'Polygon',
          coordinates: [[
            [28.0, 58.0], [45.0, 68.0], [80.0, 70.0], [130.0, 70.0], [170.0, 65.0], [140.0, 50.0], [85.0, 50.0], [50.0, 48.0], [35.0, 46.0], [28.0, 58.0]
          ]]
        }
      }
    ]
  }
];

export interface GeographicFeature {
  name: string;
  type: 'mountain' | 'river' | 'sea';
  coordinates: [number, number]; // [lng, lat]
  path?: [number, number][]; // series of [lng, lat]
}

export const REAL_GEOGRAPHIC_FEATURES: GeographicFeature[] = [
  // Mountain Ranges
  { name: '알프스 산맥', type: 'mountain', coordinates: [10.0, 46.5] },
  { name: '자그로스 산맥', type: 'mountain', coordinates: [50.0, 32.5] },
  { name: '히말라야 산맥', type: 'mountain', coordinates: [85.0, 28.5] },
  { name: '우랄 산맥', type: 'mountain', coordinates: [60.0, 58.0] },
  { name: '백두대간', type: 'mountain', coordinates: [128.5, 37.5] },
  { name: '로키 산맥', type: 'mountain', coordinates: [-110.0, 45.0] },
  { name: '안데스 산맥', type: 'mountain', coordinates: [-72.0, -15.0] },

  // Key Civilizational Rivers (polyline of [lng, lat])
  {
    name: '나일강',
    type: 'river',
    coordinates: [31.2, 30.0],
    path: [[31.5, 24.0], [32.5, 26.0], [31.8, 29.0], [31.2, 30.5], [30.5, 31.4]]
  },
  {
    name: '티그리스·유프라테스강',
    type: 'river',
    coordinates: [45.0, 32.5],
    path: [[38.5, 38.0], [40.5, 36.0], [44.0, 33.5], [47.5, 31.0], [48.5, 30.0]]
  },
  {
    name: '황하(黃河)',
    type: 'river',
    coordinates: [110.0, 35.0],
    path: [[101.0, 35.0], [103.5, 36.5], [108.5, 40.5], [111.0, 37.0], [113.0, 34.8], [118.5, 37.5]]
  },
  {
    name: '장강(양쯔강)',
    type: 'river',
    coordinates: [115.0, 30.0],
    path: [[100.0, 28.0], [106.5, 29.5], [112.5, 30.0], [117.0, 31.0], [121.5, 31.5]]
  },
  {
    name: '도나우강',
    type: 'river',
    coordinates: [19.0, 47.5],
    path: [[8.5, 48.0], [12.0, 48.5], [17.0, 48.0], [21.0, 45.0], [28.0, 45.2]]
  },
  {
    name: '미시시피강',
    type: 'river',
    coordinates: [-90.0, 35.0],
    path: [[-94.0, 47.0], [-91.0, 42.0], [-89.5, 37.0], [-91.0, 32.5], [-89.2, 29.2]]
  },
  {
    name: '한강',
    type: 'river',
    coordinates: [127.0, 37.5],
    path: [[128.5, 37.2], [127.5, 37.5], [126.7, 37.7]]
  },

  // Seas
  { name: '지중해 (Mediterranean)', type: 'sea', coordinates: [18.0, 35.0] },
  { name: '동해 (East Sea)', type: 'sea', coordinates: [132.0, 39.0] },
  { name: '황해·서해', type: 'sea', coordinates: [123.0, 35.0] },
  { name: '페르시아만', type: 'sea', coordinates: [51.0, 27.0] },
  { name: '흑해 (Black Sea)', type: 'sea', coordinates: [34.0, 43.5] },
  { name: '대서양', type: 'sea', coordinates: [-30.0, 35.0] },
  { name: '태평양', type: 'sea', coordinates: [160.0, 30.0] }
];
