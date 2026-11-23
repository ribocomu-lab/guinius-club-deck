// 알그린 만물미술트럭 — references/template의 core.js 엔진(progress·이징·SVG 헬퍼·chrome) 위에서 동작
(function () {
  const { K, clamp, eo, eio, seg, r2, txt, rect, line, circ, partial, progress, chrome } = window.MK;
  const C = K.C, SL = window.DECK.slides;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const g = (op, body, tr) => `<g opacity="${r2(clamp(op))}"${tr ? ` transform="${tr}"` : ''}>${body}</g>`;
  const up = (e, d = 24) => `translate(0 ${r2((1 - e) * d)})`;
  const S = {};

  // ── 표지·마무리 (템플릿 12 타이틀 마스크, 두 줄)
  S.cover = S.end = (p, d) => {
    const e1 = eo(seg(p, 0.05, 0.5)), e1b = eo(seg(p, 0.15, 0.6)), e2 = eo(seg(p, 0.35, 0.8)), e3 = eo(seg(p, 0.5, 1)), id = d.id;
    let s = `<defs><clipPath id="${id}1"><rect x="0" y="270" width="1920" height="190"/></clipPath><clipPath id="${id}2"><rect x="0" y="460" width="1920" height="190"/></clipPath><clipPath id="${id}3"><rect x="0" y="690" width="1920" height="70"/></clipPath></defs>`;
    s += txt(100, 132, d.kicker, { size: 28, w: 500, fill: C.b, ls: '4' }) + txt(1820, 132, d.source, { size: 28, num: 1, fill: C.b, anchor: 'end' });
    s += `<g clip-path="url(#${id}1)"><g transform="translate(0 ${r2((1 - e1) * 190)})">${txt(94, 420, d.title[0], { size: 160, w: 800, fill: C.paper, ls: '-6' })}</g></g>`;
    s += `<g clip-path="url(#${id}2)"><g transform="translate(0 ${r2((1 - e1b) * 190)})">${txt(94, 610, d.title[1], { size: 160, w: 800, fill: C.b, ls: '-6' })}</g></g>`;
    s += `<g clip-path="url(#${id}3)"><g transform="translate(0 ${r2((1 - e2) * 70)})">${txt(100, 742, d.sub, { size: 46, w: 500, fill: C.b2 })}</g></g>`;
    return s + rect(100, 810, 1720 * e3, 3, C.b) + txt(100, 890, d.foot, { size: 34, w: 500, fill: C.b, op: e3 });
  };

  // ── 소개
  S.what = (p, d) => {
    const e0 = eo(seg(p, 0.05, 0.45));
    let s = g(e0, rect(100, 290, 680, 640, C.dark) + txt(150, 372, 'ART TRUCK', { size: 28, w: 600, fill: C.b, ls: '4' }) +
      txt(150, 470, '만물미술트럭', { size: 84, w: 800, fill: C.paper, ls: '-3' }) +
      d.card.map((l, i) => txt(150, 560 + i * 52, l, { size: 36, w: 500, fill: C.b2 })).join('') +
      line(150, 790, 730, 790, 'rgba(245,245,248,.22)', 1) + txt(150, 860, d.foot, { size: 34, w: 700, fill: C.b }), up(e0, 30));
    d.rows.forEach((q, i) => {
      const e = eo(seg(p, 0.25 + i * 0.14, 0.65 + i * 0.14)), y = 290 + i * 215;
      s += g(e, line(880, y, 1820, y, C.grid, 2) + txt(880, y + 142, i + 1, { size: 120, w: 600, num: 1, fill: i === 2 ? C.a : C.a2 }) +
        txt(1000, y + 92, q[0], { size: 54, w: 700 }) + txt(1000, y + 154, q[1], { size: 36, fill: C.muted }), `translate(${r2((1 - e) * 40)} 0)`);
    });
    return s;
  };

  // ── 상품 (템플릿 06 트리맵 등장 + 10 숫자 카운트)
  S.goods = (p, d) => {
    let s = '';
    [[100, C.dark, C.paper, C.b2], [964, C.b, C.ink, C.dark]].forEach(([x, bg, fg, sub], i) => {
      const e = eo(seg(p, 0.05 + i * 0.15, 0.5 + i * 0.15)), it = d.items[i];
      s += rect(x, 290 + (1 - e) * 400, 856, 400 * e, bg);
      s += g(seg(p, 0.35 + i * 0.15, 0.6 + i * 0.15), txt(x + 50, 360, it[0], { size: 30, w: 600, fill: sub }) +
        txt(x + 50, 570, it[1], { size: 64, w: 800, fill: fg, ls: '-2' }) + txt(x + 50, 635, it[2], { size: 36, w: 500, fill: sub }));
    });
    const e = eo(seg(p, 0.4, 1));
    s += txt(100, 900, `${Math.round(9999 * (1 - eio(seg(p, 0.35, 0.95)))).toLocaleString('en-US')}<tspan font-size="64" font-family="${K.FONT}" font-weight="700" dx="10">원</tspan>`, { size: 220, w: 600, num: 1, fill: C.a });
    return s + g(e, line(964, 740, 1820, 740, C.grid, 2) + txt(964, 820, d.foot[0], { size: 36, w: 600, fill: C.muted }) + txt(964, 885, d.foot[1], { size: 52, w: 700 }));
  };

  // ── 3단계 (템플릿 09 단계, 셰브론으로 이어짐)
  S.steps = (p, d) => {
    const bg = [C.b2, C.b, C.a], fg = [C.ink, C.ink, C.paper], W = 600, H = 200, T = 60;
    return d.steps.map((q, i) => {
      const e = eo(seg(p, 0.08 + i * 0.2, 0.5 + i * 0.2)), x = 100 + i * 560, x2 = x + (W - T) * e, n = i ? T : 0;
      let s = `<path d="M${x},320 L${r2(x2)},320 L${r2(x2 + T * e)},${320 + H / 2} L${r2(x2)},${320 + H} L${x},${320 + H} L${x + n * e},${320 + H / 2} Z" fill="${bg[i]}" opacity="${e > 0 ? 1 : 0}"/>`;
      s += g(seg(p, 0.25 + i * 0.2, 0.5 + i * 0.2), txt(x + 50 + n, 452, `STEP ${i + 1}`, { size: 80, w: 600, num: 1, fill: fg[i] }));
      const e2 = eo(seg(p, 0.3 + i * 0.2, 0.6 + i * 0.2));
      return s + g(e2, txt(x, 690, q[0], { size: 110, w: 800, fill: i === 2 ? C.a : C.ink, ls: '-4' }) + txt(x, 780, q[1], { size: 40, w: 500, fill: C.muted }) + txt(x, 836, q[2], { size: 40, w: 700 }), up(e2));
    }).join('');
  };

  // ── 라면 예시 (템플릿 11 상승 라인)
  S.ramen = (p, d) => {
    const pts = [[300, 640], [740, 590], [1180, 540], [1620, 490]], f = eio(seg(p, 0.08, 0.85));
    let s = [400, 560, 720, 880].map((y) => line(100, y, 1820, y, 'rgba(245,245,248,.1)', 1)).join('') + `<path d="${partial(pts, f)}" fill="none" stroke="${C.b2}" stroke-width="6"/>`;
    s += txt(100, 920, d.foot, { size: 46, w: 700, fill: C.b, op: eo(seg(p, 0.7, 1)) });
    pts.forEach(([x, y], i) => {
      const e = eo(seg(f, i / 3 - 0.02, i / 3 + 0.1)) , last = i === 3, q = d.pts[i], op = i === 3 ? eo(seg(p, 0.8, 1)) : i === 0 ? eo(seg(p, 0.08, 0.25)) : e;
      s += circ(x, y, (last ? 18 : 13) * op, last ? C.paper : C.dark, { stroke: C.b2, sw: 5 });
      s += g(op, txt(x, y - 110, i + 1, { size: 44, w: 600, num: 1, fill: C.b, anchor: 'middle' }) + txt(x, y - 46, q[0], { size: 64, w: 800, fill: last ? C.b : C.paper, anchor: 'middle', ls: '-2' }) +
        q[1].map((l, k) => txt(x, y + 92 + k * 48, l, { size: 34, w: k ? 400 : 600, fill: k ? C.b2 : C.paper, anchor: 'middle' })).join(''), up(op));
    });
    return s;
  };

  // ── 확인 사항
  S.check = (p, d) => d.items.map((q, i) => {
    const e = eo(seg(p, 0.06 + i * 0.09, 0.5 + i * 0.09)), x = i % 2 ? 1000 : 100, y = 290 + Math.floor(i / 2) * 218;
    return rect(x, y, 820 * e, 3, i % 2 ? C.b : C.a) + g(e, txt(x, y + 136, String(i + 1).padStart(2, '0'), { size: 100, w: 600, num: 1, fill: i % 2 ? C.a2 : C.a }) +
      txt(x + 140, y + 92, q[0], { size: 48, w: 700, ls: '-1' }) + txt(x + 140, y + 148, q[1], { size: 32, fill: C.muted }), up(e));
  }).join('');

  const N = SL.length;
  const head = (i, p) => {
    const d = SL[i];
    if (d.id === 'cover' || d.id === 'end') return '';
    const tt = { kicker: esc(d.kicker), title: esc(d.title), source: esc(d.source) };
    return chrome(tt, p, !!d.dark) + txt(1820, 1030, String(i + 1).padStart(2, '0') + ' / ' + N, { size: 26, w: 600, num: 1, fill: d.dark ? C.b : C.muted, anchor: 'end' });
  };
  const body = (i, p) => {
    const d = SL[i];
    return `<rect width="${K.W}" height="${K.H}" fill="${d.dark ? C.dark : C.bg}"/>` + head(i, p) + S[d.id](p, d);
  };
  const svg = (i, p, withOver) => `<svg viewBox="0 0 ${K.W} ${K.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(Array.isArray(SL[i].title) ? SL[i].title.join(' ') : SL[i].title)}"><g class="dyn">${body(i, p)}</g>${withOver ? '' : ''}</svg>`;
  window.renderSlide = (i, t) => svg(i, progress(t, true), true); // 외부 캡처용

  // ── 플레이어: 한 장씩 변환 2.2초 후 완료 상태 유지(템플릿 once 모드)
  const q = new URLSearchParams(location.search);
  const stage = document.getElementById('stage'), board = document.getElementById('board'), scrub = document.getElementById('scrub');
  const count = document.getElementById('count'), still = q.get('still') === '1';
  if (q.get('clean') === '1') document.body.classList.add('clean');
  const notes = document.getElementById('notes');
  document.getElementById('note').onclick = () => { notes.hidden = !notes.hidden; };
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
    document.title = (SL[idx].name || '') + ' · 알그린 만물미술트럭';
    notes.textContent = SL[idx].note; t0 = performance.now(); tick();
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
    if (k === ' ' && e.target.tagName === 'BUTTON') return;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(-1); }
    else if (k === 'Home') enter(0); else if (k === 'End') enter(N - 1);
    else if (k === 'o' || k === 'O') toggleBoard();
    else if (k === 'n' || k === 'N') notes.hidden = !notes.hidden;
    else if (k === 'r' || k === 'R') enter(idx);
    else if (k === 'f' || k === 'F') document.getElementById('full').onclick();
    else if (k === 'Escape' && !board.hidden) toggleBoard(false);
  });
  window.addEventListener('hashchange', () => { const n = parseHash(); if (n !== idx) enter(n); });
  const start = () => enter(parseHash());
  (document.fonts ? Promise.all([document.fonts.load("700 40px 'Pretendard'"), document.fonts.load("600 40px 'Barlow Condensed'")]).then(() => document.fonts.ready) : Promise.resolve()).then(start, start);
})();
