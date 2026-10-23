// 색상·폰트·문구는 이 파일만 고치면 모든 슬라이드에 반영됩니다. (references/template/config.js와 같은 역할)
// 수치는 deck-data.js(자동 생성)에서 읽습니다.
window.KIT = {
  W: 1920, H: 1080,
  LOOP: 8, BUILD: 2.2, HOLD: 4.4, BACK: 1.4, // 템플릿 타이밍 계승: 변환 2.2초. 덱에서는 변환 후 완료 상태 유지(once)
  // Nintendo.com (2001) 팔레트 — DESIGN.md
  C: {
    primary: '#e60012', signal: '#f68d1f', amber: '#ecab37', gold: '#e48600',
    canvas: '#7a8aba', soft: '#9fbee7', lavender: '#acace7', ice: '#c0d5e6', peri: '#8ba1d4',
    indigo: '#3d4f97', mindigo: '#60619c', platinum: '#dedede', white: '#ffffff',
    carbon: '#21242e', hair: '#5a5f8c', teal: '#206479', gred: '#a7282b',
    // core.js 호환용 별칭
    bg: '#7a8aba', ink: '#21242e', muted: '#3d4f97', grid: '#5a5f8c', track: '#dedede',
    a: '#3d4f97', b: '#9fbee7', a2: '#8ba1d4', b2: '#c0d5e6', dark: '#21242e', paper: '#ffffff'
  },
  FONT: "'Pretendard', Arial, sans-serif",
  NUM: "'Arial Black', 'Archivo Black', 'Pretendard', sans-serif",
  DISPLAY: "'Arial Black', 'Archivo Black', 'Pretendard', sans-serif",
  PIXEL: "'Silkscreen', 'Press Start 2P', monospace",
  E: {}
};

window.DECK = {
  brand: 'GUINIUS',
  nav: ['SERVICE', 'BACKGROUND', 'INSIGHT', 'AI LAB', 'ROADMAP'],
  slides: [
    { nav: 0, kicker: 'GUINIUS CLUB · 기획 배경 및 서비스 포지셔닝', source: '출처: data/code_artifact.md — 기니어스클럽 기획 문서' },
    { nav: 1, kicker: '02  PROBLEM · 기존 스터디 툴의 피로도', title: '감시는 지치게 하고, 혼자는 외롭게 한다', source: '출처: data/code_artifact.md Slide 2 · 정성 문제 정의(외부 통계 미인용)' },
    { nav: 1, kicker: '03  TREND · Z세대 웰니스', title: "몰입은 '같이 있되 간섭하지 않는' 방식으로 바뀌었다", source: '출처: data/code_artifact.md Slide 3 · 트렌드 해석(외부 통계 미인용)' },
    { nav: 1, kicker: '04  SOLUTION · 니즈 → 기능 매핑', title: '네 가지 니즈를 네 가지 기능으로 연결한다', source: '출처: data/code_artifact.md Slide 4' },
    { nav: 2, kicker: '05  INSIGHT ① · 포럼 텍스트 분석', title: '반려인 질문의 57.4%에는 걱정이 묻어 있다', source: '출처: analysis/findings.md F1–F3 · GuineaPigCages.com 질문 47건 (Firecrawl 수집, 2026-10-23)' },
    { nav: 2, kicker: '06  INSIGHT ② · 행복의 순간', title: '기니피그는 작은 순간에 튀어 오르고, 소리로 말을 건다', source: '출처: analysis/findings.md J3–J4 · GuineaPigCages.com 스레드 44개 · 931문단' },
    { nav: 3, kicker: '07  AI LAB · Kaggle ResNet18 전이학습', title: '처음 보는 사진 20장 중 17장을 가려냈다', source: '출처: data/classification_results.csv · ImageNet 사전학습 ResNet18, 5 epoch, 검증 20장' },
    { nav: 3, kicker: '08  AI LAB · 오분류 분석', title: '틀린 사진의 공통점: 몸통 실루엣이 작거나 가려졌다', source: '출처: data/classification_results.csv · 검증셋 오분류 3장 (사진: Pexels / Unsplash)' },
    { nav: 4, kicker: '09  VISION · 온·오프라인 확장 로드맵', title: '스터디 타이머를 넘어, 펫과 함께하는 코워킹 월드로', source: '출처: data/code_artifact.md Slide 5 · 단계 구성과 오프라인 확장은 제안(안)' },
    { nav: 4, kicker: '10  TARGET · 누구를 위한 방인가', title: '혼자지만 외롭지 않은 몰입, 지금 시작합니다', source: '출처: data/code_artifact.md Slide 5 · 수치는 slides/deck-data.js' }
  ],
  problems: [
    { no: '01', head: ['관음과 감시의', '스트레스'], body: ['캠스터디·실시간 측정 앱은', '타인의 시선과 끊임없는', "상호 감시로 '도파민 소진'을", '부른다'], chip: 'BURNOUT' },
    { no: '02', head: ['1인 가구·비대면', '고립의 심화'], body: ['원격 근무와 독학은 흔해졌지만', '혼자 공부할 때의 산만함과', '정서적 고립을 받아줄', '완충지대가 없다'], chip: 'ISOLATION' },
    { no: '03', head: ['바디 더블링에', '대한 갈망'], body: ['누군가 곁에 있기만 해도', '집중이 오른다. 하지만 실제', '인간관계의 감정 소모는', '부담스럽다'], chip: 'BODY DOUBLING' }
  ],
  trends: [
    { tag: 'ANALOG FOCUS', ko: '아날로그 집중 · 로파이 ASMR', key: true, lines: ['빗소리·모닥불 위에 타자 소리, 책장 넘김,', '숨소리를 겹친 공간의 현장감 = 청각적 닻'] },
    { tag: 'SOFT WELLNESS', ko: '소프트 웰니스 · 버추얼 펫', lines: ["기계적 타이머 대신 '꾸이꾸이' 울음과", '자리를 비우는 펫, 통제보다 회복'] },
    { tag: 'MICRO-GAMIFICATION', ko: '일상형 마이크로 게이미피케이션', lines: ['집중 1분 = 1XP, 머문 시간 = 0.5XP', '회원증 커스텀 · 하트 선물 · 스트릭'] }
  ],
  mapping: [
    { need: ['상호 감시', '피로도 완화'], feat: ['카메라·마이크 개별 조절', '+ 가상 동물 타일 배치'], eff: ['감정 노동 없는', '심리적 안정감'] },
    { need: ['바디 더블링', '효과 구현'], feat: ['기니피그·햄스터 친구들의', '실시간 상태 변화 (휴식·자리비움)'], eff: ['스터디 카페에 앉은 듯한', '공존감'] },
    { need: ['지속 가능한', '공부 습관'], feat: ['뽀모도로 타이머 + 친밀도 하트', '& 만물상 코인 보상'], eff: ['장기 리텐션과', '스트릭(연속 출석) 유지'] },
    { need: ['청각적', '집중 환경'], feat: ['울음소리 빈도 조절 +', '멀티 레이어 백색소음'], eff: ['인지 부하 감소와', '딥워크 유도'] }
  ],
  misclass: {
    'hamster_044.jpg': { tag: '사람이 주인공인 구도 · 흰 털', note: ['사람이 화면 대부분을 차지하고', '작은 흰 햄스터가 안겨 있다', '→ 가장 자신 있게 틀린 사례'] },
    'hamster_028.jpg': { tag: '구멍에서 얼굴만 빼꼼', note: ['둥근 입구에 얼굴만 보이고', '몸통이 가려졌다', '→ 체형 단서가 사라짐'] },
    'guinea_pig_008.jpg': { tag: '초원 속 야생 개체', note: ['넓은 초원 배경에 몸이 작게', '찍힌 콜롬비아 야생 기니피그', '→ 반려 사진과 다른 맥락'] }
  },
  roadmap: [
    { world: 'WORLD 1', name: '온라인 스터디룸', mode: 'ONLINE', lines: ['뽀모도로 + 기니피그 메이트 타일', '카메라·마이크 개별 조절', '백색소음 + 꾸이꾸이 레이어'] },
    { world: 'WORLD 2', name: '플레이 & 스트릭', mode: 'ONLINE', lines: ['집중 1분 = 1XP · 머문 시간 0.5XP', '회원증 커스텀 · 하트 선물·편지', '만물상 코인 · 연속 출석'] },
    { world: 'WORLD 3', name: 'AI 컴패니언', mode: 'ONLINE', lines: ['AI 동물어 번역기 (윅윅 트리거)', '펫 인식 85% → 데이터 확대', '맞춤형 웰니스 케어'] },
    { world: 'WORLD 4', name: '오프라인 라운지', mode: 'OFFLINE', proposal: true, lines: ['팝업 스터디 라운지·코워킹 제휴', '회원증·피규어 굿즈', '반려인 커뮤니티 밋업'] }
  ],
  personas: [
    { p: 'PLAYER 1', head: '캠스터디에 지친 Z세대', sub: '시험 · 취업 · 자격증 준비생' },
    { p: 'PLAYER 2', head: '적막함을 덜고 싶은 원격 근무자', sub: '프리랜서 · 재택 근무자' }
  ]
};
