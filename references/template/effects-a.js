(function () {
  const { K, clamp, eo, back, seg, r2, fmt, txt, rect, line, circ, partial, FX } = window.MK;
  const C = K.C;

  // 01 꺾은선 드로잉 — 선이 그려지고 점이 차례로 찍히며 수치가 올라감
  FX['01'] = (p, d) => {
    const x0 = 220, x1 = 1700, yb = 900, yt = 330, n = d.values.length;
    const X = (i) => x0 + (x1 - x0) * i / (n - 1), Y = (v) => yb - (yb - yt) * v / d.max;
    let s = '';
    for (let g = 0; g <= d.max; g += 20) s += line(140, Y(g), 1780, Y(g), g ? C.track : C.grid, g ? 1 : 2) + txt(120, Y(g) + 9, g + '%', { size: 24, num: 1, fill: C.muted, anchor: 'end' });
    const pts = d.values.map((v, i) => [X(i), Y(v)]);
    const f = eo(seg(p, 0.05, 0.85));
    const area = eo(seg(p, 0.55, 1));
    s += `<path d="M${X(0)},${yb} ${pts.map((q) => `L${q[0]},${q[1]}`).join(' ')} L${X(n - 1)},${yb} Z" fill="${C.b2}" opacity="${r2(area * 0.8)}"/>`;
    s += `<path d="${partial(pts, f)}" fill="none" stroke="${C.a}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
    pts.forEach((q, i) => {
      const at = i / (n - 1) * 0.86, k = back(seg(f, at - 0.02, at + 0.14)), last = i === n - 1;
      s += last ? circ(q[0], q[1], 15 * k, C.a) : circ(q[0], q[1], 10 * k, C.bg, { stroke: C.a, sw: 4 });
      s += txt(q[0], q[1] - (last ? 36 : 28), fmt(d.values[i] * clamp(k), d.values[i]) + d.unit, { size: last ? 56 : 38, w: 600, num: 1, anchor: 'middle', fill: last ? C.a : C.ink, op: k });
      s += txt(q[0], 948, d.labels[i], { size: 28, num: 1, anchor: 'middle', fill: C.muted });
    });
    return s;
  };

  // 02 가로 막대 성장 — 위에서부터 순서대로 막대가 뻗음
  FX['02'] = (p, d) => {
    let s = ''; const bx = 760, bw = 880, h = 50, gap = 124, y0 = 320;
    d.rows.forEach((r, i) => {
      const y = y0 + i * gap, e = eo(seg(p, 0.08 + i * 0.09, 0.62 + i * 0.09)), hi = i === d.highlight;
      s += txt(100, y + 22, r[0], { size: 32, w: 700 }) + txt(100, y + 60, r[1], { size: 24, fill: hi ? C.a : C.muted, w: hi ? 600 : 400 });
      s += rect(bx, y, bw, h, C.track) + rect(bx, y, bw * r[2] / 100 * e, h, hi ? C.a : C.b);
      s += txt(1820, y + 42, fmt(r[2] * e, r[2]) + d.unit, { size: 60, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.ink });
    });
    return s;
  };

  // 03 덤벨 비교 — 전년 점에서 올해 점까지 선이 늘어나고 증감이 표시됨
  FX['03'] = (p, d) => {
    let s = ''; const x0 = 330, x1 = 1600, y0 = 330, gap = 74, X = (v) => x0 + (x1 - x0) * v / d.max;
    s += circ(1180, 270, 11, C.bg, { stroke: C.muted, sw: 3 }) + txt(1202, 279, d.from, { size: 26, num: 1 }) + circ(1320, 270, 13, C.a2) + txt(1344, 279, d.to, { size: 26, num: 1 }) + txt(1820, 279, '증감', { size: 26, fill: C.muted, anchor: 'end' });
    [0, 20, 40, 60, 80].forEach((g) => s += txt(X(g), 948, g + '%', { size: 24, num: 1, fill: C.muted, anchor: 'middle' }));
    s += line(x0, 912, x1, 912, C.grid);
    d.rows.forEach((r, i) => {
      const y = y0 + i * gap, hi = d.highlight.includes(i), e = eo(seg(p, 0.1 + i * 0.06, 0.62 + i * 0.06));
      const xa = X(r[1]), xb = X(r[1] + (r[2] - r[1]) * e);
      s += txt(100, y + 10, r[0], { size: 30, w: hi ? 700 : 400 }) + line(x0, y, x1, y, C.track, 2);
      s += line(xa, y, xb, y, hi ? C.a2 : C.b, hi ? 8 : 6);
      s += circ(xa, y, 11, C.bg, { stroke: C.muted, sw: 3, op: eo(seg(p, 0, 0.2)) });
      const k = back(seg(e, 0.7, 1)); s += circ(xb, y, (hi ? 16 : 14) * k, hi ? C.a : C.a2);
      s += txt(xb + 28, y + 13, fmt(r[2] * e, r[2]) + '%', { size: hi ? 44 : 36, w: 600, num: 1, fill: hi ? C.a : C.ink, op: seg(e, 0.2, 0.6) });
      s += txt(1820, y + 13, '+' + fmt((r[2] - r[1]) * e, r[2] - r[1]) + '%p', { size: hi ? 40 : 34, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.muted, op: seg(e, 0.5, 1) });
    });
    return s;
  };

  // 04 와플 채우기 — 100칸이 순서대로 채워짐
  FX['04'] = (p, d) => {
    let s = ''; const cell = 46, g = 6;
    d.groups.forEach((gr, j) => {
      const ox = 180 + j * 860, oy = 380, n = Math.round(gr[1]), hi = j === d.groups.length - 1;
      const f = eo(seg(p, 0.1 + j * 0.12, 0.8 + j * 0.12));
      s += txt(ox, 330, gr[0], { size: 36, w: hi ? 700 : 500 });
      s += txt(ox + 10 * (cell + g) - g, 336, fmt(gr[1] * f, gr[1]) + '%', { size: 84, w: 600, num: 1, anchor: 'end', fill: hi ? C.a : C.ink });
      for (let i = 0; i < 100; i++) {
        const x = ox + (i % 10) * (cell + g), y = oy + Math.floor(i / 10) * (cell + g);
        const on = i < n * f + 0.001 && i < n, pop = on ? back(clamp(n * f - i)) : 1;
        const sz = cell * (on ? pop : 1), off = (cell - sz) / 2;
        s += rect(x + off, y + off, sz, sz, on ? (hi ? C.a : C.b) : C.track);
      }
    });
    s += txt(1820, 940, d.caption, { size: 26, fill: C.muted, anchor: 'end' });
    return s;
  };

  // 05 링 게이지 — 원호가 값까지 차오름
  FX['05'] = (p, d) => {
    let s = ''; const r = 170, sw = 34, L = 2 * Math.PI * r;
    d.rings.forEach((g, i) => {
      const cx = 400 + i * 560, cy = 620, hi = i === d.highlight, e = eo(seg(p, 0.08 + i * 0.12, 0.75 + i * 0.12));
      s += circ(cx, cy, r, 'none', { stroke: C.track, sw });
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hi ? C.a : C.b}" stroke-width="${sw}" stroke-dasharray="${r2(L * g[1] / 100 * e)} ${r2(L)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      s += txt(cx, cy + 34, fmt(g[1] * e, g[1]), { size: 110, w: 600, num: 1, anchor: 'middle', fill: hi ? C.a : C.ink });
      s += txt(cx, cy + r + 90, g[0], { size: 40, w: hi ? 700 : 500, anchor: 'middle' });
    });
    return s;
  };

  // 06 트리맵 등장 — 면적 비례 타일이 큰 것부터 튀어나옴 (squarify 간이 배치)
  FX['06'] = (p, d) => {
    const X0 = 100, Y0 = 290, W = 1720, H = 650, tot = d.items.reduce((a, b) => a + b[1], 0);
    const fills = [C.dark, C.a, C.a2, C.a2, C.b, C.b, C.b2, C.b2];
    const R = []; // 1열: 첫 항목 / 나머지: 2열 세로, 3열 소형 묶음
    const w0 = W * d.items[0][1] / tot; R.push([X0, Y0, w0, H]);
    const rest = tot - d.items[0][1], w1 = W - w0, big = d.items[1][1];
    const h1 = H * big / rest; R.push([X0 + w0, Y0, w1, h1]);
    const r2t = d.items.slice(2).reduce((a, b) => a + b[1], 0), mid = d.items[2][1] + d.items[3][1];
    const wm = w1 * mid / r2t; let x = X0 + w0;
    [2, 3].forEach((i) => { const w = wm * d.items[i][1] / mid; R.push([x, Y0 + h1, w, H - h1]); x += w; });
    const sm = r2t - mid; let y = Y0 + h1;
    d.items.slice(4).forEach((it) => { const h = (H - h1) * it[1] / sm; R.push([x, y, W - (x - X0), h]); y += h; });
    let s = '';
    R.forEach(([rx, ry, rw, rh], i) => {
      const k = back(seg(p, i * 0.07, 0.42 + i * 0.07)), cx = rx + rw / 2, cy = ry + rh / 2, it = d.items[i], light = i >= 4 || i === 2;
      const ink = light ? C.ink : C.paper, big = i < 2, e = clamp(k);
      s += `<g transform="translate(${r2(cx)} ${r2(cy)}) scale(${r2(Math.max(0.001, k))}) translate(${r2(-cx)} ${r2(-cy)})">`;
      s += rect(rx + 3, ry + 3, rw - 6, rh - 6, fills[i]);
      if (rh > 120) { s += txt(rx + 30, ry + (big ? 64 : 50), it[0], { size: big ? 40 : 30, w: 700, fill: ink }) + txt(rx + 30, ry + rh - 34, fmt(it[1] * e, it[1]) + d.unit, { size: big ? (i ? 80 : 128) : 50, w: 600, num: 1, fill: ink }); }
      else { s += txt(rx + 22, cy + 10, it[0], { size: 26, fill: ink }) + txt(rx + rw - 22, cy + 11, fmt(it[1] * e, it[1]) + d.unit, { size: 30, w: 600, num: 1, fill: ink, anchor: 'end' }); }
      s += '</g>';
    });
    return s;
  };
})();
