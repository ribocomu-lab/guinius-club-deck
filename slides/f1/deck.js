// F1 레이스 전략 × 팬덤 여론 덱 — 슬라이드 마크업 생성 · Chart.js 차트 · 진입 모션
// 수치는 전부 deck-data.js(window.F1, 자동 생성)에서 읽는다. 슬라이드 전환·스케일·키보드는 references/design/slide-engine.js.
(function () {
  const D = window.F1, M = D.meta;
  const TEAM_VAR = { 'Red Bull': 'redbull', Ferrari: 'ferrari', Mercedes: 'mercedes', McLaren: 'mclaren', 'Aston Martin': 'astonmartin',
    Alpine: 'alpine', Williams: 'williams', RB: 'rb', Sauber: 'sauber', Haas: 'haas' };
  const css = getComputedStyle(document.documentElement);
  const cv = (n) => css.getPropertyValue(n).trim();
  const teamColor = (t) => cv('--team-' + TEAM_VAR[t]);
  const T = Object.fromEntries(D.teams.map((t) => [t.team, t]));
  const nf = (v, d = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sg = (v, d = 2) => (v > 0 ? '+' : v < 0 ? '−' : '') + nf(Math.abs(v), d);
  const pv = (p) => p < 0.001 ? 'p < 0.001' : 'p = ' + (p < 0.01 ? p.toFixed(3) : p.toFixed(2));
  const tag = (t) => `<span class="team-tag" style="--tc:${teamColor(t)}">${t}</span>`;
  // 카운트업 숫자: data-count 값까지 템플릿 eo 이징으로 증가
  const count = (v, d = 0, pre = '', suf = '') => `<span data-count="${v}" data-dec="${d}" data-pre="${pre}" data-suf="${suf}">${pre}${nf(v, d)}${suf}</span>`;
  const N = 12;

  const slides = [];
  const charts = {};   // 슬라이드 번호 → 차트 생성 함수 목록
  const S = (kicker, title, body, source, opt = {}) => slides.push({ kicker, title, body, source, ...opt });


  // ── 스토리라인: 레이스처럼 GRID(문제) → S1 실행력→순위 → S2 실수→여론 → S3 종합. 각 장 제목 아래 한 줄로 앞 장과 이어 준다
  const SECTORS = [['GRID', '문제·가설'], ['S1', '실행력 → 순위'], ['S2', '실수 → 여론'], ['S3', '종합·한계']];
  const sectorBar = (cur) => `<div class="sectors a" style="--d:.05s" aria-label="스토리 위치: ${SECTORS[cur][0]} ${SECTORS[cur][1]}">${SECTORS.map(([k, t], j) =>
    `<div class="sec${j === cur ? ' on' : j < cur ? ' done' : ''}"><span>${k} · ${t}</span><i></i></div>`).join('')}</div>`;
  const STORY = {
    'PROBLEM': [0, `피트스톱은 드라이버마다 레이스당 평균 1.7~2회 — 이 몇 초가 순위와 여론을 바꾸는지 4개 가설로 검증했다`],
    'EVIDENCE · H1a': [1, `첫 번째 질문: 정말 0.5초가 차이를 만드나? ${nf(D.meta.stops)}번의 스톱을 비교하자 느린 스톱은 3랩 뒤 확실히 더 뒤처졌다`],
    'EVIDENCE · H1b': [1, '0.5초는 언더컷 수싸움에서 더 크게 증폭된다 — 같은 타이밍이라도 스톱이 느리면 성공률이 절반 아래로 떨어진다'],
    'BENCHMARK': [1, '그렇다면 누가 빠른가 — 팀 간 피트 실행력 차이는 레이스마다 약 1.7초, 세 시즌 내내 거의 그대로였다'],
    'FANDOM · H2′': [2, '두 번째 질문: 이 몇 초는 팬의 말에도 남는가? 피트 실수가 언급되는 순간 문장은 비판으로 바뀐다'],
    'TWIST · H2 기각': [2, '그런데 팀 단위로 모으면 관계가 사라진다 — 팬은 절대 성적이 아니라 기대 대비 성과로 팀을 평가한다'],
    'CASE': [2, '실행이 무너지고 기대마저 낮아지면 두 데이터가 같은 방향을 가리킨다 — 2024 시즌 초 자우버가 그 예다'],
    'MATRIX': [3, '정리하면 정량은 "0.5초가 순위를 바꾼다"를, 정성은 "실수는 기억되지만 평균 여론은 기대가 정한다"를 말한다'],
    'LIMITS': [3, '결론의 강도는 데이터의 해상도만큼이다 — 아래 6가지는 다음 분석에서 보완할 지점이다']
  };

  // ── 01 타이틀
  slides.push({ raw: `
    <svg class="a" style="--d:.1s;position:absolute;left:0;top:640px" width="1920" height="260" viewBox="0 0 1920 260" aria-hidden="true">
      <path class="line-draw" style="--len:2600;--d:.2s" d="M0 170 L220 170 L260 120 L300 200 L340 90 L380 170 L700 170 L730 150 L760 175 L880 175 L920 70 L960 215 L1000 150 L1040 172 L1920 172" fill="none" stroke="#00F5D4" stroke-width="3" opacity=".7"/>
      <path class="line-draw" style="--len:2600;--d:.5s" d="M0 205 L500 205 L540 188 L580 208 L1920 208" fill="none" stroke="#E10600" stroke-width="2" opacity=".6"/>
    </svg>

    <svg class="car" style="position:absolute;left:1120px;top:618px" width="700" height="202" viewBox="0 0 900 260" aria-label="F1 레이스카 측면 실루엣" role="img">
      <g class="speed" stroke-linecap="round" opacity=".55">
        <line x1="-260" y1="120" x2="40" y2="120" stroke="#00F5D4" stroke-width="3"/><line x1="-180" y1="150" x2="60" y2="150" stroke="#8F9CAE" stroke-width="2"/><line x1="-320" y1="185" x2="20" y2="185" stroke="#E10600" stroke-width="3"/>
      </g>
      <ellipse cx="440" cy="236" rx="360" ry="10" fill="#000" opacity=".55"/>
      <!-- 리어윙 -->
      <rect x="66" y="52" width="118" height="16" rx="3" fill="#E10600"/><rect x="72" y="74" width="100" height="9" rx="2" fill="#141822" stroke="#E10600" stroke-width="2"/>
      <path d="M78 52 L98 52 L112 176 L92 176 Z" fill="#141822" stroke="#242B3B" stroke-width="2"/>
      <!-- 바닥판 -->
      <path d="M120 206 L770 206 L780 214 L120 214 Z" fill="#05070A"/>
      <!-- 차체(엔진 커버·콕핏·노즈) -->
      <path d="M108 168 L150 126 L290 104 L352 66 L404 64 L424 96 L470 100 L530 112 L650 142 L770 162 L800 172 L772 182 L600 182 L520 196 L300 200 L130 198 Z" fill="#1B2130" stroke="#3a4458" stroke-width="2"/>
      <!-- 사이드포드 -->
      <path d="M232 156 Q 300 124 446 134 L530 152 L526 194 L246 196 Z" fill="#242B3B"/>
      <path d="M250 170 L520 166" stroke="#00F5D4" stroke-width="4"/>
      <path d="M150 126 L290 104 L352 66" fill="none" stroke="#E10600" stroke-width="4"/>
      <text x="330" y="160" font-family="JetBrains Mono, monospace" font-weight="700" font-size="30" fill="#F5F7FA">0.5</text>
      <!-- 헤일로·헬멧 -->
      <circle cx="456" cy="90" r="15" fill="#00F5D4"/><rect x="448" y="84" width="20" height="7" rx="2" fill="#0B0D12"/>
      <path d="M412 100 Q 462 58 528 104" fill="none" stroke="#8F9CAE" stroke-width="7" stroke-linecap="round"/>
      <!-- 프런트윙 -->
      <path d="M690 198 L868 198 L868 208 L690 208 Z" fill="#E10600"/><path d="M700 188 L860 190 L860 196 L700 196 Z" fill="#141822" stroke="#E10600" stroke-width="1.5"/>
      <rect x="852" y="166" width="14" height="44" rx="2" fill="#141822" stroke="#242B3B" stroke-width="2"/>
      <!-- 바퀴(소프트 컴파운드 사이드월) -->
      <g class="wheel"><circle cx="172" cy="178" r="56" fill="#07090C"/><circle cx="172" cy="178" r="44" fill="none" stroke="#E10600" stroke-width="4"/><circle cx="172" cy="178" r="28" fill="#242B3B"/><path d="M172 152 L172 204 M146 178 L198 178" stroke="#8F9CAE" stroke-width="4"/></g>
      <g class="wheel"><circle cx="694" cy="182" r="50" fill="#07090C"/><circle cx="694" cy="182" r="39" fill="none" stroke="#E10600" stroke-width="4"/><circle cx="694" cy="182" r="25" fill="#242B3B"/><path d="M694 159 L694 205 M671 182 L717 182" stroke="#8F9CAE" stroke-width="4"/></g>
    </svg>
    <div class="kicker a" style="--d:0s"><span class="tag">F1 2022–2024</span>RACE STRATEGY × FANDOM SENTIMENT</div>
    <h1 style="position:absolute;left:100px;top:230px;margin:0;font:700 150px/1.02 var(--display);letter-spacing:-.03em">
      <span class="mask"><span style="--d:.1s"><span class="mono" style="color:var(--f1-red)">0.5</span>초의</span></span>
      <span class="mask"><span style="--d:.25s">나비효과</span></span>
    </h1>
    <p class="txt a" style="--d:.6s;position:absolute;left:100px;top:600px;font-size:34px;color:var(--f1-text-secondary)">피트스톱 실행력은 순위를 바꾸고, 팬덤 여론은 <b>성적이 아니라 기대</b>에 반응한다</p>
    <div style="position:absolute;right:100px;top:120px;width:560px;display:flex;flex-direction:column;gap:14px">
      <div class="hud-card cut a" style="--d:.35s;--line:var(--f1-red)">
        <div class="label">Kaggle · 정량</div>
        <div class="mid" style="margin:14px 0 6px">${count(M.stops)}<span class="unit">피트스톱</span></div>
        <div class="txt sm">${M.races}개 레이스 · 랩 ${nf(M.laps)}행 · 언더컷 시도 ${M.undercuts}건</div>
      </div>
      <div class="hud-card cut a" style="--d:.5s">
        <div class="label">Firecrawl · 정성</div>
        <div class="mid" style="margin:14px 0 6px">${count(M.chars)}<span class="unit">자</span></div>
        <div class="txt sm">팬 포럼·미디어 ${M.docs}건 · 문장 ${nf(M.sentences)}개 · 전략 문장 ${M.strategy_sentences}개</div>
      </div>
    </div>
    <div class="footer a" style="--d:.8s"><span>Kaggle rohanrao F1 World Championship v24 · akashrane2609 Stint Data · Firecrawl(F1Technical · Autosport · RaceFans · The Race 외) · 2026-10-25</span><span class="pg"><b>01</b> / ${N}</span></div>` });


  // ── 02 기획 의도 · 유의미한 결과 요약 · 로드맵
  {
    const hy = [['H1a', '0.5초 지연 → 순위 손실', true, `3랩 뒤 ${sg(D.h1a.effect05)}계단 · ${pv(D.h1a.p05)}`],
      ['H1b', '스톱 열세 → 언더컷 실패', true, `성공률 ${D.h1b.ok}% → ${D.h1b.slow}% · ${pv(D.h1b.p)}`],
      ['H2′', '실수 언급 → 비판', true, `비판 ${D.sent.pit_err.crit}% vs ${D.sent.pit_err.ref}% · ${pv(D.sent.pit_err.p)}`],
      ['H2', '피트 성과 → 팀 신뢰', false, `ρ = ${sg(D.corr.err_trust.rho)} (${pv(D.corr.err_trust.p)}) → '기대 대비 성과'라는 새 설명`]];
    slides.push({ intent: true, kicker: 'INTENT · 기획 의도', title: '피트의 몇 초는 <em>순위</em>와 <span class="cy">여론</span>을 어떻게 바꾸나',
      lede: '타이밍 데이터(무엇이 일어났나)와 팬의 문장(어떻게 받아들여졌나)을 같은 10팀·3시즌으로 맞춰 교차 검증했다',
      source: '출처: brief/project-brief.md · analysis/findings.md 종합 결론 · f1_hypothesis_tests.csv · f1_correlations.csv',
      body: `
    <div class="body split" style="grid-template-columns:44fr 56fr">
      <div class="col">
        <div class="hud-card a" style="--d:.25s">
          <div class="label">왜 이 분석인가</div>
          ${[['추월이 어려운 현대 F1에서 순위는 트랙보다 <b>피트 사이클</b>에서 자주 바뀐다'], ['피트 실수는 중계와 커뮤니티에서 가장 <strong>즉각적인 비판</strong> 대상이다'], ["하지만 '빠른 피트 = 신뢰받는 팀'인지는 <b>데이터로 검증된 적이 없다</b>"]]
            .map(([t], i) => `<div style="display:grid;grid-template-columns:56px 1fr;gap:12px;margin-top:20px;align-items:start"><span class="mono" style="font-size:30px;font-weight:700;color:var(--f1-cyan)">0${i + 1}</span><p class="txt" style="font-size:25px;line-height:1.5">${t}</p></div>`).join('')}
        </div>
        <div class="hud-card a" style="--d:.45s;--line:var(--f1-red)">
          <div class="label">방법 · 같은 10팀 × 2022–24 시즌으로 정렬</div>
          <div style="display:flex;align-items:center;gap:14px;margin-top:18px;flex-wrap:wrap">
            <span class="chip">Kaggle 피트스톱 ${nf(D.meta.stops)}</span><span style="color:var(--f1-text-secondary)">+</span>
            <span class="chip">언더컷 ${D.meta.undercuts}</span><span style="color:var(--f1-text-secondary)">×</span>
            <span class="chip">Firecrawl 전략 문장 ${D.meta.strategy_sentences}</span>
          </div>
        </div>
        <div class="hud-card cut a" style="--d:.6s;--line:var(--f1-purple)">
          <div class="label">이 덱을 관통하는 두 메시지</div>
          <p class="txt" style="margin-top:14px;font-size:25px"><span class="mono" style="color:var(--f1-red);font-weight:700">①</span> <b>0.5초의 나비효과</b> — 피트의 몇 초가 순위를 바꾼다</p>
          <p class="txt" style="margin-top:8px;font-size:25px"><span class="mono" style="color:var(--f1-cyan);font-weight:700">②</span> <b>기대 대비 성과</b> — 팬의 신뢰는 성적이 아니라 기대가 정한다</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card cut a" style="--d:.35s;--line:var(--f1-cyan)">
          <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="label">유의미한 결과</span><span class="txt sm">가설 4개 중 <b style="font-size:28px">3개</b>가 p &lt; 0.001로 확인</span></div>
          ${hy.map(([h, k, ok, t], i) => `<div class="a" style="--d:${0.5 + i * 0.1}s;display:grid;grid-template-columns:70px 1fr auto;gap:14px;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--f1-surface-border)">
            <span class="chip">${h}</span><div><div style="font:700 23px/1.2 var(--body)">${k}</div><div class="mono" style="font-size:19px;color:var(--f1-text-secondary);margin-top:6px">${t}</div></div>
            <span class="verdict ${ok ? 'ok' : 'no'}">${ok ? '유의' : '반대'}</span></div>`).join('')}
        </div>
        <div class="a" style="--d:.9s;display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          ${[['GRID', '문제·가설', '3'], ['S1', '실행력 → 순위', '4–6'], ['S2', '실수 → 여론', '7–9'], ['S3', '종합·한계', '10–12']].map(([k, t, pg], j) =>
            `<div class="hud-card" style="padding:16px 18px;--line:${['var(--f1-text-secondary)', 'var(--f1-red)', 'var(--f1-yellow)', 'var(--f1-cyan)'][j]}"><div class="mono" style="font-size:20px;font-weight:700">${k}</div><div style="font:600 19px/1.3 var(--body);margin-top:6px">${t}</div><div class="mono" style="font-size:16px;color:var(--f1-text-secondary);margin-top:6px">p.${pg}</div></div>`).join('')}
        </div>
      </div>
    </div>` });
  }

  // ── 02 문제 정의
  const cmp = D.compounds, cmpTot = Object.values(cmp).reduce((a, b) => a + b, 0);
  const cmpRow = [['S', 'tyre-soft', 'SOFT', '#E10600'], ['M', 'tyre-medium', 'MEDIUM', '#FFD000'], ['H', 'tyre-hard', 'HARD', '#FFFFFF'], ['I', '', 'INTERMEDIATE', '#43B02A'], ['W', '', 'WET', '#0067AD']];
  const sr = D.teams.map((t) => t.stops_race), srMin = D.teams.find((t) => t.stops_race === Math.min(...sr)), srMax = D.teams.find((t) => t.stops_race === Math.max(...sr));
  S('PROBLEM', '레이스는 트랙이 아니라 <span class="cy">피트레인</span>에서 갈린다', `
    <div class="body split">
      <div class="col">
        <p class="txt a" style="--d:.2s">현대 F1의 추월은 트랙보다 <b>피트 사이클</b>에서 더 자주 일어난다. 언제 들어가고(언더컷), 얼마나 빨리 나오며(피트 실행력), 어떤 타이어를 끼우는지가 순위를 바꾼다.</p>
        <div class="hud-card a" style="--d:.35s">
          <div class="label">피트레인 통과 시간 중앙값 · 2022–24</div>
          <div class="big" style="margin-top:12px">${count(M.pit_lane_median, 2)}<span class="unit">초</span></div>
          <p class="txt sm" style="margin-top:10px">드라이버 1명이 레이스마다 평균 ${nf(srMin.stops_race, 2)}~${nf(srMax.stops_race, 2)}회 들어온다 (${srMin.team} ~ ${srMax.team})</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.45s">
          <div class="label">타이어 스틴트 ${nf(cmpTot)}개의 컴파운드 구성</div>
          <div style="display:flex;height:46px;margin:20px 0 16px;border-radius:6px;overflow:hidden" class="grow">
            ${cmpRow.map(([, , k, c]) => `<div style="width:${cmp[k] / cmpTot * 100}%;background:${c}" title="${k} ${cmp[k]}"></div>`).join('')}
          </div>
          <div style="display:flex;gap:26px;flex-wrap:wrap">
            ${cmpRow.map(([b, cls, k, c]) => `<span style="display:inline-flex;gap:10px;align-items:center;font:600 20px/1 var(--mono)"><span class="tyre-badge ${cls}" style="${cls ? '' : `border-color:${c};color:${c}`}">${b}</span>${k} ${nf(cmp[k])}</span>`).join('')}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          ${[['H1a', '0.5초 지연', '레이스 평균보다 0.5초 이상 느린 스톱은 순위를 더 잃는다'], ['H1b', '언더컷', '공격 측 스톱이 0.5초 이상 느리면 언더컷 성공률이 떨어진다'],
             ['H2', '팀 여론', '피트 성과가 나쁜 팀일수록 팬 신뢰가 낮다'], ['H2′', '문장 여론', '피트 실수를 말하는 문장은 더 비판적이다']]
            .map(([h, k, t], i) => `<div class="hud-card a" style="--d:${0.6 + i * 0.1}s;padding:20px 22px;--line:${i < 2 ? 'var(--f1-red)' : 'var(--f1-cyan)'}">
              <div style="display:flex;gap:12px;align-items:center"><span class="chip">${h}</span><span class="label">${k}</span></div>
              <p class="txt sm" style="margin-top:12px;color:var(--f1-text-primary)">${t}</p></div>`).join('')}
        </div>
      </div>
    </div>`, '출처: brief/project-brief.md · f1_strategy_stats.csv · akashrane2609 스틴트 데이터(2022–24) · 피트레인 시간 = 진입~이탈(정지 시간 아님)');

  // ── 03 0.5초의 대가 (H1a)
  const a = D.h1a;
  S('EVIDENCE · H1a', '0.5초 늦으면, 3랩 뒤 <em>0.65계단</em>을 더 잃는다', `
    <div class="body split">
      <div class="col">
        <div class="hud-card cut a" style="--d:.2s;--line:var(--f1-red)">
          <div class="label">지연 스톱(≥ +0.5s) − 정상 스톱 · 피트 직전 → 3랩 뒤 순위</div>
          <div class="big red" style="margin-top:14px">${count(a.effect05, 2)}<span class="unit">계단</span></div>
          <p class="txt sm" style="margin-top:12px">95% CI [${a.ci05[0]}, ${a.ci05[1]}] · Mann-Whitney ${pv(a.p05)} · n = ${nf(a.n05)} vs ${nf(a.nref05)}</p>
        </div>
        <div class="hud-card a" style="--d:.35s">
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="label">≥ +3s 큰 실수</span><span class="delta-badge slow">${sg(a.effect3)}계단</span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px"><span class="label">지연(초) × 순위 변동</span><span class="delta-badge warn">ρ = ${a.rho}</span></div>
          <p class="txt sm" style="margin-top:16px">효과는 작지만(ρ ≈ −0.16) ${nf(M.stops)}건 전체에서 일관된다. 피트 사이클 중이라 평균 자체는 음수가 정상, <b>차이</b>가 핵심이다.</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.3s;height:100%">
          <div class="label">레이스 중앙값 대비 피트레인 지연 구간별 · 평균 순위 변동 (L−1 → L+3)</div>
          <div class="chart-box" style="margin-top:18px"><canvas id="c-h1a" width="1020" height="520"></canvas></div>
        </div>
      </div>
    </div>`, `출처: f1_pitstops_clean.csv(${nf(M.stops)}건, 레드 플래그 212건 제외) · f1_hypothesis_tests.csv · 부트스트랩 3,000회 · SC/VSC 구간 미분리`);
  charts[slides.length - 1] = [() => new Chart(el('c-h1a'), {
    type: 'bar',
    data: { labels: a.buckets.map((b) => [`${b.label}`, `n = ${nf(b.n)}`]),
      datasets: [{ data: a.buckets.map((b) => b.mean), backgroundColor: ['#00F5D4', '#FFC700', '#E10600'], borderRadius: 6, barPercentage: .62 }] },
    options: base({ id: 'c-h1a', y: { title: '평균 순위 변동 (계단)', min: -4, max: 0 }, valueLabel: (v) => sg(v, 2) })
  })];

  // ── 04 언더컷 (H1b)
  const b = D.h1b;
  const defTop = [...D.teams].filter((t) => t.uc_def >= 10).sort((x, y) => y.uc_def_rate - x.uc_def_rate);
  S('EVIDENCE · H1b', '언더컷 성공률 <span class="cy">53.3%</span> → <em>21.7%</em>', `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.25s;height:100%">
          <div class="label">언더컷 시도 ${M.undercuts}건 · 공격 측과 수비 측의 피트레인 시간 차</div>
          <div class="chart-box" style="margin-top:18px"><canvas id="c-h1b" width="1020" height="520"></canvas></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card cut a" style="--d:.35s;--line:var(--f1-red)">
          <div class="label">공격 측이 ≥ 0.5초 느릴 때</div>
          <div class="big red" style="margin-top:12px">${count(b.diff, 1, '', '')}<span class="unit">%p</span></div>
          <p class="txt sm" style="margin-top:10px">Fisher exact ${pv(b.p)} · point-biserial r = ${b.r} (${pv(b.r_p)})</p>
        </div>
        <div class="hud-card a" style="--d:.5s">
          <div class="label">앞에서 지키는 팀 · 언더컷 방어율</div>
          ${defTop.slice(0, 2).concat(defTop.slice(-1)).map((t, i) => `<div style="display:grid;grid-template-columns:200px 1fr 90px;gap:14px;align-items:center;margin-top:18px">
            ${tag(t.team)}<div class="gauge"><i class="grow" style="--d:${0.7 + i * 0.12}s;width:${t.uc_def_rate}%;--gc:${teamColor(t.team)}"></i></div>
            <span class="mono" style="text-align:right;font-size:24px">${nf(t.uc_def_rate, 1)}%</span></div>`).join('')}
          <p class="txt sm" style="margin-top:16px">전체 성공률 ${b.overall}% (2022 ${b.by_year['2022']} · 2023 ${b.by_year['2023']} · 2024 ${b.by_year['2024']}%)</p>
        </div>
      </div>
    </div>`, '출처: f1_undercut_events.csv · 시도 = 앞차와 1순위·3초 이내 다른 팀 차량보다 먼저 피트 → 상대가 1~3랩 내 피트 · 성공 = 상대 피트 다음 랩에 앞섬 · 방어율은 10건 이상 팀');
  charts[slides.length - 1] = [() => new Chart(el('c-h1b'), {
    type: 'bar',
    data: { labels: [['공격 측이 0.5초 이상 느림', `n = ${b.n_slow}`], ['그 외', `n = ${b.n_ok}`]],
      datasets: [{ data: [b.slow, b.ok], backgroundColor: ['#E10600', '#00F5D4'], borderRadius: 6, barPercentage: .5 }] },
    options: base({ id: 'c-h1b', y: { title: '언더컷 성공률 (%)', min: 0, max: 70 }, valueLabel: (v) => nf(v, 1) + '%', refLine: { value: b.overall, label: `전체 ${b.overall}%` } })
  })];

  // ── 05 팀 벤치마크 (인터랙티브)
  const rb = T['Red Bull'], hs = T.Haas, ml = T.McLaren;
  S('BENCHMARK', '레드불 <span class="cy">+0.20초</span> vs 하스 <em>+1.87초</em>: 피트 실행력은 팀 서열을 따른다', `
    <div class="body split">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:${teamColor('Red Bull')}">
          ${tag('Red Bull')}
          <div style="display:flex;gap:28px;margin-top:16px;align-items:baseline"><span class="mid cool">${sg(rb.delay)}<span class="unit">s</span></span><span class="txt sm">에러율 ${rb.err}% · 지연 ${rb.slow}%</span></div>
        </div>
        <div class="hud-card a" style="--d:.32s;--line:${teamColor('Haas')}">
          ${tag('Haas')}
          <div style="display:flex;gap:28px;margin-top:16px;align-items:baseline"><span class="mid hot">${sg(hs.delay)}<span class="unit">s</span></span><span class="txt sm">에러율 <strong>${hs.err}%</strong> · 지연 ${hs.slow}%</span></div>
        </div>
        <div class="hud-card a" style="--d:.44s;--line:${teamColor('McLaren')}">
          <div class="label">${tag('McLaren')} 에러율(≥+3s) 시즌별</div>
          <div style="display:flex;gap:18px;margin-top:18px;align-items:center;font:700 34px/1 var(--mono)">
            <span>${ml.err_by_year['2022']}%</span><span style="color:var(--f1-text-secondary)">→</span><span class="hot">${ml.err_by_year['2023']}%</span><span style="color:var(--f1-text-secondary)">→</span><span class="cool">${ml.err_by_year['2024']}%</span>
          </div>
          <p class="txt sm" style="margin-top:12px">2023 급등 뒤 2024 회복 — 같은 팀도 시즌마다 크게 달라진다</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card a" style="--d:.3s;height:100%">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:16px">
            <span class="label" id="bench-label">평균 지연 (초, 레이스 중앙값 대비)</span>
            <div class="seg" role="group" aria-label="지표 선택" data-noclick>
              <button data-m="delay" aria-pressed="true">지연(s)</button><button data-m="slow" aria-pressed="false">≥+0.5s</button>
              <button data-m="err" aria-pressed="false">≥+3s 에러</button><button data-m="uc_rate" aria-pressed="false">언더컷</button>
            </div>
          </div>
          <div class="chart-box" style="margin-top:16px" data-noclick><canvas id="c-bench" width="1020" height="530"></canvas></div>
        </div>
      </div>
    </div>`, `출처: f1_strategy_stats.csv (2022–2024 합산, 팀당 214~251스톱) · 전체 에러율 ${M.err_all}% · 지연 비율 ${M.slow_all}% · 오른쪽 위 버튼으로 지표 전환`);
  const BENCH = { delay: ['평균 지연 (초, 레이스 중앙값 대비)', (v) => sg(v, 2) + 's'], slow: ['지연 스톱 비율 (≥ +0.5s, %)', (v) => nf(v, 1) + '%'],
    err: ['피트스톱 에러율 (≥ +3s, %)', (v) => nf(v, 1) + '%'], uc_rate: ['언더컷 성공률 (%) · 시도 수', (v) => nf(v, 1) + '%'] };
  charts[slides.length - 1] = [() => {
    const ch = new Chart(el('c-bench'), {
      type: 'bar',
      data: (() => { const o = [...D.teams].sort((x, y) => x.delay - y.delay); return { labels: o.map((t) => t.team), datasets: [{ data: o.map((t) => t.delay), backgroundColor: o.map((t) => teamColor(t.team)), borderRadius: 6, barPercentage: .72 }] }; })(),
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

  // ── 06 팬덤 여론 마이닝 (H2′)
  const se = D.sent, dist = se.dist, ratio = se.pit_err.crit / se.pit_err.ref;
  S('FANDOM · H2′', '피트 실수가 언급되면 비판이 <em>8배</em>로 뛴다', `
    <div class="body split">
      <div class="col">
        <div class="hud-card cut a" style="--d:.2s;--line:var(--f1-red)">
          <div class="label">"slow / bad stop · botched · wheel nut" 문장의 비판 비율</div>
          <div class="big red" style="margin-top:12px">${count(se.pit_err.crit, 1, '', '%')}</div>
          <p class="txt sm" style="margin-top:10px">기타 전략 문장 ${se.pit_err.ref}% (n = ${se.pit_err.n} vs ${se.pit_err.n_ref}) · ×${nf(ratio, 1)} · Fisher ${pv(se.pit_err.p)}</p>
        </div>
        <div class="hud-card a" style="--d:.35s">
          <div class="label">언더컷/오버컷 언급 문장은?</div>
          <p class="txt" style="margin-top:10px">비판 <b>${se.undercut.crit}%</b> vs 기타 ${se.undercut.ref}% (${pv(se.undercut.p)}) — 전략 <b>과정</b>은 분석하고, 눈에 보이는 <strong>실수</strong>에는 즉각 분노한다.</p>
        </div>
        <div class="a" style="--d:.5s;display:flex;flex-wrap:wrap;gap:10px">${se.bigrams.slice(0, 6).map(([w, c]) => `<span class="chip">${w} <span style="color:var(--f1-cyan)">${c}</span></span>`).join('')}</div>
      </div>
      <div class="col" style="display:grid;grid-template-columns:380px 1fr;gap:24px">
        <div class="hud-card a" style="--d:.3s">
          <div class="label">전략 문장 ${M.strategy_sentences}개 감성</div>
          <div class="chart-box" style="margin-top:14px"><canvas id="c-sent" width="330" height="330"></canvas></div>
          <div style="display:grid;gap:10px;margin-top:16px;font:600 20px/1 var(--mono)">
            ${[['중립', '#FFC700'], ['긍정', '#00F5D4'], ['비판', '#E10600'], ['불안', '#B100CD']].map(([k, c]) => `<span style="display:flex;justify-content:space-between"><span style="display:flex;gap:10px;align-items:center"><i style="width:14px;height:14px;border-radius:3px;background:${c}"></i>${k}</span><span>${dist[k]} · ${nf(dist[k] / M.strategy_sentences * 100, 1)}%</span></span>`).join('')}
          </div>
        </div>
        <div class="col">
          ${[['One race is acceptable, while two is already a stretch, & three definitely unacceptable on this level.', 'RaceFans 독자 댓글 · 2024 자우버 피트 실수 기사'],
             ['…and then came the pit stops which were an absolute disaster.', '막스 페르스타펜 · 2024 오스트리아 GP (F1Technical 기사 인용)'],
             ['I\'m pissed off since we were too stupid to choose a correct strategy.', '프란츠 토스트(알파타우리) · 2023 F1Technical 팬 스레드 인용']]
            .map(([q, c], i) => `<div class="hud-card a" style="--d:${0.45 + i * 0.12}s;--line:var(--f1-red)"><p class="quote">${q}<cite>${c}</cite></p></div>`).join('')}
        </div>
      </div>
    </div>`, `출처: f1_text_sentences.csv (Firecrawl ${M.docs}건 → ${nf(M.sentences)}문장) · 규칙 기반 라벨(비판/불안/긍정 어휘 + VADER, 부정어 처리) · f1_hypothesis_tests.csv`);
  charts[slides.length - 1] = [() => new Chart(el('c-sent'), {
    type: 'doughnut',
    data: { labels: ['중립', '긍정', '비판', '불안'], datasets: [{ data: ['중립', '긍정', '비판', '불안'].map((k) => dist[k]), backgroundColor: ['#FFC700', '#00F5D4', '#E10600', '#B100CD'], borderColor: '#141822', borderWidth: 3 }] },
    options: { ...chartCommon(), cutout: '62%', plugins: { legend: { display: false }, tooltip: tooltip() } }
  })];

  // ── 07 가설의 반전 (H2 기각)
  const c1 = D.corr.err_trust, c2 = D.corr.err_trust_doc, fe = T.Ferrari;
  S('TWIST · H2 기각', '피트가 느린 팀의 팬이 <span class="cy">더 너그럽다</span>', `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.25s;height:100%">
          <div class="label">피트스톱 에러율 × 팬 신뢰 지수 (원 크기 = 전략 문장 수)</div>
          <div class="chart-box" style="margin-top:12px" data-noclick><canvas id="c-twist" width="1020" height="540"></canvas></div>
        </div>
      </div>
      <div class="col">
        <div class="hud-card cut a" style="--d:.35s;--line:var(--f1-yellow)">
          <div class="label">Spearman ρ · 10팀</div>
          <div style="display:flex;gap:24px;align-items:baseline;margin-top:12px"><span class="mid ye">${sg(c1.rho, 2)}</span><span class="txt sm">${pv(c1.p)} · 95% CI [${c1.lo}, ${c1.hi}]</span></div>
          <p class="txt sm" style="margin-top:10px">문서 균형 지수로 보면 ρ = <b>${sg(c2.rho, 2)}</b> (${pv(c2.p)}) — 가설과 <strong>반대 방향</strong></p>
        </div>
        <div class="hud-card a" style="--d:.5s;--line:${teamColor('Haas')}">
          <div class="label">하위권 · 포인트 하나에도 박수</div>
          <p class="txt" style="margin-top:8px">${tag('Haas')} 에러율 <strong>${hs.err}%</strong>(최고) · 신뢰 <b>${sg(hs.trust, 1)}</b></p>
          <p class="quote" style="font-size:20px;margin-top:10px">Haas did a great job with strategy using Kevin to hold up the group, which was very smart.<cite>알렉산더 알본 · 2024 사우디 GP (RaceFans)</cite></p>
        </div>
        <div class="hud-card a" style="--d:.65s;--line:${teamColor('Ferrari')}">
          <div class="label">상위권 · 우승을 놓친 판단에 비판</div>
          <p class="txt" style="margin-top:8px">${tag('Ferrari')} 에러율 <b>${fe.err}%</b> · 비판 <strong>${fe.crit}%</strong> · 신뢰 ${sg(fe.trust, 1)}</p>
        </div>
      </div>
    </div>`, '출처: f1_team_crossmap.csv · f1_correlations.csv (부트스트랩 2,000회, 평균 완주 순위 통제 편상관 병기) · 신뢰 지수 = (긍정 − 비판) ÷ 전략 문장 × 100');
  charts[slides.length - 1] = [() => new Chart(el('c-twist'), {
    type: 'bubble',
    data: { datasets: D.teams.map((t) => ({ label: t.team, data: [{ x: t.err, y: t.trust, r: Math.max(8, Math.sqrt(t.sent_n) * 2.6) }],
      backgroundColor: teamColor(t.team) + 'CC', borderColor: teamColor(t.team), borderWidth: 2 })) },
    options: { ...chartCommon(), layout: { padding: { right: 30, top: 10 } },
      plugins: { legend: { display: false }, tooltip: tooltip((ctx) => { const t = T[ctx.dataset.label]; return `${t.team}: 에러율 ${t.err}% · 신뢰 ${sg(t.trust, 1)} · 전략 문장 ${t.sent_n}${t.sent_n < 20 ? ' (표본 적음)' : ''}`; }) },
      scales: { x: axis('피트스톱 에러율 (≥ +3s, %)', 4, 21), y: axis('팬 신뢰 지수', -20, 45) } },
    plugins: [bubbleLabels]
  })];

  // ── 08 결정적 케이스: 자우버
  const sb = D.sauber, sa = T.Sauber, maxDelay = Math.max(...sb.stops.map((s) => s.delta));
  S('CASE', '데이터가 일치한 순간: 2024 <span style="color:var(--team-sauber)">자우버</span> 휠너트', `
    <div class="body split rev">
      <div class="col">
        <div class="hud-card a" style="--d:.2s;--line:var(--team-sauber);height:100%">
          <div class="label">2024 1~3라운드 자우버 피트스톱 ${sb.early.n}건 · 레이스 중앙값 대비 지연</div>
          <div style="display:grid;gap:14px;margin-top:24px">
            ${sb.stops.map((s, i) => `<div style="display:grid;grid-template-columns:270px 1fr 120px;gap:16px;align-items:center;font:500 21px/1 var(--body)">
              <span style="white-space:nowrap"><span class="mono" style="color:var(--f1-text-secondary)">R${s.round}</span> ${s.gp.replace('Saudi Arabian', 'Saudi')} · ${s.driver} <span class="mono" style="color:var(--f1-text-secondary)">L${s.lap}</span></span>
              <div class="gauge"><i class="grow" style="--d:${0.35 + i * 0.07}s;width:${Math.max(1.5, s.delta / maxDelay * 100)}%;--gc:${s.delta >= 3 ? 'var(--f1-red)' : s.delta >= 0.5 ? 'var(--f1-yellow)' : 'var(--f1-cyan)'}"></i></div>
              <span class="delta-badge ${s.delta >= 3 ? 'slow' : s.delta >= 0.5 ? 'warn' : 'fast'}" style="justify-self:end">${sg(s.delta, 2)}s</span></div>`).join('')}
          </div>
          <p class="txt sm" style="margin-top:22px">Saudi R2 저우 +24.22s · Australia R3 보타스 +28.97s — 피트레인에서 20초 넘게 멈춰 선 스톱</p>
        </div>
      </div>
      <div class="col">
        <div class="hud-card cut a" style="--d:.4s;--line:var(--f1-red)">
          <div class="label">팬 신뢰 지수 · 10팀 중 최하위</div>
          <div class="big red" style="margin-top:10px;font-size:110px">${count(sa.trust, 1)}</div>
          <p class="txt sm" style="margin-top:8px">VADER ${sa.vader} (최저) · 비판 ${sa.crit}% · 상위 키워드 ${sa.keywords.split(' ').filter((k) => /problems|pit|wheel/.test(k)).map((k) => k.replace(':', ' ')).join(' · ')}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="hud-card a" style="--d:.55s;--line:var(--f1-red);padding:20px 22px"><div class="label">R1–3 평균 지연</div><div class="mid hot" style="margin-top:10px;font-size:46px">${sg(sb.early.delay, 2)}s</div><div class="txt sm" style="margin-top:6px">에러율 ${sb.early.err}%</div></div>
          <div class="hud-card a" style="--d:.65s;padding:20px 22px"><div class="label">R4 이후 · ${sb.late.n}건</div><div class="mid cool" style="margin-top:10px;font-size:46px">${sg(sb.late.delay, 2)}s</div><div class="txt sm" style="margin-top:6px">에러율 ${sb.late.err}%</div></div>
        </div>
        <div class="hud-card a" style="--d:.75s;--line:var(--team-sauber)"><p class="quote" style="font-size:22px">And poor Bottas and Zhou … they have started to dread the words “Box Box Box”.<cite>RaceFans 독자 댓글 · 2024-03</cite></p></div>
      </div>
    </div>`, '출처: f1_pitstops_clean.csv (Sauber 2024) · f1_sentiment_analysis.csv · 원인: 경량 휠너트 크로스 스레드(The Race) · 호주 GP €5,000 벌금(Motorsport.com)');

  // ── 09 종합 매트릭스
  const hyp = [['H1a', '0.5초 지연 → 순위 손실', true, `${sg(a.effect05)}계단 · ${pv(a.p05)}`], ['H1b', '스톱 열세 → 언더컷 실패', true, `${b.ok}% → ${b.slow}% · ${pv(b.p)}`],
    ['H2', '피트 성과 → 팀 신뢰', false, `ρ = ${sg(c1.rho)} · ${pv(c1.p)}`], ['H2′', '실수 언급 → 비판', true, `${se.pit_err.crit}% vs ${se.pit_err.ref}%`]];
  const ext = (k, f) => { const v = D.teams.map((t) => t[k]); return f === 'min' ? Math.min(...v) : Math.max(...v); };
  const cls = (k, v, good) => v === ext(k, good) ? 'best' : v === ext(k, good === 'min' ? 'max' : 'min') ? 'hot' : '';
  S('MATRIX', '정량 × 정성: <span class="cy">실행력은 순위</span>를, <em>기대 갭은 여론</em>을 설명한다', `
    <div class="body split rev" style="grid-template-columns:66fr 34fr">
      <div class="a" style="--d:.2s">
        <table class="tower">
          <thead><tr><th>P</th><th>Team</th><th>지연 s</th><th>≥+0.5s</th><th>≥+3s</th><th>언더컷</th><th>완주 순위</th><th>신뢰</th><th>비판</th></tr></thead>
          <tbody>${[...D.teams].sort((x, y) => x.finish - y.finish).map((t, i) => `<tr class="a" style="--d:${0.25 + i * 0.05}s">
            <td>${String(i + 1).padStart(2, '0')}</td><td class="tn">${tag(t.team)}</td>
            <td class="${cls('delay', t.delay, 'min')}">${sg(t.delay)}</td><td class="${cls('slow', t.slow, 'min')}">${nf(t.slow, 1)}</td><td class="${cls('err', t.err, 'min')}">${nf(t.err, 1)}</td>
            <td class="${cls('uc_rate', t.uc_rate, 'max')}">${nf(t.uc_rate, 1)}</td><td>${nf(t.finish, 2)}</td>
            <td class="${cls('trust', t.trust, 'max')}">${sg(t.trust, 1)}${t.sent_n < 20 ? '<sup style="color:var(--f1-yellow)">*</sup>' : ''}</td><td class="${cls('crit', t.crit, 'min')}">${nf(t.crit, 1)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="col">
        ${hyp.map(([h, k, ok, s], i) => `<div class="hud-card a" style="--d:${0.4 + i * 0.12}s;padding:20px 24px;--line:${ok ? 'var(--f1-cyan)' : 'var(--f1-red)'}">
          <div style="display:flex;justify-content:space-between;align-items:center"><span style="display:flex;gap:12px;align-items:center"><span class="chip">${h}</span><span class="label">${k}</span></span><span class="verdict ${ok ? 'ok' : 'no'}">${ok ? '채택' : '기각'}</span></div>
          <div class="mono" style="font-size:22px;margin-top:12px">${s}</div></div>`).join('')}
      </div>
    </div>`, '출처: f1_team_crossmap.csv · f1_hypothesis_tests.csv · 보라 = 10팀 중 최고, 빨강 = 최저 · * 전략 문장 20개 미만(Williams 13, Alpine 11)');

  // ── 10 한계와 데이터 리터러시
  const lim = [
    ['10팀 표본', `팀 단위 ρ의 95% CI가 [${c1.lo}, ${c1.hi}] — "관계 없음"이 아니라 "이 표본으로는 검출 불가"`, 'var(--f1-yellow)'],
    ['피트레인 ≠ 정지 시간', `Kaggle duration은 피트레인 통과(중앙값 ${M.pit_lane_median}s). "3초 에러"를 레이스 중앙값 대비 +3s로 재정의`, 'var(--f1-red)'],
    ['SC/VSC 미분리', '세이프티카 중 피트(손실 작음)가 섞여 지연 효과가 과소/과대 추정될 수 있음', 'var(--f1-red)'],
    ['규칙 기반 라벨', '어휘 사전 + VADER · 부정어 처리. 사람 검수 없음 → 정밀도 미측정', 'var(--f1-yellow)'],
    ['텍스트 불균형', `팀별 전략 문장 ${Math.min(...D.teams.map((t) => t.sent_n))}~${Math.max(...D.teams.map((t) => t.sent_n))}개 · 팬 포럼 ${M.fan_docs}/${M.docs}건 · Reddit은 Firecrawl 미지원으로 제외`, 'var(--f1-yellow)'],
    ['시점 불일치', '정량은 3시즌 전체, 텍스트는 사건 중심(2025년 기사 1건 포함)', 'var(--f1-text-secondary)']];
  S('LIMITS', '숫자를 믿기 전에 <span class="cy">확인할 것</span>', `
    <div class="body" style="grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr auto">
      ${lim.map(([k, t, c], i) => `<div class="hud-card a" style="--d:${0.2 + i * 0.1}s;--line:${c}"><div class="label" style="color:var(--f1-text-primary);font-size:24px">${String(i + 1).padStart(2, '0')} · ${k}</div><p class="txt" style="margin-top:16px;font-size:24px;color:var(--f1-text-secondary)">${t}</p></div>`).join('')}
      <div class="hud-card a" style="--d:.9s;grid-column:1 / -1;--line:var(--f1-cyan);display:flex;gap:28px;align-items:center;padding:20px 28px">
        <span class="label" style="color:var(--f1-cyan)">Next</span>
        <span class="txt sm" style="color:var(--f1-text-primary)">FastF1로 SC/VSC 플래그·정지 시간 확보 → 재검정 · 레이스별 사건 전후 여론 변화 · 감성 라벨 100문장 수동 검수</span>
      </div>
    </div>`, '출처: log/decisions.md (2026-10-25) · analysis/findings.md 「한계와 다음 단계」');

  // ── 11 결론 & Q&A
  slides.push({ raw: `
    <svg class="a" style="--d:.1s;position:absolute;left:0;top:760px" width="1920" height="160" viewBox="0 0 1920 160" aria-hidden="true">
      <path class="line-draw" style="--len:2600;--d:.3s" d="M0 100 L600 100 L640 40 L680 140 L720 100 L1920 100" fill="none" stroke="#00F5D4" stroke-width="3" opacity=".6"/>
    </svg>
    <div class="kicker a" style="--d:0s"><span class="tag">12</span>CONCLUSION</div>${sectorBar(3)}
    <div style="position:absolute;left:100px;right:100px;top:170px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
      ${[['0.5s', '피트 0.5초는 순위를 바꾼다', `3랩 뒤 ${sg(a.effect05)}계단 · 언더컷 ${b.ok}% → ${b.slow}%`, 'var(--f1-red)'],
         [`${se.pit_err.crit}%`, '실수는 즉시 비판받는다', `피트 실수 언급 문장의 비판 비율 (기타 ${se.pit_err.ref}%)`, 'var(--f1-yellow)'],
         ['Gap', '여론은 기대에 비례한다', `팀 신뢰는 피트 성과와 무관(ρ = ${sg(c1.rho)}) · 하위권은 관대, 상위권은 엄격`, 'var(--f1-cyan)']]
        .map(([n, h, t, c], i) => `<div class="hud-card cut a" style="--d:${0.2 + i * 0.15}s;--line:${c};padding:32px">
          <div class="mid" style="color:${c};font-size:72px">${n}</div><div style="font:700 34px/1.25 var(--display);margin-top:18px">${h}</div><p class="txt sm" style="margin-top:14px">${t}</p></div>`).join('')}
    </div>
    <p class="txt a" style="--d:.65s;position:absolute;left:100px;right:100px;top:490px;font-size:30px;line-height:1.5"><span style="color:var(--f1-red)">▍</span>피트의 0.5초는 순위를 바꾸고 실수는 즉각 비판을 부르지만, 팀을 향한 신뢰는 결국 <b>기대 대비 성과</b>가 정한다.</p>
    <h2 style="position:absolute;left:100px;top:600px;margin:0;font:700 150px/1 var(--display);letter-spacing:-.02em">
      <span class="mask"><span style="--d:.7s">Q<span style="color:var(--f1-red)">&amp;</span>A</span></span></h2>
    <p class="txt a" style="--d:.9s;position:absolute;left:560px;top:650px;font-size:30px;color:var(--f1-text-secondary)">Box, box — 질문 받겠습니다.</p>
    <div class="footer a" style="--d:1s"><span>재현: scripts/analysis/2026-10-25_f1-*.py → data/processed/f1_*.csv → slides/f1/deck-data.js · 리포트 analysis/findings.md</span><span class="pg"><b>12</b> / ${N}</span></div>` });

  // ── 마크업 주입
  const deck = document.getElementById('deck');
  const progress = deck.querySelector('.progress');
  slides.forEach((s, i) => {
    const sec = document.createElement('section');
    sec.className = 'slide';
    sec.setAttribute('aria-label', `${i + 1} / ${N}`);
    const st = STORY[s.kicker], lede = s.lede || (st && st[1]);
    sec.innerHTML = s.raw || `<div class="kicker a" style="--d:0s"><span class="tag">${String(i + 1).padStart(2, '0')}</span>${s.kicker}</div>
      ${st ? sectorBar(st[0]) : ''}
      <h2 class="title a" style="--d:.08s">${s.title}</h2>${lede ? `<p class="lede a" style="--d:.16s">${lede}</p>` : ''}${s.body}
      <div class="footer a" style="--d:.6s"><span>${s.source}</span><span class="pg"><b>${String(i + 1).padStart(2, '0')}</b> / ${N}</span></div>`;
    deck.insertBefore(sec, progress);
  });

  // ── Chart.js 공통 스타일 (references/design/chart-guide.md)
  function el(id) { return document.getElementById(id); }
  function tooltip(label) {
    return { backgroundColor: '#141822', titleColor: '#F5F7FA', bodyColor: '#00F5D4', borderColor: '#242B3B', borderWidth: 1, padding: 12,
      titleFont: { family: 'Chakra Petch', size: 16 }, bodyFont: { family: 'JetBrains Mono', size: 15 }, ...(label ? { callbacks: { label } } : {}) };
  }
  function axis(title, min, max) {
    return { min, max, grid: { color: 'rgba(255,255,255,0.05)' }, border: { color: '#242B3B' },
      ticks: { color: '#8F9CAE', font: { family: 'JetBrains Mono', size: 16 } },
      title: { display: !!title, text: title, color: '#8F9CAE', font: { family: 'Chakra Petch', size: 18 } } };
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
    ctx.save(); ctx.font = '700 20px "JetBrains Mono"'; ctx.fillStyle = '#F5F7FA';
    ch.getDatasetMeta(0).data.forEach((bar, i) => {
      const v = ch.data.datasets[0].data[i]; if (v == null) return;
      const { x, y } = bar.tooltipPosition();
      if (horiz) { ctx.textAlign = v >= 0 ? 'left' : 'right'; ctx.textBaseline = 'middle'; ctx.fillText(f(v), x + (v >= 0 ? 10 : -10), y); }
      else { ctx.textAlign = 'center'; ctx.textBaseline = v >= 0 ? 'bottom' : 'top'; ctx.fillText(f(v), x, y + (v >= 0 ? -10 : 10)); }
    });
    const ref = reg.ref;
    if (ref) {
      const ys = ch.scales.y.getPixelForValue(ref.value), xa = ch.chartArea;
      ctx.setLineDash([10, 8]); ctx.strokeStyle = '#8F9CAE'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xa.left, ys); ctx.lineTo(xa.right, ys); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '600 18px "JetBrains Mono"'; ctx.fillStyle = '#8F9CAE'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(ref.label, xa.right, ys - 8);
    }
    ctx.restore();
  } };
  const BUBBLE_POS = { Ferrari: 'left', Mercedes: 'bottom', McLaren: 'right', 'Aston Martin': 'bottom', 'Red Bull': 'right' };
  const bubbleLabels = { id: 'bubbleLabels', afterDatasetsDraw(ch) {
    const { ctx } = ch; ctx.save(); ctx.font = '700 17px "Chakra Petch"'; ctx.textBaseline = 'middle';
    ch.data.datasets.forEach((ds, i) => { const p = ch.getDatasetMeta(i).data[0]; if (!p) return;
      const t = T[ds.label], r = p.options.radius + 8, txt = `${ds.label}${t.sent_n < 20 ? '*' : ''}`;
      const pos = BUBBLE_POS[ds.label] || (p.x < ch.chartArea.right - 170 ? 'right' : 'left');
      ctx.fillStyle = '#F5F7FA';
      if (pos === 'top' || pos === 'bottom') { ctx.textAlign = 'center'; ctx.fillText(txt, p.x, p.y + (pos === 'top' ? -r - 4 : r + 6)); }
      else { ctx.textAlign = pos === 'right' ? 'left' : 'right'; ctx.fillText(txt, p.x + (pos === 'right' ? r : -r), p.y); } });
    const ya = ch.scales.y.getPixelForValue(0); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(ch.chartArea.left, ya); ctx.lineTo(ch.chartArea.right, ya); ctx.stroke(); ctx.restore();
  } };
  function base(o) {
    const horiz = !!o.horizontal;
    FMT[o.id] = { fmt: o.valueLabel, ref: o.refLine };
    const opt = { ...chartCommon(), indexAxis: horiz ? 'y' : 'x',
      layout: { padding: horiz ? { right: 90 } : { top: 34, bottom: 4 } },
      plugins: { legend: { display: false }, tooltip: tooltip() },
      scales: horiz ? { x: axis(null), y: { grid: { display: false }, border: { color: '#242B3B' }, ticks: { color: '#F5F7FA', font: { family: 'Chakra Petch', size: 18 } } } }
        : { x: { grid: { display: false }, border: { color: '#242B3B' }, ticks: { color: '#F5F7FA', font: { family: 'Chakra Petch', size: 18 } } }, y: axis(o.y.title, o.y.min, o.y.max) } };
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
