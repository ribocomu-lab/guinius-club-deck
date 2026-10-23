// 색상·폰트·문구는 이 파일만 고치면 모든 슬라이드에 반영됩니다. (references/template/config.js와 같은 역할)
// 수치는 deck-data.js(자동 생성: scripts/analysis/2026-10-23_build-deck-data.py)에서 읽습니다.
window.KIT = {
  W: 1920, H: 1080,
  LOOP: 8, BUILD: 2.2, HOLD: 4.4, BACK: 1.4, // 템플릿 타이밍 그대로. 덱에서는 변환 2.2초 후 완료 상태 유지(once)
  // references/template/config.js 팔레트 그대로
  C: {
    bg: '#f2f2f3', ink: '#1d1f20', muted: '#5d5d60', grid: '#d4d4d7', track: '#e7e7ea',
    a: '#416180',   // 강조색 (accent-700)
    b: '#94bce3',   // 보조색 (accent-400)
    a2: '#749dc4', b2: '#d6ebff', dark: '#1d2d3d', paper: '#f5f5f8', card: '#ffffff'
  },
  FONT: "'Pretendard', sans-serif",
  NUM: "'Barlow Condensed', 'Pretendard', sans-serif",
  E: {}
};

// 슬라이드 순서·문구. 제목은 템플릿 규칙대로 "무엇이 어떻다" 한 문장 + 수치 하나.
window.DECK = {
  slides: [
    { id: 'cover', dark: true, name: '표지', kicker: 'GUINEA PIG · HAMSTER DATA REPORT', title: ['기니피그와 햄스터,', '데이터로 읽다'], sub: '반려인 질문 47건 · 포럼 문단 931개 · 사진 100장', source: '2026.10.23' },
    { id: 'why', name: '기획 배경', kicker: '00 기획 배경 · GUINIUS CLUB', title: '펫 스터디룸을 만들기 전에, 진짜 기니피그부터 봤다', source: '출처: data/code_artifact.md — 기니어스클럽 기획 문서' },
    { id: 'data', name: '데이터 개요', kicker: '01 데이터 개요', title: '세 가지 데이터로 기니피그와 햄스터를 들여다봤다', source: '출처: data/raw/firecrawl/ (GuineaPigCages.com, 2026-10-23 수집) · data/classification_results.csv' },
    { id: 'mood', name: '걱정 비율', kicker: 'PART 1  반려인의 고민 · 감성', title: '반려인 질문 10건 중 6건에는 걱정이 묻어 있다', source: '출처: analysis/findings.md F1 · VADER 점수 + 불안 어휘 사전 조합 라벨 · 표본 47건(방향성 지표)' },
    { id: 'cats', name: '고민 카테고리', kicker: 'PART 1  반려인의 고민 · 카테고리', title: '가장 큰 고민은 질병·동물병원, 질문 3건 중 1건이다', source: '출처: analysis/findings.md F2 · 주 카테고리 기준(글 1건 = 1카테고리)' },
    { id: 'neg', name: '카테고리별 부정', kicker: 'PART 1  반려인의 고민 · 카테고리별 감성', title: '합사·행동 질문의 77.8%가 부정적, 케이지는 20.0%다', source: '출처: analysis/findings.md F3 · 표본 5건 이상 카테고리만 비교' },
    { id: 'kw', name: '키워드', kicker: 'PART 1  반려인의 고민 · 키워드', title: "가장 많이 쓴 단어는 'vet'(동물병원), 51회다", source: '출처: data/processed/2026-10-23_gp-analysis.json · 불용어 제거 후 빈도 (전체 2,638토큰)' },
    { id: 'tier', name: '야채 티어표', kicker: 'PART 2  기니피그의 기쁨 · 야채 티어', title: 'S티어는 옥수수 껍질·엔다이브·멜론·포도·파슬리·키위', source: '출처: findings J1 · 점수 = (열광×2 + 좋아함 − 골라먹음 − 거부×2) ÷ (언급 + 2) · 언급 4회 이상 38종' },
    { id: 'pop', name: '자주 먹는 채소', kicker: 'PART 2  기니피그의 기쁨 · 자주 오르는 채소', title: '자주 오르는 채소 9개 중 주키니만 점수가 마이너스다', source: '출처: findings J1–J2 · 언급 30회 이상 채소 · 주키니 32회 중 거부 15회' },
    { id: 'trig', name: '팝코닝 트리거', kicker: 'PART 2  기니피그의 기쁨 · 팝코닝', title: '팝코닝은 간식 시간(25)과 청소 직후(24)에 가장 많이 터진다', source: '출처: findings J3 · 팝코닝 언급 140문단 중 짜증·서열 맥락 12문단 제외' },
    { id: 'words', name: '리액션 단어', kicker: 'PART 2  기니피그의 기쁨 · 리액션 단어', title: "반려인이 가장 많이 쓴 리액션은 'popcorn', 228회다", source: '출처: data/processed/2026-10-23_joy-reaction-words.json · 931문단 전체 빈도' },
    { id: 'wheek', name: '윅윅 트리거', kicker: 'PART 2  기니피그의 기쁨 · 윅윅 울음', title: '윅윅은 밥 시간(21)과 봉지 바스락 소리(20)에 터진다', source: '출처: findings J4 · 윅윅 언급 123문단, 한 문단에 여러 트리거 가능' },
    { id: 'set', name: '이미지 데이터', kicker: 'PART 3  기니피그 vs 햄스터 AI · 데이터셋', title: '사진 100장 중 80장으로 학습하고, 처음 보는 20장으로 검증했다', source: '출처: data/classification_results.csv · notebooks/2026-10-23_guineapig-vs-hamster-resnet18.py' },
    { id: 'acc', name: '정확도', kicker: 'PART 3  기니피그 vs 햄스터 AI · 정확도', title: '처음 보는 사진 20장 중 17장을 맞혔다 (85%)', source: '출처: data/classification_results.csv · ImageNet 사전학습 ResNet18, 5 epoch · 95% 신뢰구간은 Wilson 방식' },
    { id: 'cm', name: '혼동 행렬', kicker: 'PART 3  기니피그 vs 햄스터 AI · 혼동 행렬', title: '틀린 3장 중 2장은 햄스터를 기니피그로 본 경우다', source: '출처: data/classification_results.csv · 검증셋 20장 (클래스별 10장)' },
    { id: 'conf', name: '정답 확률', kicker: 'PART 3  기니피그 vs 햄스터 AI · 확신도', title: '가장 크게 틀린 햄스터 사진의 정답 확률은 0.04였다', source: '출처: data/classification_results.csv · 정답 클래스 확률(prob_guinea_pig / prob_hamster)' },
    { id: 'miss', name: '오분류 사진', kicker: 'PART 3  기니피그 vs 햄스터 AI · 오분류 사진', title: '틀린 사진의 공통점: 몸통이 작거나 가려졌다', source: '출처: data/classification_results.csv · 사진: Pexels / Unsplash 원본 URL' },
    { id: 'end', dark: true, name: '정리', kicker: '정리 · SUMMARY', title: '세 가지 발견, 그리고 다음 질문', source: '출처: analysis/findings.md F1–F3 · J1–J4 · data/classification_results.csv' }
  ],
  why: {
    card: ['기니피그·햄스터 메이트가 곁에서', '함께 공부해 주는 가상 펫 스터디룸'],
    points: ['감시 대신 조용히 곁에 있는 동행', '누가 곁에 있으면 집중이 오르는 바디 더블링', "'꾸이꾸이' 울음과 백색소음 사운드 레이어"],
    qs: [
      { q: '반려인은 무엇을 가장 걱정할까?', d: 'PART 1 · 포럼 질문 글 47건 · 감성·카테고리·키워드 분석' },
      { q: '기니피그는 언제 기뻐하고, 어떤 소리를 낼까?', d: 'PART 2 · 스레드 44개 931문단 · 야채 티어·팝코닝·윅윅' },
      { q: 'AI가 기니피그와 햄스터를 구별할 수 있을까?', d: 'PART 3 · 사진 100장 · ResNet18 전이학습' }
    ]
  },
  misclass: {
    'hamster_044.jpg': { tag: '사람이 주인공인 구도 · 흰 털', note: ['사람이 화면 대부분을 차지하고', '작은 흰 햄스터가 안겨 있다'] },
    'hamster_028.jpg': { tag: '구멍에서 얼굴만 빼꼼', note: ['둥근 입구에 얼굴만 보이고', '몸통이 가려져 체형 단서가 없다'] },
    'guinea_pig_008.jpg': { tag: '초원 속 야생 개체', note: ['넓은 초원에 몸이 작게 찍힌', '콜롬비아 야생 기니피그'] }
  },
  limits: [
    '단일 영어권 포럼 · 규칙 기반 라벨 → 수치는 방향성 지표로 읽는다',
    '햄스터는 이미지 데이터뿐 → 햄스터 포럼 텍스트도 같은 방식으로 모아 비교하기',
    '검증 20장의 85%는 신뢰구간 64–95% → 사진을 늘려 다시 검증하기'
  ]
};
