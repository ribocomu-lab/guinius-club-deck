// F1 레이스 전략 × 팬덤 여론 덱 — 에디토리얼 레이아웃(박스 없는 2단 구성) · Chart.js 차트 · 진입 모션
// 수치는 전부 deck-data.js(window.F1, 자동 생성)에서 읽는다. 슬라이드 전환·스케일·키보드는 references/design/slide-engine.js.
(function () {
  const D = window.F1, M = D.meta;
  const TEAM_VAR = { 'Red Bull': 'redbull', Ferrari: 'ferrari', Mercedes: 'mercedes', McLaren: 'mclaren', 'Aston Martin': 'astonmartin',
    Alpine: 'alpine', Williams: 'williams', RB: 'rb', Sauber: 'sauber', Haas: 'haas' };
  const css = getComputedStyle(document.documentElement);
  const cv = (n) => css.getPropertyValue(n).trim();
  const teamColor = (t) => cv('--team-' + TEAM_VAR[t]);
  // 화이트 캔버스용 팔레트 — 차트·SVG에서 쓰는 색은 여기서만 정한다
  const P = { ink: '#111827', ink2: '#374151', sub: '#6B7280', line: '#E5E7EB', grid: 'rgba(17,24,39,0.06)', card: '#FFFFFF',
    red: '#E10600', teal: '#0D9488', tealFill: '#14B8A6', amber: '#F59E0B', purple: '#9333EA' };
  const T = Object.fromEntries(D.teams.map((t) => [t.team, t]));
  const nf = (v, d = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sg = (v, d = 2) => (v > 0 ? '+' : v < 0 ? '−' : '') + nf(Math.abs(v), d);
  const pv = (p) => p < 0.001 ? 'p < 0.001' : 'p = ' + (p < 0.01 ? p.toFixed(3) : p.toFixed(2));
  const r0 = (v) => Math.round(v);
  // 팀 이름 앞에 팀 컬러 짧은 선만 둔다(박스·태그 없음)
  const tn = (t) => `<span class="tname"><i style="background:${teamColor(t)}"></i>${t}</span>`;
  const count = (v, d = 0, pre = '', suf = '') => `<span data-count="${v}" data-dec="${d}" data-pre="${pre}" data-suf="${suf}">${pre}${nf(v, d)}${suf}</span>`;
  const N = 12;

  const slides = [];
  const charts = {};   // 슬라이드 번호 → 차트 생성 함수 목록
  // 에디토리얼 2단: 좌측 = 아이브로우 + 대형 헤드라인 + 컨텍스트(+빅넘버), 우측 = 데이터 행 또는 차트
  const ED = ({ eyebrow, hl, ctx, left = '', right, source, rightTop = false }) => {
    const i = slides.length + 1;
    slides.push({ raw: `
    <div class="ed-left">
      <div class="eyebrow a" style="--d:0s">${eyebrow}</div>
      <h2 class="hl a" style="--d:.08s">${hl}</h2>
      ${ctx ? `<p class="ctx a" style="--d:.2s">${ctx}</p>` : ''}
      ${left}
    </div>
    <div class="ed-right${rightTop ? ' top' : ''}">${right}</div>
    <div class="footer a" style="--d:.6s"><span>${source}</span><span class="pg"><b>${String(i).padStart(2, '0')}</b> / ${N}</span></div>` });
  };
  const rows = (items, d0 = .3) => `<div class="rows">${items.map(([k, v, s], j) =>
    `<div class="row a" style="--d:${d0 + j * 0.08}s"><span class="k">${k}${s ? `<span class="s">${s}</span>` : ''}</span><span class="v">${v}</span></div>`).join('')}</div>`;
  const ans = (ok) => `<span class="ans ${ok ? 'yes' : 'no'}">${ok ? '그렇다' : '아니다'}</span>`;

  const a = D.h1a, b = D.h1b, se = D.sent, c1 = D.corr.err_trust;
  const rb = T['Red Bull'], hs = T.Haas, ml = T.McLaren, fe = T.Ferrari, sa = T.Sauber, sb = D.sauber;
  const gap = r0((hs.delay - rb.delay) * 10) / 10;
  const ratio = r0(se.pit_err.crit / se.pit_err.ref);

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
    <div class="eyebrow a" style="--d:0s;position:absolute;left:100px;top:110px">F1 2022–2024 · 레이스 전략 × 팬심</div>
    <h1 style="position:absolute;left:100px;top:170px;margin:0;font:800 160px/1.02 var(--body);letter-spacing:-.05em;color:var(--f1-text-primary)">
      <span class="mask"><span style="--d:.1s"><span class="mono" style="color:var(--f1-red);letter-spacing:-.06em">0.5</span>초의</span></span>
      <span class="mask"><span style="--d:.25s">나비효과</span></span>
    </h1>
    <p class="ctx a" style="--d:.6s;position:absolute;left:100px;top:540px;margin:0;font-size:34px">피트스톱 0.5초가 순위를 바꾸고, 팬심은 기대를 따라 움직인다</p>
    <div style="position:absolute;left:1180px;right:100px;top:200px">${rows([
      ['경기 기록', `${count(M.stops)}<span class="u">번의 피트스톱</span>`],
      ['팬·미디어 글', `${count(M.sentences)}<span class="u">문장</span>`],
      ['분석 범위', `10<span class="u">개 팀 · 3시즌</span>`]], .35)}</div>
    <div class="footer a" style="--d:.8s"><span>Kaggle(F1 경기 기록) · Firecrawl(F1Technical · Autosport · RaceFans 외) · 2026-10</span><span class="pg"><b>01</b> / ${N}</span></div>` });

  // ── 02 기획 의도
  ED({ eyebrow: '기획 의도', hl: '빠른 피트가<br>사랑받는 팀을<br>만들까?',
    ctx: `경기 기록 ${nf(M.stops)}건과 팬·미디어 글 ${nf(M.sentences)}문장을 같은 10개 팀·3시즌으로 맞춰 확인했다. 답은 둘로 갈렸다 — 0.5초는 순위를 바꾸지만, 팬심은 <b>기대</b>를 따른다.`,
    right: rows([
      ['0.5초 늦으면 순위가 떨어질까?', ans(true), `3바퀴 뒤 ${sg(a.effect05)}계단`],
      ['피트가 느리면 추월 작전이 실패할까?', ans(true), `언더컷 성공률 ${r0(b.ok)}% → ${r0(b.slow)}%`],
      ['피트 실수에 팬들은 분노할까?', ans(true), `비판 ${r0(se.pit_err.crit)}% · 평소 ${r0(se.pit_err.ref)}%`],
      ['피트 잘하는 팀이 더 사랑받을까?', ans(false), '팬심은 기대를 따른다']]),
    source: '출처: analysis/findings.md 종합 결론 · f1_hypothesis_tests.csv · f1_correlations.csv' });

  // ── 03 문제
  const cmp = D.compounds, cmpTot = Object.values(cmp).reduce((x, y) => x + y, 0);
  const cmpRow = [['SOFT', '소프트', P.red], ['MEDIUM', '미디엄', '#FFD000'], ['HARD', '하드', '#D1D5DB'], ['INTERMEDIATE', '인터', '#43B02A'], ['WET', '웨트', '#0067AD']];
  const sr = D.teams.map((t) => t.stops_race);
  ED({ eyebrow: '문제', hl: '순위는<br><span class="cy">피트</span>에서 갈린다',
    ctx: '추월이 어려운 F1에서 순위는 피트에서 자주 바뀐다. 그 몇 초가 승부와 팬심을 어떻게 바꾸는지 물었다.',
    right: `${rows([
      ['피트레인을 지나는 시간', `${count(M.pit_lane_median, 1)}<span class="u">초</span>`, '이 안에서 0.5초가 승부를 가른다'],
      ['드라이버 1명의 피트 횟수', `${nf(Math.min(...sr), 1)}~${nf(Math.max(...sr), 1)}<span class="u">번 / 레이스</span>`]])}
      <div class="a" style="--d:.5s;margin-top:44px">
        <div class="mini">어떤 타이어로 달렸나 · ${nf(cmpTot)}구간</div>
        <div class="grow" style="display:flex;height:14px;margin:18px 0 16px">${cmpRow.map(([k, , c]) => `<div style="width:${cmp[k] / cmpTot * 100}%;background:${c}" title="${k}"></div>`).join('')}</div>
        <div style="display:flex;gap:30px;flex-wrap:wrap;font:500 22px/1 var(--body);color:var(--f1-text-primary)">${cmpRow.map(([k, ko, c]) =>
          `<span style="display:inline-flex;align-items:center;gap:10px"><i style="width:12px;height:12px;border-radius:50%;background:${c};${k === 'HARD' ? 'outline:1px solid #9CA3AF' : ''}"></i>${ko} <b class="mono">${r0(cmp[k] / cmpTot * 100)}%</b></span>`).join('')}</div>
      </div>`,
    source: '출처: f1_strategy_stats.csv · akashrane2609 스틴트 데이터 · 피트레인 시간은 중앙값(정지 시간 아님)' });

  // ── 04 0.5초 (H1a)
  ED({ eyebrow: '① 피트 → 순위', hl: '0.5초가<br>가르는 승패',
    ctx: `피트스톱이 0.5초만 늦어져도 3바퀴 뒤 평균 0.65계단 뒤처진다. 3초 이상 늦으면 1계단이다.`,
    left: `<div class="bignum a" style="--d:.35s">${count(a.effect05, 2)}<span class="u">계단</span></div>`,
    right: `<div class="mini a" style="--d:.25s">늦어진 정도별 · 3바퀴 뒤 평균 순위 변화</div><div class="chart-box a" style="--d:.3s;margin-top:16px"><canvas id="c-h1a" width="940" height="560"></canvas></div>`,
    source: `출처: f1_pitstops_clean.csv (피트스톱 ${nf(M.stops)}건) · 같은 레이스 평균 대비 · Mann-Whitney ${pv(a.p05)}` });
  charts[slides.length - 1] = [() => new Chart(el('c-h1a'), {
    type: 'bar',
    data: { labels: [['정상', `${nf(a.buckets[0].n)}번`], ['0.5~3초 늦음', `${nf(a.buckets[1].n)}번`], ['3초 이상 늦음', `${nf(a.buckets[2].n)}번`]],
      datasets: [{ data: a.buckets.map((x) => x.mean), backgroundColor: ['#D1D5DB', P.amber, P.red], borderRadius: 2, barPercentage: .56 }] },
    options: base({ id: 'c-h1a', y: { title: '', min: -4, max: 0 }, valueLabel: (v) => sg(v, 1) })
  })];

  // ── 05 언더컷 (H1b)
  const defTop = [...D.teams].filter((t) => t.uc_def >= 10).sort((x, y) => y.uc_def_rate - x.uc_def_rate);
  ED({ eyebrow: '① 피트 → 순위', hl: `느린 피트는<br>추월 작전을<br><em>반토막</em> 낸다`,
    ctx: `앞차보다 먼저 들어가 새 타이어로 추월하는 '언더컷'. 내 피트가 0.5초만 느려도 성공률이 <b>${r0(b.ok)}% → ${r0(b.slow)}%</b>로 떨어진다.`,
    right: `<div class="mini a" style="--d:.25s">언더컷 성공률 · ${M.undercuts}번의 시도</div><div class="chart-box a" style="--d:.3s;margin-top:16px"><canvas id="c-h1b" width="940" height="340"></canvas></div>
      <div style="margin-top:26px">${rows(defTop.slice(0, 2).concat(defTop.slice(-1)).map((t) => [`${tn(t.team)} <span class="dim">앞에서 막아낸 비율</span>`, `${r0(t.uc_def_rate)}%`]), .5)}</div>`,
    source: `출처: f1_undercut_events.csv · Fisher exact ${pv(b.p)} · 막아낸 비율은 10번 이상 시도받은 팀` });
  charts[slides.length - 1] = [() => new Chart(el('c-h1b'), {
    type: 'bar',
    data: { labels: [['내 피트가 0.5초 이상 느릴 때', `${b.n_slow}번`], ['그렇지 않을 때', `${b.n_ok}번`]],
      datasets: [{ data: [b.slow, b.ok], backgroundColor: [P.red, '#D1D5DB'], borderRadius: 2, barPercentage: .46 }] },
    options: base({ id: 'c-h1b', y: { title: '', min: 0, max: 70 }, valueLabel: (v) => r0(v) + '%', refLine: { value: b.overall, label: `전체 평균 ${r0(b.overall)}%` } })
  })];

  // ── 06 팀 비교
  ED({ eyebrow: '① 피트 → 순위', hl: `가장 빠른 팀과<br>가장 느린 팀,<br><em>${nf(gap, 1)}초</em> 차이`,
    ctx: `레드불은 같은 레이스 평균보다 ${nf(rb.delay, 2)}초, 하스는 ${nf(hs.delay, 2)}초 늦었다. 맥라렌은 2023년 흔들렸다가(${r0(ml.err_by_year['2023'])}%) 2024년 회복했다(${r0(ml.err_by_year['2024'])}%).`,
    right: `<div class="a" style="--d:.25s;display:flex;justify-content:space-between;align-items:baseline;gap:20px">
        <span class="mini" id="bench-label">평균 지연 (초)</span>
        <div class="seg" role="group" aria-label="지표 선택" data-noclick>
          <button data-m="delay" aria-pressed="true">평균 지연</button><button data-m="slow" aria-pressed="false">0.5초+</button>
          <button data-m="err" aria-pressed="false">3초+</button><button data-m="uc_rate" aria-pressed="false">언더컷 성공</button>
        </div></div>
      <div class="chart-box a" style="--d:.3s;margin-top:18px" data-noclick><canvas id="c-bench" width="940" height="580"></canvas></div>`,
    source: '출처: f1_strategy_stats.csv (2022–2024, 팀당 214~251번) · 오른쪽 위 메뉴로 지표 전환' });
  const BENCH = { delay: ['평균 지연 (초)', (v) => sg(v, 2) + '초'], slow: ['0.5초 이상 늦은 비율 (%)', (v) => r0(v) + '%'],
    err: ['3초 이상 늦은 비율 (%)', (v) => r0(v) + '%'], uc_rate: ['언더컷 성공률 (%) · 시도 횟수', (v) => r0(v) + '%'] };
  charts[slides.length - 1] = [() => {
    const ch = new Chart(el('c-bench'), {
      type: 'bar',
      data: (() => { const o = [...D.teams].sort((x, y) => x.delay - y.delay); return { labels: o.map((t) => t.team), datasets: [{ data: o.map((t) => t.delay), backgroundColor: o.map((t) => teamColor(t.team)), borderRadius: 2, barPercentage: .62 }] }; })(),
      options: base({ id: 'c-bench', horizontal: true, valueLabel: BENCH.delay[1] })
    });
    const seg = el('c-bench').closest('.ed-right').querySelectorAll('.seg button');
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

  // ── 07 팬 반응 (H2′)
  ED({ eyebrow: '② 실수 → 여론', hl: `피트 실수 얘기가<br>나오면,<br>비판이 <em>${ratio}배</em>`,
    ctx: `팬·미디어 글 ${M.strategy_sentences}개 전략 문장의 감정을 읽었다. 작전 얘기는 차분하지만, 눈에 보이는 실수에는 바로 분노한다.`,
    left: `<div class="bignum a" style="--d:.35s">${count(se.pit_err.crit, 0, '', '%')}<span class="u">비판</span></div>`,
    right: `${rows([
      ['피트 실수를 말한 문장', `${r0(se.pit_err.crit)}%`, '이 중 비판의 비율'],
      ['다른 전략 이야기', `${r0(se.pit_err.ref)}%`],
      ['언더컷 같은 작전 이야기', `${r0(se.undercut.crit)}%`]])}
      <blockquote class="q a" style="--d:.6s">“한 번은 괜찮아도, 두 번은 심하고,<br>세 번은 용납 못 한다.”<cite>RaceFans 독자 댓글 · 2024 자우버 피트 실수</cite></blockquote>
      <blockquote class="q a" style="--d:.72s">“그리고 피트스톱은 완전히 재앙이었다.”<cite>막스 페르스타펜 · 2024 오스트리아 GP</cite></blockquote>`,
    source: `출처: f1_text_sentences.csv (Firecrawl ${M.docs}건 · ${nf(M.sentences)}문장) · 규칙 기반 감정 분류 · Fisher ${pv(se.pit_err.p)}` });

  // ── 08 반전 (H2)
  ED({ eyebrow: '② 실수 → 여론', hl: `팬들은 성적이 아닌<br><em>'기대'</em>에<br>분노한다`,
    ctx: '피트 실수가 가장 많은 하스는 칭찬받고, 피트가 상위권인 페라리는 비판받는다. 팀 단위로 보면 피트 실력과 팬 신뢰는 관계가 없다.',
    right: `<div class="mini a" style="--d:.25s">3초 이상 늦은 피트 비율 × 팬 신뢰 점수 · 원 크기 = 글의 양</div>
      <div class="chart-box a" style="--d:.3s;margin-top:12px" data-noclick><canvas id="c-twist" width="940" height="390"></canvas></div>
      <div style="margin-top:20px">${rows([
        [`${tn('Haas')} 피트 실수 1위`, `<span class="ans yes">칭찬</span>`, '"하스는 작전을 정말 영리하게 썼다" — 알본'],
        [`${tn('Ferrari')} 피트 상위권`, `<span class="ans no">비판 ${r0(fe.crit)}%</span>`, '기대가 클수록 실망도 크다']], .5)}</div>`,
    source: `출처: f1_team_crossmap.csv · Spearman ρ = ${sg(c1.rho)} (${pv(c1.p)}) · 신뢰 점수 = (긍정 − 비판) ÷ 전략 문장 × 100 · * 글이 적은 팀` });
  charts[slides.length - 1] = [() => new Chart(el('c-twist'), {
    type: 'bubble',
    data: { datasets: D.teams.map((t) => ({ label: t.team, data: [{ x: t.err, y: t.trust, r: Math.max(7, Math.sqrt(t.sent_n) * 2.3) }],
      backgroundColor: teamColor(t.team) + 'D9', borderColor: P.card, borderWidth: 2 })) },
    options: { ...chartCommon(), layout: { padding: { right: 30, top: 10 } },
      plugins: { legend: { display: false }, tooltip: tooltip((ctx) => { const t = T[ctx.dataset.label]; return `${t.team}: 3초+ 지연 ${r0(t.err)}% · 신뢰 ${sg(t.trust, 1)}${t.sent_n < 20 ? ' (글 적음)' : ''}`; }) },
      scales: { x: axis('', 4, 21), y: axis('', -20, 45) } },
    plugins: [bubbleLabels]
  })];

  // ── 09 사례: 자우버
  const maxDelay = Math.max(...sb.stops.map((s) => s.delta));
  ED({ eyebrow: '② 실수 → 여론', hl: '바퀴 너트 하나가<br>만든 최악의 평판',
    ctx: `2024년 자우버는 시즌 첫 3경기에서 피트가 무너졌다. 바퀴 너트가 안 풀려 24초, 29초씩 멈춰 섰고, 팬 신뢰 점수는 10개 팀 중 꼴찌가 됐다.`,
    left: `<div class="bignum a" style="--d:.35s">${count(sa.trust, 1)}<span class="u">신뢰 점수</span></div>`,
    right: `<div class="mini a" style="--d:.25s">시즌 첫 3경기 피트스톱 ${sb.early.n}번 · 평균보다 늦어진 시간</div>
      <div class="stops">${sb.stops.map((s, i) => `<div class="stop a" style="--d:${0.3 + i * 0.05}s">
        <span class="k"><span class="dim mono">R${s.round}</span> ${s.gp.replace('Saudi Arabian', 'Saudi')} · ${s.driver}</span>
        <span class="bar"><i class="grow" style="--d:${0.45 + i * 0.06}s;width:${Math.max(0.8, s.delta / maxDelay * 100)}%;background:${s.delta >= 3 ? P.red : s.delta >= 0.5 ? P.amber : '#D1D5DB'}"></i></span>
        <span class="v${s.delta >= 3 ? ' hot' : ''}">${sg(s.delta, 1)}초</span></div>`).join('')}</div>
      <p class="ctx a" style="--d:.9s;margin-top:28px;font-size:24px">문제 기간 평균 <b class="mono" style="color:var(--f1-red)">${sg(sb.early.delay, 1)}초</b> → 해결 후 <b class="mono">${sg(sb.late.delay, 1)}초</b></p>`,
    source: '출처: f1_pitstops_clean.csv (Sauber 2024 1~3라운드 vs 이후) · f1_sentiment_analysis.csv · The Race · Motorsport.com' });

  // ── 10 한눈에
  const ext = (k, f) => { const v = D.teams.map((t) => t[k]); return f === 'min' ? Math.min(...v) : Math.max(...v); };
  const cls = (k, v, good) => v === ext(k, good) ? 'best' : v === ext(k, good === 'min' ? 'max' : 'min') ? 'hot' : '';
  ED({ eyebrow: '③ 정리', hl: '실력은 <span class="cy">순위</span>를,<br>기대는 <em>여론</em>을<br>움직인다',
    ctx: '네 가지 질문 중 세 가지는 "그렇다". 피트 실력과 팬 신뢰만은 따로 움직였다.',
    right: `<table class="tower a" style="--d:.3s">
        <thead><tr><th></th><th>팀</th><th>평균 지연</th><th>3초+ 지연</th><th>언더컷 성공</th><th>팬 신뢰</th></tr></thead>
        <tbody>${[...D.teams].sort((x, y) => x.finish - y.finish).map((t, i) => `<tr>
          <td class="dim">${i + 1}</td><td class="tn">${tn(t.team)}</td>
          <td class="${cls('delay', t.delay, 'min')}">${sg(t.delay)}초</td><td class="${cls('err', t.err, 'min')}">${r0(t.err)}%</td>
          <td class="${cls('uc_rate', t.uc_rate, 'max')}">${r0(t.uc_rate)}%</td>
          <td class="${cls('trust', t.trust, 'max')}">${sg(t.trust, 0)}${t.sent_n < 20 ? '*' : ''}</td></tr>`).join('')}</tbody>
      </table>`,
    source: '출처: f1_team_crossmap.csv · 순서 = 2022–24 평균 완주 순위 · 굵은 보라 = 최고, 빨강 = 최저 · * 글이 적은 팀(Williams, Alpine)' });

  // ── 11 주의할 점
  ED({ eyebrow: '③ 정리', hl: '이 결과를 읽을 때<br>주의할 점',
    ctx: '더 정확한 결론을 위해, 다음 분석에서는 정확한 정지 시간과 세이프티카 데이터로 다시 확인한다.',
    right: rows([
      ['팀이 10개뿐', '', '팀끼리 비교한 결과는 참고용'],
      ['피트 시간 = 피트레인 통과 시간', '', '바퀴 교체 정지 시간과는 다르다'],
      ['세이프티카 구간 미구분', '', '그때 들어간 피트도 함께 계산'],
      ['감정 분류는 자동', '', '사람이 한 문장씩 검수하진 않았다'],
      ['팀별 글 양이 다름', '', `적은 팀 ${Math.min(...D.teams.map((t) => t.sent_n))}문장 · 많은 팀 ${Math.max(...D.teams.map((t) => t.sent_n))}문장`],
      ['Reddit 제외', '', '수집 도구가 지원하지 않음']], .25),
    source: '출처: log/decisions.md · analysis/findings.md 「한계와 다음 단계」' });

  // ── 12 결론
  ED({ eyebrow: '결론', hl: '0.5초는 순위를,<br>기대는 마음을<br>움직인다',
    ctx: '질문 받겠습니다. <span class="dim">— Box, box.</span>',
    right: rows([
      ['늦은 피트는 순위를 잃는다', `<span class="v-big">0.5초</span>`],
      ['실수는 바로 비판받는다', `<span class="v-big">${r0(se.pit_err.crit)}%</span>`],
      ['팬의 신뢰는 기대가 정한다', `<span class="v-big cy">기대</span>`]], .3),
    source: '재현: scripts/analysis/2026-10-25_f1-*.py → data/processed/f1_*.csv → slides/f1/deck-data.js' });

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
    const { ctx } = ch; ctx.save(); ctx.font = '600 18px "Pretendard"'; ctx.textBaseline = 'middle';
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
