(function () {
  const { K, clamp, eo, eio, back, seg, r2, fmt, txt, rect, line, circ, partial, FX } = window.MK;
  const C = K.C;

  // 07 기울기 차트 — 전년 점에서 올해 점으로 선이 뻗음. 증가=강조색, 감소=회색
  FX['07'] = (p, d) => {
    let s = ''; const xa = 700, xb = 1260, yt = 330, yb = 900, Y = (v) => yb - (yb - yt) * v / d.max;
    s += line(xa, yt - 20, xa, yb + 20, C.grid, 2) + line(xb, yt - 20, xb, yb + 20, C.grid, 2);
    s += txt(xa, 290, d.from, { size: 32, num: 1, anchor: 'middle', fill: C.muted }) + txt(xb, 290, d.to, { size: 32, w: 600, num: 1, anchor: 'middle', fill: C.a });
    d.rows.forEach((r, i) => {
      const up = r[2] >= r[1], col = up ? C.a : C.b, e = eio(seg(p, 0.1 + i * 0.08, 0.7 + i * 0.08));
      const ya = Y(r[1]), yb2 = ya + (Y(r[2]) - ya) * e, xe = xa + (xb - xa) * e;
      s += line(xa, ya, xe, yb2, up ? C.a : C.grid, up ? 6 : 4);
      s += circ(xa, ya, 9, up ? C.a : C.muted);
      s += txt(xa - 30, ya + 10, `${r[0]}  ${r[1].toFixed(1)}%`, { size: 30, w: up ? 700 : 400, anchor: 'end' });
      const k = back(seg(e, 0.85, 1));
      s += circ(xe, yb2, 12 * k, up ? C.a : C.muted);
      const ratio = r[2] / r[1] >= 2 ? `  ×${(r[2] / r[1]).toFixed(1)}` : '';
      s += txt(xb + 34, yb2 + 14, r[2].toFixed(1) + '%' + ratio, { size: up ? 44 : 36, w: 600, num: 1, fill: up ? C.a : C.muted, op: k });
    });
    return s;
  };

  // 08 세로 막대 성장 — 바닥에서 막대가 솟고 최고값이 강조됨
  FX['08'] = (p, d) => {
    let s = ''; const n = d.values.length, x0 = 260, x1 = 1660, yb = 900, hmax = 560, bw = 170;
    s += line(160, yb, 1760, yb, C.grid, 2);
    d.values.forEach((v, i) => {
      const cx = x0 + (x1 - x0) * i / (n - 1), hi = i === d.highlight, e = eo(seg(p, 0.08 + i * 0.08, 0.7 + i * 0.08));
      const h = hmax * v / d.max * e;
      s += rect(cx - bw / 2, yb - h, bw, h, hi ? C.a : C.b);
      s += txt(cx, yb - h - 22, fmt(v * e, v) + d.unit, { size: hi ? 60 : 44, w: 600, num: 1, anchor: 'middle', fill: hi ? C.a : C.ink, op: seg(e, 0.1, 0.4) });
      s += txt(cx, 948, d.labels[i], { size: 30, w: 600, anchor: 'middle' });
    });
    return s;
  };

  // 09 단계 퍼널 — 위에서부터 한 단씩 내려앉음
  FX['09'] = (p, d) => {
    let s = ''; const cx = 960, top = 300, h = 140, g = 12, w0 = 1400, dw = 180;
    const fills = [C.b2, C.b, C.a2, C.dark];
    d.steps.forEach((st, i) => {
      const e = eo(seg(p, 0.05 + i * 0.13, 0.5 + i * 0.13)), y = top + i * (h + g) - (1 - e) * 40;
      const wt = w0 - i * dw, wb = wt - dw, hi = i === d.highlight, ink = i >= 2 ? C.paper : C.ink;
      s += `<g opacity="${r2(e)}"><path d="M${cx - wt / 2},${r2(y)} L${cx + wt / 2},${r2(y)} L${cx + wb / 2},${r2(y + h)} L${cx - wb / 2},${r2(y + h)} Z" fill="${fills[i]}"/>`;
      s += txt(cx - wb / 2 + 30, y + h / 2 + 12, st[0], { size: 36, w: hi ? 700 : 500, fill: ink });
      s += txt(cx + wb / 2 - 30, y + h / 2 + 22, fmt(st[1] * e, st[1]) + '%', { size: hi ? 72 : 60, w: 600, num: 1, anchor: 'end', fill: ink }) + '</g>';
    });
    return s;
  };

  // 10 숫자 카운트업 — 큰 수치가 올라가고 구성 막대가 이어 붙음
  FX['10'] = (p, d) => {
    let s = ''; const e = eo(seg(p, 0, 0.7));
    s += txt(100, 330, d.label, { size: 36, w: 600, fill: C.muted });
    s += txt(90, 640, fmt(d.big * e, d.big) + d.unit, { size: 340, w: 600, num: 1, fill: C.a, ls: '-4' });
    let x = 100; const W = 1720, fills = [C.dark, C.a2, C.b];
    s += rect(100, 720, W, 80, C.track);
    d.parts.forEach((pt, i) => {
      const k = eo(seg(p, 0.3 + i * 0.14, 0.62 + i * 0.14)), w = W * pt[1] / 100;
      s += rect(x, 720, w * k, 80, fills[i]);
      s += rect(x, 842, 22, 22, fills[i], { op: k }) + txt(x + 34, 862, `${pt[0]} ${pt[1]}%`, { size: 28, op: k });
      x += w;
    });
    return s;
  };

  // 11 순위 상승 라인 (어두운 배경) — 기준선이 먼저 깔리고 선이 올라가며 순위 배지가 찍힘
  FX['11'] = (p, d) => {
    let s = ''; const x0 = 300, x1 = 1620, yb = 900, yt = 330, n = d.values.length;
    const X = (i) => x0 + (x1 - x0) * i / (n - 1), Y = (v) => yb - (yb - yt) * v / d.max;
    for (let g = 0; g <= 40; g += 10) s += line(140, Y(g), 1780, Y(g), 'rgba(245,245,248,.14)', g ? 1 : 2);
    const rf = eo(seg(p, 0, 0.35));
    s += line(140, Y(d.ref), 140 + 1640 * rf, Y(d.ref), C.b, 3, { dash: '12 10' }) + txt(1780, Y(d.ref) + 44, d.refLabel, { size: 28, fill: C.b, anchor: 'end', op: rf });
    const pts = d.values.map((v, i) => [X(i), Y(v)]), f = eo(seg(p, 0.2, 0.9));
    s += `<path d="${partial(pts, f)}" fill="none" stroke="${C.b2}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`;
    pts.forEach((q, i) => {
      const at = i / (n - 1) * 0.85, k = back(seg(f, at - 0.02, at + 0.15)), last = i === n - 1;
      s += last ? circ(q[0], q[1], 18 * k, C.b2) : circ(q[0], q[1], 13 * k, C.dark, { stroke: C.b2, sw: 5 });
      s += txt(q[0], q[1] + (last ? -44 : 64), fmt(d.values[i] * clamp(k), d.values[i]) + '%', { size: last ? 72 : 50, w: 600, num: 1, anchor: 'middle', fill: C.paper, op: k });
      const bw = 100, by = q[1] - (last ? 150 : 90);
      s += `<g opacity="${r2(clamp(k))}">` + rect(q[0] - bw / 2, by - 36, bw, 48, last ? C.b2 : 'none', { stroke: C.b, sw: last ? 0 : 1.5 }) + txt(q[0], by - 3, d.ranks[i], { size: 28, w: last ? 700 : 400, anchor: 'middle', fill: last ? C.dark : C.b2 }) + '</g>';
      s += txt(q[0], 948, d.labels[i], { size: 28, anchor: 'middle', fill: C.b2 });
    });
    return s;
  };

  // 12 타이틀 마스크 (어두운 배경) — 제목이 아래에서 밀려 올라오고 밑줄이 그어짐. 표지·섹션용
  FX['12'] = (p, d) => {
    const e1 = eo(seg(p, 0.05, 0.55)), e2 = eo(seg(p, 0.3, 0.75)), e3 = eo(seg(p, 0.45, 1));
    let s = `<defs><clipPath id="m12"><rect x="0" y="330" width="1920" height="190"/></clipPath><clipPath id="m12b"><rect x="0" y="560" width="1920" height="80"/></clipPath></defs>`;
    s += txt(100, 132, d.kicker, { size: 28, w: 500, fill: C.b, ls: '4' }) + txt(1820, 132, d.source, { size: 28, num: 1, fill: C.b, anchor: 'end' });
    s += `<g clip-path="url(#m12)"><g transform="translate(0 ${r2((1 - e1) * 190)})">${txt(96, 478, d.title, { size: 150, w: 800, fill: C.paper, ls: '-5' })}</g></g>`;
    s += `<g clip-path="url(#m12b)"><g transform="translate(0 ${r2((1 - e2) * 80)})">${txt(100, 620, d.sub, { size: 48, w: 500, fill: C.b })}</g></g>`;
    s += rect(100, 700, 1720 * e3, 3, C.b);
    return s;
  };
})();
