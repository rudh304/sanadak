'use strict';

/* index.html بالعربية و en.html بالإنجليزية، ويشتركان في هذا الملف */
const IS_AR = document.documentElement.lang === 'ar';
const L = (ar, en) => (IS_AR ? ar : en);

/* ===== البيانات ===== */
const ACTIVITIES = [
  { id: 'A', name: L('إعداد الميثاق والبدء', 'Charter preparation and initiation'), dur: 2, pred: [], es: 0, ef: 2, ls: 0, lf: 2 },
  { id: 'B', name: L('جمع وتحليل المتطلبات', 'Requirements gathering and analysis'), dur: 4, pred: ['A'], es: 2, ef: 6, ls: 2, lf: 6 },
  { id: 'C', name: L('تصميم معمارية النظام وقاعدة البيانات', 'System architecture and database design'), dur: 3, pred: ['B'], es: 6, ef: 9, ls: 6, lf: 9 },
  { id: 'D', name: L('تصميم الواجهات UI/UX', 'UI/UX design'), dur: 4, pred: ['B'], es: 6, ef: 10, ls: 10, lf: 14 },
  { id: 'E', name: L('إعداد البيئة السحابية', 'Cloud environment setup'), dur: 2, pred: ['C'], es: 9, ef: 11, ls: 12, lf: 14 },
  { id: 'F', name: L('تطوير الواجهة الخلفية ومحرك التوجيه', 'Backend and routing engine development'), dur: 8, pred: ['C'], es: 9, ef: 17, ls: 9, lf: 17 },
  { id: 'G', name: L('تطوير بوابة العميل', 'Customer portal development'), dur: 6, pred: ['D', 'E'], es: 11, ef: 17, ls: 15, lf: 21 },
  { id: 'H', name: L('تطوير تطبيق الفني', 'Technician app development'), dur: 7, pred: ['D', 'E'], es: 11, ef: 18, ls: 14, lf: 21 },
  { id: 'I', name: L('تطوير لوحة الإدارة', 'Admin dashboard development'), dur: 4, pred: ['F'], es: 17, ef: 21, ls: 17, lf: 21 },
  { id: 'J', name: L('تكامل الدفع والإشعارات', 'Payment and notification integration'), dur: 3, pred: ['F'], es: 17, ef: 20, ls: 18, lf: 21 },
  { id: 'K', name: L('اختبار التكامل والنظام', 'Integration and system testing'), dur: 4, pred: ['G', 'H', 'I', 'J'], es: 21, ef: 25, ls: 21, lf: 25 },
  { id: 'L', name: L('اختبار القبول مع عملاء تجريبيين', 'Acceptance testing with pilot customers'), dur: 3, pred: ['K'], es: 25, ef: 28, ls: 25, lf: 28 },
  { id: 'M', name: L('تدريب فريق التشغيل والفنيين', 'Operations team and technician training'), dur: 2, pred: ['L'], es: 28, ef: 30, ls: 28, lf: 30 },
  { id: 'N', name: L('الإطلاق وإغلاق المشروع', 'Launch and project closure'), dur: 2, pred: ['M'], es: 30, ef: 32, ls: 30, lf: 32 }
];
const floatOf = (a) => a.ls - a.es;
const isCritical = (a) => floatOf(a) === 0;

const WORK_PACKAGES = [
  { code: '1.1', name: L('إدارة المشروع', 'Project management'), cost: 45000 },
  { code: '1.2.1', name: L('جمع وتحليل المتطلبات', 'Requirements gathering and analysis'), cost: 25000 },
  { code: '1.2.2', name: L('تصميم المعمارية وقاعدة البيانات', 'Architecture and database design'), cost: 20000 },
  { code: '1.2.3', name: L('تصميم الواجهات UI/UX', 'UI/UX design'), cost: 25000 },
  { code: '1.3.1', name: L('الواجهة الخلفية ومحرك التوجيه', 'Backend and routing engine'), cost: 90000 },
  { code: '1.3.2', name: L('بوابة العميل', 'Customer portal'), cost: 45000 },
  { code: '1.3.3', name: L('تطبيق الفني', 'Technician app'), cost: 55000 },
  { code: '1.3.4', name: L('لوحة الإدارة', 'Admin dashboard'), cost: 20000 },
  { code: '1.4.1', name: L('إعداد البيئة السحابية', 'Cloud environment setup'), cost: 15000 },
  { code: '1.4.2', name: L('تكامل الدفع والإشعارات', 'Payment and notification integration'), cost: 25000 },
  { code: '1.5.1', name: L('اختبار التكامل والنظام', 'Integration and system testing'), cost: 25000 },
  { code: '1.5.2', name: L('اختبار القبول', 'Acceptance testing'), cost: 15000 },
  { code: '1.6.1', name: L('التدريب', 'Training'), cost: 10000 },
  { code: '1.6.2', name: L('الإطلاق والإغلاق', 'Launch and closure'), cost: 15000 }
];
const CONTINGENCY = 43000;
const MANAGEMENT_RESERVE = 27000;

/* الألوان بترتيب ثابت من لوحة فئوية مختبرة لعمى الألوان، وقيمها في styles.css لكل وضع */
const AREAS = [
  { prefix: '1.1', name: L('إدارة المشروع', 'Project management') },
  { prefix: '1.2', name: L('التحليل والتصميم', 'Analysis and design') },
  { prefix: '1.3', name: L('التطوير', 'Development') },
  { prefix: '1.4', name: L('البنية والتكامل', 'Infrastructure and integration') },
  { prefix: '1.5', name: L('الاختبار والجودة', 'Testing and quality') },
  { prefix: '1.6', name: L('الإطلاق والتدريب', 'Launch and training') }
];

const PROB = { high: L('عالية', 'High'), medium: L('متوسطة', 'Medium'), low: L('منخفضة', 'Low') };
const IMPACT = { veryHigh: L('عالٍ جداً', 'Very high'), high: L('عالٍ', 'High'), medium: L('متوسط', 'Medium'), low: L('منخفض', 'Low') };

/* p و i هما موقع الخطر في المصفوفة: 0 منخفض، 1 متوسط، 2 عالٍ */
const RISKS = [
  { id: 'R1', risk: L('تغيير المتطلبات وزحف النطاق', 'Requirements change and scope creep'), prob: 'high', impact: 'high', score: 'high', strategy: L('تجنّب', 'Avoid'), action: L('تجميد المتطلبات بعد اعتمادها، وتمرير أي تغيير عبر مجلس التحكم بالتغييرات', 'Freeze requirements after approval, and route any change through the change control board'), p: 2, i: 2 },
  { id: 'R2', risk: L('تأخر تطوير محرك التوجيه (نشاط حرج)', 'Routing engine development delay (critical activity)'), prob: 'medium', impact: 'high', score: 'high', strategy: L('تخفيف', 'Mitigate'), action: L('تخصيص أقوى المطورين له، ومراجعة أسبوعية للتقدم', 'Assign the strongest developers, with a weekly progress review'), p: 1, i: 2 },
  { id: 'R3', risk: L('قلة الفنيين المسجلين عند الإطلاق', 'Too few registered technicians at launch'), prob: 'medium', impact: 'high', score: 'high', strategy: L('تخفيف', 'Mitigate'), action: L('التعاقد المبكر مع فنيين قبل الإطلاق بشهرين', 'Contract technicians early, two months before launch'), p: 1, i: 2 },
  { id: 'R4', risk: L('اختراق أمني أو تسرب بيانات العملاء', 'Security breach or customer data leak'), prob: 'low', impact: 'veryHigh', score: 'high', strategy: L('تخفيف + نقل', 'Mitigate + Transfer'), action: L('اختبار اختراق، وتشفير، وتأمين سيبراني', 'Penetration testing, encryption, and cyber insurance'), p: 0, i: 2, note: '*' },
  { id: 'R5', risk: L('تعطل خدمة الاستضافة السحابية', 'Cloud hosting outage'), prob: 'low', impact: 'high', score: 'medium', strategy: L('نقل', 'Transfer'), action: L('اتفاقية مستوى خدمة (SLA) مع المزود ونسخ احتياطي', 'Service level agreement (SLA) with the provider, and backups'), p: 0, i: 2 },
  { id: 'R6', risk: L('تجاوز الميزانية', 'Budget overrun'), prob: 'medium', impact: 'medium', score: 'medium', strategy: L('تخفيف', 'Mitigate'), action: L('متابعة شهرية للتكلفة، واحتياطي الطوارئ', 'Monthly cost monitoring, and the contingency reserve'), p: 1, i: 1 },
  { id: 'R7', risk: L('ترك أحد أعضاء الفريق للمشروع', 'A team member leaves the project'), prob: 'low', impact: 'medium', score: 'low', strategy: L('قبول', 'Accept'), action: L('توثيق مستمر للعمل، وتوزيع المعرفة بين الأعضاء', 'Continuous documentation, and knowledge sharing among members'), p: 0, i: 1 },
  { id: 'R8', risk: L('ضعف إقبال العملاء على التجربة', 'Low customer uptake of the pilot'), prob: 'medium', impact: 'medium', score: 'medium', strategy: L('تخفيف', 'Mitigate'), action: L('شراكات مع حاضنات الأعمال وعروض مجانية للعملاء التجريبيين', 'Partnerships with business incubators, and free offers for pilot customers'), p: 1, i: 1 }
];

const money = (n) => n.toLocaleString('en-US');
const el = (id) => document.getElementById(id);
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, text) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ===== الجدول الزمني ===== */
function renderSchedule() {
  el('schedule-body').innerHTML = ACTIVITIES.map((a) => `
    <tr class="${isCritical(a) ? 'critical-row' : ''}">
      <td class="code-cell">${a.id}</td><td class="wide">${a.name}</td><td>${a.dur}</td>
      <td>${a.pred.length ? a.pred.join(', ') : '—'}</td>
      <td>${a.es}</td><td>${a.ef}</td><td>${a.ls}</td><td>${a.lf}</td><td>${floatOf(a)}</td>
      <td>${isCritical(a) ? '<span class="check">✔</span>' : ''}</td>
    </tr>`).join('');

  const path = ACTIVITIES.filter(isCritical);
  const total = path.reduce((s, a) => s + a.dur, 0);
  el('critical-path').innerHTML = path.map((a) => `<li title="${a.name}">${a.id}</li>`).join('');
  el('critical-sum').textContent = `(${path.map((a) => a.dur).join('+')} = ${total})`;
  el('critical-total').textContent = L(`${total} أسبوعاً`, `${total} weeks`);
}

function renderGantt() {
  const WEEKS = 32;
  const cells = Array.from({ length: WEEKS }, (_, w) => `<span class="g-cell" style="grid-column:${w + 2}"></span>`).join('');
  const header = Array.from({ length: WEEKS }, (_, w) => `<span class="g-week" style="grid-column:${w + 2}">${w + 1}</span>`).join('');

  const rows = ACTIVITIES.map((a) => {
    const kind = isCritical(a) ? 'critical' : 'normal';
    const bar = `<span class="g-bar g-${kind}" data-id="${a.id}" data-es="${a.es}" data-ef="${a.ef}" style="grid-column:${a.es + 2} / ${a.ef + 2}">${a.dur}</span>`;
    const float = floatOf(a) > 0
      ? `<span class="g-float" title="${L(`الفائض ${floatOf(a)} أسابيع`, `Float: ${floatOf(a)} weeks`)}" style="grid-column:${a.ef + 2} / ${a.lf + 2}"></span>`
      : '';
    return `<div class="g-row"><span class="g-label"><b>${a.id}</b> ${a.name}</span>${cells}${bar}${float}</div>`;
  }).join('');

  el('gantt').innerHTML = `<div class="g-row g-head"><span class="g-label">${L('النشاط / الأسبوع', 'Activity / week')}</span>${header}</div>${rows}`;
}

function renderNetwork() {
  const W = 104, H = 78, GAP = 44, ROW = 110, PAD = 16, COLS = 9;
  const width = COLS * W + (COLS - 1) * GAP + PAD * 2;
  const height = 3 * ROW + H + PAD * 2;
  /* [العمود، الصف]: يقع المسار الحرج على صف واحد، ويتبع الرسم اتجاه لغة الصفحة */
  const POS = {
    A: [0, 2], B: [1, 2], C: [2, 2], D: [2, 0], E: [3, 1], F: [3, 2], G: [4, 0],
    H: [4, 1], I: [4, 2], J: [4, 3], K: [5, 2], L: [6, 2], M: [7, 2], N: [8, 2]
  };
  const xOf = (id) => (IS_AR ? width - PAD - W - POS[id][0] * (W + GAP) : PAD + POS[id][0] * (W + GAP));
  const yOf = (id) => PAD + POS[id][1] * ROW;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`, role: 'img', dir: 'ltr',
    'aria-label': L('مخطط الشبكة لأنشطة المشروع، والمسار الحرج فيه A B C F I K L M N', 'Project network diagram, with the critical path A B C F I K L M N')
  });
  const defs = svgEl('defs', {});
  ['critical', 'normal'].forEach((name) => {
    const marker = svgEl('marker', { id: `arrow-${name}`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    marker.appendChild(svgEl('path', { d: 'M0 0 10 5 0 10z', class: `marker-${name}` }));
    defs.appendChild(marker);
  });
  svg.appendChild(defs);

  const byId = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]));
  const edges = ACTIVITIES.flatMap((a) => a.pred.map((p) => ({ from: p, to: a.id, critical: isCritical(a) && isCritical(byId[p]) })));
  /* تُرسم الأسهم الحرجة أخيراً لتظهر فوق غيرها */
  edges.sort((x, y) => Number(x.critical) - Number(y.critical)).forEach((e) => {
    const sx = IS_AR ? xOf(e.from) : xOf(e.from) + W, sy = yOf(e.from) + H / 2;
    const ex = IS_AR ? xOf(e.to) + W : xOf(e.to), ey = yOf(e.to) + H / 2;
    const cx = IS_AR ? ex + GAP / 2 : ex - GAP / 2;
    const d = sy === ey ? `M${sx} ${sy} H${ex}` : `M${sx} ${sy} H${cx} V${ey} H${ex}`;
    const kind = e.critical ? 'critical' : 'normal';
    svg.appendChild(svgEl('path', { d, class: `net-edge net-edge-${kind}`, 'marker-end': `url(#arrow-${kind})`, 'data-edge': `${e.from}-${e.to}` }));
  });

  const early = IS_AR ? W - 18 : 18;
  const late = W - early;
  ACTIVITIES.forEach((a) => {
    const x = xOf(a.id), y = yOf(a.id);
    const g = svgEl('g', { class: `net-node net-${isCritical(a) ? 'critical' : 'normal'}` });
    g.appendChild(svgEl('title', {}, `${a.id}: ${a.name}`));
    g.appendChild(svgEl('rect', { x, y, width: W, height: H, rx: 8 }));
    const put = (dx, dy, text, cls) => g.appendChild(svgEl('text', { x: x + dx, y: y + dy, class: cls }, text));
    put(early, 20, a.es, 'net-num');
    put(W / 2, 20, a.dur, 'net-num');
    put(late, 20, a.ef, 'net-num');
    put(W / 2, 47, a.id, 'net-code');
    put(early, 68, a.ls, 'net-num');
    put(W / 2, 68, floatOf(a), 'net-num');
    put(late, 68, a.lf, 'net-num');
    svg.appendChild(g);
  });
  el('network').appendChild(svg);
}

/* ===== التكلفة ===== */
function areaTotals() {
  return AREAS.map((area, index) => ({
    ...area,
    series: `--series-${index + 1}`,
    total: WORK_PACKAGES.filter((w) => w.code === area.prefix || w.code.startsWith(`${area.prefix}.`)).reduce((s, w) => s + w.cost, 0)
  }));
}

function renderCost() {
  const activities = WORK_PACKAGES.reduce((s, w) => s + w.cost, 0);
  const baseline = activities + CONTINGENCY;
  const budget = baseline + MANAGEMENT_RESERVE;

  const row = (code, name, value, cls = '') => `<tr class="${cls}"><td class="code-cell">${code}</td><td class="wide">${name}</td><td class="money">${money(value)}</td></tr>`;
  el('cost-body').innerHTML = WORK_PACKAGES.map((w) => row(w.code, w.name, w.cost)).join('')
    + row('', L('إجمالي تكلفة الأنشطة', 'Total activity cost'), activities, 'total-row')
    + row('', L('احتياطي الطوارئ (<bdi dir="ltr">10%</bdi>) — Contingency Reserve', 'Contingency reserve (10%)'), CONTINGENCY, 'reserve-row')
    + row('', L('خط أساس التكلفة (Cost Baseline)', 'Cost baseline'), baseline, 'total-row')
    + row('', L('احتياطي الإدارة — Management Reserve', 'Management reserve'), MANAGEMENT_RESERVE, 'reserve-row')
    + row('', L('الميزانية الكلية للمشروع', 'Total project budget'), budget, 'grand-row');

  el('doughnut-total').textContent = money(activities);
  el('area-body').innerHTML = areaTotals().map((a) => `
    <tr><td><span class="swatch" style="background:var(${a.series})"></span>${a.name}</td>
    <td class="money">${money(a.total)}</td><td class="money">${(a.total / activities * 100).toFixed(1)}%</td></tr>`).join('');

  el('budget-build').innerHTML = `
    <div class="tier tier-1"><span>${L('تكلفة الأنشطة', 'Activity cost')}</span><strong>${money(activities)}</strong></div>
    <div class="adder"><i class="fa-solid fa-plus" aria-hidden="true"></i> ${L('احتياطي الطوارئ', 'Contingency reserve')} ${money(CONTINGENCY)}</div>
    <div class="tier tier-2"><span>${L('خط الأساس', 'Cost baseline')}</span><strong>${money(baseline)}</strong></div>
    <div class="adder"><i class="fa-solid fa-plus" aria-hidden="true"></i> ${L('احتياطي الإدارة', 'Management reserve')} ${money(MANAGEMENT_RESERVE)}</div>
    <div class="tier tier-3"><span>${L('الميزانية الكلية', 'Total budget')}</span><strong>${money(budget)}</strong></div>`;
}

/* ===== المخاطر ===== */
function renderRisks() {
  el('risk-body').innerHTML = RISKS.map((r) => `
    <tr><td class="code-cell">${r.id}</td><td class="wide">${r.risk}</td><td>${PROB[r.prob]}</td><td>${IMPACT[r.impact]}</td>
    <td><span class="score score-${r.score}">${PROB[r.score]}</span></td><td>${r.strategy}</td><td class="wide">${r.action}</td></tr>`).join('');

  const LEVEL_P = [PROB.low, PROB.medium, PROB.high];
  const LEVEL_I = [IMPACT.low, IMPACT.medium, IMPACT.high];
  const HEAT = [['low', 'low', 'medium'], ['low', 'medium', 'high'], ['medium', 'high', 'high']];
  let html = '';
  for (let p = 2; p >= 0; p -= 1) {
    html += `<div class="matrix-rowlabel">${LEVEL_P[p]}</div>`;
    for (let i = 0; i < 3; i += 1) {
      const chips = RISKS.filter((r) => r.p === p && r.i === i)
        .map((r) => `<span class="risk-chip score-${r.score}" title="${r.risk}">${r.id}${r.note || ''}</span>`).join('');
      html += `<div class="matrix-cell heat-${HEAT[p][i]}" data-p="${p}" data-i="${i}">${chips}</div>`;
    }
  }
  html += '<div></div>' + LEVEL_I.map((l) => `<div class="matrix-collabel">${l}</div>`).join('');
  el('risk-matrix').innerHTML = html;
}

/* ===== قنوات الاتصال ===== */
function renderChannels() {
  const N = 10, C = 150, R = 118;
  const svg = svgEl('svg', {
    viewBox: '0 0 300 300', role: 'img',
    'aria-label': L('عشر نقاط على دائرة، كل نقطتين بينهما خط، بمجموع 45 قناة اتصال', 'Ten points on a circle, with a line between every pair, making 45 communication channels')
  });
  const pts = Array.from({ length: N }, (_, k) => {
    /* يبدأ الترقيم من الأعلى ويسير مع عقارب الساعة */
    const t = (k / N) * 2 * Math.PI - Math.PI / 2;
    return [C + R * Math.cos(t), C + R * Math.sin(t)];
  });
  for (let a = 0; a < N; a += 1) {
    for (let b = a + 1; b < N; b += 1) {
      svg.appendChild(svgEl('line', { x1: pts[a][0], y1: pts[a][1], x2: pts[b][0], y2: pts[b][1], class: 'channel-line' }));
    }
  }
  pts.forEach(([x, y], k) => {
    svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 15, class: 'channel-node' }));
    svg.appendChild(svgEl('text', { x, y: y + 5, class: 'channel-text' }, k + 1));
  });
  el('channels-graph').appendChild(svg);
}

/* ===== الرسوم البيانية ===== */
let charts = [];

function renderCharts({ animate = true } = {}) {
  if (!window.Chart) return;
  charts.forEach((c) => c.destroy());
  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation = animate && !reduceMotion ? undefined : false;
  Chart.defaults.font.family = "'IBM Plex Sans Arabic', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = token('--ink-2');
  const tooltip = { rtl: IS_AR, textDirection: IS_AR ? 'rtl' : 'ltr' };

  const areas = areaTotals();
  const doughnut = new Chart(el('doughnut-chart'), {
    type: 'doughnut',
    data: {
      labels: areas.map((a) => a.name),
      datasets: [{ data: areas.map((a) => a.total), backgroundColor: areas.map((a) => token(a.series)), borderColor: token('--surface'), borderWidth: 2 }]
    },
    options: {
      animation,
      maintainAspectRatio: false,
      cutout: '66%',
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltip, callbacks: { label: (c) => ` ${money(c.parsed)} ${L('ريال', 'SAR')}` } }
      }
    }
  });

  /* بيانات توضيحية مجموعها 100 خطأ، فالعدد والنسبة يشتركان في محور واحد */
  const errors = [
    [L('واجهة المستخدم', 'User interface'), 38], [L('التكامل', 'Integration'), 24], [L('منطق التوجيه', 'Routing logic'), 16],
    [L('الأداء', 'Performance'), 10], [L('الأمان', 'Security'), 7], [L('التوافق', 'Compatibility'), 5]
  ];
  let running = 0;
  const cumulative = errors.map(([, n]) => (running += n));
  const pareto = new Chart(el('pareto-chart'), {
    data: {
      labels: errors.map(([name]) => name),
      datasets: [
        { type: 'line', label: L('النسبة التراكمية', 'Cumulative share'), data: cumulative, borderColor: token('--series-2'), backgroundColor: token('--series-2'), borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0, order: 1 },
        { type: 'bar', label: L('نسبة الأخطاء', 'Share of defects'), data: errors.map(([, n]) => n), backgroundColor: token('--series-1'), borderRadius: 4, maxBarThickness: 56, order: 2 }
      ]
    },
    options: {
      animation,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { reverse: IS_AR, grid: { display: false } },
        y: { position: IS_AR ? 'right' : 'left', min: 0, max: 100, ticks: { stepSize: 20, callback: (v) => `${v}%` }, grid: { color: token('--line') }, border: { display: false } }
      },
      plugins: {
        legend: { position: 'top', align: 'center', ...tooltip, labels: { usePointStyle: true, boxHeight: 8 } },
        tooltip: { ...tooltip, callbacks: { label: (c) => ` ${c.dataset.label}: ${c.parsed.y}%` } }
      }
    }
  });
  charts = [doughnut, pareto];
}

/* ===== الوضع الداكن ===== */
function setupTheme() {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const apply = (theme, { persist = true, animate = false } = {}) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    const label = dark ? L('الوضع الفاتح', 'Light mode') : L('الوضع الداكن', 'Dark mode');
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', label);
    button.title = label;
    button.querySelector('i').className = `fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`;
    if (persist) { try { localStorage.setItem('theme', theme); } catch (e) { /* يكفي الوضع الحالي للصفحة */ } }
    renderCharts({ animate });
  };
  button.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* تُطبع الصفحة بالألوان الفاتحة دائماً */
  let themeBeforePrint = null;
  window.addEventListener('beforeprint', () => {
    themeBeforePrint = root.dataset.theme;
    if (themeBeforePrint === 'dark') apply('light', { persist: false });
  });
  window.addEventListener('afterprint', () => {
    if (themeBeforePrint === 'dark') apply('dark', { persist: false });
  });

  apply(root.dataset.theme || 'light', { persist: false, animate: true });
}

/* يبقى القارئ في القسم نفسه عند تبديل اللغة */
function setupLangToggle() {
  const link = document.querySelector('.lang-toggle');
  link.addEventListener('click', () => {
    const current = document.querySelector('#main-nav a.active');
    link.setAttribute('href', `${link.getAttribute('href').split('#')[0]}${current ? current.getAttribute('href') : ''}`);
  });
}

/* ===== سلوك الصفحة ===== */
function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = el('main-nav');
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? L('إغلاق القائمة', 'Close menu') : L('فتح القائمة', 'Open menu'));
    toggle.querySelector('i').className = `fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`;
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const links = [...nav.querySelectorAll('a')];
  const spy = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      links.forEach((a) => {
        const active = a.getAttribute('href') === `#${e.target.id}`;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section').forEach((s) => spy.observe(s));
}

function setupBackTop() {
  const button = el('back-top');
  const update = () => button.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((n) => n.classList.add('shown'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      e.target.classList.add('shown');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -40px 0px' });
  items.forEach((n) => io.observe(n));
  window.addEventListener('beforeprint', () => items.forEach((n) => n.classList.add('shown')));
}

renderSchedule();
renderGantt();
renderNetwork();
renderCost();
renderRisks();
renderChannels();
setupNav();
setupBackTop();
setupReveal();
setupTheme();
setupLangToggle();
