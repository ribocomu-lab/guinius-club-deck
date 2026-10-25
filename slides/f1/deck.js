// F1 레이스 전략 × 팬덤 여론 덱 — 슬라이드 마크업 생성 · Chart.js 차트 · 진입 모션 (화이트 테마)
// 수치는 전부 deck-data.js(window.F1, 자동 생성)에서 읽는다. 슬라이드 전환·스케일·키보드는 references/design/slide-engine.js.
(function () {
  const D = window.F1, M = D.meta;
  const TEAM_VAR = { 'Red Bull': 'redbull', Ferrari: 'ferrari', Mercedes: 'mercedes', McLaren: 'mclaren', 'Aston Martin': 'astonmartin',
    Alpine: 'alpine', Williams: 'williams', RB: 'rb', Sauber: 'sauber', Haas: 'haas' };
  const css = getComputedStyle(document.documentElement);
  const cv = (n) => css.getPropertyValue(n).trim();
  const teamColor = (t) => cv('--team-' + TEAM_VAR[t]);
  // 화이트 배경용 팔레트 — 차트·SVG에서 쓰는 색은 여기서만 정한다
  const P = { ink: '#111827', ink2: '#374151', sub: '#6B7280', line: '#E5E7EB', grid: 'rgba(17,24,39,0.06)', card: '#FFFFFF',
    red: '#E10600', teal: '#0D9488', tealFill: '#14B8A6', amber: '#F59E0B', purple: '#9333EA' };
  const T = Object.fromEntries(D.teams.map((t) => [t.team, t]));
  const nf = (v, d = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sg = (v, d = 2) => (v > 0 ? '+' : v < 0 ? '−' : '') + nf(Math.abs(v), d);
  const pv = (p) => p < 0.001 ? 'p < 0.001' : 'p = ' + (p < 0.01 ? p.toFixed(3) : p.toFixed(2));
  const tag = (t) => `<span class="team-tag" style="--tc:${teamColor(t)}">${t}</span>`;
  const r0 = (v) => Math.round(v);
  // 카운트업 숫자: data-count 값까지 템플릿 eo 이징으로 증가
  const count = (v, d = 0, pre = '', suf = '') => `<span data-count="${v}" data-dec="${d}" data-pre="${pre}" data-suf="${suf}">${pre}${nf(v, d)}${suf}</span>`;
  const N = 12;

  const slides = [];
  const charts = {};   // 슬라이드 번호 → 차트 생성 함수 목록
  const S = (kicker, title, body, source, opt = {}) => slides.push({ kicker, title, body, source, ...opt });

  // ── 스토리라인: 시작 → ① 피트 → 순위 → ② 실수 → 여론 → ③ 정리. 오른쪽 위 막대로 현재 위치를 보여 준다
  const SECTORS = ['시작', '① 피트 → 순위', '② 실수 → 여론', '③ 정리'];
  const sectorBar = (cur) => `<div class="sectors a" style="--d:.05s" aria-label="이야기 위치: ${SECTORS[cur]}">${SECTORS.map((t, j) =>
    `<div class="sec${j === cur ? ' on' : j < cur ? ' done' : ''}"><span>${t}</span><i></i></div>`).join('')}</div>`;

  const a = D.h1a, b = D.h1b, se = D.sent, dist = se.dist, c1 = D.corr.err_trust;
  const rb = T['Red Bull'], hs = T.Haas, ml = T.McLaren, fe = T.Ferrari, sa = T.Sauber, sb = D.sauber;
  const gap = r0((hs.delay - rb.delay) * 10) / 10;

  // ── 01 표지
  slides.push({ raw: `
    <svg class="a" style="--d:.1s;position:absolute;left:0;top:640px" width="1920" height="260" viewBox="0 0 1920 260" aria-hidden="true">
      <path class="line-draw" style="--len:2600;--d:.2s" d="M0 170 L220 170 L260 120 L300 200 L340 90 L380 170 L700 170 L730 150 L760 175 L880 175 L920 70 L960 215 L1000 150 L1040 172 L1920 172" fill="none" stroke="${P.tealFill}" stroke-width="3" opacity=".8"/>
      <path class="line-draw" style="--len:2600;--d:.5s" d="M0 205 L500 205 L540 188 L580 208 L1920 208" fill="none" stroke="${P.red}" stroke-width="2" opacity=".6"/>
    </svg>
    <svg class="car" style="position:absolute;left:1120px;top:618px" width="700" height="202" viewBox="0 0 900 260" aria-label="F1 레이스카 측면 실루엣" role="img">
      <g class="speed" stroke-linecap="round" opacity=".55">
        <line x1="-260" y1="120" x2="40" y2="120" stroke="${P.tealFill}" stroke-width="3"/><line x1="-180" y1="150" x2="60" y2="150" stroke="#9CA3AF" stroke-width="2"/><line x1="-320" y1="185" x2="20" y2="185" stroke="${P.red}" stroke-width="3"/>
      </g>
      <ellipse cx="440" cy="236" rx="360" ry="10" fill="#111827" opacity=".12"/>
      <rect x="66" y="52" width="118" height="16" rx="3" fill="${P.red}"/><rect x="72" y="74" width="100" height="9" rx="2" fill="#1F2937" stroke="${P.red}" stroke-width="2"/>
      <path d="M78 52 L98 52 L112 176 L92 176 Z" fill="#1F2937" stroke="#374151" stroke-width="2"/>
      <path d="M120 206 L770 206 L780 214 L120 214 Z" fill="#0B0D12"/>
      <path d="M108 168 L150 126 L290 104 L352 66 L404 64 L424 96 L470 100 L530 112 L650 142 L770 162 L800 172 L772 182 L600 182 L520 196 L300 200 L130 198 Z" fill="#1F2937" stroke="#4B5563" stroke-width="2"/>
      <path d="M232 156 Q 300 124 446 134 L530 152 L526 194 L246 196 Z" fill="#374151"/>
      <path d="M250 170 L520 166" stroke="${P.tealFill}" stroke-width="4"/>
      <path d="M150 126 L290 104 L352 66" fill="none" stroke="${P.red}" stroke-width="4"/>
      <text x="330" y="160" font-family="JetBrains Mono, monospace" font-weight="700" font-size="30" fill="#F9FAFB">0.5</text>
      <circle cx="456" cy="90" r="15" fill="${P.tealFill}"/><rect x="448" y="84" width="20" height="7" rx="2" fill="#0B0D12"/>
      <path d="M412 100 Q 462 58 528 104" fill="none" stroke="#9CA3AF" stroke-width="7" stroke-linecap="round"/>
      <path d="M690 198 L868 198 L868 208 L690 208 Z" fill="${P.red}"/><path d="M700 188 L860 190 L860 196 L700 196 Z" fill="#1F2937" stroke="${P.red}" stroke-width="1.5"/>
      <rect x="852" y="166" width="14" height="44" rx="2" fill="#1F2937" stroke="#374151" stroke-width="2"/>
      <g class="wheel"><circle cx="172" cy="178" r="56" fill="#0B0D12"/><circle cx="172" cy="178" r="44" fill="none" stroke="${P.red}" stroke-width="4"/><circle cx="172" cy="178" r="28" fill="#374151"/><path d="M172 152 L172 204 M146 178 L198 178" stroke="#9CA3AF" stroke-width="4"/></g>
      <g class="wheel"><circle cx="694" cy="182" r="50" fill="#0B0D12"/><circle cx="694" cy="182" r="39" fill="none" stroke="${P.red}" stroke-width="4"/><circle cx="694" cy="182" r="25" fill="#374151"/><path d="M694 159 L694 205 M671 182 L717 182" stroke="#9CA3AF" stroke-width="4"/></g>
    </svg>
    <div class="kicker a" style="--d:0s"><span class="tag">F1 2022–2024</span>레이스 전략 × 팬심 데이터 분석</div>
    <h1 style="position:absolute;left:100px;top:230px;margin:0;font:700 150px/1.02 var(--display);letter-spacing:-.03em;color:var(--f1-text-primary)">
      <span class="mask"><span style="--d:.1s"><span class="mono" style="color:var(--f1-red)">0.5</span>초의</span></span>
      <span class="mask"><span style="--d:.25s">나비효과</span></span>
    </h1>
    <p class="txt a" style="--d:.6s;position:absolute;left:100px;top:600px;font-size:34px;color:var(--f1-text-secondary)">피트스톱 0.5초가 순위를 바꾸고, 팬심은 <b>기대</b>를 따라 움직인다</p>
    <div style="position:absolute;right:100px;top:120px;width:520px;display:flex;flex-direction:column;gap:16px">
      <div class="hud-card a" style="--d:.35s;--line:var(--f1-red)">
        <div class="label">데이터 ① 경기 기록</div>
        <div class="mid" style="margin:12px 0 4px">${count(M.stops)}<span class="unit">번의 피트스톱</span></div>
      </div>
      <div class="hud-card a" style="--d:.5s">
        <div class="label">데이터 ② 팬·미디어 글</div>
        <div class="mid" style="margin:12px 0 4px">${count(M.docs)}<span class="unit">건 · ${nf(M.sentences)}문장</span></div>
      </div>
    </div>
    <div class="footer a" style="--d:.8s"><span>Kaggle(F1 경기 기록) · Firecrawl(F1Technical · Autosport · RaceFans 외) · 2026-10</span><span class="pg"><b>01</b> / ${N}</span></div>` });

  // ── 02 기획 의도
  {
    const qs = [['0.5초 늦으면 순위가 떨어질까?', true, `3바퀴 뒤 ${sg(a.effect05)}계단`],
      ['피트가 느리면 언더컷이 실패할까?', true, `성공률 ${r0(b.ok)}% → ${r0(b.slow)}%`],
      ['피트 실수에 팬들은 분노할까?', true, `비판 ${r0(se.pit_err.crit)}% (평소 ${r0(se.pit_err.ref)}%)`],
      ['피트 잘하는 팀이 더 사랑받을까?', false, '관계없음 → 기대가 더 중요']];
    slides.push({ kicker: '기획 의도', sector: 0, title: '빠른 피트 = 좋은 순위 = <span class="cy">팬의 신뢰</span>?',
      lede: '정말 그런지, 경기 기록과 팬들의 글을 같은 10개 팀·3시즌으로 맞춰 확인했다',
      source: '출처: analysis/findings.md 종합 결론 · f1_hypothesis_tests.csv · f1_correlations.csv',
      body: `
    <div class="body split" style="grid-template-columns:40fr 60fr">
      <div class="col">
        <div class="hud-card a" style="--d:.25s">
          <div class="label">왜 궁금했나</div>
          ${['F1에서 순위는 <b>피트</b>에서 자주 바뀐다', '피트 실수는 <strong>가장 먼저</strong> 욕을 먹는다', '그런데 피트 잘하는 팀이 <b>사랑받는 팀</b>일까?']
            .map((t, i) => `<p class="txt" style="margin-top:${i ? 18 : 22}px;font-size:30px"><span class="mono" style="color:var(--f1-red);font-weight:700;margin-right:12px">0${i + 1}</span>${t}</p>`).join('')}
        </div>
        <div class="hud-card a" style="--d:.45s;--line:var(--f1-purple)">
          <div class="label">핵심 메시지</div>
          <p class="txt" style="margin-top:16px;font-size:30px"><b>0.5초</b>가 순위를 바꾼다</p>
          <p class="txt" style="margin-top:8px;font-size:30px">팬심은 성적이 아니라 <b>기대</b>를 따른다</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.35s;--line:var(--f1-cyan)">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="label">결과 한눈에</span><span class="txt sm">4개 질문 중 <b style="font-size:30px">3개</b>가 "그렇다"</span></div>
          ${qs.map(([q, ok, t], i) => `<div class="a" style="--d:${0.5 + i * 0.1}s;display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:center;margin-top:22px;padding-top:24px;border-top:1px solid var(--f1-surface-border)">
            <div style="font:700 30px/1.25 var(--body);color:var(--f1-text-primary)">${q}</div><div class="mono" style="font-size:22px;color:var(--f1-text-secondary)">${t}</div>
            <span class="verdict ${ok ? 'ok' : 'no'}">${ok ? 'YES' : 'NO'}</span></div>`).join('')}
        </div>
      </div>
    </div>` });
  }

  // ── 03 문제
  const cmp = D.compounds, cmpTot = Object.values(cmp).reduce((x, y) => x + y, 0);
  const cmpRow = [['S', 'tyre-soft', 'SOFT', '소프트', P.red], ['M', 'tyre-medium', 'MEDIUM', '미디엄', '#FFD000'], ['H', 'tyre-hard', 'HARD', '하드', '#D1D5DB'], ['I', '', 'INTERMEDIATE', '인터', '#43B02A'], ['W', '', 'WET', '웨트', '#0067AD']];
  const sr = D.teams.map((t) => t.stops_race);
  S('문제', '순위는 <span class="cy">피트</span>에서 갈린다', `
    <div class="body split" style="grid-template-columns:42fr 58fr">
      <div class="col">
        <div class="hud-card a" style="--d:.25s;--line:var(--f1-red)">
          <div class="label">피트레인을 지나는 시간</div>
          <div class="big" style="margin-top:12px">${count(M.pit_lane_median, 1)}<span class="unit">초</span></div>
          <p class="txt sm" style="margin-top:8px">이 안에서 0.5초가 승부를 가른다</p>
        </div>
        <div class="hud-card a" style="--d:.4s">
          <div class="label">드라이버 1명당 피트 횟수</div>
          <div class="mid" style="margin-top:12px">${nf(Math.min(...sr), 1)}~${nf(Math.max(...sr), 1)}<span class="unit">번 / 레이스</span></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.45s">
          <div class="label">어떤 타이어로 달렸나 (${nf(cmpTot)}구간)</div>
          <div style="display:flex;height:46px;margin:20px 0 16px;border-radius:6px;overflow:hidden" class="grow">
            ${cmpRow.map(([, , k, , c]) => `<div style="width:${cmp[k] / cmpTot * 100}%;background:${c}" title="${k} ${cmp[k]}"></div>`).join('')}
          </div>
          <div style="display:flex;gap:24px;flex-wrap:wrap">
            ${cmpRow.map(([bd, cl, k, ko, c]) => `<span style="display:inline-flex;gap:10px;align-items:center;font:600 21px/1 var(--body);color:var(--f1-text-primary)"><span class="tyre-badge ${cl}" style="${cl ? '' : `border-color:${c};color:${c}`}">${bd}</span>${ko} <span class="mono" style="color:var(--f1-text-secondary)">${r0(cmp[k] / cmpTot * 100)}%</span></span>`).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          ${[['질문 1', '몇 초 늦으면<br>순위가 떨어질까?', 'var(--f1-red)'], ['질문 2', '팬들은 그 몇 초에<br>반응할까?', 'var(--f1-cyan)']]
            .map(([k, q, c], i) => `<div class="hud-card a" style="--d:${0.6 + i * 0.12}s;--line:${c};padding:26px 28px"><div class="label">${k}</div><p style="margin:12px 0 0;font:700 32px/1.3 var(--body);color:var(--f1-text-primary)">${q}</p></div>`).join('')}
        </div>
      </div>
    </div>`, '출처: f1_strategy_stats.csv · akashrane2609 스틴트 데이터 · 피트레인 시간은 중앙값(정지 시간 아님)', { sector: 0, lede: '드라이버 1명이 레이스마다 약 2번 피트에 들어온다' });

  // ── 04 발견 1: 0.5초 (H1a)
  S('발견 1', '피트스톱이 <em>0.5초</em>만 늦어져도', `
    <div class="body split">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:var(--f1-red)">
          <div class="label">3바퀴 뒤 순위</div>
          <div class="big red" style="margin-top:12px">${count(a.effect05, 2)}<span class="unit">계단</span></div>
          <p class="txt sm" style="margin-top:8px">0.5초 이상 늦은 피트스톱의 평균 손해</p>
        </div>
        <div class="hud-card a" style="--d:.35s">
          <div class="label">3초 이상 늦으면</div>
          <div class="mid hot" style="margin-top:12px">${sg(a.effect3, 1)}<span class="unit">계단</span></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.3s;height:100%">
          <div class="label">늦어진 정도별 · 3바퀴 뒤 순위 변화</div>
          <div class="chart-box" style="margin-top:18px"><canvas id="c-h1a" width="1020" height="520"></canvas></div>
        </div>
      </div>
    </div>`, `출처: f1_pitstops_clean.csv (피트스톱 ${nf(M.stops)}건) · 같은 레이스 평균 대비 · Mann-Whitney ${pv(a.p05)}`, { sector: 1, lede: `${nf(M.stops)}번의 피트스톱을 비교하니, 늦은 피트는 3바퀴 뒤 확실히 뒤처져 있었다` });
  charts[slides.length - 1] = [() => new Chart(el('c-h1a'), {
    type: 'bar',
    data: { labels: [['정상', `${nf(a.buckets[0].n)}번`], ['0.5~3초 늦음', `${nf(a.buckets[1].n)}번`], ['3초 이상 늦음', `${nf(a.buckets[2].n)}번`]],
      datasets: [{ data: a.buckets.map((x) => x.mean), backgroundColor: [P.tealFill, P.amber, P.red], borderRadius: 6, barPercentage: .62 }] },
    options: base({ id: 'c-h1a', y: { title: '평균 순위 변화 (계단)', min: -4, max: 0 }, valueLabel: (v) => sg(v, 1) })
  })];

  // ── 05 발견 2: 언더컷 (H1b)
  const defTop = [...D.teams].filter((t) => t.uc_def >= 10).sort((x, y) => y.uc_def_rate - x.uc_def_rate);
  S('발견 2', `언더컷 성공률 반토막 <span class="mono" style="font-size:.8em">(<span class="cy">${r0(b.ok)}%</span> → <em>${r0(b.slow)}%</em>)</span>`, `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.25s;height:100%">
          <div class="label">언더컷 성공률 · ${M.undercuts}번의 시도</div>
          <div class="chart-box" style="margin-top:18px"><canvas id="c-h1b" width="1020" height="520"></canvas></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.35s;--line:var(--f1-cyan)">
          <div class="label">언더컷이란?</div>
          <p class="txt" style="margin-top:12px;font-size:27px">앞차보다 <b>먼저 피트</b>에 들어가<br>새 타이어로 추월하는 작전</p>
        </div>
        <div class="hud-card a" style="--d:.5s">
          <div class="label">앞에서 잘 막는 팀</div>
          ${defTop.slice(0, 2).concat(defTop.slice(-1)).map((t, i) => `<div style="display:grid;grid-template-columns:190px 1fr 80px;gap:14px;align-items:center;margin-top:18px">
            ${tag(t.team)}<div class="gauge"><i class="grow" style="--d:${0.7 + i * 0.12}s;width:${t.uc_def_rate}%;--gc:${teamColor(t.team)}"></i></div>
            <span class="mono" style="text-align:right;font-size:26px;font-weight:700">${r0(t.uc_def_rate)}%</span></div>`).join('')}
        </div>
      </div>
    </div>`, `출처: f1_undercut_events.csv · Fisher exact ${pv(b.p)} · 막기 비율은 10번 이상 시도받은 팀`, { sector: 1, lede: '내 피트가 0.5초만 느려도, 추월 작전 성공률이 절반 아래로' });
  charts[slides.length - 1] = [() => new Chart(el('c-h1b'), {
    type: 'bar',
    data: { labels: [['내 피트가 0.5초 이상 느릴 때', `${b.n_slow}번`], ['그렇지 않을 때', `${b.n_ok}번`]],
      datasets: [{ data: [b.slow, b.ok], backgroundColor: [P.red, P.tealFill], borderRadius: 6, barPercentage: .5 }] },
    options: base({ id: 'c-h1b', y: { title: '성공률 (%)', min: 0, max: 70 }, valueLabel: (v) => r0(v) + '%', refLine: { value: b.overall, label: `전체 평균 ${r0(b.overall)}%` } })
  })];

  // ── 06 팀 비교 (인터랙티브)
  S('팀 비교', `가장 빠른 팀 vs 가장 느린 팀: <em>${nf(gap, 1)}초</em> 차이`, `
    <div class="body split">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:${teamColor('Red Bull')}">
          <div style="display:flex;justify-content:space-between;align-items:center">${tag('Red Bull')}<span class="delta-badge best">가장 빠름</span></div>
          <div class="mid cool" style="margin-top:14px">${sg(rb.delay)}<span class="unit">초</span></div>
        </div>
        <div class="hud-card a" style="--d:.32s;--line:${teamColor('Haas')}">
          <div style="display:flex;justify-content:space-between;align-items:center">${tag('Haas')}<span class="delta-badge slow">가장 느림</span></div>
          <div class="mid hot" style="margin-top:14px">${sg(hs.delay)}<span class="unit">초</span></div>
          <p class="txt sm" style="margin-top:6px">5번 중 1번은 3초 이상 지연 (${r0(hs.err)}%)</p>
        </div>
        <div class="hud-card a" style="--d:.44s;--line:${teamColor('McLaren')}">
          <div class="label">${tag('McLaren')} 3초+ 지연 비율</div>
          <div style="display:flex;gap:16px;margin-top:14px;align-items:center;font:700 34px/1 var(--mono)">
            <span>${r0(ml.err_by_year['2022'])}%</span><span style="color:var(--f1-text-secondary)">→</span><span class="hot">${r0(ml.err_by_year['2023'])}%</span><span style="color:var(--f1-text-secondary)">→</span><span class="cool">${r0(ml.err_by_year['2024'])}%</span>
          </div>
          <p class="txt sm" style="margin-top:8px">2023년 흔들렸다가 2024년 회복</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.3s;height:100%">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:16px">
            <span class="label" id="bench-label">평균 지연 (초)</span>
            <div class="seg" role="group" aria-label="지표 선택" data-noclick>
              <button data-m="delay" aria-pressed="true">평균 지연</button><button data-m="slow" aria-pressed="false">0.5초+ 지연</button>
              <button data-m="err" aria-pressed="false">3초+ 지연</button><button data-m="uc_rate" aria-pressed="false">언더컷 성공</button>
            </div>
          </div>
          <div class="chart-box" style="margin-top:16px" data-noclick><canvas id="c-bench" width="1020" height="530"></canvas></div>
        </div>
      </div>
    </div>`, '출처: f1_strategy_stats.csv (2022–2024, 팀당 214~251번) · 오른쪽 위 버튼으로 지표 전환', { sector: 1, lede: '같은 레이스 평균보다 얼마나 늦었나 — 팀별 차이는 3시즌 내내 거의 그대로' });
  const BENCH = { delay: ['평균 지연 (초)', (v) => sg(v, 2) + '초'], slow: ['0.5초 이상 늦은 비율 (%)', (v) => r0(v) + '%'],
    err: ['3초 이상 늦은 비율 (%)', (v) => r0(v) + '%'], uc_rate: ['언더컷 성공률 (%) · 시도 횟수', (v) => r0(v) + '%'] };
  charts[slides.length - 1] = [() => {
    const ch = new Chart(el('c-bench'), {
      type: 'bar',
      data: (() => { const o = [...D.teams].sort((x, y) => x.delay - y.delay); return { labels: o.map((t) => t.team), datasets: [{ data: o.map((t) => t.delay), backgroundColor: o.map((t) => teamColor(t.team)), borderColor: P.line, borderWidth: 1, borderRadius: 6, barPercentage: .72 }] }; })(),
      options: base({ id: 'c-bench', horizontal: true, valueLabel: BENCH.delay[1] })
    });
    const seg = el('c-bench').closest('.hud-card').querySelectorAll('.seg button');
    seg.forEach((btn) => btn.onclick = (e) => {
      e.stopPropagation();
      const m = btn.dataset.m, order = [...D.teams].sort((x, y) => m === 'uc_rate' ? y[m] - x[m] : x[m] - y[m]);
      seg.forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
      el('bench-label').textContent = BENCH[m][0];
      ch.data.labels = order.map((t) => m === 'uc_rate' ? `${t.team} (${t.uc_att})` : t.team);
      ch.data.datasets[0].data = order.map((t) => t[m]);
      ch.data.datasets[0].backgroundColor = order.map((t) => teamColor(t.team));
      FMT['c-bench'].fmt = BENCH[m][1];
      ch.update();
    });
    return ch;
  }];

  // ── 07 발견 3: 팬 반응 (H2′)
  const ratio = se.pit_err.crit / se.pit_err.ref;
  S('발견 3', `피트 실수 얘기가 나오면, 비판이 <em>${r0(ratio)}배</em>`, `
    <div class="body split" style="grid-template-columns:36fr 24fr 40fr">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:var(--f1-red)">
          <div class="label">피트 실수를 말한 문장 중 비판</div>
          <div class="big red" style="margin-top:12px">${count(se.pit_err.crit, 0, '', '%')}</div>
        </div>
        <div class="hud-card a" style="--d:.32s">
          <div class="label">다른 전략 이야기</div>
          <div class="mid" style="margin-top:12px;color:var(--f1-text-secondary)">${r0(se.pit_err.ref)}%</div>
          <p class="txt sm" style="margin-top:6px">언더컷 같은 작전 얘기는 차분 (${r0(se.undercut.crit)}%)</p>
        </div>
      </div>
      <div class="hud-card a" style="--d:.3s">
        <div class="label">전략 문장 ${M.strategy_sentences}개의 감정</div>
        <div class="chart-box" style="margin-top:18px"><canvas id="c-sent" width="300" height="300"></canvas></div>
        <div style="display:grid;gap:12px;margin-top:22px;font:600 21px/1 var(--body);color:var(--f1-text-primary)">
          ${[['중립', '#9CA3AF'], ['긍정', P.tealFill], ['비판', P.red], ['불안', P.purple]].map(([k, c]) => `<span style="display:flex;justify-content:space-between"><span style="display:flex;gap:10px;align-items:center"><i style="width:14px;height:14px;border-radius:3px;background:${c}"></i>${k}</span><span class="mono">${r0(dist[k] / M.strategy_sentences * 100)}%</span></span>`).join('')}
        </div>
      </div>
      <div class="col">
        ${[['한 번은 괜찮아도, 두 번은 심하고, 세 번은 용납 못 한다.', 'One race is acceptable, while two is already a stretch, & three definitely unacceptable…', 'RaceFans 독자 댓글 · 2024 자우버 피트 실수'],
           ['그리고 피트스톱은 완전히 재앙이었다.', '…and then came the pit stops which were an absolute disaster.', '막스 페르스타펜 · 2024 오스트리아 GP']]
          .map(([ko, en, c], i) => `<div class="hud-card a" style="--d:${0.45 + i * 0.12}s;--line:var(--f1-red)"><p class="quote" style="font-size:26px;font-weight:700">${ko}</p><p class="txt sm" style="margin-top:10px;font-style:italic">${en}</p><p class="txt sm" style="margin-top:6px;font-size:19px">— ${c}</p></div>`).join('')}
      </div>
    </div>`, `출처: f1_text_sentences.csv (Firecrawl ${M.docs}건 · ${nf(M.sentences)}문장) · 규칙 기반 감정 분류 · Fisher ${pv(se.pit_err.p)}`, { sector: 2, lede: '팬·미디어 글을 문장 단위로 읽어 감정을 분류했다' });
  charts[slides.length - 1] = [() => new Chart(el('c-sent'), {
    type: 'doughnut',
    data: { labels: ['중립', '긍정', '비판', '불안'], datasets: [{ data: ['중립', '긍정', '비판', '불안'].map((k) => dist[k]), backgroundColor: ['#D1D5DB', P.tealFill, P.red, P.purple], borderColor: P.card, borderWidth: 3 }] },
    options: { ...chartCommon(), cutout: '62%', plugins: { legend: { display: false }, tooltip: tooltip() } }
  })];

  // ── 08 반전 (H2)
  S('반전', `팬들은 '절대 성적'보다 <em>'기대 대비 실망'</em>에 분노한다`, `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.25s;height:100%">
          <div class="label">피트 실수가 많은 팀일수록 신뢰가 낮을까? (원 크기 = 글의 양)</div>
          <div class="chart-box" style="margin-top:12px" data-noclick><canvas id="c-twist" width="1020" height="540"></canvas></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.35s;--line:var(--f1-yellow)">
          <div class="label">결과</div>
          <p style="margin:10px 0 0;font:700 34px/1.3 var(--body);color:var(--f1-text-primary)">관계 <span style="color:var(--f1-red)">없음</span></p>
          <p class="txt sm" style="margin-top:6px">피트 실력과 팬 신뢰는 따로 움직인다</p>
        </div>
        <div class="hud-card a" style="--d:.5s;--line:${teamColor('Haas')}">
          ${tag('Haas')}
          <p class="txt" style="margin-top:10px;font-size:26px">피트 실수 <strong>1위</strong>, 그래도 <b>칭찬</b></p>
          <p class="txt sm" style="margin-top:6px">"하스는 작전을 정말 영리하게 썼다" — 알본</p>
        </div>
        <div class="hud-card a" style="--d:.65s;--line:${teamColor('Ferrari')}">
          ${tag('Ferrari')}
          <p class="txt" style="margin-top:10px;font-size:26px">피트는 상위권, 그런데 <strong>비판 많음</strong></p>
          <p class="txt sm" style="margin-top:6px">기대가 클수록 실망도 크다</p>
        </div>
      </div>
    </div>`, `출처: f1_team_crossmap.csv · Spearman ρ = ${sg(c1.rho)} (${pv(c1.p)}) · 신뢰 점수 = (긍정 − 비판) ÷ 전략 문장 × 100 · * 글이 적은 팀`, { sector: 2, lede: '피트를 못하는 팀이 오히려 덜 욕먹는다' });
  charts[slides.length - 1] = [() => new Chart(el('c-twist'), {
    type: 'bubble',
    data: { datasets: D.teams.map((t) => ({ label: t.team, data: [{ x: t.err, y: t.trust, r: Math.max(8, Math.sqrt(t.sent_n) * 2.6) }],
      backgroundColor: teamColor(t.team) + 'CC', borderColor: P.ink2, borderWidth: 1 })) },
    options: { ...chartCommon(), layout: { padding: { right: 30, top: 10 } },
      plugins: { legend: { display: false }, tooltip: tooltip((ctx) => { const t = T[ctx.dataset.label]; return `${t.team}: 3초+ 지연 ${r0(t.err)}% · 신뢰 ${sg(t.trust, 1)}${t.sent_n < 20 ? ' (글 적음)' : ''}`; }) },
      scales: { x: axis('3초 이상 늦은 피트 비율 (%)', 4, 21), y: axis('팬 신뢰 점수', -20, 45) } },
    plugins: [bubbleLabels]
  })];

  // ── 09 사례: 자우버
  const maxDelay = Math.max(...sb.stops.map((s) => s.delta));
  S('사례', `2024 <span style="color:#16A34A">자우버</span>: 바퀴 너트 하나가 만든 최악의 평판`, `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:var(--team-sauber);height:100%">
          <div class="label">시즌 첫 3경기 피트스톱 ${sb.early.n}번 · 평균보다 늦어진 시간</div>
          <div style="display:grid;gap:14px;margin-top:24px">
            ${sb.stops.map((s, i) => `<div style="display:grid;grid-template-columns:270px 1fr 120px;gap:16px;align-items:center;font:500 21px/1 var(--body);color:var(--f1-text-primary)">
              <span style="white-space:nowrap"><span class="mono" style="color:var(--f1-text-secondary)">R${s.round}</span> ${s.gp.replace('Saudi Arabian', 'Saudi')} · ${s.driver}</span>
              <div class="gauge"><i class="grow" style="--d:${0.35 + i * 0.07}s;width:${Math.max(1.5, s.delta / maxDelay * 100)}%;--gc:${s.delta >= 3 ? P.red : s.delta >= 0.5 ? P.amber : P.tealFill}"></i></div>
              <span class="delta-badge ${s.delta >= 3 ? 'slow' : s.delta >= 0.5 ? 'warn' : 'fast'}" style="justify-self:end">${sg(s.delta, 1)}초</span></div>`).join('')}
          </div>
          <p class="txt sm" style="margin-top:22px">+24초 · +29초 — 바퀴 너트가 안 풀려 그대로 멈춰 섰다</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.4s;--line:var(--f1-red)">
          <div class="label">팬 신뢰 점수</div>
          <div class="big red" style="margin-top:10px;font-size:112px">${count(sa.trust, 1)}</div>
          <p class="txt sm" style="margin-top:6px">10개 팀 중 <strong>꼴찌</strong></p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="hud-card a" style="--d:.55s;--line:var(--f1-red);padding:20px 22px"><div class="label">문제 기간</div><div class="mid hot" style="margin-top:10px;font-size:46px">${sg(sb.early.delay, 1)}초</div></div>
          <div class="hud-card a" style="--d:.65s;padding:20px 22px"><div class="label">해결 후</div><div class="mid cool" style="margin-top:10px;font-size:46px">${sg(sb.late.delay, 1)}초</div></div>
        </div>
        <div class="hud-card a" style="--d:.75s;--line:var(--team-sauber)"><p class="quote" style="font-size:24px;font-weight:700">드라이버들이 이제 "Box Box Box"(피트 들어와) 소리만 들어도 겁낸다.</p><p class="txt sm" style="margin-top:8px;font-size:19px">— RaceFans 독자 댓글 · 2024-03</p></div>
      </div>
    </div>`, '출처: f1_pitstops_clean.csv (Sauber 2024 1~3라운드 vs 이후) · f1_sentiment_analysis.csv · The Race · Motorsport.com', { sector: 2, lede: '시즌 초 3경기 피트가 무너지자, 팬 신뢰도 꼴찌로' });

  // ── 10 한눈에
  const ext = (k, f) => { const v = D.teams.map((t) => t[k]); return f === 'min' ? Math.min(...v) : Math.max(...v); };
  const cls = (k, v, good) => v === ext(k, good) ? 'best' : v === ext(k, good === 'min' ? 'max' : 'min') ? 'hot' : '';
  const yes = [['0.5초 늦으면 순위 하락', true], ['느린 피트 = 언더컷 실패', true], ['실수 언급 = 비판', true], ['피트 실력 = 팬 신뢰', false]];
  S('한눈에', '피트 실력은 <span class="cy">순위</span>를, 기대는 <em>여론</em>을 움직인다', `
    <div class="body split rev" style="grid-template-columns:68fr 32fr">
      <div class="a" style="--d:.2s">
        <table class="tower">
          <thead><tr><th>순위</th><th>팀</th><th>평균 지연</th><th>3초+ 지연</th><th>언더컷 성공</th><th>팬 신뢰</th></tr></thead>
          <tbody>${[...D.teams].sort((x, y) => x.finish - y.finish).map((t, i) => `<tr class="a" style="--d:${0.25 + i * 0.05}s">
            <td>${String(i + 1).padStart(2, '0')}</td><td class="tn">${tag(t.team)}</td>
            <td class="${cls('delay', t.delay, 'min')}">${sg(t.delay)}초</td><td class="${cls('err', t.err, 'min')}">${r0(t.err)}%</td>
            <td class="${cls('uc_rate', t.uc_rate, 'max')}">${r0(t.uc_rate)}%</td>
            <td class="${cls('trust', t.trust, 'max')}">${sg(t.trust, 0)}${t.sent_n < 20 ? '<sup style="color:#B45309">*</sup>' : ''}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="col">
        ${yes.map(([k, ok], i) => `<div class="hud-card a" style="--d:${0.4 + i * 0.12}s;padding:22px 24px;--line:${ok ? 'var(--f1-cyan)' : 'var(--f1-red)'}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><span style="font:700 25px/1.3 var(--body);color:var(--f1-text-primary)">${k}</span><span class="verdict ${ok ? 'ok' : 'no'}">${ok ? 'YES' : 'NO'}</span></div></div>`).join('')}
      </div>
    </div>`, '출처: f1_team_crossmap.csv · 팀 순위 = 2022–24 평균 완주 순위 · 보라 = 최고, 빨강 = 최저 · * 글이 적은 팀(Williams, Alpine)', { sector: 3, lede: '10개 팀 성적표와 4개 질문의 답' });

  // ── 11 주의할 점
  const lim = [['팀이 10개뿐', '팀끼리 비교한 결과는 참고용'], ['피트 시간 = 피트레인 통과 시간', '바퀴 교체 정지 시간과는 다르다'], ['세이프티카 구간 미구분', '그때 들어간 피트도 함께 계산'],
    ['감정 분류는 자동', '사람이 한 문장씩 검수하진 않았다'], ['팀별 글 양이 다름', `적은 팀 ${Math.min(...D.teams.map((t) => t.sent_n))}문장 · 많은 팀 ${Math.max(...D.teams.map((t) => t.sent_n))}문장`], ['Reddit 제외', '수집 도구가 지원하지 않음']];
  S('주의', '이 결과를 읽을 때 <span class="cy">주의할 점</span>', `
    <div class="body" style="grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr auto">
      ${lim.map(([k, t], i) => `<div class="hud-card a" style="--d:${0.2 + i * 0.1}s;--line:${i < 3 ? 'var(--f1-red)' : 'var(--f1-yellow)'}"><div style="font:700 32px/1.3 var(--body);color:var(--f1-text-primary)">${k}</div><p class="txt sm" style="margin-top:14px;font-size:26px">${t}</p></div>`).join('')}
      <div class="hud-card a" style="--d:.9s;grid-column:1 / -1;--line:var(--f1-cyan);display:flex;gap:28px;align-items:center;padding:20px 28px">
        <span class="label" style="color:var(--f1-cyan)">다음 단계</span>
        <span class="txt" style="font-size:24px">정확한 정지 시간·세이프티카 데이터로 다시 확인하기</span>
      </div>
    </div>`, '출처: log/decisions.md · analysis/findings.md 「한계와 다음 단계」', { sector: 3, lede: '더 정확한 결론을 위해 다음에 보완할 부분' });

  // ── 12 결론 & Q&A
  slides.push({ raw: `
    <svg class="a" style="--d:.1s;position:absolute;left:0;top:760px" width="1920" height="160" viewBox="0 0 1920 160" aria-hidden="true">
      <path class="line-draw" style="--len:2600;--d:.3s" d="M0 100 L600 100 L640 40 L680 140 L720 100 L1920 100" fill="none" stroke="${P.tealFill}" stroke-width="3" opacity=".7"/>
    </svg>
    <div class="kicker a" style="--d:0s"><span class="tag">12</span>결론</div>${sectorBar(3)}
    <div style="position:absolute;left:100px;right:100px;top:170px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
      ${[['0.5초', '늦은 피트는<br>순위를 잃는다', 'var(--f1-red)'], [`${r0(se.pit_err.crit)}%`, '실수는 바로<br>비판받는다', '#B45309'], ['기대', '팬의 신뢰는<br>기대가 정한다', 'var(--f1-cyan)']]
        .map(([n, h, c], i) => `<div class="hud-card a" style="--d:${0.2 + i * 0.15}s;--line:${c};padding:32px">
          <div class="mid" style="color:${c};font-size:76px">${n}</div><div style="font:700 36px/1.3 var(--body);margin-top:18px;color:var(--f1-text-primary)">${h}</div></div>`).join('')}
    </div>
    <p class="txt a" style="--d:.65s;position:absolute;left:100px;right:100px;top:500px;font-size:32px;line-height:1.5;font-weight:600"><span style="color:var(--f1-red)">▍</span>피트 0.5초는 순위를 바꾸지만, 팬의 마음은 <b>기대</b>가 움직인다.</p>
    <h2 style="position:absolute;left:100px;top:600px;margin:0;font:700 150px/1 var(--display);letter-spacing:-.02em;color:var(--f1-text-primary)">
      <span class="mask"><span style="--d:.7s">Q<span style="color:var(--f1-red)">&amp;</span>A</span></span></h2>
    <p class="txt a" style="--d:.9s;position:absolute;left:560px;top:650px;font-size:30px;color:var(--f1-text-secondary)">Box, box — 질문 받겠습니다.</p>
    <div class="footer a" style="--d:1s"><span>재현: scripts/analysis/2026-10-25_f1-*.py → data/processed/f1_*.csv → slides/f1/deck-data.js</span><span class="pg"><b>12</b> / ${N}</span></div>` });

  // ── 마크업 주입
  const deck = document.getElementById('deck');
  const progress = deck.querySelector('.progress');
  slides.forEach((s, i) => {
    const sec = document.createElement('section');
    sec.className = 'slide';
    sec.setAttribute('aria-label', `${i + 1} / ${N}`);
    const lede = s.lede;
    sec.innerHTML = s.raw || `<div class="kicker a" style="--d:0s"><span class="tag">${String(i + 1).padStart(2, '0')}</span>${s.kicker}</div>
      ${s.sector !== undefined ? sectorBar(s.sector) : ''}
      <h2 class="title a" style="--d:.08s">${s.title}</h2>${lede ? `<p class="lede a" style="--d:.16s">${lede}</p>` : ''}${s.body}
      <div class="footer a" style="--d:.6s"><span>${s.source}</span><span class="pg"><b>${String(i + 1).padStart(2, '0')}</b> / ${N}</span></div>`;
    deck.insertBefore(sec, progress);
  });

  // ── Chart.js 공통 스타일 (references/design/chart-guide.md)
  function el(id) { return document.getElementById(id); }
  function tooltip(label) {
    return { backgroundColor: P.card, titleColor: P.ink, bodyColor: P.ink2, borderColor: P.line, borderWidth: 1, padding: 12,
      titleFont: { family: 'Chakra Petch', size: 16 }, bodyFont: { family: 'JetBrains Mono', size: 15 }, ...(label ? { callbacks: { label } } : {}) };
  }
  function axis(title, min, max) {
    return { min, max, grid: { color: P.grid }, border: { color: P.line },
      ticks: { color: P.sub, font: { family: 'JetBrains Mono', size: 16 } },
      title: { display: !!title, text: title, color: P.sub, font: { family: 'Pretendard', size: 18, weight: '600' } } };
  }
  function chartCommon() {
    return { responsive: false, devicePixelRatio: Math.max(2, window.devicePixelRatio || 1),
      animation: STILL() ? false : { duration: 1600, easing: 'easeOutCubic', delay: (c) => c.type === 'data' ? c.dataIndex * 120 + 300 : 0 } };
  }
  // 막대 끝 값 라벨 · 기준선 (외부 플러그인 없이). 포맷 함수는 Chart 옵션 대신 캔버스 id별 레지스트리에 둔다
  const FMT = {};
  const valueLabels = { id: 'valueLabels', afterDatasetsDraw(ch) {
    const reg = FMT[ch.canvas.id]; if (!reg || !reg.fmt) return; const f = reg.fmt;
    const { ctx } = ch, horiz = ch.options.indexAxis === 'y';
    ctx.save(); ctx.font = '700 22px "JetBrains Mono"'; ctx.fillStyle = P.ink;
    ch.getDatasetMeta(0).data.forEach((bar, i) => {
      const v = ch.data.datasets[0].data[i]; if (v == null) return;
      const { x, y } = bar.tooltipPosition();
      if (horiz) { ctx.textAlign = v >= 0 ? 'left' : 'right'; ctx.textBaseline = 'middle'; ctx.fillText(f(v), x + (v >= 0 ? 10 : -10), y); }
      else { ctx.textAlign = 'center'; ctx.textBaseline = v >= 0 ? 'bottom' : 'top'; ctx.fillText(f(v), x, y + (v >= 0 ? -10 : 10)); }
    });
    const ref = reg.ref;
    if (ref) {
      const ys = ch.scales.y.getPixelForValue(ref.value), xa = ch.chartArea;
      ctx.setLineDash([10, 8]); ctx.strokeStyle = P.sub; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xa.left, ys); ctx.lineTo(xa.right, ys); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '600 18px "Pretendard"'; ctx.fillStyle = P.sub; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(ref.label, xa.right, ys - 8);
    }
    ctx.restore();
  } };
  const BUBBLE_POS = { Ferrari: 'left', Mercedes: 'bottom', McLaren: 'right', 'Aston Martin': 'bottom', 'Red Bull': 'right' };
  const bubbleLabels = { id: 'bubbleLabels', afterDatasetsDraw(ch) {
    const { ctx } = ch; ctx.save(); ctx.font = '700 17px "Chakra Petch"'; ctx.textBaseline = 'middle';
    ch.data.datasets.forEach((ds, i) => { const p = ch.getDatasetMeta(i).data[0]; if (!p) return;
      const t = T[ds.label], r = p.options.radius + 8, txt = `${ds.label}${t.sent_n < 20 ? '*' : ''}`;
      const pos = BUBBLE_POS[ds.label] || (p.x < ch.chartArea.right - 170 ? 'right' : 'left');
      ctx.fillStyle = P.ink;
      if (pos === 'top' || pos === 'bottom') { ctx.textAlign = 'center'; ctx.fillText(txt, p.x, p.y + (pos === 'top' ? -r - 4 : r + 6)); }
      else { ctx.textAlign = pos === 'right' ? 'left' : 'right'; ctx.fillText(txt, p.x + (pos === 'right' ? r : -r), p.y); } });
    const ya = ch.scales.y.getPixelForValue(0); ctx.strokeStyle = 'rgba(17,24,39,.25)'; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(ch.chartArea.left, ya); ctx.lineTo(ch.chartArea.right, ya); ctx.stroke(); ctx.restore();
  } };
  function base(o) {
    const horiz = !!o.horizontal;
    FMT[o.id] = { fmt: o.valueLabel, ref: o.refLine };
    const opt = { ...chartCommon(), indexAxis: horiz ? 'y' : 'x',
      layout: { padding: horiz ? { right: 90 } : { top: 34, bottom: 4 } },
      plugins: { legend: { display: false }, tooltip: tooltip() },
      scales: horiz ? { x: axis(null), y: { grid: { display: false }, border: { color: P.line }, ticks: { color: P.ink, font: { family: 'Pretendard', size: 19, weight: '600' } } } }
        : { x: { grid: { display: false }, border: { color: P.line }, ticks: { color: P.ink, font: { family: 'Pretendard', size: 20, weight: '600' } } }, y: axis(o.y.title, o.y.min, o.y.max) } };
    return opt;
  }
  if (window.Chart) Chart.register(valueLabels);

  // ── 진입 모션 재생 · 카운트업 · 차트 (템플릿 progress(t, once): 변환 2.2초 후 완료 상태 유지)
  const live = {};
  const STILL = () => document.body.classList.contains('still');
  const eo = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  function play(i) {
    const s = document.querySelectorAll('#deck .slide')[i]; if (!s) return;
    s.classList.remove('play'); void s.offsetWidth; s.classList.add('play');
    s.querySelectorAll('[data-count]').forEach((n) => {
      const v = +n.dataset.count, d = +n.dataset.dec, pre = n.dataset.pre, suf = n.dataset.suf, t0 = performance.now(), delay = 250;
      if (STILL()) { n.textContent = pre + (v < 0 ? '−' : '') + nf(Math.abs(v), d) + suf; return; }
      const step = (now) => { const p = eo((now - t0 - delay) / 1400); n.textContent = pre + (v < 0 ? '−' : '') + nf(Math.abs(v) * p, d) + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    (live[i] || []).forEach((c) => c.destroy()); live[i] = [];
    if (window.Chart && charts[i]) live[i] = charts[i].map((f) => f());
  }

  // ── slide-engine.js 연결: showSlide를 감싸 모션·차트·해시·카운터를 붙인다
  window.F1Deck = { attach() {
    if (typeof SlideEngine === 'undefined') return;
    const initial = parseInt(location.hash.slice(1), 10); // 엔진 첫 표시가 해시를 #1로 덮기 전에 읽어 둔다
    const orig = SlideEngine.prototype.showSlide;
    SlideEngine.prototype.showSlide = function (index) {
      if (index < 0 || index >= this.totalSlides) return;
      orig.call(this, index);
      document.getElementById('count').textContent = String(index + 1).padStart(2, '0') + ' / ' + this.totalSlides;
      if (location.hash !== '#' + (index + 1)) history.replaceState(null, '', '#' + (index + 1));
      play(index);
    };
    const q = new URLSearchParams(location.search);
    if (q.get('clean') === '1') document.body.classList.add('clean');
    if (q.get('still') === '1') document.body.classList.add('still'); // 완료 상태로 고정(캡처·인쇄용)
    const start = () => {
      const eng = window.f1SlideEngine; if (!eng) return;
      const n = initial;
      if (n >= 2 && n <= eng.totalSlides) eng.showSlide(n - 1);
      document.getElementById('prev').onclick = () => eng.prev();
      document.getElementById('next').onclick = () => eng.next();
      document.getElementById('replay').onclick = () => eng.showSlide(eng.currentIndex);
      document.getElementById('full').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      document.getElementById('stage').addEventListener('click', (e) => {
        if (e.target.closest('[data-noclick],button,a')) return;
        e.clientX < innerWidth / 3 ? eng.prev() : eng.next();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') eng.showSlide(eng.currentIndex);
        else if (e.key === 'Home') eng.showSlide(0);
        else if (e.key === 'End') eng.showSlide(eng.totalSlides - 1);
      });
      window.addEventListener('hashchange', () => { const k = parseInt(location.hash.slice(1), 10); if (k >= 1 && k <= eng.totalSlides && k - 1 !== eng.currentIndex) eng.showSlide(k - 1); });
    };
    // 엔진은 DOMContentLoaded에서 생성된다 → 그 다음, 폰트가 준비되면 시작(템플릿과 같은 순서)
    document.addEventListener('DOMContentLoaded', () => {
      const fonts = document.fonts ? Promise.all(["700 40px 'Chakra Petch'", "700 40px 'JetBrains Mono'", "400 20px 'Pretendard'"].map((f) => document.fonts.load(f))).then(() => document.fonts.ready) : Promise.resolve();
      // 폰트 로드가 지연돼도 1.5초 뒤에는 시작
      Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(start, start);
    });
  } };
})();
