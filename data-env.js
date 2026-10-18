/* ==========================================================
   GFSSM AI Coach · 环境档案层（Env Profile）
   ----------------------------------------------------------
   设计意图：
   1) GFSSM 每年换目标天体，但"环境六维度"的知识框架不变。
      所以把"每年会变的数字"全部抽到这里，讲解与题目只引用变量，
      不写死任何一年的数值。
   2) 学生上传 RFP 后，自动识别场景并抽取数值；识别不到就手动选/填。
      三档来源：preset（预设）/ rfp（自动识别）/ manual（手填）。
   3) 页面里可用的占位符（在 data-learn-*.js 里写 {{key}}）：
      {{scene}} {{where}} {{gNat}} {{gNatMs}} {{pOut}} {{pOutKind}}
      {{radDay}} {{radYear}} {{tMin}} {{tMax}} {{tAvg}} {{dayLen}}
      {{commMin}} {{commMax}} {{sun}} {{shield}} {{hazard}}
      {{resources}} {{proto}} {{depth}} {{gTarget}}
      条件块：{{#if icy}}…{{/if}} {{#unless icy}}…{{/unless}}
      条件变量按 scene 的 tags 判断，可选 tags 见 TAG_LABEL。
   ========================================================== */

/* ---------- 场景标签 ---------- */
const TAG_LABEL = {
  vacuum: '真空', atmosphere: '有大气', surface: '星球表面', orbital: '轨道/自由空间',
  icy: '冰/水下', subsurface: '地下/覆土', lowg: '低重力', highg: '高重力',
  highrad: '强辐射', cold: '极寒', hot: '高温', noLight: '无自然光',
  longDelay: '长时延', shortDay: '短昼夜', longDay: '长昼夜', insitu: '可就地取资源'
};

/* ---------- 预设场景库（数值为教学用典型值，非 RFP 承诺） ---------- */
const SCENES = [
  {
    id: 'moon', name: '月球表面 / 熔岩管', short: '月球',
    where: '月面或熔岩管内', tags: ['vacuum', 'surface', 'lowg', 'highrad', 'longDay', 'insitu'],
    gNat: 0.166, pOut: 0, pOutKind: '真空', radDay: 0.0014, tMin: -173, tMax: 127, tAvg: -20,
    dayLen: 708, commMin: 1.3, commMax: 1.3, sun: 1361,
    shield: '覆土（1–3 m 月壤）+ 熔岩管顶板', hazard: '真空、微陨石、月尘、昼夜温差 300 ℃、太阳质子事件',
    resources: '月壤中的氧与铁、极区水冰、太阳能', proto: '月球遗产保护（如涉历史着陆点）',
    depth: 0, note: '昼夜各约 14.75 天，储能按满夜设计；月尘带静电、磨蚀密封件。'
  },
  {
    id: 'mars', name: '火星表面', short: '火星',
    where: '火星地表', tags: ['atmosphere', 'surface', 'lowg', 'cold', 'insitu'],
    gNat: 0.379, pOut: 0.0006, pOutKind: '近真空（0.6 kPa）', radDay: 0.00067, tMin: -125, tMax: 20, tAvg: -63,
    dayLen: 24.66, commMin: 3, commMax: 22, sun: 590,
    shield: '覆土（2–3 m 火星土）；大气仅贡献约 1/100 地球屏蔽', hazard: '全球性沙尘暴（可持续数月）、尘暴遮光、极低温、高氯酸盐毒性',
    resources: 'CO₂ 制氧（MOXIE 路线）、水冰、铁氧化物、太阳能（受尘影响大）', proto: '行星保护（避免地球微生物污染）',
    depth: 0, note: '大气压虽低，但足以产生对流散热与尘暴荷载，不能按真空设计。'
  },
  {
    id: 'europa', name: '木卫二 冰下海洋', short: '木卫二',
    where: '冰壳之下的海洋中', tags: ['icy', 'subsurface', 'lowg', 'highrad', 'cold', 'noLight', 'longDelay'],
    gNat: 0.134, pOut: 6, pOutKind: '外压（约 600 m 水深）', radDay: 5.4, tMin: -223, tMax: -148, tAvg: -160,
    dayLen: 85.2, commMin: 35, commMax: 52, sun: 50,
    shield: '冰壳本身（每 10 cm 冰约衰减一半剂量），越深越安全', hazard: '木星辐射带、极寒真空、冰蠕变闭腔、外压屈曲、无自然光',
    resources: '水（近乎无限）、冰、盐类；金属与挥发分贫乏', proto: 'EPC 零排放（灰水/黑水/固废均不得入海）',
    depth: 600, note: '城市不在表面而在冰下，表面只是太空港；壳体受外压，与轨道城受力方向相反。'
  },
  {
    id: 'titan', name: '土卫六 表面', short: '土卫六',
    where: '土卫六地表（甲烷湖边）', tags: ['atmosphere', 'surface', 'lowg', 'cold', 'insitu', 'longDay'],
    gNat: 0.138, pOut: 0.147, pOutKind: '大气压 1.5 atm（外压略大于内压）', radDay: 0.0005, tMin: -185, tMax: -170, tAvg: -179,
    dayLen: 382, commMin: 67, commMax: 90, sun: 15,
    shield: '稠密大气 + 远离太阳，辐射本底很低；主要威胁是低温', hazard: '−179 ℃ 极寒、液态甲烷/乙烷、氮气窒息、光照极弱',
    resources: '甲烷/乙烷湖、氮气大气、水冰', proto: '土卫六有机化学环境保护（避免污染前生命化学）',
    depth: 0, note: '唯一"外压≈内压"的常见场景，壳体几乎不承压，但低温与可燃气体是主要矛盾。'
  },
  {
    id: 'asteroid', name: '小行星 / 谷神星', short: '小行星',
    where: '小行星表面或内部', tags: ['vacuum', 'surface', 'lowg', 'highrad', 'cold', 'insitu'],
    gNat: 0.03, pOut: 0, pOutKind: '真空', radDay: 0.002, tMin: -140, tMax: -40, tAvg: -90,
    dayLen: 9.07, commMin: 20, commMax: 40, sun: 180,
    shield: '覆土/碎石堆（结构本身可做屏蔽）', hazard: '微重力（人无法正常行走）、自转过快、结构松散无法锚固、真空',
    resources: '含水矿物、金属（铁镍、铂族）、碳质挥发分', proto: '天体资源开发相关规范（如涉）',
    depth: 0, note: '重力小到"走路会飘走"，人工重力需求最强烈；锚固与采掘是最大工程难点。'
  },
  {
    id: 'orbit', name: '近地轨道空间站', short: '近地轨道',
    where: '近地轨道（400 km 量级）', tags: ['vacuum', 'orbital', 'highrad', 'shortDay'],
    gNat: 0, pOut: 0, pOutKind: '真空', radDay: 0.0008, tMin: -120, tMax: 120, tAvg: -150,
    dayLen: 1.5, commMin: 0.02, commMax: 0.02, sun: 1361,
    shield: '材料质量屏蔽 + 水墙/储物兼屏蔽；地磁可挡一部分', hazard: '真空、昼夜各 45 分钟、轨道碎片、原子氧腐蚀、微重力生理损伤',
    resources: '几乎无（全部上行补给）', proto: '轨道碎片减缓准则（25 年离轨）',
    depth: 0, note: '90 分钟一圈意味着一天 16 次日出，照明与节律设计是重点；散热只能靠辐射。'
  },
  {
    id: 'lpoint', name: '地月空间 / 拉格朗日点', short: '自由空间',
    where: '地月转移空间或 L1/L2', tags: ['vacuum', 'orbital', 'highrad'],
    gNat: 0, pOut: 0, pOutKind: '真空', radDay: 0.0015, tMin: -150, tMax: 120, tAvg: -100,
    dayLen: 0, commMin: 0.08, commMax: 1.3, sun: 1361,
    shield: '需要完整质量屏蔽（无水无土可用）', hazard: '深空 GCR 与太阳粒子事件、无就近补给、热环境随日照变化剧烈',
    resources: '无就地资源；可取日月光辐照', proto: '空间资源与频轨协调',
    depth: 0, note: '辐射是无解项：必须靠质量换安全，这会直接推高结构质量与发射成本。'
  },
  {
    id: 'venus', name: '金星云层（55 km）', short: '金星云层',
    where: '金星大气 55 km 高度（浮空平台）', tags: ['atmosphere', 'orbital', 'highg', 'hot'],
    gNat: 0.905, pOut: 0.05, pOutKind: '大气压约 0.5 atm', radDay: 0.002, tMin: 30, tMax: 60, tAvg: 45,
    dayLen: 2808, commMin: 2.5, commMax: 14, sun: 2611,
    shield: '大气本身提供部分屏蔽；硫酸云腐蚀是主要问题', hazard: '硫酸气溶胶腐蚀、超自转大风（~100 m/s）、下方 460 ℃ 高压热海',
    resources: '大气中的 CO₂、硫酸、少量水汽；太阳能极充沛', proto: '行星保护（避免地球微生物在云层存活）',
    depth: 0, note: '1 g 天然重力但浮在空中：重力不是问题，"浮力维持"和"腐蚀"才是。'
  }
];

/* ---------- 默认档案（未识别时用：只讲原理，数字留空） ---------- */
const ENV_DEFAULT = {
  id: 'generic', name: '通用（尚未指定目标环境）', short: '待定', where: '待定（请上传 RFP 或手动选择）',
  tags: [], gNat: 0, pOut: 0, pOutKind: '待填', radDay: 0, tMin: 0, tMax: 0, tAvg: 0,
  dayLen: 0, commMin: 0, commMax: 0, sun: 0, shield: '待填', hazard: '待填', resources: '待填',
  proto: '待填', depth: 0, note: '还没确定目标环境。上面的原理仍然成立，但所有具体数字需要你用本年的 RFP 填进来。',
  source: 'none', gTarget: 0.8
};

/* ---------- 关键参数说明（供"环境档案"页编辑与校验用） ---------- */
const ENV_FIELDS = [
  { k: 'gNat', label: '天然重力', unit: 'g', hint: '地球=1。查天体参数或用 GM/r² 估', type: 'num', step: 0.001 },
  { k: 'gTarget', label: '要求的人工重力', unit: 'g', hint: 'RFP 通常直接给（历年多为 0.8 g）', type: 'num', step: 0.1 },
  { k: 'pOut', label: '外部压力', unit: 'MPa', hint: '真空填 0；水下按 ρgh 估（每 100 m 水 ≈ 1 MPa）', type: 'num', step: 0.01 },
  { k: 'radDay', label: '所在位置辐射剂量', unit: 'Sv/天', hint: '屏蔽后的位置剂量，不是表面剂量', type: 'num', step: 0.0001 },
  { k: 'tMin', label: '最低温度', unit: '℃', hint: '热控与材料的下限', type: 'num', step: 1 },
  { k: 'tMax', label: '最高温度', unit: '℃', hint: '热控与材料的上限', type: 'num', step: 1 },
  { k: 'dayLen', label: '昼夜周期', unit: 'h', hint: '潮汐锁定填 0；轨道按圈周期填', type: 'num', step: 0.1 },
  { k: 'commMin', label: '单程通信时延（最小）', unit: 'min', hint: '= 距离 ÷ 光速', type: 'num', step: 0.01 },
  { k: 'commMax', label: '单程通信时延（最大）', unit: 'min', hint: '取轨道最远点，可与最小值相同', type: 'num', step: 0.01 },
  { k: 'sun', label: '太阳辐照', unit: 'W/m²', hint: '地球 1361；按 1/d² 缩放', type: 'num', step: 1 },
  { k: 'depth', label: '建造深度（水下/地下）', unit: 'm', hint: '表面填 0；冰下填冰壳厚度', type: 'num', step: 1 }
];

/* ---------- 识别：从 RFP 文本推断场景 ---------- */
const SCENE_PATTERNS = [
  { id: 'europa', re: /europa|木卫二|galileo|伽利略卫星|jovian|木星/i, w: 6 },
  { id: 'titan', re: /titan|土卫六|saturn/i, w: 5 },
  { id: 'mars', re: /mars|火星|ares|红色星球/i, w: 5 },
  { id: 'moon', re: /moon|lunar|月球|月面|lava tube|熔岩管|artemis/i, w: 4 },
  { id: 'asteroid', re: /asteroid|小行星|ceres|谷神星|bennu|itokawa/i, w: 4 },
  { id: 'venus', re: /venus|金星/i, w: 4 },
  { id: 'lpoint', re: /lagrang|拉格朗日|cislunar|地月空间|L1|L2/i, w: 3 },
  { id: 'orbit', re: /low earth orbit|LEO|近地轨道|space station|轨道空间站|orbital habitat/i, w: 3 }
];

function detectScene(text) {
  const t = String(text || '');
  if (!t.trim()) return null;
  let best = null;
  SCENE_PATTERNS.forEach(p => {
    const m = t.match(new RegExp(p.re.source, 'gi'));
    if (m) {
      const score = m.length * p.w;
      if (!best || score > best.score) best = { id: p.id, score, hits: m.length };
    }
  });
  return best;
}

/* 数值抽取：只抽"能被正则稳定命中"的量；抽不到保持预设值 */
function parseNumbers(text) {
  const t = String(text || '').replace(/\u00a0/g, ' ');
  const out = {};

  let m = t.match(/([\d.]+)\s*(?:m\/s(?:²|2|\^2))/i);
  if (m) { const v = parseFloat(m[1]); if (v > 0 && v < 30) out.gNat = +(v / 9.80665).toFixed(3); }
  /* 注意：不再从 "x g" 抽天然重力——RFP 里的 "0.8 g" 几乎总是人工重力要求，
     误当天然重力会毁掉整份档案；天然重力交给场景预设 + 人工确认。 */

  m = t.match(/([\d.]+)\s*(Sv|mSv|rem)\s*(?:per|\/|a|each)?\s*(day|year|天|日|年)/i);
  if (m) {
    let v = parseFloat(m[1]);
    if (/mSv/i.test(m[2])) v = v / 1000;
    if (/rem/i.test(m[2])) v = v / 100;
    out.radDay = /year|年/i.test(m[4]) ? +(v / 365).toFixed(5) : v;
  }

  /* 压力：收集所有 MPa/kPa/bar，取最大值——外压通常远大于舱内 1 atm；
     "x atm" 不抽：atm 是舱内压力的惯用单位，抽了必然污染外压 */
  {
    const all = [];
    const re = /([\d.]+)\s*(MPa|kPa|bar)\b/gi;
    let mm;
    while ((mm = re.exec(t))) {
      let v = parseFloat(mm[1]);
      if (/kPa/i.test(mm[2])) v = v / 1000;
      if (/bar/i.test(mm[2])) v = v * 0.1;
      if (v > 0.2 && v < 100) all.push(v);   // ≈0.1 MPa 量级 = 舱内压，跳过
    }
    if (all.length) out.pOut = +Math.max.apply(null, all).toFixed(3);
  }

  m = t.match(/([\d,]+)\s*m(?:eters)?\s*(?:thick|of ice|ice shell|below|depth|deep)/i) ||
    t.match(/(?:depth|thick(?:ness)?|shell)\D{0,12}([\d,]+)\s*m\b/i);
  if (m) { const v = parseFloat(m[1].replace(/,/g, '')); if (v > 0 && v < 100000) out.depth = v; }

  m = t.match(/([\d.]+)\s*(?:[–\-~]|to)\s*([\d.]+)\s*(minutes?|min|hours?|hrs?)\s*(?:one[- ]way|delay|travel)?/i) ||
    t.match(/(?:delay|one[- ]way|signal)\D{0,20}([\d.]+)\s*(?:[–\-~]|to)?\s*([\d.]+)?\s*(minutes?|min)/i);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2] || m[1]);
    const f = /hour|hr/i.test(m[3] || '') ? 60 : 1;
    if (a > 0 && a < 100000) { out.commMin = +(a * f).toFixed(2); out.commMax = +(Math.max(a, b) * f).toFixed(2); }
  }

  m = t.match(/([\d,]+)\s*(?:people|persons|residents|inhabitants|colonists|scientists|居民|人口|人)/i);
  if (m) { const v = parseInt(m[1].replace(/,/g, ''), 10); if (v > 10 && v < 1000000) out.population = v; }

  m = t.match(/([\d.]+)\s*W\/m(?:²|2|\^2)/i);
  if (m) { const v = parseFloat(m[1]); if (v > 1 && v < 5000) out.sun = v; }

  m = t.match(/([\d.]+)\s*(?:years?|年)/i);
  if (m) { const v = parseFloat(m[1]); if (v >= 2 && v <= 100) out.years = v; }

  return out;
}

/* ---------- 命令：生成当前档案 ---------- */
function buildEnv(sceneId, overrides) {
  const base = SCENES.find(s => s.id === sceneId) || ENV_DEFAULT;
  const e = Object.assign({}, ENV_DEFAULT, base, { gTarget: 0.8, source: base.id === 'generic' ? 'none' : 'preset' }, overrides || {});
  return e;
}

/* 用 RFP 文本生成档案：预设 + 抽取覆盖 */
function envFromRFP(text) {
  const hit = detectScene(text);
  const nums = parseNumbers(text);
  const base = hit ? buildEnv(hit.id, { source: 'rfp', hit: hit.hits }) : Object.assign({}, ENV_DEFAULT, { source: 'rfp' });
  Object.keys(nums).forEach(k => {
    if (k === 'population' || k === 'years') return;   // 这两项不覆盖环境参数
    base[k] = nums[k];
  });
  // 深度存在 → 若原来不是水下场景，也要按外压修正
  if (nums.depth && base.tags.indexOf('icy') < 0) {
    base.pOut = +(nums.depth * 0.01).toFixed(3);   // ρgh，水/冰近似每 100 m ≈ 1 MPa
    base.pOutKind = '外压（约 ' + nums.depth + ' m）';
  }
  base.extraNums = nums;
  return base;
}

/* ---------- 渲染辅助：格式化 ---------- */
function envFmt(e) {
  const D = '待填';
  const todo = !e.id || e.id === 'generic';
  const n = (v, d) => {
    if (todo) return D;
    return (typeof v === 'number' && isFinite(v)) ? (d == null ? String(v) : v.toFixed(d)) : D;
  };
  const hh = v => {
    if (todo || !v) return D;
    if (v < 48) return v.toFixed(1) + ' 小时';
    return (v / 24).toFixed(1) + ' 天（' + v.toFixed(0) + ' 小时）';
  };
  /* 辐射：小剂量自动换 mSv，避免一长串 0 */
  const radShow = () => {
    if (todo) return D;
    const v = e.radDay;
    if (!v) return '0 Sv/天';
    if (v < 0.01) return (v * 1000).toFixed(2) + ' mSv/天';
    return v.toFixed(2) + ' Sv/天';
  };
  const radYear = () => {
    if (todo || !e.radDay) return D;
    const y = e.radDay * 365;
    return (y < 0.01 ? (y * 1000).toFixed(2) + ' mSv' : y.toFixed(y < 1 ? 3 : 2) + ' Sv');
  };
  const comm = () => {
    if (todo) return D;
    const a = e.commMin || 0, b = e.commMax || a;
    const f = v => (v < 0.1 ? v.toFixed(3) : (v < 10 ? v.toFixed(2) : v.toFixed(0)));
    return b > a ? f(a) + '–' + f(b) : f(a);
  };
  return {
    scene: todo ? '通用（尚未指定）' : e.name,
    where: todo ? D : e.where,
    gNat: n(e.gNat, 3), gNatMs: n(e.gNat * 9.80665, 2),
    pOut: todo ? D : (e.pOut ? n(e.pOut, 3) : '0'), pOutKind: todo ? D : e.pOutKind,
    radDay: n(e.radDay, e.radDay && e.radDay < 0.01 ? 4 : 2),
    radDayShow: radShow(), radYear: radYear(),
    tMin: n(e.tMin, 0), tMax: n(e.tMax, 0), tAvg: n(e.tAvg, 0),
    dayLen: e.dayLen ? hh(e.dayLen) : (todo ? D : ((e.tags || []).indexOf('orbital') >= 0 ? D : '潮汐锁定（无昼夜）')),
    commMin: todo ? D : n(e.commMin, 2), commMax: todo ? D : n(e.commMax, 2), commRange: comm(),
    sun: n(e.sun, 0), shield: todo ? D : e.shield, hazard: todo ? D : e.hazard,
    resources: todo ? D : e.resources, proto: todo ? D : e.proto,
    depth: todo ? D : (e.depth ? n(e.depth, 0) : '0'),
    gTarget: n(e.gTarget, 2) === D ? '0.80' : n(e.gTarget, 2),
    gTargetMs: n((e.gTarget || 0.8) * 9.80665, 2) === D ? '7.85' : n((e.gTarget || 0.8) * 9.80665, 2)
  };
}

/* ---------- 动态片段：需要现场计算、无法用静态文字写的表 ---------- */
const ENV_SNIPPETS = {
  /* 1 MW 负荷的光伏面积量级 */
  pvarea: function (e) {
    const I = e.sun || 0;
    if (!I || !e.id || e.id === 'generic') return '<span class="env-todo">待填</span>';
    const S = 1e6 / (0.2 * I);
    if (S >= 1e6) return (S / 1e6).toFixed(2) + ' km²';
    if (S >= 1e4) return (S / 1e4).toFixed(1) + ' 万 m²';
    return Math.round(S).toLocaleString() + ' m²';
  },

  /* 光伏可行性对照：按当前辐照给四档，标出本场景所在档 */
  pv: function (e) {
    const I = e.sun || 0;
    const tiers = [
      { lo: 1000, name: '强日照（≥1000 W/m²）', ex: '近地轨道、月球、火星轨道', verdict: '光伏可作主力电源' },
      { lo: 300, name: '中等（300–1000）', ex: '火星表面（约 590）', verdict: '可行，但面积约为地球的 2–4 倍，还要算尘暴与低温' },
      { lo: 50, name: '弱日照（50–300）', ex: '木星附近（约 50）、小行星带', verdict: '只适合小负载或补电，主力必须另想办法' },
      { lo: 0, name: '极弱（<50）', ex: '外太阳系、冰下', verdict: '光伏基本不可行，核能是唯一现实选项' }
    ];
    const hit = tiers.filter(t => I >= t.lo)[0] || tiers[tiers.length - 1];
    return tiers.map(t => {
      const on = (t === hit);
      return '<tr' + (on ? ' style="background:#F0F5FF"' : '') + '><td>' +
        (on ? '<b>' + t.name + '</b>（本场景）' : t.name) + '</td><td>' + t.ex + '</td><td>' + t.verdict + '</td></tr>';
    }).join('');
  },

  /* 转速—半径表：按当前目标重力实时算 */
  spin: function (e) {
    const g = e.gTarget || 0.8;
    const a = g * 9.80665;
    const rows = [100, 150, 200, 250, 400].map(function (R) {
      const w = Math.sqrt(a / R);
      const n = w * 60 / (2 * Math.PI);
      let ev, cls = '';
      if (n > 2.5) { ev = '太转：科里奥利效应明显，多数人不适'; cls = 'color:#B4443C'; }
      else if (n > 2) { ev = '临界：刚好在 2 rpm 舒适上限附近'; cls = 'color:#9A6A18'; }
      else if (n > 1.5) { ev = '较舒适，工程上的常用区间'; cls = 'color:#1B7A56'; }
      else { ev = '很舒适，但结构质量与造价高'; cls = 'color:#1B7A56'; }
      return '<tr><td class="num">' + g.toFixed(2) + ' g</td><td class="num">' + R + ' m</td>' +
        '<td class="num">' + w.toFixed(3) + '</td><td class="num">' + n.toFixed(2) + '</td>' +
        '<td style="' + cls + '">' + ev + '</td></tr>';
    });
    const Rc = a / Math.pow(2 * 2 * Math.PI / 60, 2);
    rows.push('<tr style="background:#F7F9FF"><td class="num">' + g.toFixed(2) + ' g</td>' +
      '<td class="num"><b>' + Math.round(Rc) + ' m</b></td><td class="num">0.209</td><td class="num">2.00</td>' +
      '<td><b>2 rpm 下所需的最小半径</b>——半径再小，转速就超上限</td></tr>');
    return rows.join('');
  }
};

/* 把 {{key}} 与条件块替换掉 */
function fillEnv(html, e) {
  if (!html) return html;
  const env = e || (window.ENV || ENV_DEFAULT);
  const f = envFmt(env);
  let s = String(html);

  // 条件块 {{#if tag}} … {{/if}} / {{#unless tag}} … {{/unless}}
  s = s.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, tag, body) =>
    (env.tags || []).indexOf(tag) >= 0 ? body : '');
  s = s.replace(/\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_, tag, body) =>
    (env.tags || []).indexOf(tag) < 0 ? body : '');

  // 动态片段 {{@spin}}
  s = s.replace(/\{\{@(\w+)\}\}/g, (m, k) => (ENV_SNIPPETS[k] ? ENV_SNIPPETS[k](env) : ''));

  // 变量
  s = s.replace(/\{\{(\w+)\}\}/g, (m, k) => (f[k] != null && f[k] !== '' ? f[k] : '<span class="env-todo">待填</span>'));
  return s;
}

/* 当前生效档案（由 app.js 挂到 window.ENV） */
function currentEnv() { return window.ENV || ENV_DEFAULT; }
