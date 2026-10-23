// 기니피그·햄스터 데이터 리포트 — references/template의 core.js 엔진(progress·이징·SVG 헬퍼·chrome) 위에서 동작
// 슬라이드마다 두 층: dyn(크롬 + 빌드 모션, 매 프레임) · over(사진, 진입 시 1회)
(function () {
  const { K, clamp, eo, eio, back, seg, r2, fmt, txt, rect, line, circ, progress, chrome } = window.MK;
  const C = K.C, D = window.DECK_DATA, CFG = window.DECK, SL = CFG.slides;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // 글자 폭 추정(px) — 칩·라벨 배치용
  const tw = (s, size, num) => [...String(s)].reduce((a, ch) => a + size * (/[가-힣]/.test(ch) ? 0.96 : /\s/.test(ch) ? 0.26 : num ? 0.46 : /[A-Z0-9%]/.test(ch) ? 0.62 : 0.5), 0);
  const g = (op, body, tr) => `<g${op !== undefined ? ` opacity="${r2(clamp(op))}"` : ''}${tr ? ` transform="${tr}"` : ''}>${body}</g>`;
  const up = (e, d = 24) => `translate(0 ${r2((1 - e) * d)})`;
  const KO = { guinea_pig: '기니피그', hamster: '햄스터' };
  const f1 = (v) => v.toFixed(1); // 퍼센트는 소수 첫째 자리 고정(34.0%)

  // 가로 막대 행(템플릿 02 계승): 라벨 2줄 + 트랙 + 막대 + 오른쪽 수치
  const hbar = (p, i, y, o) => {
    const e = eo(seg(p, 0.08 + i * 0.08, 0.6 + i * 0.08)), hi = o.hi;
    let s = txt(100, y + (o.sub ? 22 : 36), esc(o.label), { size: 32, w: 700 }) + txt(100, y + 60, esc(o.sub), { size: 24, fill: hi ? C.a : C.muted, w: hi ? 600 : 400 });
    s += rect(o.bx, y, o.bw, o.h, C.track) + rect(o.bx, y, o.bw * o.v / o.max * e, o.h, hi ? C.a : C.b);
    s += txt(1820, y + 42, (o.dec ? (o.v * e).toFixed(o.dec) : fmt(o.v * e, o.v)) + `<tspan font-size="${o.uSize || 30}" font-family="${K.FONT}" font-weight="500" dx="6">${o.unit}</tspan>`, { size: 60, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.ink });
    return s;
  };

  const S = {};

  // ── 표지 (템플릿 12 타이틀 마스크, 두 줄)
  S.cover = (p, d) => {
    const e1 = eo(seg(p, 0.05, 0.5)), e1b = eo(seg(p, 0.15, 0.6)), e2 = eo(seg(p, 0.35, 0.8)), e3 = eo(seg(p, 0.5, 1));
    let s = `<defs><clipPath id="cv1"><rect x="0" y="300" width="1920" height="170"/></clipPath><clipPath id="cv2"><rect x="0" y="470" width="1920" height="170"/></clipPath><clipPath id="cv3"><rect x="0" y="672" width="1920" height="70"/></clipPath></defs>`;
    s += txt(100, 132, d.kicker, { size: 28, w: 500, fill: C.b, ls: '4' }) + txt(1820, 132, d.source, { size: 28, num: 1, fill: C.b, anchor: 'end' });
    s += `<g clip-path="url(#cv1)"><g transform="translate(0 ${r2((1 - e1) * 170)})">${txt(94, 440, d.title[0], { size: 140, w: 800, fill: C.paper, ls: '-5' })}</g></g>`;
    s += `<g clip-path="url(#cv2)"><g transform="translate(0 ${r2((1 - e1b) * 170)})">${txt(94, 610, d.title[1], { size: 140, w: 800, fill: C.b, ls: '-5' })}</g></g>`;
    s += `<g clip-path="url(#cv3)"><g transform="translate(0 ${r2((1 - e2) * 70)})">${txt(100, 724, d.sub, { size: 44, w: 500, fill: C.b2 })}</g></g>`;
    s += rect(100, 790, 1720 * e3, 3, C.b);
    s += txt(100, 870, 'GuineaPigCages.com 포럼 텍스트 (Firecrawl 수집) · Pexels·Unsplash 사진 (Kaggle ResNet18 분류)', { size: 26, fill: C.b, op: e3 });
    return s;
  };

  // ── 기획 배경 (기니어스클럽 1장)
  S.why = (p) => {
    const W = CFG.why, e0 = eo(seg(p, 0.05, 0.45));
    let s = g(e0, rect(100, 290, 700, 640, C.dark) +
      txt(150, 362, 'GUINIUS CLUB', { size: 26, w: 600, fill: C.b, ls: '4' }) +
      txt(150, 442, '기니어스클럽', { size: 72, w: 800, fill: C.paper, ls: '-2' }) +
      W.card.map((l, i) => txt(150, 512 + i * 44, esc(l), { size: 30, w: 500, fill: C.b2 })).join('') +
      line(150, 610, 750, 610, 'rgba(245,245,248,.22)', 1) +
      W.points.map((l, i) => rect(150, 652 + i * 74, 14, 14, C.b) + txt(184, 668 + i * 74, esc(l), { size: 28, fill: C.paper })).join(''), up(e0, 30));
    s += g(eo(seg(p, 0.2, 0.5)), txt(900, 330, '그래서 서비스를 그리기 전에, 데이터로 먼저 확인했다', { size: 32, w: 700, fill: C.muted }));
    W.qs.forEach((q, i) => {
      const e = eo(seg(p, 0.28 + i * 0.12, 0.7 + i * 0.12)), y = 400 + i * 180;
      s += g(e, line(900, y - 10, 1820, y - 10, C.grid, i ? 1 : 2) +
        txt(900, y + 92, 'Q' + (i + 1), { size: 96, w: 600, num: 1, fill: C.a }) +
        txt(1030, y + 62, esc(q.q), { size: 40, w: 700 }) +
        txt(1030, y + 112, esc(q.d), { size: 26, fill: C.muted }), `translate(${r2((1 - e) * 40)} 0)`);
    });
    return s;
  };

  // ── 데이터 개요 (템플릿 10 카운트업 × 3)
  S.data = (p) => {
    const cols = [
      { k: 'PART 1', n: D.care.posts, u: '건', h: '반려인 질문 글', l: ['GuineaPigCages.com 스레드 첫 글', 'Firecrawl 수집 · 감성·카테고리·키워드'] },
      { k: 'PART 2', n: D.joy.paragraphs, u: '문단', h: `스레드 ${D.joy.threads}개의 전체 답글`, l: ['야채·팝코닝·울음소리 스레드', '규칙 기반 반응 사전 · 트리거 분류'] },
      { k: 'PART 3', n: D.ai.total, u: '장', h: '기니피그·햄스터 사진', l: [`클래스별 ${D.ai.per_class}장 · Pexels·Unsplash`, 'Kaggle T4 · ResNet18 전이학습'] }
    ];
    let s = '';
    cols.forEach((c, i) => {
      const x = 100 + i * 593, e = eo(seg(p, 0.06 + i * 0.12, 0.7 + i * 0.12));
      s += rect(x, 300, 534, 6, C.track) + rect(x, 300, 534 * e, 6, i === 1 ? C.a : C.b);
      s += txt(x, 362, c.k, { size: 28, w: 600, fill: C.a, op: e });
      const num = fmt(c.n * e, c.n);
      s += txt(x - 6, 610, num + `<tspan font-size="48" font-family="${K.FONT}" font-weight="700" fill="${C.muted}" dx="14" letter-spacing="0">${c.u}</tspan>`, { size: 230, w: 600, num: 1, fill: i === 1 ? C.a : C.ink, ls: '-4' });
      s += g(e, txt(x, 712, esc(c.h), { size: 36, w: 700 }) + c.l.map((l, j) => txt(x, 772 + j * 42, esc(l), { size: 26, fill: C.muted })).join(''));
    });
    return s;
  };

  // ── 걱정 비율 (템플릿 10 카운트업)
  S.mood = (p) => {
    const n = D.care.posts, sent = D.care.sentiment, e = eo(seg(p, 0, 0.7));
    const parts = [['부정·불안', sent['부정'], C.a], ['중립', sent['중립'], C.b], ['긍정', sent['긍정'], C.b2]];
    let s = txt(100, 330, `부정·불안 감성이 드러난 질문 (${n}건 중 ${sent['부정']}건)`, { size: 36, w: 600, fill: C.muted });
    s += txt(90, 640, fmt(D.care.neg_pct * e, D.care.neg_pct) + '%', { size: 340, w: 600, num: 1, fill: C.a, ls: '-4' });
    s += g(eo(seg(p, 0.45, 0.85)), txt(1180, 470, '도움 요청 글이 대부분이라', { size: 32, w: 600 }) + txt(1180, 516, '걱정·불안 어휘가 함께 나온다', { size: 32, w: 600 }) +
      txt(1180, 572, 'worried · afraid · terrified · worse', { size: 28, fill: C.a, w: 500 }));
    let x = 100; const W = 1720;
    s += rect(100, 720, W, 80, C.track);
    parts.forEach((pt, i) => {
      const k = eo(seg(p, 0.3 + i * 0.14, 0.62 + i * 0.14)), w = W * pt[1] / n;
      s += rect(x, 720, w * k, 80, pt[2]);
      s += rect(x, 842, 22, 22, pt[2], { op: k }) + txt(x + 34, 862, `${pt[0]} ${pt[1]}건 · ${(pt[1] / n * 100).toFixed(1)}%`, { size: 28, op: k });
      x += w;
    });
    return s;
  };

  // ── 고민 카테고리 (템플릿 06 트리맵, 6항목 배치)
  S.cats = (p) => {
    const it = D.care.categories, tot = D.care.posts, X0 = 100, Y0 = 290, W = 1720, H = 650;
    const fills = [C.dark, C.a, C.a2, C.b, C.b2, C.track];
    const w0 = W * it[0].n / tot, rest = tot - it[0].n;
    const c2 = it[1].n + it[2].n, w2 = (W - w0) * c2 / rest, w3 = W - w0 - w2, c3 = rest - c2;
    const R = [[X0, Y0, w0, H]];
    let y = Y0; [1, 2].forEach((i) => { const h = H * it[i].n / c2; R.push([X0 + w0, y, w2, h]); y += h; });
    y = Y0; [3, 4, 5].forEach((i) => { const h = H * it[i].n / c3; R.push([X0 + w0 + w2, y, w3, h]); y += h; });
    let s = '';
    R.forEach(([rx, ry, rw, rh], i) => {
      const k = back(seg(p, i * 0.08, 0.42 + i * 0.08)), cx = rx + rw / 2, cy = ry + rh / 2, c = it[i], e = clamp(k);
      const ink = i < 3 ? C.paper : C.ink, big = i === 0;
      s += `<g transform="translate(${r2(cx)} ${r2(cy)}) scale(${r2(Math.max(0.001, k))}) translate(${r2(-cx)} ${r2(-cy)})">` + rect(rx + 3, ry + 3, rw - 6, rh - 6, fills[i]);
      if (rh > 200) {
        s += txt(rx + 34, ry + (big ? 72 : 60), esc(c.name), { size: big ? 44 : 34, w: 700, fill: ink });
        s += txt(rx + 34, ry + rh - 40, f1(c.pct * e) + '%', { size: big ? 150 : 84, w: 600, num: 1, fill: ink });
        s += txt(rx + rw - 34, ry + rh - 44, c.n + '건', { size: big ? 40 : 32, w: 600, fill: ink, anchor: 'end', op: 0.8 });
      } else {
        const sz = rh > 80 ? 28 : 24;
        s += txt(rx + 26, cy + 9, esc(c.name), { size: sz, w: 600, fill: ink }) + txt(rx + rw - 26, cy + 10, `${f1(c.pct * e)}% · ${c.n}건`, { size: sz + 4, w: 600, num: 1, fill: ink, anchor: 'end' });
      }
      s += '</g>';
    });
    return s;
  };

  // ── 카테고리별 부정 비율 (템플릿 02 가로 막대)
  S.neg = (p) => {
    const rows = D.care.categories.filter((c) => c.n >= 5).sort((a, b) => b.neg_pct - a.neg_pct);
    let s = rows.map((c, i) => hbar(p, i, 320 + i * 140, { label: c.name, sub: `${c.n}건 중 ${Math.round(c.n * c.neg_pct / 100)}건이 부정`, v: c.neg_pct, dec: 1, max: 100, unit: '%', bx: 640, bw: 960, h: 54, hi: i === 0 })).join('');
    const e = eo(seg(p, 0.6, 1));
    s += g(e, txt(100, 920, '케이지 질문은 크기·제품을 묻는 정보 탐색형, 합사·질병 질문은 "don\'t know what to do" 같은 무력감과 함께 나온다', { size: 26, fill: C.muted }));
    return s;
  };

  // ── 키워드 (템플릿 08 세로 막대)
  S.kw = (p) => {
    const kw = D.care.keywords, n = kw.length, x0 = 230, x1 = 1690, yb = 880, hmax = 500, max = 55, bw = 128;
    let s = line(140, yb, 1780, yb, C.grid, 2);
    kw.forEach((k, i) => {
      const cx = x0 + (x1 - x0) * i / (n - 1), hi = i === 0, e = eo(seg(p, 0.06 + i * 0.07, 0.62 + i * 0.07)), h = hmax * k.n / max * e;
      s += rect(cx - bw / 2, yb - h, bw, h, hi ? C.a : C.b);
      s += txt(cx, yb - h - 22, fmt(k.n * e, k.n), { size: hi ? 64 : 46, w: 600, num: 1, anchor: 'middle', fill: hi ? C.a : C.ink, op: seg(e, 0.1, 0.4) });
      if (h > 70) s += txt(cx, yb - 24, k.word, { size: 28, w: 600, num: 1, anchor: 'middle', fill: hi ? C.paper : C.dark, op: seg(e, 0.5, 1) });
      s += txt(cx, 928, esc(k.ko), { size: 28, w: hi ? 700 : 600, anchor: 'middle' });
    });
    return s;
  };

  // ── 야채 티어표 (와플식 칩 등장)
  S.tier = (p) => {
    const T = D.joy.tiers, tiers = ['S', 'A', 'B', 'C'], fills = { S: C.dark, A: C.a, B: C.a2, C: C.grid };
    let s = '';
    tiers.forEach((t, r) => {
      const y = 286 + r * 168, H = 150, e = eo(seg(p, 0.04 + r * 0.1, 0.4 + r * 0.1));
      s += g(e, rect(100, y, 140, H, fills[t]) + txt(170, y + 98, t, { size: 104, w: 600, num: 1, anchor: 'middle', fill: t === 'C' ? C.ink : C.paper }) +
        txt(170, y + 136, T[t].length + '종', { size: 22, w: 600, anchor: 'middle', fill: t === 'C' ? C.muted : C.b2 }) + rect(248, y, 1572, H, C.track), `translate(${r2((1 - e) * -30)} 0)`);
      // 칩 자동 줄바꿈
      let cx = 272, cy = y + 18; const ch = 54, rowW = 1800;
      T[t].forEach((v, j) => {
        const sc = (v.score > 0 ? '+' : v.score < 0 ? '−' : '') + Math.abs(v.score).toFixed(2);
        const w = tw(v.ko, 26) + tw(sc, 26, 1) + 52;
        if (cx + w > rowW) { cx = 272; cy += ch + 10; }
        const k = back(seg(p, 0.18 + r * 0.1 + j * 0.025, 0.42 + r * 0.1 + j * 0.025)), mx = cx + w / 2, my = cy + ch / 2;
        const strong = t === 'S';
        s += `<g transform="translate(${r2(mx)} ${r2(my)}) scale(${r2(Math.max(0.001, k))}) translate(${r2(-mx)} ${r2(-my)})">` +
          rect(cx, cy, w, ch, C.card, { stroke: strong ? C.a : C.grid, sw: strong ? 2 : 1 }) +
          txt(cx + 18, cy + 37, esc(v.ko), { size: 26, w: strong ? 700 : 500 }) +
          txt(cx + w - 16, cy + 38, sc, { size: 28, w: 600, num: 1, anchor: 'end', fill: v.score < 0 ? C.muted : C.a }) + '</g>';
        cx += w + 12;
      });
    });
    return s;
  };

  // ── 자주 오르는 채소: 점수 발산 막대
  S.pop = (p) => {
    const rows = D.joy.popular, x0 = 1140, sc = 560, y0 = 300, gap = 66;
    let s = line(x0, y0 - 24, x0, y0 + rows.length * gap - 10, C.ink, 2);
    [-1, -0.5, 0.5, 1].forEach((v) => s += line(x0 + v * sc, y0 - 24, x0 + v * sc, y0 + rows.length * gap - 10, C.track, 1));
    [-1, -0.5, 0, 0.5, 1].forEach((v) => s += txt(x0 + v * sc, y0 + rows.length * gap + 30, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1), { size: 26, num: 1, anchor: 'middle', fill: C.muted }));
    s += txt(x0 - 20, 270, '← 거부가 많음', { size: 24, fill: C.muted, anchor: 'end' }) + txt(x0 + 20, 270, '열광이 많음 →', { size: 24, fill: C.muted });
    rows.forEach((v, i) => {
      const y = y0 + i * gap, neg = v.score < 0, e = eo(seg(p, 0.08 + i * 0.06, 0.6 + i * 0.06)), w = sc * Math.abs(v.score) * e;
      s += txt(100, y + 30, esc(v.ko), { size: 32, w: neg ? 800 : 600, fill: neg ? C.a : C.ink });
      s += txt(500, y + 30, v.n + '회', { size: 30, w: 500, num: 1, fill: C.muted, anchor: 'end' });
      s += txt(530, y + 30, `열광 ${v.love} · 거부 ${v.reject}`, { size: 24, fill: neg ? C.a : C.muted, w: neg ? 700 : 400 });
      s += rect(neg ? x0 - w : x0, y + 4, w, 38, neg ? C.a : C.b);
      const lx = neg ? x0 - w - 14 : x0 + w + 14;
      s += txt(lx, y + 34, (neg ? '−' : '+') + fmt(Math.abs(v.score) * e, Math.abs(v.score)), { size: neg ? 40 : 32, w: 600, num: 1, anchor: neg ? 'end' : 'start', fill: neg ? C.a : C.ink, op: seg(e, 0.3, 0.7) });
    });
    return s;
  };

  // ── 팝코닝 트리거: 누적 가로 막대(격렬한 묘사 / 그 외)
  S.trig = (p) => {
    const rows = D.joy.triggers, bx = 700, bw = 960, max = 26, y0 = 330, gap = 98;
    let s = rect(1290, 262, 22, 22, C.a) + txt(1322, 282, '격렬한 묘사 포함', { size: 24 }) + rect(1530, 262, 22, 22, C.b) + txt(1562, 282, '그 외 언급', { size: 24 });
    rows.forEach((r, i) => {
      const y = y0 + i * gap, e = eo(seg(p, 0.08 + i * 0.08, 0.6 + i * 0.08)), hi = i < 2;
      s += txt(100, y + 36, esc(r.ko), { size: 32, w: hi ? 700 : 500 });
      s += rect(bx, y, bw, 50, C.track) + rect(bx, y, bw * r.intense / max * e, 50, C.a) + rect(bx + bw * r.intense / max * e, y, bw * (r.n - r.intense) / max * e, 50, C.b);
      s += txt(bx + 16, y + 35, '격렬 ' + r.intense, { size: 24, w: 600, fill: C.paper, op: seg(e, 0.6, 1) });
      s += txt(1820, y + 44, fmt(r.n * e, r.n) + `<tspan font-size="26" font-family="${K.FONT}" font-weight="500" dx="6">문단</tspan>`, { size: 56, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.ink });
    });
    s += g(eo(seg(p, 0.6, 1)), txt(100, 940, '격렬한 묘사 비율은 집사 목소리·등장(71%), 쓰다듬기(67%)가 가장 높지만 표본은 6~7문단이다', { size: 26, fill: C.muted }));
    return s;
  };

  // ── 리액션 단어 (템플릿 08 세로 막대)
  S.words = (p) => {
    const w = D.joy.words, n = w.length, x0 = 240, x1 = 1680, yb = 860, hmax = 480, max = 240, bw = 150;
    let s = line(140, yb, 1780, yb, C.grid, 2);
    w.forEach((k, i) => {
      const cx = x0 + (x1 - x0) * i / (n - 1), hi = i < 2, e = eo(seg(p, 0.06 + i * 0.08, 0.62 + i * 0.08)), h = hmax * k.count / max * e;
      s += rect(cx - bw / 2, yb - h, bw, h, hi ? C.a : C.b);
      s += txt(cx, yb - h - 22, fmt(k.count * e, k.count), { size: hi ? 64 : 46, w: 600, num: 1, anchor: 'middle', fill: hi ? C.a : C.ink, op: seg(e, 0.1, 0.4) });
      s += txt(cx, 906, esc(k.word.split(' / ')[0]), { size: 30, w: 600, num: 1, anchor: 'middle' });
      s += txt(cx, 946, esc(k.ko.replace(/\(.*\)/, '')), { size: 24, anchor: 'middle', fill: C.muted });
    });
    return s;
  };

  // ── 윅윅 트리거 (템플릿 02 가로 막대)
  S.wheek = (p) => {
    const rows = D.joy.wheek_all;
    return rows.map((r, i) => hbar(p, i, 300 + i * 104, { label: r.ko, sub: i === 0 ? '사료 시간이 다가오면 먼저 울기 시작' : i === 1 ? '봉지 소리 = 간식이 온다는 신호' : '', v: r.n, max: 24, unit: '문단', uSize: 26, bx: 760, bw: 860, h: 46, hi: i < 2 })).join('');
  };

  // ── 이미지 데이터셋 (템플릿 04 와플)
  S.set = (p) => {
    const cell = 52, gp = 8, ox = 100, oy = 290, f = eo(seg(p, 0.04, 0.8));
    let s = '';
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10, ham = r >= 5, val = r === 4 || r === 9;
      const x = ox + c * (cell + gp), y = oy + r * (cell + gp) + (ham ? 24 : 0);
      const on = i < 100 * f, pop = on ? back(clamp(100 * f - i)) : 1, sz = cell * (on ? pop : 1), off = (cell - sz) / 2, col = ham ? C.b : C.a;
      s += on ? (val ? rect(x + off + 2, y + off + 2, sz - 4, sz - 4, C.bg, { stroke: col, sw: 4 }) : rect(x + off, y + off, sz, sz, col)) : rect(x, y, cell, cell, C.track);
    }
    const e1 = eo(seg(p, 0.15, 0.55)), e2 = eo(seg(p, 0.3, 0.7)), e3 = eo(seg(p, 0.45, 0.9));
    const sb = D.ai.split_by_class;
    s += g(e1, txt(820, 380, fmt(50 * e1, 50), { size: 150, w: 600, num: 1, fill: C.a }) + txt(820, 430, `기니피그 · 학습 ${sb['guinea_pig|train']} / 검증 ${sb['guinea_pig|val']}`, { size: 28, w: 600 }) +
      txt(1320, 380, fmt(50 * e1, 50), { size: 150, w: 600, num: 1, fill: C.b }) + txt(1320, 430, `햄스터 · 학습 ${sb['hamster|train']} / 검증 ${sb['hamster|val']}`, { size: 28, w: 600 }));
    s += g(e2, rect(820, 500, 28, 28, C.a2) + txt(862, 524, `학습 ${D.ai.train_n}장`, { size: 28 }) + rect(1062, 502, 24, 24, C.bg, { stroke: C.a2, sw: 4 }) + txt(1100, 524, `검증 ${D.ai.val_n}장 (학습에 안 쓴 사진)`, { size: 28 }));
    const steps = ['Firecrawl로 Pexels·Unsplash 이미지 URL 수집', '다운로드 · 손상 파일 검증 → 클래스별 폴더', 'ImageNet 사전학습 ResNet18 · 5 epoch (Kaggle T4)'];
    s += g(e3, line(820, 590, 1820, 590, C.grid, 1) + steps.map((t, i) => txt(820, 656 + i * 66, String(i + 1).padStart(2, '0'), { size: 40, w: 600, num: 1, fill: C.a }) + txt(880, 654 + i * 66, t, { size: 30 })).join('') +
      txt(820, 870, `출처 구성: Pexels ${D.ai.sources.pexels}장 · Unsplash ${D.ai.sources.unsplash}장`, { size: 26, fill: C.muted }));
    return s;
  };

  // ── 정확도 (템플릿 05 링 게이지)
  S.acc = (p) => {
    const a = D.ai, rings = [
      ['학습 정확도', a.train_acc * 100, `${a.train_correct}/${a.train_n}장 · 과적합 신호`],
      ['검증 정확도', a.val_acc * 100, `${a.val_correct}/${a.val_n}장 · 처음 보는 사진`],
      ['95% 신뢰구간 하한', a.ci_lo * 100, `구간 ${(a.ci_lo * 100).toFixed(1)}–${(a.ci_hi * 100).toFixed(1)}%`]
    ];
    let s = ''; const r = 170, sw = 34, L = 2 * Math.PI * r;
    rings.forEach((gg, i) => {
      const cx = 400 + i * 560, cy = 590, hi = i === 1, e = eo(seg(p, 0.08 + i * 0.12, 0.75 + i * 0.12));
      s += circ(cx, cy, r, 'none', { stroke: C.track, sw });
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hi ? C.a : C.b}" stroke-width="${sw}" stroke-dasharray="${r2(L * gg[1] / 100 * e)} ${r2(L)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      s += txt(cx, cy + 34, fmt(gg[1] * e, gg[1]) + `<tspan font-size="48" dx="4">%</tspan>`, { size: 110, w: 600, num: 1, anchor: 'middle', fill: hi ? C.a : C.ink });
      s += txt(cx, cy + r + 82, gg[0], { size: 38, w: hi ? 700 : 500, anchor: 'middle' });
      s += txt(cx, cy + r + 124, esc(gg[2]), { size: 26, anchor: 'middle', fill: hi ? C.a : C.muted, w: hi ? 600 : 400 });
    });
    return s;
  };

  // ── 혼동 행렬 + 클래스별 재현율
  S.cm = (p) => {
    const cm = D.ai.cm, cls = ['guinea_pig', 'hamster'], ox = 330, oy = 360, cs = 250, gap = 10;
    let s = txt(ox + cs + gap / 2, 300, '예측 →', { size: 26, w: 600, fill: C.muted, anchor: 'middle' }) + txt(ox - 30, 300, '실제 ↓', { size: 26, w: 600, fill: C.muted, anchor: 'end' });
    cls.forEach((c, j) => s += txt(ox + j * (cs + gap) + cs / 2, 344, KO[c], { size: 30, w: 700, anchor: 'middle' }));
    cls.forEach((t, i) => {
      s += txt(ox - 30, oy + i * (cs + gap) + cs / 2 + 12, KO[t], { size: 30, w: 700, anchor: 'end' });
      cls.forEach((pr, j) => {
        const v = cm[`${t}->${pr}`], diag = i === j, hi = t === 'hamster' && pr === 'guinea_pig';
        const k = back(seg(p, 0.06 + (i * 2 + j) * 0.09, 0.45 + (i * 2 + j) * 0.09)), x = ox + j * (cs + gap), y = oy + i * (cs + gap), mx = x + cs / 2, my = y + cs / 2;
        s += `<g transform="translate(${mx} ${my}) scale(${r2(Math.max(0.001, k))}) translate(${-mx} ${-my})">` +
          rect(x, y, cs, cs, diag ? C.a : hi ? C.b2 : C.track, hi ? { stroke: C.a, sw: 4 } : {}) +
          txt(mx, my + 44, v, { size: 150, w: 600, num: 1, anchor: 'middle', fill: diag ? C.paper : C.a }) +
          txt(mx, y + cs - 22, diag ? '맞힘' : '틀림', { size: 24, w: 600, anchor: 'middle', fill: diag ? C.b2 : C.muted }) + '</g>';
      });
    });
    const bx = 1040, bw = 780;
    s += g(eo(seg(p, 0.4, 0.7)), txt(bx, 400, '클래스별 재현율 (실제 클래스를 맞힌 비율)', { size: 28, w: 600, fill: C.muted }));
    cls.forEach((c, i) => {
      const v = D.ai.recall[c] * 100, e = eo(seg(p, 0.45 + i * 0.12, 0.85 + i * 0.12)), y = 450 + i * 150, hi = c === 'hamster';
      s += txt(bx, y + 40, KO[c], { size: 34, w: 700 }) + txt(1820, y + 46, fmt(v * e, v) + '%', { size: 64, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.ink });
      s += rect(bx, y + 66, bw, 40, C.track) + rect(bx, y + 66, bw * v / 100 * e, 40, hi ? C.a : C.b);
    });
    s += g(eo(seg(p, 0.7, 1)), txt(bx, 800, '햄스터 10장 중 2장을 기니피그로 봤다', { size: 30, w: 700, fill: C.a }) + txt(bx, 844, '→ 오답은 햄스터 쪽에 몰려 있다', { size: 28, fill: C.muted }));
    return s;
  };

  // ── 정답 확률 스트립 플롯
  S.conf = (p) => {
    const pts = D.ai.val_points, x0 = 420, x1 = 1760, X = (v) => x0 + (x1 - x0) * v, lanes = { guinea_pig: 470, hamster: 720 };
    const e0 = eo(seg(p, 0, 0.3));
    let s = rect(x0, 360, X(0.5) - x0, 470, C.track, { op: e0 }) + txt(x0 + 24, 400, '오답 영역 (정답 확률 0.5 미만)', { size: 24, w: 600, fill: C.muted, op: e0 });
    s += line(X(0.5), 350, X(0.5), 840, C.ink, 2, { dash: '10 8' });
    [0, 0.25, 0.5, 0.75, 1].forEach((v) => s += line(X(v), 840, X(v), 852, C.ink, 2) + txt(X(v), 890, v.toFixed(2), { size: 28, num: 1, anchor: 'middle', fill: C.muted }));
    s += line(x0, 840, x1, 840, C.ink, 2) + txt(x1, 940, '정답 클래스 확률 → 1에 가까울수록 확신하고 맞힘', { size: 26, anchor: 'end', fill: C.muted });
    Object.entries(lanes).forEach(([c, y]) => s += txt(100, y + 12, KO[c], { size: 36, w: 700 }) + txt(100, y + 52, `검증 ${D.ai.cm[c + '->guinea_pig'] + D.ai.cm[c + '->hamster']}장`, { size: 24, fill: C.muted }) + line(x0, y, x1, y, C.grid, 1));
    const seen = {};
    pts.forEach((q, i) => {
      const lane = lanes[q.true], k = seen[q.true] = (seen[q.true] || 0) + 1;
      const e = eio(seg(p, 0.15 + i * 0.02, 0.7 + i * 0.02)), x = X(0.5 + (q.p_true - 0.5) * e);
      const y = lane + (q.ok ? ((k % 5) - 2) * 24 : 0);
      if (q.ok) s += circ(x, y, 14, C.b, { op: 0.85, stroke: C.a2, sw: 2 });
      else {
        const lab = esc(q.file.replace('.jpg', ''));
        s += circ(x, y, 20, C.a) + g(seg(e, 0.8, 1), txt(x, y - 40, q.p_true.toFixed(2), { size: 40, w: 600, num: 1, anchor: 'middle', fill: C.a }) + txt(x, y + 58, lab, { size: 22, anchor: 'middle', fill: C.ink, w: 600 }));
      }
    });
    return s;
  };

  // ── 오분류 사진 카드 (사진은 over 층)
  const MIS = () => D.ai.wrong.map((w) => Object.assign({}, w, CFG.misclass[w.file] || { tag: '', note: [] }, { p_true: (D.ai.val_points.find((q) => q.file === w.file) || {}).p_true }));
  S.miss = (p) => {
    let s = '';
    MIS().forEach((m, k) => {
      const x = 100 + k * 593, e = eo(seg(p, 0.06 + k * 0.12, 0.55 + k * 0.12));
      s += g(e, rect(x, 280, 534, 650, C.card, { stroke: C.grid, sw: 1 }) + rect(x + 16, 296, 502, 290, C.track) + txt(x + 267, 450, '사진 불러오는 중', { size: 22, fill: C.muted, anchor: 'middle' }) +
        txt(x + 30, 636, esc(m.file), { size: 28, w: 600, num: 1, fill: C.muted }) +
        txt(x + 30, 686, `정답 ${KO[m.true]} → 예측 ${KO[m.pred]}`, { size: 32, w: 700 }) +
        txt(x + 30, 736, `정답 확률 ${m.p_true.toFixed(2)} · 오답 확신도 ${m.conf.toFixed(2)}`, { size: 26, w: 600, fill: C.a }) +
        line(x + 30, 766, x + 504, 766, C.grid, 1) +
        txt(x + 30, 812, esc(m.tag), { size: 28, w: 700 }) + m.note.map((l, j) => txt(x + 30, 856 + j * 36, esc(l), { size: 25, fill: C.muted })).join(''), up(e, 30));
    });
    return s;
  };
  const OVER = {
    miss: () => MIS().map((m, k) => {
      const x = 100 + k * 593;
      return `<clipPath id="mc${k}"><rect x="${x + 16}" y="296" width="502" height="290"/></clipPath><image class="fade-img" style="animation-delay:${0.5 + k * 0.25}s" href="${esc(m.url)}" x="${x + 16}" y="296" width="502" height="290" preserveAspectRatio="xMidYMid slice" clip-path="url(#mc${k})"><title>${esc(m.alt)}</title></image>`;
    }).join('')
  };

  // ── 정리 (어두운 배경)
  S.end = (p) => {
    const tg = D.joy.triggers[0];
    const cols = [
      { k: 'PART 1  반려인의 고민', big: D.care.neg_pct + '%', h: '질문에 묻은 걱정', l: [`최대 고민 = 질병·동물병원 ${D.care.top_cat_pct.toFixed(1)}%`, `합사·행동 질문 부정 ${D.care.bond_neg_pct}%`] },
      { k: 'PART 2  기니피그의 기쁨', big: String(tg.n), u: '문단', h: `팝코닝 1위 트리거: ${tg.ko}`, l: [`리액션 단어 popcorn ${D.joy.word_popcorn} · wheek ${D.joy.word_wheek}`, `주키니는 ${D.joy.popular.find((v) => v.ko === '주키니').n}회 중 거부 ${D.joy.zucchini_reject}회`] },
      { k: 'PART 3  AI 구별 실험', big: Math.round(D.ai.val_acc * 100) + '%', h: '처음 보는 사진 정확도', l: [`오답 ${D.ai.val_n - D.ai.val_correct}장 중 2장이 햄스터→기니피그`, '몸통이 작거나 가려지면 틀린다'] }
    ];
    let s = '';
    cols.forEach((c, i) => {
      const x = 100 + i * 593, e = eo(seg(p, 0.08 + i * 0.12, 0.6 + i * 0.12));
      s += g(e, rect(x, 290, 534, 4, C.b) + txt(x, 346, c.k, { size: 26, w: 600, fill: C.b }) +
        txt(x - 4, 500, c.big + (c.u ? `<tspan font-size="40" font-family="${K.FONT}" font-weight="700" fill="${C.b}" dx="12" letter-spacing="0">${c.u}</tspan>` : ''), { size: 150, w: 600, num: 1, fill: C.paper, ls: '-3' }) +
        txt(x, 560, esc(c.h), { size: 32, w: 700, fill: C.paper }) + c.l.map((l, j) => txt(x, 608 + j * 40, esc(l), { size: 25, fill: C.b2 })).join(''), up(e, 30));
    });
    const e = eo(seg(p, 0.5, 1));
    s += g(e, line(100, 730, 1820, 730, 'rgba(245,245,248,.22)', 1) + txt(100, 786, '한계와 다음 질문', { size: 28, w: 700, fill: C.b }) +
      CFG.limits.map((l, j) => rect(100, 822 + j * 46, 10, 10, C.b) + txt(126, 834 + j * 46, esc(l), { size: 27, fill: C.paper })).join(''));
    return s;
  };

  // ── 프레임 조립
  const N = SL.length;
  const head = (i, p) => {
    const d = SL[i];
    if (d.id === 'cover') return '';
    const tt = { kicker: esc(d.kicker), title: esc(d.title), source: esc(d.source) };
    return chrome(tt, p, !!d.dark) + txt(1820, 1030, String(i + 1).padStart(2, '0') + ' / ' + N, { size: 26, w: 600, num: 1, fill: d.dark ? C.b : C.muted, anchor: 'end' });
  };
  const body = (i, p) => {
    const d = SL[i];
    return `<rect width="${K.W}" height="${K.H}" fill="${d.dark ? C.dark : C.bg}"/>` + head(i, p) + S[d.id](p, d);
  };
  const svg = (i, p, withOver) => `<svg viewBox="0 0 ${K.W} ${K.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(Array.isArray(SL[i].title) ? SL[i].title.join(' ') : SL[i].title)}"><g class="dyn">${body(i, p)}</g>${withOver && OVER[SL[i].id] ? `<g class="over">${OVER[SL[i].id]()}</g>` : ''}</svg>`;
  window.renderSlide = (i, t) => svg(i, progress(t, true), true); // 외부 캡처용

  // ── 플레이어: 한 장씩 변환 2.2초 후 완료 상태 유지(템플릿 once 모드)
  const q = new URLSearchParams(location.search);
  const stage = document.getElementById('stage'), board = document.getElementById('board'), scrub = document.getElementById('scrub');
  const count = document.getElementById('count'), still = q.get('still') === '1';
  if (q.get('clean') === '1') document.body.classList.add('clean');
  let idx = 0, t0 = 0, raf = 0, dyn = null;
  const parseHash = () => { const n = parseInt(location.hash.slice(1), 10); return n >= 1 && n <= N ? n - 1 : 0; };
  const tick = () => {
    const t = still ? K.BUILD : (performance.now() - t0) / 1000, p = progress(t, true);
    dyn.innerHTML = body(idx, p);
    raf = p < 1 ? requestAnimationFrame(tick) : 0;
  };
  const enter = (i) => {
    idx = (i + N) % N; cancelAnimationFrame(raf);
    stage.innerHTML = svg(idx, 0, true); dyn = stage.querySelector('.dyn');
    count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + N; scrub.value = idx;
    if (location.hash !== '#' + (idx + 1)) history.replaceState(null, '', '#' + (idx + 1));
    document.title = (SL[idx].name || '') + ' · 기니피그·햄스터 데이터 리포트';
    t0 = performance.now(); tick();
  };
  const go = (dlt) => enter(idx + dlt);
  const toggleBoard = (on) => {
    const show = on === undefined ? board.hidden : on;
    board.hidden = !show; document.body.classList.toggle('boarding', show);
    if (show && !board.dataset.ready) {
      document.getElementById('cells').innerHTML = SL.map((d, i) => `<button class="cell" data-i="${i}"><span class="thumb">${svg(i, 1, true)}</span><span class="cap"><b>${String(i + 1).padStart(2, '0')}</b>${esc(d.name)}</span></button>`).join('');
      board.dataset.ready = '1';
    }
  };
  board.addEventListener('click', (e) => { const c = e.target.closest('.cell'); if (c) { toggleBoard(false); enter(+c.dataset.i); } });
  stage.addEventListener('click', (e) => go(e.clientX < innerWidth / 3 ? -1 : 1));
  document.getElementById('prev').onclick = () => go(-1);
  document.getElementById('next').onclick = () => go(1);
  document.getElementById('replay').onclick = () => enter(idx);
  document.getElementById('grid').onclick = () => toggleBoard();
  document.getElementById('full').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  scrub.max = N - 1; scrub.oninput = () => enter(+scrub.value);
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(-1); }
    else if (k === 'Home') enter(0); else if (k === 'End') enter(N - 1);
    else if (k === 'o' || k === 'O') toggleBoard();
    else if (k === 'r' || k === 'R') enter(idx);
    else if (k === 'f' || k === 'F') document.getElementById('full').onclick();
    else if (k === 'Escape' && !board.hidden) toggleBoard(false);
  });
  window.addEventListener('hashchange', () => { const n = parseHash(); if (n !== idx) enter(n); });
  const start = () => enter(parseHash());
  (document.fonts ? Promise.all([document.fonts.load("700 40px 'Pretendard'"), document.fonts.load("600 40px 'Barlow Condensed'")]).then(() => document.fonts.ready) : Promise.resolve()).then(start, start);
})();
