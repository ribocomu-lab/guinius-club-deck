// 공통 엔진: 시간 → 진행도, 이징, SVG 헬퍼, 슬라이드 크롬
(function () {
  const K = window.KIT;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const eo = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const eio = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const back = (t) => { t = clamp(t); const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const r2 = (n) => Math.round(n * 100) / 100;
  // 반복: 0~2.2 변환 → 4.4 완료 유지 → 1.4 복귀. once: 변환 후 완료 상태 유지(PPT 녹화용)
  const progress = (t, once) => {
    if (once) return clamp(t / K.BUILD);
    t = ((t % K.LOOP) + K.LOOP) % K.LOOP;
    if (t < K.BUILD) return t / K.BUILD;
    if (t < K.BUILD + K.HOLD) return 1;
    return 1 - eio((t - K.BUILD - K.HOLD) / K.BACK);
  };
  const fmt = (v, ref) => {
    const s = String(Number(Number(ref).toFixed(2))); const dec = (s.split('.')[1] || '').length;
    const out = v.toFixed(dec);
    return Math.abs(ref) >= 1000 ? Number(out).toLocaleString('en-US', { minimumFractionDigits: dec }) : out;
  };
  const txt = (x, y, s, o = {}) => `<text x="${r2(x)}" y="${r2(y)}" font-family="${o.num ? K.NUM : K.FONT}" font-size="${o.size || 28}" font-weight="${o.w || 400}" fill="${o.fill || K.C.ink}" text-anchor="${o.anchor || 'start'}"${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
  const rect = (x, y, w, h, fill, o = {}) => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(Math.max(0, w))}" height="${r2(Math.max(0, h))}" fill="${fill}"${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}/>`;
  const line = (x1, y1, x2, y2, stroke, sw = 1, o = {}) => `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${stroke}" stroke-width="${sw}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}/>`;
  const circ = (cx, cy, r, fill, o = {}) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(Math.max(0, r))}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 2}"` : ''}${o.op !== undefined ? ` opacity="${r2(clamp(o.op))}"` : ''}/>`;
  // 부분 폴리라인: 전체 길이의 f만큼만 그림
  const partial = (pts, f) => {
    const L = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
    let rem = tot * clamp(f); const out = [pts[0]];
    for (let i = 1; i < pts.length && rem > 0; i++) {
      if (rem >= L[i - 1]) { out.push(pts[i]); rem -= L[i - 1]; }
      else { const k = rem / L[i - 1]; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]); rem = 0; }
    }
    return out.map((p, i) => `${i ? 'L' : 'M'}${r2(p[0])},${r2(p[1])}`).join(' ');
  };
  // 슬라이드 크롬(키커·제목·출처). chrome=0이면 차트만 남김 → PPT에서 제목을 편집 가능한 텍스트로 올릴 때
  const chrome = (d, p, dark) => {
    const ink = dark ? K.C.paper : K.C.ink, sub = dark ? K.C.b : K.C.a, mut = dark ? K.C.b2 : K.C.muted;
    const e = eo(seg(p, 0, 0.35));
    return txt(100, 132, d.kicker, { size: 28, w: 600, fill: sub, op: e }) +
      `<g transform="translate(0 ${r2((1 - e) * 24)})">${txt(100, 214, d.title, { size: 64, w: 700, fill: ink, op: e, ls: '-1.5' })}</g>` +
      line(100, 988, 1820, 988, dark ? 'rgba(245,245,248,.22)' : K.C.grid, 1) +
      txt(100, 1030, d.source, { size: 24, fill: mut });
  };
  window.MK = { K, clamp, eo, eio, back, seg, r2, progress, fmt, txt, rect, line, circ, partial, chrome, FX: {} };
})();
