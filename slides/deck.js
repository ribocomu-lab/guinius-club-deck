// 기니어스클럽 피치 덱 — references/template/core.js의 진행도·이징·SVG 헬퍼 위에 Nintendo 2001 크롬을 얹는다.
// 슬라이드마다 세 층: base(배경·크롬, 진입 시 1회) · dyn(빌드 모션, 매 프레임) · over(사진·마스코트, 진입 시 1회)
(function () {
  const { K, clamp, eo, eio, back, seg, r2, fmt, partial } = window.MK;
  const C = K.C, D = window.DECK_DATA, CFG = window.DECK;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- 그리기 헬퍼
  const T = (x, y, s, o = {}) => `<text x="${r2(x)}" y="${r2(y)}" font-family="${o.f || K.FONT}" font-size="${o.size || 28}" font-weight="${o.w || 400}" fill="${o.fill || C.ink}" text-anchor="${o.anchor || 'start'}"${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}${o.ls !== undefined ? ` letter-spacing="${o.ls}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 4}" stroke-linejoin="round" paint-order="stroke"` : ''}>${esc(s)}</text>`;
  // 글자 폭 추정: 한글 0.95em · 공백 0.3em · 그 외 0.6em
  const tw = (s, size) => [...String(s)].reduce((a, ch) => a + (/[가-힣]/.test(ch) ? 0.95 : ch === ' ' ? 0.3 : 0.6), 0) * size;
  const lines = (x, y, arr, lh, o) => arr.map((s, i) => T(x, y + i * lh, s, o)).join('');
  // 박스아트 타이포: 굵은 외곽선 + 단단한 오프셋 그림자 (DESIGN.md: display type is outlined, never flat)
  const box = (x, y, s, o = {}) => {
    const sh = o.shadow === undefined ? Math.max(4, (o.size || 60) * 0.07) : o.shadow;
    const base = { f: o.f || K.DISPLAY, size: o.size || 60, w: o.w || 900, anchor: o.anchor, ls: o.ls, op: o.op };
    return T(x + sh, y + sh, s, { ...base, fill: o.shade || C.carbon, stroke: o.shade || C.carbon, sw: o.sw || (o.size || 60) * 0.16 }) +
      T(x, y, s, { ...base, fill: o.fill || C.white, stroke: o.stroke || C.indigo, sw: o.sw || (o.size || 60) * 0.16 });
  };
  const R = (x, y, w, h, fill, o = {}) => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(Math.max(0, w))}" height="${r2(Math.max(0, h))}" fill="${fill}"${o.rx ? ` rx="${o.rx}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ''}/>`;
  const L = (x1, y1, x2, y2, c, w = 2, o = {}) => `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${c}" stroke-width="${w}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}/>`;
  const O = (cx, cy, r, fill, o = {}) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(Math.max(0, r))}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}/>`;
  const G = (inner, o = {}) => {
    const t = [];
    if (o.dx || o.dy) t.push(`translate(${r2(o.dx || 0)} ${r2(o.dy || 0)})`);
    if (o.s !== undefined) { const [cx, cy] = o.at; t.push(`translate(${r2(cx)} ${r2(cy)}) scale(${r2(Math.max(0.001, o.s))}) translate(${r2(-cx)} ${r2(-cy)})`); }
    return `<g${t.length ? ` transform="${t.join(' ')}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}>${inner}</g>`;
  };
  // 금속판: 모따기(chamfer) 모서리 + 위쪽 하이라이트 + 아래 인디고 그림자선 (Elevation level 1 — Plate)
  const plate = (x, y, w, h, o = {}) => {
    const c = o.ch || 0, fill = o.fill || C.platinum;
    const d = `M${x + c},${y} L${x + w},${y} L${x + w},${y + h - c} L${x + w - c},${y + h} L${x},${y + h} L${x},${y + c} Z`;
    return `<path d="${d}" fill="${fill}" stroke="${o.edge || C.indigo}" stroke-width="2"/>` +
      (o.pattern ? `<path d="${d}" fill="url(#${o.pattern})"/>` : '') +
      L(x + c + 2, y + 3, x + w - 3, y + 3, C.white, 3, { op: o.hi === undefined ? 0.55 : o.hi }) +
      L(x + 3, y + h + 3, x + w - c, y + h + 3, C.indigo, 4, { op: 0.9 });
  };
  // 패널 헤더: section-label-bar (격자 글리프 + 대문자 라벨)
  const labelBar = (x, y, w, label, o = {}) => {
    const h = o.h || 46, fill = o.fill || C.canvas, ink = o.ink || C.carbon;
    let g = '';
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) g += R(x + 16 + i * 9, y + h / 2 - 8 + j * 9, 7, 7, ink);
    return R(x, y, w, h, fill) + L(x, y + h, x + w, y + h, C.indigo, 2) + g + T(x + 46, y + h / 2 + 8, label, { size: o.size || 21, w: 700, fill: ink, ls: 1.2 });
  };
  const chip = (x, y, s, o = {}) => {
    const size = o.size || 18, w = o.w || (String(s).length * size * ((o.f || K.PIXEL) === K.PIXEL ? 1.02 : 0.62) + 30), h = size + 16;
    return R(x, y, w, h, o.fill || C.amber, { rx: o.rx === undefined ? 2 : o.rx }) + L(x + 2, y + 2, x + w - 2, y + 2, C.white, 2, { op: 0.5 }) +
      T(x + w / 2, y + h / 2 + size * 0.36, s, { f: o.f || K.PIXEL, size, w: 700, fill: o.ink || C.carbon, anchor: 'middle', ls: o.ls === undefined ? 1 : o.ls });
  };
  const arrowDisc = (cx, cy, r, o = {}) => O(cx, cy, r, o.fill || C.signal) + O(cx, cy - r * 0.15, r * 0.8, C.white, { op: 0.18 }) +
    `<path d="M${cx - r * 0.25},${cy - r * 0.4} L${cx + r * 0.35},${cy} L${cx - r * 0.25},${cy + r * 0.4}" fill="none" stroke="${C.white}" stroke-width="${r * 0.28}" stroke-linecap="round" stroke-linejoin="round"/>`;

  // 픽셀 기니피그 마스코트 (A 앰버 몸, W 흰 무늬, K 눈, N 코, E 귀, F 발)
  const PIG = [
    '.....AAAAA....',
    '...AAWWWAAAA..',
    '..AAWWWWWAAAE.',
    '.AAAWWWWAAAKAA',
    '.AAAAWWAAAAAAN',
    'AAAAAAAAAAAAA.',
    'AAAAAAAAAAAA..',
    '.AAAAAAAAAA...',
    '..F..F..F.F...'
  ];
  const PIGC = { A: C.amber, W: C.white, K: C.carbon, N: C.primary, E: '#f7a6ae', F: C.carbon, S: C.gold };
  const pig = (x, y, px, o = {}) => {
    let s = '';
    PIG.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === '.') return;
      const ii = o.flip ? row.length - 1 - i : i;
      let c = PIGC[ch];
      if (ch === 'A' && j >= 6) c = C.gold; // 배 쪽 음영
      if (o.sleep && ch === 'K') c = C.gold;
      s += R(x + ii * px, y + j * px, px + 0.5, px + 0.5, c);
    }));
    return s;
  };
  const bubble = (x, y, w, h, arr, o = {}) => {
    const tx = o.tail === 'left' ? x + 40 : x + w - 90;
    return `<path d="M${tx},${y + h - 2} L${tx + 24},${y + h + 34} L${tx + 46},${y + h - 2} Z" fill="${C.white}" stroke="${C.carbon}" stroke-width="3"/>` +
      R(x, y, w, h, C.white, { rx: 22, stroke: C.carbon, sw: 3 }) + R(tx + 3, y + h - 5, 40, 8, C.white) +
      lines(x + 30, y + 52, arr, o.lh || 42, { size: o.size || 30, w: 700, fill: C.carbon });
  };

  const DEFS = `<defs>
    <pattern id="brush" width="16" height="6" patternUnits="userSpaceOnUse"><rect width="16" height="1" fill="#ffffff" opacity=".07"/><rect y="3" width="16" height="1" fill="#21242e" opacity=".05"/></pattern>
    <pattern id="ht" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#ffffff" opacity=".08"/><circle cx="8" cy="8" r="1.6" fill="#ffffff" opacity=".05"/></pattern>
    <pattern id="circuit" width="160" height="160" patternUnits="userSpaceOnUse"><path d="M0 40 H60 L80 60 H160 M20 0 V30 L40 50 V160 M100 0 V20 L120 40 V100 L140 120 H160 M0 130 H50 L70 110 H100" fill="none" stroke="#ffffff" stroke-width="2" opacity=".18"/><circle cx="60" cy="40" r="5" fill="#ffffff" opacity=".22"/><circle cx="120" cy="100" r="5" fill="#ffffff" opacity=".22"/><circle cx="40" cy="160" r="4" fill="#ffffff" opacity=".2"/></pattern>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" fill="none" stroke="#3d4f97" stroke-width="1" opacity=".18"/></pattern>
  </defs>`;

  // ---------------------------------------------------------------- 크롬 (템플릿 그리드 계승: 좌측 x=100, 키커·제목 상단, 출처선 y=988)
  const N = CFG.slides.length;
  const chromeBase = (i) => {
    const sl = CFG.slides[i];
    let s = R(0, 0, 1920, 1080, C.canvas) + R(0, 0, 1920, 1080, 'url(#brush)');
    // nav-bar: 카본 + 하프톤, 로고 필, 금빛 메뉴 단어
    s += R(0, 0, 1920, 76, C.carbon) + R(0, 0, 1920, 76, 'url(#ht)') + L(0, 76, 1920, 76, C.black || '#000', 2, { op: 0.5 });
    s += R(40, 13, 262, 50, C.white, { rx: 25, stroke: C.primary, sw: 4 }) + T(171, 51, CFG.brand, { f: K.DISPLAY, size: 31, w: 900, fill: C.primary, anchor: 'middle', ls: 1 });
    let x = 360;
    CFG.nav.forEach((n, k) => {
      const on = k === sl.nav, w = (n.length + 3) * 15.8 + 26;
      s += `<g data-go-nav="${k}" style="cursor:pointer">`;
      if (on) s += R(x - 14, 16, w, 44, C.amber, { rx: 2 }) + L(x - 12, 18, x + w - 16, 18, C.white, 2, { op: 0.55 });
      s += T(x, 47, `${String(k + 1).padStart(2, '0')} ${n}`, { f: 'Arial, sans-serif', size: 22, w: 700, fill: on ? C.carbon : C.gold, ls: 1 });
      s += R(x - 14, 10, w, 56, 'transparent') + '</g>';
      x += w + 18;
    });
    s += chip(1690, 21, 'STUDY ROOM', { size: 16, fill: C.signal, ink: C.white, w: 190 });
    // subnav-strip: 페일 스카이 + 키커
    s += R(0, 76, 1920, 42, C.soft) + L(0, 118, 1920, 118, C.indigo, 2);
    s += T(100, 105, sl.kicker, { size: 21, w: 700, fill: C.carbon, ls: 0.5 });
    s += T(1820, 105, '기니어스클럽 · 혼자지만 외롭지 않은 몰입', { size: 19, w: 600, fill: C.indigo, anchor: 'end' });
    // footer-bar: 카본 모따기 슬랩
    s += `<path d="M0,988 H1900 L1920,1008 V1080 H0 Z" fill="${C.carbon}"/>` + R(0, 988, 1920, 92, 'url(#ht)') + L(0, 988, 1920, 988, C.indigo, 3);
    s += T(100, 1042, sl.source, { size: 21, fill: C.soft });
    s += chip(1600, 1018, `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`, { size: 17, w: 120, fill: C.amber });
    return s;
  };
  const title = (i, p) => {
    const sl = CFG.slides[i]; if (!sl.title) return '';
    const e = eo(seg(p, 0, 0.35));
    return G(box(100, 212, sl.title, { f: K.FONT, size: 56, w: 900, sw: 10, shadow: 5, op: e }), { dy: (1 - e) * 24 });
  };

  // ---------------------------------------------------------------- 슬라이드
  const S = [];

  // 01 표지 — 히어로 판 위 박스아트 워드마크가 마스크에서 솟아오름 (템플릿 FX12 계승)
  S[0] = {
    base: () => plate(100, 150, 1720, 610, { fill: C.lavender, ch: 34, pattern: 'circuit' }),
    dyn: (p) => {
      const e1 = eo(seg(p, 0.05, 0.5)), e2 = eo(seg(p, 0.2, 0.62)), e3 = eo(seg(p, 0.4, 0.8));
      let s = `<defs><clipPath id="m1"><rect x="100" y="250" width="1200" height="320"/></clipPath></defs>`;
      s += G(chip(160, 200, 'VIRTUAL MATE STUDY ROOM', { size: 18, w: 380 }), { op: e1 });
      s += `<g clip-path="url(#m1)">${G(box(150, 395, 'GUINIUS', { size: 172, sw: 20, shadow: 11 }), { dy: (1 - e1) * 200 })}${G(box(150, 552, 'CLUB', { size: 172, sw: 20, shadow: 11, stroke: C.primary }), { dy: (1 - e2) * 200 })}</g>`;
      s += G(T(156, 652, '기니어스클럽', { size: 62, w: 900, fill: C.carbon }) + T(156, 716, '차세대 가상 메이트 스터디룸 — 혼자지만 외롭지 않은 몰입', { size: 32, w: 700, fill: C.indigo }), { op: e3, dy: (1 - e3) * 20 });
      // 서비스 소개 3판
      CFG.slides && ['GENTLE PRESENCE', 'BODY DOUBLING', 'MICRO-GAMIFICATION'].forEach((tag, k) => {
        const e = back(seg(p, 0.5 + k * 0.08, 0.84 + k * 0.08)), x = 100 + k * 586;
        const ko = ['비침해적 동행', '바디 더블링', '마이크로 게이미피케이션'][k];
        const d = ['감시 대신, 곁에 있는 가상 메이트', '누군가 옆에 있으면 집중이 오른다', '집중 1분 = 경험치 1, 몰입을 놀이로'][k];
        s += G(plate(x, 800, 548, 150, { fill: C.white }) + labelBar(x, 800, 548, tag, { fill: C.peri, size: 19 }) +
          T(x + 24, 890, ko, { size: 30, w: 800, fill: C.carbon }) + T(x + 24, 930, d, { size: 23, fill: C.indigo }), { s: e, at: [x + 274, 875], op: clamp(e) });
      });
      s += G(bubble(1290, 214, 470, 128, ['꾸이꾸이! 오늘도', '옆에서 같이 공부할게요'], { size: 30 }), { s: back(seg(p, 0.45, 0.85)), at: [1520, 300] });
      return s;
    },
    over: () => mascot(1336, 410, 24)
  };

  // 02 문제 — 세 개의 판이 위에서 떨어져 자리 잡음
  S[1] = {
    dyn: (p) => {
      let s = '';
      CFG.problems.forEach((q, k) => {
        const x = 100 + k * 590, e = eo(seg(p, 0.12 + k * 0.12, 0.6 + k * 0.12)), y = 268 - (1 - e) * 60;
        s += G(plate(x, y, 540, 590, { fill: k === 2 ? C.ice : C.platinum, ch: 22 }) + labelBar(x, y, 540, `PAIN ${q.no}`, { fill: k === 2 ? C.amber : C.canvas }) +
          box(x + 36, y + 190, q.no, { size: 110, sw: 14, shadow: 7, stroke: k === 2 ? C.gold : C.indigo }) +
          lines(x + 36, y + 290, q.head, 54, { size: 44, w: 900, fill: C.carbon }) +
          L(x + 36, y + 372, x + 504, y + 372, C.mindigo, 2, { dash: '2 7', cap: 'round' }) +
          lines(x + 36, y + 422, q.body, 38, { size: 26, fill: C.indigo, w: 500 }) +
          chip(x + 36, y + 546, q.chip, { size: 17, fill: k === 2 ? C.signal : C.amber, ink: k === 2 ? C.white : C.carbon }), { op: e });
      });
      const e = eo(seg(p, 0.6, 1));
      s += G(R(100, 892, 1720, 70, C.carbon) + R(100, 892, 1720, 70, 'url(#ht)') +
        T(140, 938, '그래서 필요한 것:', { size: 28, w: 700, fill: C.soft }) +
        T(380, 938, '사람의 감시 없이, 곁에 있는 존재감', { size: 30, w: 900, fill: C.amber }) +
        arrowDisc(1772, 927, 20), { op: e, dx: (1 - e) * -40 });
      return s;
    }
  };

  // 03 트렌드 — 왼쪽 큰 히어로(패럴렐 플레이 × 바디더블링), 오른쪽 세 트렌드 판
  const tile = (x, y, w, h, label, kind, e) => {
    let s = plate(x, y, w, h, { fill: kind === 'you' ? C.white : C.ice, hi: 0.3 });
    if (kind === 'pig') s += pig(x + w / 2 - 56, y + 24, 8);
    if (kind === 'sleep') s += pig(x + w / 2 - 56, y + 24, 8, { sleep: true }) + T(x + w - 40, y + 50, 'z z', { f: K.PIXEL, size: 22, fill: C.indigo, anchor: 'end' });
    if (kind === 'you') s += O(x + w / 2, y + 44, 26, C.peri) + R(x + w / 2 - 50, y + 76, 100, 32, C.peri, { rx: 16 }) + T(x + w / 2, y + 98, '공부 중', { size: 18, w: 700, fill: C.carbon, anchor: 'middle' });
    if (kind === 'off') s += R(x + 20, y + 20, w - 40, h - 70, C.mindigo) + T(x + w / 2, y + h / 2 - 4, 'CAM OFF', { f: K.PIXEL, size: 22, fill: C.soft, anchor: 'middle' });
    s += R(x, y + h - 40, w, 40, C.carbon, { op: 0.85 }) + T(x + 14, y + h - 13, label, { size: 19, w: 700, fill: C.white });
    if (kind !== 'off') s += O(x + w - 22, y + h - 20, 7, kind === 'sleep' ? C.amber : '#4cd964');
    return G(s, { s: e, at: [x + w / 2, y + h / 2], op: clamp(e) });
  };
  S[2] = {
    base: () => plate(100, 268, 860, 690, { fill: C.teal, ch: 28, pattern: 'circuit', hi: 0.35 }),
    dyn: (p) => {
      let s = chip(136, 296, 'KEY TREND', { size: 17, w: 170 });
      s += G(box(136, 400, 'PARALLEL PLAY', { size: 64, sw: 10, shadow: 6 }) + box(136, 474, '× BODY DOUBLING', { size: 52, sw: 9, shadow: 5, stroke: C.carbon }), { op: eo(seg(p, 0.05, 0.4)) });
      s += G(lines(138, 530, ['대화 없이 같은 공간에서 각자의 일에 몰입하는 Z세대식 공존.', '마이크 볼륨·화각 숨기기로 관계의 밀도를 유저가 직접 정한다.'], 38, { size: 25, w: 600, fill: C.white }), { op: eo(seg(p, 0.2, 0.55)) });
      [['나', 'you'], ['메이트 · 집중 중', 'pig'], ['친구', 'off'], ['메이트 · 자리비움', 'sleep']].forEach(([lb, kd], k) => {
        s += tile(138 + (k % 2) * 400, 604 + Math.floor(k / 2) * 172 - 0, 380, 156, lb, kd, back(seg(p, 0.3 + k * 0.08, 0.62 + k * 0.08)));
      });
      CFG.trends.forEach((t, k) => {
        const y = 268 + k * 236, e = eo(seg(p, 0.2 + k * 0.12, 0.7 + k * 0.12));
        s += G(plate(1000, y, 820, 214, { fill: t.key ? C.white : C.platinum }) + labelBar(1000, y, 820, t.tag, { fill: t.key ? C.amber : C.peri }) +
          (t.key ? chip(1660, y + 8, 'KEY', { size: 16, w: 140, fill: C.signal, ink: C.white }) : '') +
          T(1030, y + 104, t.ko, { size: 34, w: 900, fill: C.carbon }) + lines(1030, y + 150, t.lines, 36, { size: 24, fill: C.indigo, w: 500 }), { op: e, dx: (1 - e) * 60 });
      });
      return s;
    }
  };

  // 04 매핑 — 표 행이 차례로 미끄러져 들어오고 화살표 디스크가 튐
  S[3] = {
    dyn: (p) => {
      let s = '';
      const cols = [[100, 470, 'NEED · 유저 니즈'], [650, 640, 'FEATURE · 기니어스클럽 솔루션'], [1370, 450, 'EFFECT · 기대 효과']];
      cols.forEach(([x, w, lb]) => s += labelBar(x, 272, w, lb, { fill: C.carbon, ink: C.soft }));
      CFG.mapping.forEach((m, k) => {
        const y = 340 + k * 156, e = eo(seg(p, 0.1 + k * 0.12, 0.6 + k * 0.12));
        let r = plate(100, y, 470, 136, { fill: C.peri }) + lines(132, y + 60, m.need, 42, { size: 32, w: 900, fill: C.carbon });
        r += plate(650, y, 640, 136, { fill: C.white }) + lines(682, y + 60, m.feat, 40, { size: 28, w: 800, fill: C.carbon });
        r += plate(1370, y, 450, 136, { fill: C.platinum }) + lines(1402, y + 60, m.eff, 40, { size: 27, w: 600, fill: C.indigo });
        s += G(r, { op: e, dx: (1 - e) * -50 });
        s += G(arrowDisc(610, y + 68, 24), { s: back(seg(p, 0.3 + k * 0.12, 0.6 + k * 0.12)), at: [610, y + 68] });
        s += G(arrowDisc(1330, y + 68, 24), { s: back(seg(p, 0.34 + k * 0.11, 0.62 + k * 0.11)), at: [1330, y + 68] });
      });
      return s;
    }
  };

  // 05 인사이트 ① — 큰 수치 카운트업 + 47칸 와플 (템플릿 FX10·FX04 계승)
  S[4] = {
    dyn: (p) => {
      const c = D.care, e = eo(seg(p, 0, 0.7));
      let s = plate(100, 268, 1060, 600, { fill: C.white, ch: 24 }) + labelBar(100, 268, 1060, `CARE ANXIETY · 반려인 질문 ${c.posts}건의 감성`);
      s += box(140, 540, fmt(c.neg_pct * e, c.neg_pct) + '%', { size: 210, sw: 18, shadow: 10, stroke: C.gred });
      s += T(146, 610, `질문 글 ${c.posts}건 중 ${c.neg}건에 불안·걱정이 드러났다`, { size: 30, w: 800, fill: C.carbon });
      const cell = 40, g = 8, ox = 146, oy = 660;
      for (let i = 0; i < c.posts; i++) {
        const x = ox + (i % 20) * (cell + g), y = oy + Math.floor(i / 20) * (cell + g), on = i < c.neg;
        const k = back(clamp((p * 1.4 - i / c.posts) * 4));
        const sz = cell * (on ? clamp(k, 0.2, 1.2) : 1), off = (cell - sz) / 2;
        s += R(x + off, y + off, sz, sz, on ? C.gred : C.platinum, { stroke: on ? C.carbon : C.hair, sw: 1.5 });
      }
      s += R(ox, 822, 18, 18, C.gred) + T(ox + 28, 838, '불안·부정', { size: 20, fill: C.indigo }) + R(ox + 150, 822, 18, 18, C.platinum, { stroke: C.hair }) + T(ox + 178, 838, '중립·긍정', { size: 20, fill: C.indigo });
      [[fmt(c.top_cat_pct * eo(seg(p, 0.2, 0.8)), c.top_cat_pct) + '%', '가장 많은 고민', '질병 · 동물병원'],
       [fmt(c.bond_neg_pct * eo(seg(p, 0.3, 0.9)), c.bond_neg_pct) + '%', '부정 비중이 가장 높은 주제', '행동 · 합사 글'],
       [Math.round(c.top_kw_n * eo(seg(p, 0.4, 1))) + '회', '가장 많이 나온 단어', `'${c.top_kw}' 동물병원`]].forEach(([v, a, b], k) => {
        const y = 268 + k * 204, e2 = eo(seg(p, 0.25 + k * 0.12, 0.7 + k * 0.12));
        s += G(plate(1200, y, 620, 184, { fill: k === 0 ? C.ice : C.platinum }) + T(1232, y + 46, a, { size: 22, w: 700, fill: C.indigo }) +
          box(1232, y + 140, v, { size: 74, sw: 9, shadow: 5 }) + T(1790, y + 138, b, { size: 24, w: 700, fill: C.carbon, anchor: 'end' }), { op: e2, dx: (1 - e2) * 50 });
      });
      const e3 = eo(seg(p, 0.65, 1));
      s += G(R(100, 892, 1720, 70, C.carbon) + R(100, 892, 1720, 70, 'url(#ht)') + chip(124, 909, 'PRODUCT HINT', { size: 16, w: 210 }) +
        T(360, 938, "돌봄의 긴장을 덜어 주는 '소프트 웰니스' 톤 — 경쟁·감시가 아닌 안심과 회복", { size: 27, w: 700, fill: C.white }), { op: e3 });
      return s;
    }
  };

  // 06 인사이트 ② — 팝코닝 트리거 가로 막대 (템플릿 FX02 계승) + 윅윅 트리거
  S[5] = {
    dyn: (p) => {
      const j = D.joy;
      let s = plate(100, 268, 1080, 600, { fill: C.white, ch: 24 }) + labelBar(100, 268, 1080, `POPCORN TRIGGER · 팝코닝을 부른 순간 TOP ${j.triggers.length}`);
      const max = d3max(j.triggers.map((t) => t.n)), bx = 470, bw = 600;
      j.triggers.forEach((t, k) => {
        const y = 348 + k * 84, e = eo(seg(p, 0.08 + k * 0.08, 0.6 + k * 0.08));
        s += T(130, y + 34, t.ko, { size: 27, w: k === 0 ? 900 : 700, fill: C.carbon });
        s += R(bx, y + 4, bw, 40, C.platinum, { stroke: C.hair, sw: 1 });
        const w = bw * t.n / max * e, wi = w * t.intense / t.n;
        s += R(bx, y + 4, w, 40, k === 0 ? C.indigo : C.peri) + R(bx, y + 4, wi, 40, C.carbon) + L(bx, y + 6, bx + w, y + 6, C.white, 2, { op: 0.4 });
        s += T(1150, y + 38, Math.round(t.n * e) + '회', { f: K.NUM, size: 34, w: 900, fill: k === 0 ? C.indigo : C.carbon, anchor: 'end' });
      });
      s += R(470, 846, 18, 18, C.carbon) + T(498, 862, '격렬한 묘사 동반', { size: 19, fill: C.indigo }) + R(680, 846, 18, 18, C.peri) + T(708, 862, '그 외 언급 (문단 수)', { size: 19, fill: C.indigo });
      // 오른쪽 레일: 윅윅
      const e2 = eo(seg(p, 0.25, 0.75));
      let r = plate(1220, 268, 600, 600, { fill: C.carbon, ch: 24, hi: 0.15 }) + R(1220, 268, 600, 600, 'url(#ht)') + labelBar(1220, 268, 600, 'WHEEK · 윅윅이 터지는 소리', { fill: C.amber });
      r += T(1252, 372, `${fmt(j.paragraphs, j.paragraphs)}문단 · ${j.threads}스레드 분석`, { size: 22, w: 600, fill: C.soft });
      const wm = d3max(j.wheek.map((w) => w.n));
      j.wheek.forEach((w, k) => {
        const y = 412 + k * 108, ek = eo(seg(p, 0.32 + k * 0.09, 0.7 + k * 0.09));
        r += T(1252, y + 28, w.ko, { size: 25, w: 700, fill: C.white }) + R(1252, y + 46, 440 * w.n / wm * ek, 26, k === 0 ? C.amber : C.mindigo) +
          T(1790, y + 68, Math.round(w.n * ek), { f: K.NUM, size: 30, w: 900, fill: k === 0 ? C.amber : C.soft, anchor: 'end' });
      });
      s += G(r, { op: e2, dx: (1 - e2) * 50 });
      const e3 = eo(seg(p, 0.6, 1));
      const hints = [['팝코닝', '보상 모먼트'], ['윅윅', '청각적 닻 · 꾸이꾸이'], ['친구 효과', '혼자 두지 않는 공존']];
      s += G(R(100, 892, 1720, 70, C.carbon) + R(100, 892, 1720, 70, 'url(#ht)') + chip(124, 909, 'PRODUCT HINT', { size: 16, w: 210 }) +
        hints.map(([a, b], k) => T(370 + k * 490, 938, `${a} →`, { size: 26, w: 700, fill: C.soft }) + T(370 + k * 490 + tw(`${a} →`, 26) + 14, 938, b, { size: 26, w: 900, fill: C.amber })).join(''), { op: e3 });
      return s;
    }
  };
  const d3max = (a) => Math.max(...a, 1);

  // 07 AI 정확도 — 85% 카운트업 + 신뢰구간 막대 + 혼동행렬
  S[6] = {
    dyn: (p) => {
      const a = D.ai, e = eo(seg(p, 0, 0.7));
      let s = plate(100, 268, 940, 690, { fill: C.white, ch: 24 }) + labelBar(100, 268, 940, 'VALIDATION ACCURACY · 처음 보는 사진으로 채점');
      s += box(140, 560, fmt(a.val_acc * 100 * e, 85) + '%', { size: 260, sw: 22, shadow: 12, stroke: C.indigo });
      s += T(150, 628, `검증 ${a.val_n}장 중 ${Math.round(a.val_correct * e)}장 정답 · 정답일 때 평균 확신도 ${Math.round(a.val_conf_correct * 100)}%`, { size: 27, w: 700, fill: C.carbon });
      // 95% 신뢰구간 막대
      const x0 = 150, x1 = 990, X = (v) => x0 + (x1 - x0) * v, ec = eo(seg(p, 0.35, 0.85));
      s += T(150, 690, '95% 신뢰구간 — 표본 20장이라 폭이 넓다', { size: 22, w: 700, fill: C.indigo });
      s += R(x0, 712, x1 - x0, 30, C.platinum, { stroke: C.hair, sw: 1 });
      s += R(X(a.ci_lo), 712, (X(a.ci_hi) - X(a.ci_lo)) * ec, 30, C.peri);
      s += L(X(a.val_acc), 702, X(a.val_acc), 752, C.carbon, 5, { op: ec });
      [0, 0.5, 1].forEach((v) => s += T(X(v), 776, Math.round(v * 100) + '%', { f: K.NUM, size: 20, fill: C.indigo, anchor: 'middle' }));
      s += T(X(a.ci_lo), 700, Math.round(a.ci_lo * 100) + '%', { f: K.NUM, size: 22, fill: C.indigo, anchor: 'middle', op: ec }) + T(X(a.ci_hi), 700, Math.round(a.ci_hi * 100) + '%', { f: K.NUM, size: 22, fill: C.indigo, anchor: 'middle', op: ec });
      const e4 = eo(seg(p, 0.6, 1));
      s += G(plate(150, 806, 840, 124, { fill: C.ice }) + chip(172, 826, 'CHECK', { size: 15, w: 110, fill: C.signal, ink: C.white }) +
        T(300, 850, `학습셋은 ${a.train_correct}/${a.train_n} = ${Math.round(a.train_acc * 100)}% — 외운 것과 아는 것은 다르다.`, { size: 24, w: 800, fill: C.carbon }) +
        T(172, 900, '그래서 성능은 학습에 쓰지 않은 검증셋 기준으로만 이야기한다.', { size: 23, fill: C.indigo }), { op: e4 });
      // 혼동행렬
      const ox = 1080, oy = 268;
      let m = plate(ox, oy, 740, 690, { fill: C.platinum, ch: 24 }) + labelBar(ox, oy, 740, 'CONFUSION MATRIX · 검증셋 20장');
      m += T(ox + 470, oy + 100, '모델의 예측', { size: 22, w: 700, fill: C.indigo, anchor: 'middle' });
      m += T(ox + 330, oy + 140, '기니피그', { size: 24, w: 800, fill: C.carbon, anchor: 'middle' }) + T(ox + 590, oy + 140, '햄스터', { size: 24, w: 800, fill: C.carbon, anchor: 'middle' });
      m += `<text transform="translate(${ox + 50} ${oy + 380}) rotate(-90)" font-family="${K.FONT}" font-size="22" font-weight="700" fill="${C.indigo}" text-anchor="middle">실제 정답</text>`;
      m += T(ox + 190, oy + 260, '기니피그', { size: 24, w: 800, fill: C.carbon, anchor: 'end' }) + T(ox + 190, oy + 510, '햄스터', { size: 24, w: 800, fill: C.carbon, anchor: 'end' });
      const cells = [['guinea_pig->guinea_pig', 0, 0], ['guinea_pig->hamster', 1, 0], ['hamster->guinea_pig', 0, 1], ['hamster->hamster', 1, 1]];
      cells.forEach(([key, cx, cy], k) => {
        const v = a.cm[key], good = cx === cy, x = ox + 210 + cx * 260, y = oy + 160 + cy * 250, ek = back(seg(p, 0.3 + k * 0.08, 0.65 + k * 0.08));
        m += G(plate(x, y, 240, 230, { fill: good ? C.indigo : '#f3c7c9', edge: good ? C.carbon : C.gred }) +
          box(x + 120, y + 145, Math.round(v * clamp(ek)), { size: 110, sw: 12, shadow: 6, anchor: 'middle', stroke: good ? C.carbon : C.gred }) +
          T(x + 120, y + 200, good ? '정답' : '오답', { size: 22, w: 800, fill: good ? C.soft : C.gred, anchor: 'middle' }), { s: ek, at: [x + 120, y + 115] });
      });
      m += T(ox + 470, oy + 672, `데이터 ${a.total}장 (클래스별 ${a.per_class}) · Pexels ${a.sources.pexels} / Unsplash ${a.sources.unsplash}`, { size: 20, fill: C.indigo, anchor: 'middle' });
      s += G(m, { op: eo(seg(p, 0.15, 0.55)) });
      return s;
    }
  };

  // 08 오분류 — 사진 카드 3장, 확신도 게이지가 차오름
  const MIS = () => D.ai.wrong.map((w) => ({ ...w, ...(CFG.misclass[w.file] || { tag: '', note: [] }) }));
  const KO = { guinea_pig: '기니피그', hamster: '햄스터' };
  S[7] = {
    base: () => MIS().map((m, k) => {
      const x = 100 + k * 590;
      return plate(x, 268, 540, 610, { fill: C.white, ch: 20 }) + R(x + 20, 288, 500, 290, C.carbon) + T(x + 270, 440, 'IMAGE', { f: K.PIXEL, size: 24, fill: C.mindigo, anchor: 'middle' });
    }).join(''),
    dyn: (p) => {
      let s = '';
      MIS().forEach((m, k) => {
        const x = 100 + k * 590, e = eo(seg(p, 0.15 + k * 0.12, 0.6 + k * 0.12));
        let c = R(x + 20, 590, 500, 52, C.carbon) + T(x + 40, 625, `정답 ${KO[m.true]}`, { size: 24, w: 700, fill: C.soft }) + arrowDisc(x + 230, 616, 15) +
          T(x + 260, 625, `예측 ${KO[m.pred]}`, { size: 24, w: 900, fill: C.amber });
        c += T(x + 24, 690, m.tag, { size: 30, w: 900, fill: C.carbon });
        c += T(x + 24, 732, '확신도', { size: 20, w: 700, fill: C.indigo }) + R(x + 110, 714, 330, 24, C.platinum, { stroke: C.hair, sw: 1 }) +
          R(x + 110, 714, 330 * m.conf * e, 24, m.conf > 0.9 ? C.gred : C.peri) + T(x + 516, 734, Math.round(m.conf * 100 * e) + '%', { f: K.NUM, size: 26, w: 900, fill: m.conf > 0.9 ? C.gred : C.carbon, anchor: 'end' });
        c += lines(x + 24, 782, m.note, 32, { size: 22, fill: C.indigo, w: 500 });
        s += G(c, { op: e, dy: (1 - e) * 20 });
      });
      const e3 = eo(seg(p, 0.65, 1)), sh = D.ai.shaky.map((q) => Math.round(q.conf * 100) + '%').join(' · ');
      s += G(R(100, 900, 1720, 66, C.carbon) + R(100, 900, 1720, 66, 'url(#ht)') + chip(124, 916, 'NEXT', { size: 16, w: 110, fill: C.signal, ink: C.white }) +
        T(260, 944, '전신이 보이게 찍도록 프레이밍 가이드 · 가림·원거리 사진으로 데이터 증강 · 확신도가 낮으면 다시 찍기 유도', { size: 24, w: 700, fill: C.white }), { op: e3 });
      return s;
    },
    over: () => MIS().map((m, k) => {
      const x = 100 + k * 590;
      return `<clipPath id="mc${k}"><rect x="${x + 20}" y="288" width="500" height="290"/></clipPath><image class="fade-img" style="animation-delay:${0.5 + k * 0.25}s" href="${esc(m.url)}" x="${x + 20}" y="288" width="500" height="290" preserveAspectRatio="xMidYMid slice" clip-path="url(#mc${k})"/>` +
        R(x + 20, 288, 500, 290, 'none', { stroke: C.carbon, sw: 4 }) + (k === 0 ? chip(x + 264, 304, 'CONFIDENT MISS', { size: 15, w: 240, fill: C.primary, ink: C.white }) : '');
    }).join('')
  };

  // 09 로드맵 — 월드맵 경로가 그려지고 스테이지 깃발이 차례로 꽂힘, 마스코트가 따라 걷는다
  const STAGES = [[305, 380], [742, 330], [1178, 380], [1615, 330]];
  S[8] = {
    base: () => R(100, 268, 1720, 690, 'url(#grid)'),
    dyn: (p) => {
      let s = '';
      const f = eo(seg(p, 0.05, 0.8));
      const pts = [[120, 400], ...STAGES, [1820, 330]];
      s += `<path d="${partial(pts, 1)}" fill="none" stroke="${C.mindigo}" stroke-width="10" stroke-dasharray="2 22" stroke-linecap="round"/>`;
      s += `<path d="${partial(pts, f)}" fill="none" stroke="${C.amber}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
      CFG.roadmap.forEach((st, k) => {
        const [cx, cy] = STAGES[k], at = (k + 1) / 5, kk = back(seg(f, at - 0.1, at + 0.08));
        const off = st.mode === 'OFFLINE';
        s += G(O(cx, cy, 34, off ? C.signal : C.indigo, { stroke: C.carbon, sw: 4 }) + T(cx, cy + 12, k + 1, { f: K.DISPLAY, size: 34, w: 900, fill: C.white, anchor: 'middle' }), { s: kk, at: [cx, cy] });
        const x = cx - 205, y = 460, e = eo(seg(p, 0.22 + k * 0.1, 0.62 + k * 0.1));
        s += G(plate(x, y, 410, 440, { fill: off ? C.ice : C.white, ch: 18, edge: off ? C.gold : C.indigo }) +
          labelBar(x, y, 410, st.world, { fill: off ? C.amber : C.peri }) +
          chip(x + 410 - 132, y + 7, st.mode, { size: 14, w: 120, fill: off ? C.signal : C.carbon, ink: C.white }) +
          T(x + 24, y + 106, st.name, { size: 36, w: 900, fill: C.carbon }) +
          (st.proposal ? T(x + 24, y + 144, '제안(안) · 기획 문서 이후 확장', { size: 19, w: 700, fill: C.gold }) : T(x + 24, y + 144, k === 0 ? 'MVP' : k === 1 ? '리텐션 루프' : '데이터 기반 고도화', { size: 19, w: 700, fill: C.indigo })) +
          L(x + 24, y + 170, x + 386, y + 170, C.mindigo, 2, { dash: '2 7', cap: 'round' }) +
          st.lines.map((l, i) => R(x + 26, y + 212 + i * 70, 10, 10, off ? C.signal : C.indigo) + T(x + 48, y + 223 + i * 70, l, { size: 22, w: 600, fill: C.carbon })).join(''), { op: e, dy: (1 - e) * 30 });
      });
      // 걷는 마스코트
      const pos = (() => { const tot = []; let sum = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); tot.push(d); sum += d; } let rem = sum * f; for (let i = 1; i < pts.length; i++) { if (rem <= tot[i - 1]) { const q = rem / tot[i - 1]; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * q, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * q]; } rem -= tot[i - 1]; } return pts[pts.length - 1]; })();
      s += pig(Math.min(pos[0], 1720) - 56, pos[1] - 96, 8);
      return s;
    }
  };

  // 10 클로징 — 플레이어 선택 화면 + 핵심 숫자 스코어보드
  S[9] = {
    base: () => plate(1040, 268, 780, 470, { fill: C.lavender, ch: 30, pattern: 'circuit' }),
    dyn: (p) => {
      let s = '';
      CFG.personas.forEach((q, k) => {
        const y = 268 + k * 240, e = eo(seg(p, 0.1 + k * 0.15, 0.6 + k * 0.15));
        s += G(R(100, y, 900, 210, C.carbon) + R(100, y, 900, 210, 'url(#ht)') + L(100, y + 2, 1000, y + 2, C.mindigo, 3) +
          chip(132, y + 30, q.p, { size: 18, w: 170, fill: k ? C.amber : C.signal, ink: k ? C.carbon : C.white }) +
          T(132, y + 130, q.head, { size: 44, w: 900, fill: C.white }) + T(132, y + 178, q.sub, { size: 26, w: 600, fill: C.soft }) +
          arrowDisc(950, y + 105, 26), { op: e, dx: (1 - e) * -60 });
      });
      s += G(box(1080, 400, 'PRESS START', { size: 76, sw: 11, shadow: 6 }) + T(1084, 470, '디지털 반려동물 기반', { size: 30, w: 800, fill: C.carbon }) + T(1084, 512, '라이프스타일 코워킹 스페이스', { size: 30, w: 800, fill: C.carbon }), { op: eo(seg(p, 0.2, 0.6)) });
      const a = D.ai, j = D.joy, c = D.care;
      const nums = [[j.paragraphs, '', '포럼 문단 분석'], [c.neg_pct, '%', '걱정이 담긴 질문'], [a.val_acc * 100, '%', 'AI 판별 정확도'], [4, '', '확장 월드']];
      nums.forEach(([v, u, lb], k) => {
        const x = 100 + k * 440, e = eo(seg(p, 0.4 + k * 0.08, 0.76 + k * 0.08));
        s += G(plate(x, 770, 400, 186, { fill: k === 2 ? C.ice : C.platinum }) + box(x + 28, 880, fmt(v * e, v) + u, { size: 82, sw: 10, shadow: 5 }) + T(x + 30, 932, lb, { size: 24, w: 700, fill: C.indigo }), { op: e });
      });
      return s;
    },
    over: () => mascot(1590, 560, 13, true)
  };

  // 마스코트는 over 층에 SMIL로 깡충(팝코닝) — 매 프레임 다시 그리지 않음
  function mascot(x, y, px, small) {
    const body = pig(x, y, px);
    if (RM) return body;
    const h = small ? 26 : 46;
    return `<ellipse cx="${x + 7 * px}" cy="${y + 9.4 * px}" rx="${6.5 * px}" ry="${px * 0.7}" fill="#21242e" opacity=".18"><animate attributeName="rx" values="${6.5 * px};${6.5 * px};${4.5 * px};${6.5 * px};${5.5 * px};${6.5 * px}" keyTimes="0;.6;.7;.8;.86;1" dur="2.8s" repeatCount="indefinite"/></ellipse>` +
      `<g>${body}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -${h};0 0;0 -${h * 0.4};0 0" keyTimes="0;.6;.7;.8;.86;1" dur="2.8s" repeatCount="indefinite"/></g>`;
  }

  // ---------------------------------------------------------------- 플레이어
  const stage = document.getElementById('stage');
  const q = new URLSearchParams(location.search);
  const still = q.get('still') === '1';
  let idx = clamp(parseInt((location.hash.slice(1) || q.get('s') || '1'), 10) - 1 || 0, 0, N - 1), t0 = performance.now(), running = false;
  const svgShell = (i, withOver) => `<svg viewBox="0 0 ${K.W} ${K.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc((CFG.slides[i].title || '기니어스클럽 표지'))}">${DEFS}<g>${chromeBase(i)}${S[i].base ? S[i].base() : ''}</g><g class="dyn"></g>${withOver && S[i].over ? `<g class="over">${S[i].over()}</g>` : ''}</svg>`;
  const dynAt = (i, p) => title(i, p) + S[i].dyn(p);

  const enter = (i) => {
    idx = (i + N) % N;
    stage.innerHTML = svgShell(idx, true);
    t0 = performance.now();
    if (history.replaceState) history.replaceState(null, '', '#' + (idx + 1));
    document.getElementById('count').textContent = `${String(idx + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    document.querySelectorAll('#dots button').forEach((b, k) => b.setAttribute('aria-current', k === idx ? 'true' : 'false'));
    stage.querySelectorAll('[data-go-nav]').forEach((g) => g.addEventListener('click', (e) => { e.stopPropagation(); const n = +g.dataset.goNav; enter(CFG.slides.findIndex((s) => s.nav === n)); }));
    if (!running) { running = true; requestAnimationFrame(loop); }
  };
  const loop = () => {
    const dyn = stage.querySelector('.dyn');
    const t = (still || RM) ? 99 : (performance.now() - t0) / 1000;
    const p = window.MK.progress(t, true);
    if (dyn) dyn.innerHTML = dynAt(idx, p);
    if (p < 1) requestAnimationFrame(loop); else running = false; // 빌드가 끝나면 멈춤 → 마스코트(SMIL)만 계속 움직임
  };
  const go = (d) => enter(idx + d);

  // 개요 보드 (템플릿의 카드 그리드 계승)
  const board = document.getElementById('board');
  const openBoard = () => {
    board.innerHTML = CFG.slides.map((s, i) => `<button class="cell" data-i="${i}"><span class="thumb">${svgShell(i, false).replace('<g class="dyn"></g>', `<g>${dynAt(i, 1)}</g>`)}</span><span class="cap"><b>${String(i + 1).padStart(2, '0')}</b>${esc(s.title || '표지 · 기니어스클럽')}</span></button>`).join('');
    board.hidden = false; document.body.classList.add('boarding');
    board.querySelectorAll('.cell').forEach((c) => c.addEventListener('click', () => { closeBoard(); enter(+c.dataset.i); }));
  };
  const closeBoard = () => { board.hidden = true; board.innerHTML = ''; document.body.classList.remove('boarding'); };

  document.getElementById('prev').addEventListener('click', () => go(-1));
  document.getElementById('next').addEventListener('click', () => go(1));
  document.getElementById('replay').addEventListener('click', () => enter(idx));
  document.getElementById('grid').addEventListener('click', () => (board.hidden ? openBoard() : closeBoard()));
  document.getElementById('full').addEventListener('click', () => { const el = document.documentElement; (document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen && el.requestFullscreen()).catch?.(() => {}); });
  document.getElementById('dots').innerHTML = CFG.slides.map((s, i) => `<button aria-label="${i + 1}번 슬라이드">${i + 1}</button>`).join('');
  document.querySelectorAll('#dots button').forEach((b, i) => b.addEventListener('click', () => enter(i)));
  stage.addEventListener('click', (e) => { const r = stage.getBoundingClientRect(); go(e.clientX - r.left < r.width / 3 ? -1 : 1); });
  document.addEventListener('keydown', (e) => {
    if (!board.hidden) { if (e.key === 'Escape' || e.key.toLowerCase() === 'o') closeBoard(); return; }
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') enter(0); else if (e.key === 'End') enter(N - 1);
    else if (e.key.toLowerCase() === 'r') enter(idx);
    else if (e.key.toLowerCase() === 'o') openBoard();
    else if (e.key.toLowerCase() === 'f') document.getElementById('full').click();
    else if (/^[0-9]$/.test(e.key)) enter(e.key === '0' ? 9 : +e.key - 1);
  });
  if (q.get('clean') === '1') document.body.classList.add('clean');

  const fonts = document.fonts ? Promise.all(["900 40px 'Pretendard'", "700 20px 'Silkscreen'", "900 40px 'Arial Black'"].map((f) => document.fonts.load(f))).then(() => document.fonts.ready) : Promise.resolve();
  fonts.then(() => enter(idx), () => enter(idx));
})();
