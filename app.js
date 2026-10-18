/* ==========================================================
   GFSSM AI Coach · 应用逻辑
   ========================================================== */
(function () {
  'use strict';

  const LS_KEY = 'gfssm.coach.v1';
  const ENV_KEY = 'gfssm.env.v1';
  const store = { read: {}, quiz: { idx: 0, ans: {}, locked: {}, started: false, finished: false }, rfp: null, checks: {}, tab: 'overview' };
  try { const s = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); Object.assign(store, s); } catch (e) { }
  const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch (e) { } };

  /* 当前环境档案：全站讲解与题目都从这里取数 */
  let ENV = null;
  try { ENV = JSON.parse(localStorage.getItem(ENV_KEY) || 'null'); } catch (e) { }
  if (!ENV || !ENV.id) ENV = Object.assign({}, ENV_DEFAULT);
  window.ENV = ENV;
  function setEnv(next) {
    ENV = Object.assign({}, ENV_DEFAULT, next);
    window.ENV = ENV;
    try { localStorage.setItem(ENV_KEY, JSON.stringify(ENV)); } catch (e) { }
    // 环境变了，参数题的答案不再成立 → 清掉 E1..E10 的记录
    const q = store.quiz;
    Object.keys(q.ans || {}).forEach(k => { if (/^E\d+$/.test(k)) delete q.ans[k]; });
    Object.keys(q.locked || {}).forEach(k => { if (/^E\d+$/.test(k)) delete q.locked[k]; });
    save();
  }
  const envLabel = () => (ENV && ENV.id !== 'generic') ? ENV.short || ENV.name : '环境待定';

  /* 全部题目 = 通用题 + 术语题 + 当前环境参数题 */
  const QZ = () => QUIZ.concat(TERM_QUIZ, ENV_QUIZ(ENV));

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const modById = id => MODULES.find(m => m.id === id);
  const modTitle = id => { const m = modById(id); return m ? m.title.replace(/^[^：]*：/, '') : id; };
  const modNo = id => { const m = modById(id); return m ? m.no : '--'; };

  /* ---------------- 路由 ----------------
     全部页面跳转都用 go()，不依赖 <a href> 的默认行为，
     也不依赖 hashchange 一定触发（预览面板 / 内嵌 iframe 里可能不触发）。 */
  let rendered = null;
  const pageId = () => (location.hash || '#/start').replace(/^#\/?/, '') || 'start';
  function go(id) {
    if (!id) return;
    if (pageId() === id) { route(); }
    else {
      location.hash = '#/' + id;
      if (pageId() !== rendered) route();
    }
    const sb = $('#sidebar'); if (sb) sb.classList.remove('open');
  }

  /* ---------------- toast ---------------- */
  let toastTimer = null;
  function toast(msg, isErr) {
    const t = $('#toast');
    t.textContent = msg; t.className = 'toast show' + (isErr ? ' err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 2600);
  }

  /* ---------------- nav ---------------- */
  const GROUPS = [
    { label: '开始', ids: ['start'] },
    { label: '基础认知', ids: ['gfssm', 'env', 'gravity'] },
    { label: '设计与建造', ids: ['layout', 'build'] },
    { label: '系统与运行', ids: ['airwater', 'foodwaste', 'power', 'human', 'infra'] },
    { label: '管理与呈现', ids: ['business', 'review'] }
  ];

  function renderNav() {
    let html = '<button class="nav-env' + (ENV.id === 'generic' ? ' empty' : '') + '" data-go="envset">' +
      '<span class="ne-k">当前环境</span><span class="ne-v">' + esc(envLabel()) + '</span><span class="ne-act">设置</span></button>';
    GROUPS.forEach(g => {
      html += '<div class="nav-group"><div class="nav-label">' + g.label + '</div>';
      g.ids.forEach(id => {
        const m = modById(id); if (!m) return;
        html += '<button class="nav-item' + (store.read[id] ? ' done' : '') + '" data-go="' + id + '">' +
          '<span class="no">' + m.no + '</span><span>' + esc(m.title.replace(/^[^：]*：/, '')) + '</span><i class="dot"></i></button>';
      });
      html += '</div>';
    });
    html += '<div class="nav-group"><div class="nav-label">练习</div>' +
      '<button class="nav-item" data-go="quiz"><span class="no">Q</span><span>自测：' + QZ().length + ' 道题</span></button></div>';
    html += '<div class="nav-group"><div class="nav-label">用起来</div>' +
      '<button class="nav-item" data-go="rfp"><span class="no">R</span><span>分析本年 RFP</span></button>' +
      '<button class="nav-item" data-go="envset"><span class="no">E</span><span>环境档案（本年参数）</span></button>' +
      '<button class="nav-item" data-go="tools"><span class="no">T</span><span>工具箱 / 计算器</span></button></div>';
    $('#nav').innerHTML = html;
    $$('#nav .nav-item, #nav .nav-env').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.go === 'quiz') store.quizFilter = null;   // 侧栏的“自测”永远指全部题
      go(b.dataset.go);
    }));
    updateProgress();
  }

  function updateProgress() {
    const done = MODULES.filter(m => store.read[m.id]).length;
    $('#prog-text').textContent = done + ' / ' + MODULES.length;
    $('#prog-bar').style.width = Math.round(done / MODULES.length * 100) + '%';
  }

  /* ---------------- router ---------------- */
  function route() {
    const h = pageId();
    rendered = h;
    const view = $('#view');
    window.scrollTo(0, 0);
    $$('#nav .nav-item, #nav .nav-env').forEach(b => b.classList.toggle('active', b.dataset.go === h));
    if (h === 'envset') { view.innerHTML = fillEnv(viewEnv()); bindEnv(); mountFigures(view); mountDiagrams(view); return; }
    if (h === 'quiz') { view.innerHTML = fillEnv(viewQuiz()); bindQuiz(); mountFigures(view); mountDiagrams(view); return; }
    if (h === 'rfp') { view.innerHTML = fillEnv(viewRFP()); bindRFP(); mountFigures(view); mountDiagrams(view); return; }
    if (h === 'tools') { view.innerHTML = fillEnv(viewTools()); bindTools(); mountFigures(view); mountDiagrams(view); return; }
    const m = modById(h) || MODULES[0];
    view.innerHTML = fillEnv(viewLearn(m));
    bindLearn(m);
    mountFigures(view);
    mountDiagrams(view);
  }

  /* ---------------- learn ---------------- */
  function pageHead(o) {
    return '<div class="page-head">' +
      '<p class="kicker">' + esc(o.kicker) + '</p>' +
      '<h2>' + o.title + '</h2>' +
      (o.sub ? '<p class="sub">' + o.sub + '</p>' : '') +
      (o.meta ? '<div class="head-meta">' + o.meta + '</div>' : '') +
      '</div>';
  }

  /* 顶部环境提示条：让“这里的数字从哪来、去哪改”一眼可见 */
  function envBar(compact) {
    const f = envFmt(ENV);
    const ready = ENV.id !== 'generic';
    const press = f.pOut === '0' ? '真空' : f.pOut + ' MPa';
    return '<div class="env-bar' + (ready ? '' : ' todo') + '">' +
      '<div class="eb-main">' +
      '<span class="eb-k">' + (ready ? '本页数字来自「环境档案」' : '还没设定场地：本页数字显示为“待填”') + '</span>' +
      '<span class="eb-v">' + esc(ready ? ENV.name : '选一个预设场地，或上传本年 RFP 自动识别') + '</span>' +
      (ready && !compact
        ? '<span class="eb-sub">天然重力 ' + f.gNat + ' g · 任务要求 ' + f.gTarget + ' g · 辐射 ' + f.radDayShow + ' · 外部 ' + press + '</span>'
        : '') +
      '</div>' +
      '<button class="btn btn-sm' + (ready ? '' : ' btn-primary') + '" data-nav="envset">' +
      (ready ? '换场地 / 改参数' : '现在设定') + '</button></div>';
  }

  function viewLearn(m) {
    const i = MODULES.indexOf(m);
    const prev = MODULES[i - 1], next = MODULES[i + 1];
    let html = pageHead({
      kicker: '模块 ' + m.no + ' · ' + m.kicker,
      title: m.title.replace(/^[^：]*：/, ''),
      sub: m.sub,
      meta: '<span class="badge b-gray">约 ' + m.minutes + ' 分钟</span>' +
        '<span class="badge b-blue">' + esc(m.kicker) + '</span>' +
        (store.read[m.id] ? '<span class="badge b-green">已读</span>' : '')
    });

    html += envBar();

    if (m.oneLine) html += '<div class="callout c-key" style="margin-top:0"><span class="ct">一句话记住</span>' + m.oneLine + '</div>';

    m.sections.forEach(s => {
      html += '<div class="reader">' + (s.h ? '<h3 class="sec">' + s.h + '</h3>' : '<div style="height:6px"></div>') + s.html + '</div>';
    });

    if (m.review && m.review.length) {
      html += '<div class="card card-pad" style="margin-top:26px">' +
        '<h3 style="margin:0 0 6px;font-size:16px">评审会怎么看这一章</h3>' +
        '<p class="small" style="margin:0 0 10px">以下是从 RFP 评审准则与历年评审表里提炼的关注点。</p>' +
        '<ul class="mini-list">' + m.review.map(x => '<li>' + x + '</li>').join('') + '</ul></div>';
    }
    if (m.check && m.check.length) {
      html += '<div class="card card-pad" style="margin-top:14px;border-color:#F3E2C0;background:#FFFDF8">' +
        '<h3 style="margin:0 0 8px;font-size:16px;color:#8A5B10">合上页面前，先自问三个问题</h3>' +
        '<ol class="mini-list">' + m.check.map(x => '<li>' + x + '</li>').join('') + '</ol></div>';
    }

    /* 本节小测：放在最显眼的位置 */
    const mq = QZ().filter(q => q.tag === m.id || q.ref === m.id);
    html += '<div class="quiz-cta">' +
      '<div class="qc-txt">' +
      '<span class="qc-k">本节小测 · ' + (mq.length ? mq.length + ' 道题' : '暂未配题') + '</span>' +
      '<b class="qc-h">' + (mq.length ? '刚读完这几页，能答对几道？' : '这一节暂时没有配套题') + '</b>' +
      '<p class="qc-p">' + (mq.length
        ? '做完立刻给解析；答错会指回具体段落。约 ' + Math.max(3, Math.round(mq.length * 1.2)) + ' 分钟。'
        : '可以直接做全部 ' + QZ().length + ' 道题，里面有跨模块的判断题。') + '</p>' +
      '</div>' +
      '<div class="qc-btns">' +
      (mq.length ? '<button class="btn btn-primary" data-nav="quiz" data-quizmod="' + m.id + '">做这 ' + mq.length + ' 道题</button>' : '') +
      '<button class="btn" data-nav="quiz" data-quizall="1">全部 ' + QZ().length + ' 题</button>' +
      '</div></div>';

    html += '<div class="lesson-foot"><button class="btn btn-sm' + (store.read[m.id] ? '' : ' btn-ghost') + '" id="mark-read">' +
      (store.read[m.id] ? '已标记为读过（点击取消）' : '标记这一节已读') + '</button></div>';

    html += '<div class="lesson-nav">' +
      (prev ? '<button class="prev" data-nav="' + prev.id + '"><span>上一节</span>' + esc(prev.title.replace(/^[^：]*：/, '')) + '</button>' : '<span></span>') +
      (next ? '<button class="next" data-nav="' + next.id + '"><span>下一节</span>' + esc(next.title.replace(/^[^：]*：/, '')) + '</button>' : '<button class="next" data-nav="rfp"><span>下一步</span>用 RFP 检验学习成果</button>') +
      '</div>';

    return html;
  }

  function bindLearn(m) {
    const btn = $('#mark-read');
    if (btn) btn.addEventListener('click', () => {
      store.read[m.id] = !store.read[m.id]; save(); renderNav(); route();
    });
    // 停留 20 秒自动标记已读
    if (!store.read[m.id]) {
      const t = setTimeout(() => {
        if ((location.hash || '').indexOf(m.id) >= 0) { store.read[m.id] = true; save(); renderNav(); }
      }, 20000);
      window.__readTimer && clearTimeout(window.__readTimer);
      window.__readTimer = t;
    }
  }

  /* ---------------- env profile ---------------- */
  function viewEnv() {
    const e = ENV, f = envFmt(e), ready = e.id !== 'generic';
    let html = pageHead({
      kicker: 'ENV PROFILE · 环境档案',
      title: '今年把城建在哪儿',
      sub: 'GFSSM 每年换一个目标场地。原理不变，但所有具体数字都跟着变——这一页负责把"今年的数字"定下来，全站讲解和自测会自动引用它。',
      meta: '<span class="badge ' + (ready ? 'b-green' : 'b-amber') + '">' + esc(ready ? '已设定：' + e.short : '尚未设定') + '</span>' +
        '<span class="badge b-gray">来源：' + ({ preset: '预设场景', rfp: 'RFP 自动识别', none: '未设定' }[e.source] || '手动填写') + '</span>'
    });

    if (!ready) {
      html += '<div class="callout c-warn" style="margin-top:0"><span class="ct">先做这一步</span>' +
        '花 1 分钟选一个场景（或直接上传 RFP 自动识别）。不选也能读讲解，但页面上凡是写"待填"的地方都不会有数字，自测里的参数题也不会出现。</div>';
    }

    /* ① 自动识别 */
    html += '<div class="card card-pad" style="margin-top:16px">' +
      '<h3 style="margin:0 0 6px;font-size:16px">① 从本年的 RFP 自动识别</h3>' +
      '<p class="small" style="margin:0 0 10px">读取 RFP 全文里的天体名与数字，自动猜测场地并填入参数。识别结果可以再手改。</p>';
    if (store.rfp && store.rfp.text) {
      html += '<div class="row-flex"><button class="btn btn-primary" id="env-detect">从「' + esc(store.rfp.name || '已上传的 RFP') + '」识别</button>' +
        '<span class="small" style="align-self:center">全文 ' + store.rfp.text.length.toLocaleString() + ' 字符</span></div>';
    } else {
      html += '<div class="row-flex"><a class="btn" data-nav="rfp">先上传本年 RFP</a>' +
        '<span class="small" style="align-self:center">还没有上传过 RFP，也可以直接在下面选场景。</span></div>';
    }
    html += '</div>';

    /* ② 场景选择 */
    html += '<div class="card card-pad" style="margin-top:14px">' +
      '<h3 style="margin:0 0 4px;font-size:16px">② 或者直接选一个场地</h3>' +
      '<p class="small" style="margin:0 0 12px">这些是 GFSSM 历年与常见设定。选中后所有参数自动带出来，不需要你一个个查。</p>' +
      '<div class="scene-grid">';
    SCENES.forEach(s => {
      const on = s.id === e.id;
      html += '<button class="scene-card' + (on ? ' on' : '') + '" data-scene="' + s.id + '">' +
        '<div class="sc-top"><span class="sc-name">' + esc(s.short) + '</span>' + (on ? '<span class="sc-on">已选</span>' : '') + '</div>' +
        '<div class="sc-sub">' + esc(s.name) + '</div>' +
        '<div class="sc-kv">' +
        '<span>天然重力 <b>' + s.gNat.toFixed(3) + ' g</b></span>' +
        '<span>' + (s.pOut ? '外部压力 <b>' + s.pOut + ' MPa</b>' : '外部 <b>真空</b>') + '</span>' +
        '<span>辐射 <b>' + (s.radDay < 0.01 ? (s.radDay * 1000).toFixed(1) + ' mSv' : s.radDay + ' Sv') + '/天</b></span>' +
        '</div>' +
        '<div class="sc-note">' + esc(s.note) + '</div></button>';
    });
    html += '</div></div>';

    /* ③ 当前档案全表 */
    html += '<div class="card card-pad" style="margin-top:14px">' +
      '<div class="row-flex" style="justify-content:space-between;align-items:baseline">' +
      '<h3 style="margin:0;font-size:16px">③ 当前档案：' + esc(e.name) + '</h3>' +
      '<span class="small">' + esc(e.where) + '</span></div>' +
      '<div class="table-wrap" style="margin-top:10px"><table>' +
      '<tr><th style="width:24%">参数</th><th class="num" style="width:22%">值</th><th>它决定了什么</th></tr>' +
      '<tr><td>天然重力</td><td class="num">' + f.gNat + ' g（' + f.gNatMs + ' m/s²）</td><td>要不要人工重力、缺口多大、结构是否必须旋转</td></tr>' +
      '<tr><td>要求的人工重力</td><td class="num">' + f.gTarget + ' g</td><td>由 RFP 给定；与天然重力之差才是你要"造"的部分</td></tr>' +
      '<tr><td>外部压力</td><td class="num">' + f.pOut + ' MPa · ' + esc(f.pOutKind) + '</td><td>壳体受拉还是受压、气闸数量、屈曲校核</td></tr>' +
      '<tr><td>辐射剂量（所在位置）</td><td class="num">' + f.radDay + ' Sv/天 · ' + f.radYear + ' Sv/年</td><td>屏蔽厚度、居住深度、舱外作业时长</td></tr>' +
      '<tr><td>温度</td><td class="num">' + f.tMin + ' ~ ' + f.tMax + ' ℃（平均 ' + f.tAvg + '）</td><td>材料、保温、热控功率、散热方式</td></tr>' +
      '<tr><td>昼夜周期</td><td class="num">' + f.dayLen + '</td><td>储能规模、照明与节律设计</td></tr>' +
      '<tr><td>单程通信时延</td><td class="num">' + f.commRange + ' 分钟</td><td>自主等级、远程运维可行性、治理结构</td></tr>' +
      '<tr><td>太阳辐照</td><td class="num">' + f.sun + ' W/m²</td><td>光伏面积或"必须用核能"的判断</td></tr>' +
      '<tr><td>建造深度</td><td class="num">' + f.depth + ' m</td><td>屏蔽、外压、开挖与蠕变、竖井物流</td></tr>' +
      '</table></div>' +
      '<div class="grid-2" style="margin-top:12px">' +
      '<div class="obj"><span class="k">可用屏蔽手段</span><div class="v">' + esc(f.shield) + '</div></div>' +
      '<div class="obj"><span class="k">主要危害</span><div class="v">' + esc(f.hazard) + '</div></div>' +
      '<div class="obj"><span class="k">就地资源</span><div class="v">' + esc(f.resources) + '</div></div>' +
      '<div class="obj"><span class="k">特殊约束</span><div class="v">' + esc(f.proto) + '</div></div>' +
      '</div>' +
      '<p class="small" style="margin:10px 0 0">以上为教学用典型值，<b>不是 RFP 承诺的数据</b>。凡是 RFP 原文给了的数，以原文为准；原文没给的，方案里要写成"假设 + 依据"。</p>' +
      '</div>';

    /* ④ 手动微调 */
    html += '<div class="card card-pad" style="margin-top:14px">' +
      '<h3 style="margin:0 0 4px;font-size:16px">④ 手动改数字（RFP 和预设不一致时用）</h3>' +
      '<p class="small" style="margin:0 0 12px">只需要改有出入的几项，其余保持不动。改完点"应用"，全站立刻跟着变。</p>' +
      '<div class="env-form">';
    ENV_FIELDS.forEach(fd => {
      const v = e[fd.k];
      html += '<label class="ef"><span class="ef-l">' + fd.label + '<i>' + fd.unit + '</i></span>' +
        '<input type="number" step="' + fd.step + '" data-field="' + fd.k + '" value="' + (v == null ? '' : v) + '">' +
        '<span class="ef-h">' + esc(fd.hint) + '</span></label>';
    });
    html += '</div>' +
      '<div class="row-flex" style="margin-top:12px">' +
      '<button class="btn btn-primary" id="env-apply">应用修改</button>' +
      '<button class="btn" id="env-reset">重置为预设值</button>' +
      (e.id === 'generic' ? '' : '<span class="small" style="align-self:center">参数题（自测里的 E1–E10）会按新数值重新计算</span>') +
      '</div></div>';

    /* ⑤ 说明 */
    html += '<div class="callout c-key" style="margin-top:16px"><span class="ct">这一页改变什么</span>' +
      '改完之后：讲解页里所有"<code>{{ }}</code>"位置都会显示你的实际数字；环境类自测题（E1–E10）的题干、选项、答案、解析全部按新参数重算；RFP 分析页的环境简报也会用这份档案。' +
      '<br>唯一不变的是原理——<b>a = ω²R 不会因为换星球而改</b>。这也是为什么先学原理、再套参数，比背某一年的答案划算。</div>';

    return html;
  }

  function bindEnv() {
    $$('[data-scene]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.scene;
      const keepG = ENV.gTarget || 0.8;
      setEnv(buildEnv(id, { gTarget: keepG }));
      renderNav(); route();
      toast('已切换到：' + ENV.short + '，讲解与题目已更新');
    }));

    const det = $('#env-detect');
    if (det) det.addEventListener('click', () => {
      if (!store.rfp || !store.rfp.text) return toast('还没有 RFP 文本', true);
      const hit = detectScene(store.rfp.text);
      const next = envFromRFP(store.rfp.text);
      if (!hit) {
        setEnv(next);
        renderNav(); route();
        return toast('没识别出具体天体，已保留通用模板，请手动选场景', true);
      }
      setEnv(next);
      renderNav(); route();
      toast('识别为「' + next.short + '」' + (next.extraNums && Object.keys(next.extraNums).length ? '，并抽取了 ' + Object.keys(next.extraNums).length + ' 个数值' : ''));
    });

    const apply = $('#env-apply');
    if (apply) apply.addEventListener('click', () => {
      const next = Object.assign({}, ENV);
      $$('[data-field]').forEach(inp => {
        const k = inp.dataset.field, v = parseFloat(inp.value);
        next[k] = isFinite(v) ? v : 0;
      });
      // pOutKind 跟随数值给一个中性描述
      next.pOutKind = next.pOut > 0 ? '外压 / 大气压（' + next.pOut + ' MPa）' : '真空';
      next.source = 'manual';
      setEnv(next);
      renderNav(); route();
      toast('参数已应用');
    });

    const reset = $('#env-reset');
    if (reset) reset.addEventListener('click', () => {
      if (ENV.id === 'generic') return toast('当前是通用模板，没有预设可恢复', true);
      setEnv(buildEnv(ENV.id, { gTarget: ENV.gTarget }));
      renderNav(); route();
      toast('已恢复预设值');
    });
  }

  /* ---------------- quiz ---------------- */
  const sameSet = (a, b) => a.length === b.length && a.slice().sort().join() === b.slice().sort().join();

  /* 题目池：默认全部；从“本节小测”进来时只取该模块的题 */
  function quizPool() {
    const all = QZ(), f = store.quizFilter;
    if (!f) return all;
    const sub = all.filter(q => q.tag === f || q.ref === f);
    return sub.length ? sub : all;
  }

  function viewQuiz() {
    const q = store.quiz;
    if (!q || typeof q.idx !== 'number') store.quiz = { idx: 0, ans: {}, locked: {}, started: false, finished: false };
    // 兼容旧存档：没有 started 字段但有作答记录 → 视为已开始
    if (typeof store.quiz.started !== 'boolean') {
      store.quiz.started = Object.keys(store.quiz.ans || {}).length > 0 || Object.keys(store.quiz.locked || {}).length > 0;
    }
    const st = store.quiz;
    if (st.finished) return quizResult();
    if (!st.finished && !st.started) return quizIntro();
    const item = quizPool()[st.idx];
    if (!item) return quizResult();
    const ans = st.ans[item.id] || [];
    const locked = !!st.locked[item.id];
    const doneCount = Object.keys(st.locked).length;

    let html = pageHead({
      kicker: '自测 · ' + (st.idx + 1) + ' / ' + quizPool().length,
      title: '做题是最好的复习',
      sub: '单选选一个，多选选出全部正确项。提交后会给出解析，并告诉你可以回哪一节看。',
      meta: '<span class="badge b-gray">已完成 ' + doneCount + ' 题</span><span class="badge b-blue">' + esc(modTitle(item.tag)) + '</span>'
    });

    html += '<div class="quiz-top"><div class="qbar"><i style="width:' + ((st.idx) / quizPool().length * 100) + '%"></i></div>' +
      '<span class="small">第 ' + (st.idx + 1) + ' 题</span></div>';

    html += '<div class="card q-card"><div class="q-meta">' +
      '<span class="badge ' + (item.type === 'multi' ? 'b-amber' : 'b-blue') + '">' + (item.type === 'multi' ? '多选题' : '单选题') + '</span>' +
      '<span class="badge b-gray">模块 ' + modNo(item.tag) + ' · ' + esc(modTitle(item.tag)) + '</span></div>';
    html += '<p class="q-stem">' + item.stem + '</p>';
    html += '<div class="opts">';
    item.opts.forEach((o, i) => {
      let cls = 'opt';
      if (locked) {
        if (item.ans.indexOf(i) >= 0) cls += ' correct';
        else if (ans.indexOf(i) >= 0) cls += ' wrong';
        cls += ' locked';
      } else if (ans.indexOf(i) >= 0) cls += ' sel';
      const mark = locked && item.ans.indexOf(i) >= 0 ? '✓' : (locked && ans.indexOf(i) >= 0 ? '✕' : String.fromCharCode(65 + i));
      html += '<div class="' + cls + '" data-i="' + i + '"><span class="tick">' + mark + '</span><span>' + o + '</span></div>';
    });
    html += '</div>';

    html += '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px">';
    html += '<button class="btn btn-primary" id="q-submit"' + (locked || !ans.length ? ' disabled' : '') + '>提交答案</button>';
    if (locked) html += '<button class="btn btn-primary" id="q-next">' + (st.idx === quizPool().length - 1 ? '查看结果' : '下一题') + '</button>';
    html += '<button class="btn btn-ghost" id="q-exit">先退出（进度会保存）</button>';
    html += '</div>';

    if (locked) {
      const ok = sameSet(ans, item.ans);
      html += '<div class="explain"><div class="res ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓ 答对了' : '✕ 答错了') +
        '　正确答案：' + item.ans.map(i => String.fromCharCode(65 + i)).join('') + '</div>';
      if (item.steps) html += '<div class="steps">' + esc(item.steps).replace(/\n/g, '<br>') + '</div>';
      html += '<p>' + item.exp + '</p>';
      html += '<p style="margin-top:10px"><a class="link-btn" data-nav="' + item.ref + '">→ 回到模块 ' + modNo(item.ref) + '：' + esc(modTitle(item.ref)) + '</a></p>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function quizIntro() {
    const tags = Array.from(new Set(quizPool().map(q => q.tag)));
    const N = quizPool().length;
    const envReadyNow = ENV.id !== 'generic';
    return pageHead({
      kicker: store.quizFilter ? '自测 · 模块 ' + modNo(store.quizFilter) : '自测',
      title: store.quizFilter ? '模块 ' + modNo(store.quizFilter) + ' 小测：' + esc(modTitle(store.quizFilter)) : '先测一下，再决定学什么',
      sub: store.quizFilter
        ? '这一组只有 <b>' + N + ' 道题</b>，全部来自模块 ' + modNo(store.quizFilter) + '（含按本届环境实时计算的参数题）。做完看解析，答错就回那一节重读。'
        : (envReadyNow
          ? '共 ' + N + ' 道题 = ' + QUIZ.length + ' 道通用原理题 + ' + TERM_QUIZ.length + ' 道术语题 + ' + ENV_QUIZ(ENV).length + ' 道环境参数题（题干、答案已按「' + esc(ENV.short) + '」实时算好）。答错不是问题，关键是能顺着解析找到该补的那一节。'
          : '共 ' + N + ' 道题。当前还没有设定环境档案，环境参数题暂未加入——先去顶部「环境档案」选个场地或上传 RFP，题目会自动按你那年的数字生成。'),
      meta: '<span class="badge b-gray">' + N + ' 题</span><span class="badge b-gray">约 ' + Math.round(N * 1.2) + ' 分钟</span><span class="badge b-blue">含计算题</span>' +
        (envReadyNow ? '<span class="badge b-green">环境：' + esc(ENV.short) + '</span>' : '<span class="badge b-amber">环境未设定</span>')
    }) +
      '<div class="card card-pad">' +
      '<h3 style="margin:0 0 10px;font-size:16px">这套题在考什么</h3>' +
      '<ul class="mini-list">' +
      '<li><b>概念辨析</b>：天然重力 vs 人工重力、功率 vs 能量、硬指标 vs 建议。</li>' +
      '<li><b>定量计算</b>：转速、环带面积、储能量、光伏面积、水补给。</li>' +
      '<li><b>系统判断</b>：建造顺序、分级重力布局、AI 与人的分工、应急预案。</li>' +
      '<li><b>评审意识</b>：跨章节一致性、提交规范里的硬要求。</li>' +
      '</ul>' +
      (store.quizFilter
        ? '<p class="small" style="margin-top:12px">当前范围：<b>模块 ' + modNo(store.quizFilter) + ' · ' + esc(modTitle(store.quizFilter)) + '</b>　<button class="link-btn" data-nav="quiz" data-quizall="1">改为全部 ' + QZ().length + ' 题</button></p>'
        : '<p class="small" style="margin-top:12px">覆盖模块：' + tags.map(t => '模块' + modNo(t)).join('、') + '。</p>') +
      '<div style="margin-top:16px"><button class="btn btn-primary" id="q-start">开始做题</button></div>' +
      '</div>';
  }

  function quizResult() {
    const st = store.quiz;
    let ok = 0; const byTag = {};
    quizPool().forEach(q => {
      const a = st.ans[q.id] || [];
      const good = sameSet(a, q.ans);
      if (good) ok++;
      byTag[q.tag] = byTag[q.tag] || { n: 0, ok: 0 };
      byTag[q.tag].n++; if (good) byTag[q.tag].ok++;
    });
    const pct = Math.round(ok / quizPool().length * 100);
    const color = pct >= 85 ? '#1E9E6A' : pct >= 60 ? '#C78318' : '#D0453F';
    const circ = 2 * Math.PI * 46;

    let html = pageHead({
      kicker: '自测结果',
      title: pct >= 85 ? '基础很稳，可以开始拆 RFP 了' : pct >= 60 ? '及格线以上，先补薄弱模块' : '先别急着做设计，把基础补一遍',
      sub: '分数只是体检结果。下面按模块列出正确率，低于 70% 的建议回去重读那一节，再回来做错题。'
    });

    html += '<div class="card card-pad"><div class="result-hero">' +
      '<div class="score-ring" style="background:conic-gradient(' + color + ' ' + (pct * 3.6) + 'deg,#EEF1F8 0)">' +
      '<div style="width:82px;height:82px;border-radius:50%;background:#fff;display:grid;place-items:center"><div style="text-align:center"><span style="font-size:26px;font-weight:750">' + ok + '</span><small style="display:block">/ ' + quizPool().length + ' 题</small></div></div></div>' +
      '<div style="flex:1;min-width:220px"><div style="font-size:15px;font-weight:650;margin-bottom:4px">正确率 ' + pct + '%</div>' +
      '<p class="small" style="margin:0">' + (pct >= 85 ? '概念、计算、系统判断都过关。接下来去"分析 RFP"，把知识映射到你们这届的真实要求上。' : pct >= 60 ? '大部分概念没问题，但有明显薄弱环节。先补下面的红条，再把错题重做一遍。' : '基础概念还没建立起来，建议从模块 02、03 重新读，不要直接进入方案设计。') + '</p>' +
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn" id="q-retry-wrong">只做错题</button>' +
      '<button class="btn btn-ghost" id="q-reset">全部重做</button>' +
      '<a class="btn btn-primary" data-nav="rfp">去分析 RFP</a></div></div></div></div>';

    html += '<div class="card card-pad" style="margin-top:14px"><h3 style="margin:0 0 8px;font-size:16px">按模块看</h3>';
    Object.keys(byTag).sort((a, b) => (byTag[a].ok / byTag[a].n) - (byTag[b].ok / byTag[b].n)).forEach(t => {
      const r = Math.round(byTag[t].ok / byTag[t].n * 100);
      const c = r >= 70 ? '#1E9E6A' : r >= 40 ? '#C78318' : '#D0453F';
      html += '<div class="weak-row"><a data-nav="' + t + '" style="flex:0 0 190px;color:inherit">模块 ' + modNo(t) + ' · ' + esc(modTitle(t)) + '</a>' +
        '<div class="weak-bar"><i style="width:' + r + '%;background:' + c + '"></i></div>' +
        '<span class="small mono" style="flex:0 0 66px;text-align:right">' + byTag[t].ok + '/' + byTag[t].n + '　' + r + '%</span></div>';
    });
    html += '</div>';

    const wrong = quizPool().filter(q => !sameSet(st.ans[q.id] || [], q.ans));
    if (wrong.length) {
      html += '<div class="card card-pad" style="margin-top:14px"><h3 style="margin:0 0 8px;font-size:16px">错题回看（' + wrong.length + ' 题）</h3>';
      wrong.forEach(q => {
        html += '<div style="padding:9px 0;border-bottom:1px solid var(--line-2)">' +
          '<div style="font-size:13.6px;line-height:1.7"><span class="badge b-red">第 ' + q.id + ' 题</span> ' + q.stem.slice(0, 46) + '…</div>' +
          '<div class="small" style="margin-top:4px">正确答案 ' + q.ans.map(i => String.fromCharCode(65 + i)).join('') +
          ' · <a data-nav="' + q.ref + '">回模块 ' + modNo(q.ref) + '</a></div></div>';
      });
      html += '</div>';
    }
    return html;
  }

  function bindQuiz() {
    if ($('#q-start')) $('#q-start').addEventListener('click', () => {
      store.quiz = { idx: 0, ans: {}, locked: {}, started: true, finished: false }; save(); route();
    });
    if ($('#q-submit')) $('#q-submit').disabled = false;
    $$('.opt').forEach(op => op.addEventListener('click', () => {
      const st = store.quiz, item = quizPool()[st.idx];
      if (st.locked[item.id]) return;
      const i = +op.dataset.i;
      let a = st.ans[item.id] || [];
      if (item.type === 'single') a = [i];
      else a = a.indexOf(i) >= 0 ? a.filter(x => x !== i) : a.concat(i);
      st.ans[item.id] = a; save(); route();
    }));
    if ($('#q-submit')) $('#q-submit').addEventListener('click', () => {
      const st = store.quiz, item = quizPool()[st.idx];
      if (!(st.ans[item.id] || []).length) return;
      st.locked[item.id] = true; save(); route();
    });
    if ($('#q-next')) $('#q-next').addEventListener('click', () => {
      const st = store.quiz;
      if (st.idx >= quizPool().length - 1) { st.finished = true; }
      else st.idx++;
      save(); route();
    });
    if ($('#q-exit')) $('#q-exit').addEventListener('click', () => go('start'));
    if ($('#q-reset')) $('#q-reset').addEventListener('click', () => {
      store.quiz = { idx: 0, ans: {}, locked: {}, started: true, finished: false }; save(); route();
    });
    if ($('#q-retry-wrong')) $('#q-retry-wrong').addEventListener('click', () => {
      const st = store.quiz;
      const wrongIds = quizPool().filter(q => !sameSet(st.ans[q.id] || [], q.ans)).map(q => q.id);
      if (!wrongIds.length) { toast('没有错题，可以直接进 RFP 分析了'); return; }
      st.ans = {}; st.locked = {}; st.finished = false; st.started = true;
      st.idx = quizPool().findIndex(q => q.id === wrongIds[0]);
      save(); route();
    });
  }

  /* ---------------- RFP: 文件解析 ---------------- */
  function normalizeText(t) {
    return String(t).replace(/\r/g, '\n').replace(/\u00a0/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      .trim();
  }

  async function inflateRaw(u8) {
    const ds = new DecompressionStream('deflate-raw');
    const stream = new Blob([u8]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function readDocx(file) {
    const buf = await file.arrayBuffer();
    const dv = new DataView(buf), u8 = new Uint8Array(buf);
    let eocd = -1;
    for (let i = u8.length - 22; i >= 0 && i > u8.length - 66000; i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('这不是一个有效的 .docx 文件');
    const count = dv.getUint16(eocd + 10, true);
    let off = dv.getUint32(eocd + 16, true);
    let xml = '';
    for (let k = 0; k < count; k++) {
      if (dv.getUint32(off, true) !== 0x02014b50) break;
      const method = dv.getUint16(off + 10, true);
      const csize = dv.getUint32(off + 20, true);
      const nLen = dv.getUint16(off + 28, true);
      const eLen = dv.getUint16(off + 30, true);
      const cLen = dv.getUint16(off + 32, true);
      const lho = dv.getUint32(off + 42, true);
      const name = new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nLen));
      if (name === 'word/document.xml') {
        const lnLen = dv.getUint16(lho + 26, true);
        const leLen = dv.getUint16(lho + 28, true);
        const start = lho + 30 + lnLen + leLen;
        const data = u8.subarray(start, start + csize);
        const bytes = method === 0 ? data : await inflateRaw(data);
        xml = new TextDecoder('utf-8').decode(bytes);
      }
      off += 46 + nLen + eLen + cLen;
    }
    if (!xml) throw new Error('docx 里没找到正文');
    return xml.replace(/<w:tab[^>]*\/>/g, ' ')
      .replace(/<w:br[^>]*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }

  async function readPdf(file) {
    if (typeof pdfjsLib === 'undefined') throw new Error('PDF 解析库没有加载成功，请改用 docx 或直接粘贴文字');
    pdfjsLib.GlobalWorkerOptions.workerSrc = './libs/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
    const lines = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      let lastY = null, line = '';
      tc.items.forEach(it => {
        const y = it.transform[5];
        if (lastY === null) lastY = y;
        if (Math.abs(y - lastY) > 3.2) { lines.push(line); line = ''; lastY = y; }
        line += it.str;
      });
      lines.push(line); lines.push('');
    }
    return lines.join('\n');
  }

  async function handleFile(file) {
    if (!file) return;
    const name = file.name || '未命名文件';
    const ext = (name.split('.').pop() || '').toLowerCase();
    try {
      let text = '';
      if (ext === 'docx') text = await readDocx(file);
      else if (ext === 'pdf') text = await readPdf(file);
      else if (ext === 'txt' || ext === 'md' || ext === 'csv') text = await file.text();
      else if (ext === 'doc') throw new Error('老版 .doc 无法直接读取，请用 WPS/Word 另存为 .docx');
      else throw new Error('支持 .pdf / .docx / .txt，或直接粘贴文字');
      text = normalizeText(text);
      if (text.length < 500) throw new Error('只读到 ' + text.length + ' 个字符，可能是扫描版 PDF（图片），请粘贴文字');
      store.rfp = { name: name, text: text, at: Date.now() };
      store.tab = 'overview'; save(); route();
      toast('已读取：' + name + '（' + text.length + ' 字）');
    } catch (e) {
      toast(e.message || '解析失败', true);
    }
  }

  /* ---------------- RFP: 解析 ---------------- */
  const KNOWN_HEADINGS = [
    [/^executive summary$/i, 'Executive Summary'],
    [/^statement of work$/i, 'Statement of Work'],
    [/^structure and construction$/i, 'Structure and Construction'],
    [/^operation and maintenance$/i, 'Operation and Maintenance'],
    [/^human factors$/i, 'Human Factors'],
    [/^infrastructure design$/i, 'Infrastructure Design'],
    [/^schedule and cost$/i, 'Schedule and Cost'],
    [/^requirements for submission$/i, 'Requirements for Submission'],
    [/^criteria of evaluation$/i, 'Criteria of Evaluation']
  ];

  function asHeading(line) {
    if (!line || line.length > 92) return null;
    for (const [re, t] of KNOWN_HEADINGS) if (re.test(line)) return { no: '', title: t };
    const m = line.match(/^(\d{1,2}(?:\.\d{1,2})?)[\.\s]\s*([A-Z][A-Za-z][A-Za-z0-9 ,&\/\-]{2,70})$/);
    if (m && !/(19|20|21)\d{2}/.test(m[2]) && !/\.$/.test(line)) return { no: m[1], title: m[2].trim() };
    return null;
  }

  function parseRFP(text) {
    const lines = text.split('\n');
    const sections = [{ no: '', title: '背景与总述', body: '' }];
    let cur = sections[0];
    const dels = [];
    lines.forEach(raw => {
      const line = raw.trim();
      if (!line) { cur.body += '\n'; return; }
      const h = asHeading(line);
      if (h) { cur = { no: h.no, title: h.title, body: '' }; sections.push(cur); return; }
      if (/^deliverables?\s*[:：]/i.test(line)) {
        dels.push({ text: line.replace(/^deliverables?\s*[:：]\s*/i, '').trim(), section: cur.no, title: cur.title });
      }
      cur.body += line + '\n';
    });
    return { sections, dels };
  }

  function matchRule(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    let best = null, bs = 0;
    SECTION_RULES.forEach(r => {
      let s = 0;
      r.keys.forEach(k => { if (t.indexOf(k.toLowerCase()) >= 0) s += k.length > 9 ? 3 : 2; });
      if (s > bs) { bs = s; best = r; }
    });
    return bs >= 2 ? best : null;
  }

  function detectTags(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    const out = [];
    Object.keys(MODULE_KEYS).forEach(id => {
      let s = 0;
      MODULE_KEYS[id].forEach(k => { if (t.indexOf(k) >= 0) s++; });
      if (s) out.push({ id: id, s: s });
    });
    out.sort((a, b) => b.s - a.s);
    return out.slice(0, 3).map(x => x.id);
  }

  const NUM_RE = /(\d[\d,]*(?:\.\d+)?)\s*(m²|m2|km²|km2|km|kW|kWh|MW|MWh|GW|GWh|days?|day|years?|year|months?|month|%|g\b|rpm|RPM|atm|MPa|kPa|°C|Sv|kg|t\b|tonnes?|tons?|people|persons|residents|visitors|billion|million|m\b)/g;
  function extractNumbers(text) {
    const out = []; let m;
    NUM_RE.lastIndex = 0;
    while ((m = NUM_RE.exec(text)) !== null) {
      const s = (m[1] + ' ' + m[2]).replace(/\s+/g, ' ');
      if (out.indexOf(s) < 0) out.push(s);
      if (out.length > 60) break;
    }
    return out;
  }

  function detectTheme(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    const count = (k) => { let n = 0, i = 0; while ((i = t.indexOf(k, i)) >= 0) { n++; i += k.length; } return n; };
    let best = { score: 0, theme: THEMES[THEMES.length - 1] };
    THEMES.forEach(th => {
      let s = 0;
      th.keys.forEach(k => { const n = count(k); s += n * (k.length > 5 ? 2 : 1); });
      if (s > best.score) best = { score: s, theme: th };
    });
    let theme = best.score >= 2 ? best.theme : THEMES[THEMES.length - 1];
    if (theme.id.indexOf('mars') === 0) {
      const orbit = count('orbit'), surface = count('surface');
      theme = orbit > surface ? THEMES.find(x => x.id === 'mars-orbit') : THEMES.find(x => x.id === 'mars-surface');
    }
    return theme;
  }

  function extractFacts(text) {
    const t = text.replace(/\u00a0/g, ' ');
    const g = (re) => { const m = t.match(re); return m ? m[1].replace(/,/g, '') : null; };
    const award = t.match(/awarded in ([A-Z][a-z]+ \d{4})/i);
    const before = t.match(/before\s+(\d{4})/i);
    return {
      pop: g(/([\d,]{2,7})\s*(?:full-time\s+|permanent\s+)?(?:residents|people|persons|inhabitants|colonists)/i),
      visitors: g(/([\d,]{1,7})\s*(?:visitors|visiting|transient)/i),
      peak: g(/peak[^0-9]{0,12}([\d,]{2,7})/i),
      award: award ? award[1] : null,
      deadline: before ? before[1] : null,
      gravity: g(/(\d(?:\.\d)?)\s*g\b(?!\w)/i),
      days: g(/(\d{1,3})\s*days/i),
      ice: g(/(\d{2,4})\s*m\s*(?:ice\s*shell|thick)/i),
      port: g(/(\d{1,3})\s*vehicles/i),
      shaft: g(/(\d{1,3})\s*m\s*diameter/i),
      labs: g(/(\d{1,3})\s*(?:world-class\s*)?(?:science\s*)?labs/i),
      ratio: t.match(/(\d{1,2}:\d{1,2})/),
      pages: g(/(\d{1,3})\s*pages/i)
    };
  }

  function extractConstraints(text) {
    const parts = text.split(/(?<=[\.\!\?；;])\s+|\n/);
    const seen = {}, out = [];
    parts.forEach(s => {
      const x = s.trim();
      if (x.length < 18 || x.length > 320) return;
      if (!/(must|shall|required|at least|no less than|minimum|not exceed|zero|no waste|may not|before 2\d{3})/i.test(x)) return;
      const key = x.slice(0, 55).toLowerCase();
      if (seen[key]) return; seen[key] = 1;
      out.push(x);
    });
    return out;
  }

  function analyze(text) {
    const clean = normalizeText(text);
    const p = parseRFP(clean);
    const theme = detectTheme(clean);
    const facts = extractFacts(clean);
    const constraints = extractConstraints(clean);
    const nums = extractNumbers(clean);
    const sections = p.sections
      .map(s => {
        const canRule = s.no !== '' || /requirements for submission|criteria of evaluation/i.test(s.title);
        const rule = canRule ? matchRule(s.no + ' ' + s.title + ' ' + s.body.slice(0, 1500)) : null;
        const tags = detectTags(s.title + ' ' + s.body);
        return Object.assign({}, s, {
          rule: rule, tags: tags,
          nums: extractNumbers(s.title + ' ' + s.body).slice(0, 6),
          dels: p.dels.filter(d => d.section === s.no)
        });
      })
      .filter(s => (s.body.trim().length > 40 || s.dels.length) && !/^Statement of Work$/i.test(s.title));
    return { clean, theme, facts, constraints, nums, sections, dels: p.dels };
  }

  /* ---------------- RFP: 视图 ---------------- */
  function viewRFP() {
    if (!store.rfp || !store.rfp.text) {
      return pageHead({
        kicker: '分析本年 RFP',
        title: '把你的 RFP 变成一张“要做什么”的清单',
        sub: '上传 PDF / DOCX，或直接粘贴文字。工具会拆出章节、交付物、硬指标，并对应到前面学的知识模块。',
        meta: '<span class="badge b-blue">本地解析，不上传网络</span><span class="badge b-gray">支持 PDF / DOCX / TXT</span>'
      }) + rfpUploadHTML() +
      '<div class="pele-fig" data-diagram="rfp-pipeline"></div>' +
      '<p class="pele-cap">图 R-1　从 RFP 到可执行清单：本地解析只做拆解与关联，原文仍是最终依据。</p>';
    }
    const A = analyze(store.rfp.text);
    const tab = store.tab || 'overview';
    let html = pageHead({
      kicker: 'RFP 分析',
      title: esc(store.rfp.name),
      sub: '已识别 ' + A.sections.length + ' 个章节、' + A.dels.length + ' 条 Deliverable、' + A.constraints.length + ' 条硬指标。建议按“画像 → 章节要求 → 交付物 → 环境 → 自查”的顺序看。',
      meta: '<span class="badge b-gray">' + A.clean.length + ' 字</span><span class="badge b-teal">' + esc(A.theme.name) + '</span>'
    });

    /* 环境识别提示：RFP 与当前档案不一致时提醒 */
    const det = detectScene(store.rfp.text);
    if (det && det.id !== ENV.id) {
      const s = SCENES.find(x => x.id === det.id);
      if (s) {
        html += '<div class="callout c-warn" style="margin-top:0"><span class="ct">环境档案需要更新</span>' +
          '这份 RFP 的场地看起来是<b>' + esc(s.name) + '</b>，而当前档案是「' + esc(envLabel()) + '」。' +
          '讲解与自测题目引用的都是当前档案的数字。' +
          '<div style="margin-top:8px"><a class="btn btn-sm btn-primary" data-nav="envset">去环境档案页应用</a></div></div>';
      }
    }

    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">' +
      '<button class="btn btn-sm" id="rfp-copy">复制分析摘要</button>' +
      '<button class="btn btn-sm" id="rfp-replace">换一份 RFP</button>' +
      '<button class="btn btn-sm btn-ghost" id="rfp-clear">清空</button></div>';

    html += '<div class="tabs">' +
      tabBtn('overview', '总览') + tabBtn('sections', '章节要求 (' + A.sections.length + ')') +
      tabBtn('dels', '交付物 (' + A.dels.length + ')') + tabBtn('env', '环境与风险') +
      tabBtn('check', '自查清单') + '</div>';

    if (tab === 'overview') html += tabOverview(A);
    else if (tab === 'sections') html += tabSections(A);
    else if (tab === 'dels') html += tabDels(A);
    else if (tab === 'env') html += tabEnv(A);
    else html += tabCheck(A);

    html += '<p class="small" style="margin-top:24px;line-height:1.9;border-top:1px solid var(--line);padding-top:14px">' +
      '⚠️ 自动解析一定会有遗漏或误判（尤其是扫描版 PDF、复杂排版、表格里的数字）。请以 RFP 原文为准，把这份清单当作“检查表”，而不是“替代阅读”。<br>' +
      '这份分析只回答“甲方要什么、评委看什么、你该问自己什么”，<b>不会替你们给出设计方案或参数</b>。</p>';
    return html;
  }

  function tabBtn(id, label) {
    return '<button class="tab' + ((store.tab || 'overview') === id ? ' active' : '') + '" data-tab="' + id + '">' + label + '</button>';
  }

  function rfpUploadHTML() {
    return '<div class="card card-pad">' +
      '<div class="drop" id="drop">' +
      '<h4>把 RFP 拖到这里，或点击选择文件</h4>' +
      '<p>支持 .pdf / .docx / .txt　·　全部在你的电脑里解析，不会上传</p>' +
      '<input type="file" id="file" accept=".pdf,.docx,.txt,.md" style="display:none">' +
      '</div>' +
      '<div style="display:flex;gap:10px;align-items:center;margin:18px 0 10px"><div style="flex:1;height:1px;background:var(--line)"></div>' +
      '<span class="small">或者直接粘贴文字</span><div style="flex:1;height:1px;background:var(--line)"></div></div>' +
      '<textarea id="paste" rows="7" placeholder="从 PDF 或 Word 里复制正文粘贴到这里（建议包含 Statement of Work 与 Deliverables 部分）"></textarea>' +
      '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" id="paste-go">分析这段文字</button>' +
      '<button class="btn" id="load-sample">载入 2027 示例（木卫二 Galileo）</button></div>' +
      '<div class="callout c-warn" style="margin-top:18px;margin-bottom:0"><span class="ct">提示</span>' +
      '如果 PDF 是扫描件（图片），文字提取会失败；请用 WPS/Word 打开后另存为 .docx，或直接复制粘贴正文。</div>' +
      '</div>';
  }

  function profileCells(A) {
    const f = A.facts;
    const cells = [];
    cells.push(['地点 / 天体', A.theme.name]);
    cells.push(['服务人口', [f.pop ? f.pop + ' 常驻' : null, f.visitors ? '最多 ' + f.visitors + ' 访客' : null].filter(Boolean).join(' + ') || '见 RFP 原文']);
    cells.push(['时间窗口', [f.award ? f.award + ' 授予' : null, f.deadline ? f.deadline + ' 前运营' : null].filter(Boolean).join(' → ') || '见 RFP 原文']);
    cells.push(['重力要求', f.gravity ? f.gravity + ' g' : '需人工重力 / 待确认']);
    cells.push(['关键数字', [f.ice ? '冰层 ' + f.ice + ' m' : null, f.port ? f.port + ' 泊位' : null, f.days ? f.days + ' 天储备' : null, f.labs ? f.labs + ' 个实验室' : null].filter(Boolean).join(' · ') || '见下方数字清单']);
    cells.push(['提交形式', [f.ratio ? f.ratio : null, f.pages ? '≤' + f.pages + ' 页' : null].filter(Boolean).join(' · ') + (f.ratio ? '' : '见 RFP 原文')]);
    return '<div class="profile">' + cells.map(c => '<div><span class="k">' + esc(c[0]) + '</span><span class="v">' + c[1] + '</span></div>').join('') + '</div>';
  }

  function tabOverview(A) {
    let html = '<div class="stack">';
    html += '<div class="card card-pad"><h3 style="margin:0 0 12px;font-size:16px">项目画像</h3>' + profileCells(A) + '</div>';

    html += '<div class="callout c-key" style="margin:0"><span class="ct">这份 RFP 的核心是什么</span>' +
      '地点是 <b>' + esc(A.theme.name) + '</b>，最需要提前吃透的环境约束是：' + esc(A.theme.env[2] ? A.theme.env[2][0] + '（' + A.theme.env[2][1] + '）' : '见环境表') + '。' +
      '全文有 <b>' + A.dels.length + ' 条 Deliverable</b>，意味着你们至少要交出 ' + A.dels.length + ' 组“可被检查的证据”（图/表/流程图）。' +
      '下面的硬指标是“漏了就直接判不满足”的条款。</div>';

    if (A.nums.length) {
      html += '<div class="card card-pad"><h3 style="margin:0 0 10px;font-size:16px">关键数字（从原文抽出，请逐条核对）</h3><div class="chips">' +
        A.nums.slice(0, 36).map(n => '<span class="badge b-gray mono">' + esc(n) + '</span>').join('') + '</div></div>';
    }

    html += '<div class="card card-pad"><h3 style="margin:0 0 10px;font-size:16px">硬指标清单（must / at least / zero）</h3>';
    if (!A.constraints.length) html += '<p class="small">没有识别到 must/shall 类句子——可能是 PDF 提取不完整，请粘贴文字再试。</p>';
    else {
      html += '<div style="max-height:420px;overflow:auto">';
      A.constraints.slice(0, 24).forEach((c, i) => {
        html += '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line-2)">' +
          '<span class="badge b-red" style="flex:0 0 auto">' + (i + 1) + '</span>' +
          '<span style="font-size:13.4px;line-height:1.7">' + esc(c) + '</span></div>';
      });
      html += '</div>';
      if (A.constraints.length > 24) html += '<p class="small" style="margin-top:8px">共 ' + A.constraints.length + ' 条，这里显示前 24 条。</p>';
    }
    html += '</div>';

    html += '<div class="card card-pad"><h3 style="margin:0 0 10px;font-size:16px">建议的阅读顺序</h3>' +
      '<ol class="mini-list">' +
      '<li><b>先看 Requirements for Submission 与 Criteria of Evaluation</b>：格式与评分标准决定了后面所有内容的呈现方式。</li>' +
      '<li><b>再看 Executive Summary</b>：人口、地点、时限、总体目标。<b>把数字抄进共享参数表</b>。</li>' +
      '<li><b>然后逐节读 Statement of Work</b>：每节先找 Deliverable，再找 must/at least，最后找形容词（隐含要求）。</li>' +
      '<li><b>最后回读环境描述</b>：把环境约束翻译成设计参数（屏蔽厚度、散热方式、自主等级）。</li>' +
      '</ol></div>';
    html += '</div>';
    return html;
  }

  function tabSections(A) {
    let html = '<p class="small" style="margin-bottom:14px">每个章节给出：原文摘要、该节的交付物与数字、<b>评审视角下的最小达标线</b>、以及你该向自己提的问题。</p>';
    A.sections.forEach(s => {
      const r = s.rule;
      html += '<div class="req">';
      html += '<div class="req-top"><div><p class="req-title">' + (s.no ? '<span class="mono" style="color:var(--blue)">' + esc(s.no) + '</span> ' : '') + esc(s.title) + '</p>' +
        '<div class="chips" style="margin-top:6px">' + s.tags.map(t => '<a class="badge b-blue" data-nav="' + t + '">模块 ' + modNo(t) + ' · ' + esc(modTitle(t)) + '</a>').join('') +
        (r ? '<span class="badge b-violet">' + esc(r.name) + '</span>' : '<span class="badge b-gray">通用要求</span>') + '</div></div></div>';

      const brief = s.body.trim().replace(/\s+/g, ' ');
      if (brief) html += '<div class="req-quote">' + esc(brief.slice(0, 420)) + (brief.length > 420 ? '…' : '') + '</div>';

      if (s.nums.length) html += '<div class="chips" style="margin-bottom:8px">' + s.nums.map(n => '<span class="badge b-gray mono">' + esc(n) + '</span>').join('') + '</div>';

      if (s.dels.length) {
        html += '<div class="kvline"><span class="k">交付物</span><span class="v">';
        html += s.dels.map(d => '• ' + esc(d.text)).join('<br>');
        html += '</span></div>';
      }

      if (r) {
        html += '<div class="kvline"><span class="k">最小达标线</span><span class="v"><ul class="mini-list">' + r.minimum.map(x => '<li>' + x + '</li>').join('') + '</ul></span></div>';
        html += '<div class="kvline"><span class="k">评审视角</span><span class="v">' + r.review + '</span></div>';
        html += '<div class="kvline"><span class="k">先问自己</span><span class="v"><ol class="mini-list">' + r.ask.map(x => '<li>' + x + '</li>').join('') + '</ol></span></div>';
        html += '<div class="kvline"><span class="k">常见坑</span><span class="v" style="color:#8A3B36">' + r.pitfalls.map(x => '· ' + x).join('<br>') + '</span></div>';
      } else {
        html += '<div class="kvline"><span class="k">怎么读</span><span class="v">这一节没有匹配到固定的评审规则库。请自己找：① 带数字的硬指标；② “Deliverable”后面的交付物；③ 形容词背后的隐含要求。</span></div>';
      }
      html += '</div>';
    });
    return html;
  }

  function tabDels(A) {
    let html = '<p class="small" style="margin-bottom:14px">RFP 里每一句 “Deliverable:” 都是一条<b>必须被看见</b>的交付物。把它当成出图清单：左边是要求，右边是你该交的证据。</p>';
    if (!A.dels.length) {
      html += '<div class="card card-pad"><p class="small">没有识别到 "Deliverable:" 句。可能是 PDF 排版把该词拆开，或这份 RFP 用了别的表述（如 "shall show / shall provide"）。请用搜索功能在原文里找 "Deliver"。<br><br>另一种做法：把每个小节最后一段当作隐含交付物。</p></div>';
    } else {
      A.dels.forEach((d, i) => {
        const rule = matchRule(d.text + ' ' + d.title);
        const tags = detectTags(d.text);
        html += '<div class="req"><div class="req-top"><p class="req-title"><span class="mono" style="color:var(--blue)">D' + (i + 1) + '</span> ' + esc(d.text) + '</p></div>' +
          '<div class="chips" style="margin-top:8px">' +
          (d.section ? '<span class="badge b-gray">§' + esc(d.section) + '</span>' : '') +
          tags.map(t => '<a class="badge b-blue" data-nav="' + t + '">模块 ' + modNo(t) + '</a>').join('') +
          (rule ? '<span class="badge b-violet">' + esc(rule.name) + '</span>' : '') + '</div>';
        if (rule) html += '<p class="small" style="margin:10px 0 0">评审会检查：' + rule.minimum[0] + '</p>';
        html += '</div>';
      });
    }
    return html;
  }

  function tabEnv(A) {
    let html = '<div class="card card-pad"><h3 style="margin:0 0 12px;font-size:16px">环境参数（' + esc(A.theme.name) + '）</h3>' +
      '<div class="table-wrap"><table><tr><th style="width:20%">项目</th><th style="width:28%">数值 / 状态</th><th>对设计的影响</th></tr>' +
      A.theme.env.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('') +
      '</table></div><p class="small">以上为教学用典型值，请以 RFP 原文与官方资料为准；不一致时以 RFP 为准并在方案中注明。</p></div>';

    html += '<div class="grid-2" style="margin-top:16px">' +
      '<div class="card card-pad"><h3 style="margin:0 0 8px;font-size:15px">由此推出的设计含义</h3><ul class="mini-list">' +
      A.theme.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul></div>' +
      '<div class="card card-pad" style="border-color:#F3E2C0;background:#FFFDF8"><h3 style="margin:0 0 8px;font-size:15px;color:#8A5B10">这类场地的常见坑</h3><ul class="mini-list">' +
      A.theme.risks.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul></div></div>';

    html += '<div class="card card-pad" style="margin-top:16px"><h3 style="margin:0 0 8px;font-size:15px">环境参数待确认清单</h3>' +
      '<p class="small" style="margin-bottom:8px">把下表填完，你们的环境章节就有底了。找不到的数据要写"假设 + 依据"。</p>' +
      '<div class="table-wrap"><table><tr><th style="width:26%">参数</th><th>你们的结论</th><th style="width:26%">来源 / 假设</th></tr>' +
      ['天然重力', '外部压力（真空/大气/水压）', '辐射剂量（年或日）', '温度范围', '昼夜与光照', '通信时延与窗口', '主要本地资源', '主要灾害']
        .map(k => '<tr><td>' + k + '</td><td class="small">（待填）</td><td class="small">（待填）</td></tr>').join('') +
      '</table></div></div>';
    return html;
  }

  function tabCheck(A) {
    let html = '<div class="card card-pad"><h3 style="margin:0 0 6px;font-size:16px">提交前自查（' + SELF_CHECK.length + ' 项）</h3>' +
      '<p class="small" style="margin-bottom:12px">勾选状态会保存在本机。全部打勾之前，不要提交。</p>';
    SELF_CHECK.forEach((c, i) => {
      const id = 'ck' + i;
      html += '<div class="check-item"><input type="checkbox" id="' + id + '" data-ck="' + i + '"' + (store.checks[i] ? ' checked' : '') + '>' +
        '<label for="' + id + '">' + esc(c) + '</label></div>';
    });
    html += '</div>';

    html += '<div class="card card-pad" style="margin-top:16px"><h3 style="margin:0 0 10px;font-size:16px">针对这份 RFP 的追问清单</h3>' +
      '<p class="small" style="margin-bottom:10px">按章节汇总，来自评审规则库。组会时一条条过，每条都要有人能答。</p>';
    const seen = {};
    A.sections.forEach(s => {
      if (!s.rule) return;
      if (seen[s.rule.id]) return; seen[s.rule.id] = 1;
      html += '<div style="margin-bottom:14px"><div style="font-size:13.6px;font-weight:650;margin-bottom:4px">' + esc(s.rule.name) + '</div>' +
        '<ol class="mini-list">' + s.rule.ask.map(q => '<li>' + q + '</li>').join('') + '</ol></div>';
    });
    html += '</div>';
    return html;
  }

  function bindRFP() {
    const drop = $('#drop');
    if (drop) {
      const file = $('#file');
      drop.addEventListener('click', () => file.click());
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('hot'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('hot'));
      drop.addEventListener('drop', e => {
        e.preventDefault(); drop.classList.remove('hot');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      });
      file.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
      $('#paste-go').addEventListener('click', () => {
        const t = normalizeText($('#paste').value);
        if (t.length < 300) { toast('内容太短了，至少粘贴 300 字', true); return; }
        store.rfp = { name: '粘贴的 RFP（' + new Date().toLocaleDateString() + '）', text: t, at: Date.now() };
        store.tab = 'overview'; save(); route();
      });
      $('#load-sample').addEventListener('click', () => {
        store.rfp = { name: SAMPLE_RFP.name, text: normalizeText(SAMPLE_RFP.text), at: Date.now() };
        store.tab = 'overview'; save(); route();
      });
    }

    $$('[data-tab]').forEach(b => b.addEventListener('click', () => { store.tab = b.dataset.tab; save(); route(); }));
    if ($('#rfp-clear')) $('#rfp-clear').addEventListener('click', () => {
      store.rfp = null; save(); toast('已清空'); route();
    });
    if ($('#rfp-replace')) $('#rfp-replace').addEventListener('click', () => {
      store.rfp = null; save(); route();
    });
    if ($('#rfp-copy')) $('#rfp-copy').addEventListener('click', () => {
      if (!store.rfp) return;
      const A = analyze(store.rfp.text);
      const lines = [];
      lines.push('GFSSM RFP 分析摘要 · ' + store.rfp.name);
      lines.push('地点：' + A.theme.name);
      lines.push('章节：' + A.sections.length + '　交付物：' + A.dels.length + '　硬指标：' + A.constraints.length);
      lines.push('');
      lines.push('【交付物清单】');
      A.dels.forEach((d, i) => lines.push((i + 1) + '. ' + d.text));
      lines.push('');
      lines.push('【硬指标】');
      A.constraints.slice(0, 30).forEach((c, i) => lines.push((i + 1) + '. ' + c));
      lines.push('');
      lines.push('【各章节最小达标线】');
      A.sections.forEach(s => {
        if (!s.rule) return;
        lines.push('§' + (s.no || '') + ' ' + s.title + '　（' + s.rule.name + '）');
        s.rule.minimum.forEach(m => lines.push('  - ' + m.replace(/<[^>]+>/g, '')));
      });
      const txt = lines.join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => toast('已复制到剪贴板'), () => fallbackCopy(txt));
      } else fallbackCopy(txt);
    });
    $$('[data-ck]').forEach(cb => cb.addEventListener('change', () => {
      store.checks[cb.dataset.ck] = cb.checked; save();
    }));
  }

  function fallbackCopy(txt) {
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('已复制到剪贴板'); } catch (e) { toast('复制失败，请手动选择', true); }
    document.body.removeChild(ta);
  }

  /* ---------------- tools ---------------- */
  function viewTools() {
    return pageHead({
      kicker: '工具箱',
      title: '算一遍，比“大概”有说服力',
      sub: '五个最常用的估算：重力、环带面积、储能、光伏面积、水补给。每个都要把“假设”写进方案。',
      meta: '<span class="badge b-blue">边算边理解</span><span class="badge b-gray">结果不代替设计论证</span>'
    }) +
      '<div class="stack">' + calcHTML('g', '① 人工重力：R 与 n 的关系', [
        { id: 'g-g', label: '目标重力 g（如 0.8）', val: '0.8' },
        { id: 'g-r', label: '地板半径 R（m）', val: '250' }
      ]) + calcHTML('area', '② 环带面积与人均面积', [
        { id: 'a-r', label: '地板半径 R（m）', val: '250' },
        { id: 'a-w', label: '环带宽度 W（m）', val: '40' },
        { id: 'a-p', label: '设计人口（人）', val: '1250' }
      ]) + calcHTML('store', '③ 应急储能（最低功率 × 天数）', [
        { id: 's-p', label: '最低功率（kW）', val: '4000' },
        { id: 's-d', label: '维持天数', val: '90' }
      ]) + calcHTML('pv', '④ 光伏面积', [
        { id: 'p-p', label: '所需电功率（MW）', val: '24' },
        { id: 'p-e', label: '组件效率（0.24 = 24%）', val: '0.24' },
        { id: 'p-i', label: '当地辐照（W/m²）', val: '590' }
      ]) + calcHTML('water', '⑤ 水回收与补给', [
        { id: 'w-n', label: '人口（人）', val: '1250' },
        { id: 'w-l', label: '人均用水（L/人·天）', val: '100' },
        { id: 'w-r', label: '回收率（0.9 = 90%）', val: '0.9' }
      ]) + calcHTML('delay', '⑥ 通信时延', [
        { id: 'd-au', label: '距离（AU，1 AU ≈ 1.5 亿 km）', val: '5.2' }
      ]) + '</div>' +
      '<div class="callout c-warn" style="margin-top:18px"><span class="ct">用法提醒</span>' +
      '计算器给的是<b>量级</b>，不是答案。方案里要写清：用的什么假设、假设从哪来、结果对设计有什么影响。只贴一个数字，评委会追问“为什么是这个数”。</div>';
  }

  function calcHTML(id, title, fields) {
    return '<div class="card card-pad calc" id="calc-' + id + '">' +
      '<div><h3 style="margin:0 0 10px;font-size:15.5px">' + title + '</h3>' +
      fields.map(f => '<div class="field"><label>' + f.label + '</label><input id="' + f.id + '" value="' + f.val + '" inputmode="decimal"></div>').join('') +
      '</div><div class="calc-out" id="out-' + id + '">—</div></div>';
  }

  function bindTools() {
    const num = id => parseFloat(($(id) || {}).value);
    function upd() {
      // 1 gravity
      let g = num('#g-g'), r = num('#g-r');
      if (g > 0 && r > 0) {
        const a = g * 9.81, w = Math.sqrt(a / r), n = w * 60 / (2 * Math.PI);
        $('#out-g').innerHTML = '<span class="lab">所需转速</span><span class="big">' + n.toFixed(2) + ' rpm</span>' +
          '角速度 ω = ' + w.toFixed(3) + ' rad/s<br>向心加速度 a = ' + a.toFixed(2) + ' m/s²<br>' +
          (n <= 2 ? '<span style="color:#7BE0B0">✓ 在 2 rpm 舒适上限内</span>' : '<span style="color:#FFB4A8">⚠ 超过 2 rpm，科里奥利效应可能引起不适</span>');
      }
      // 2 area
      let ar = num('#a-r'), aw = num('#a-w'), ap = num('#a-p');
      if (ar > 0 && aw > 0) {
        const A = 2 * Math.PI * ar * aw;
        $('#out-area').innerHTML = '<span class="lab">环带可用面积</span><span class="big">' + Math.round(A).toLocaleString() + ' m²</span>' +
          (ap > 0 ? '人均 ' + (A / ap).toFixed(1) + ' m²/人<br>' + (A / ap < 40 ? '<span style="color:#FFB4A8">⚠ 偏紧（含公共/工作/农业时通常需 80–120 m²/人）</span>' : '<span style="color:#7BE0B0">✓ 量级合理</span>') : '') +
          '<br><span style="opacity:.7">A ≈ 2πR·W</span>';
      }
      // 3 storage
      let sp = num('#s-p'), sd = num('#s-d');
      if (sp > 0 && sd > 0) {
        const E = sp * sd * 24;
        $('#out-store').innerHTML = '<span class="lab">所需储能</span><span class="big">' + (E / 1e6).toFixed(2) + ' GWh</span>' +
          E.toLocaleString() + ' kWh<br>锂电池（0.2 kWh/kg）≈ ' + Math.round(E / 0.2 / 1000).toLocaleString() + ' 吨<br>' +
          '<span style="opacity:.75">提示：这个量级通常不该用电池，而应"燃料储备 + 降功率运行"</span>';
      }
      // 4 pv
      let pp = num('#p-p'), pe = num('#p-e'), pi = num('#p-i');
      if (pp > 0 && pe > 0 && pi > 0) {
        const S = pp * 1e6 / (pe * pi);
        $('#out-pv').innerHTML = '<span class="lab">所需光伏面积</span><span class="big">' + S.toExponential(2).replace('e+', '×10^') + ' m²</span>' +
          '≈ ' + Math.round(S).toLocaleString() + ' m²<br><span style="opacity:.7">S = P / (η·I)</span>';
      }
      // 5 water
      let wn = num('#w-n'), wl = num('#w-l'), wr = num('#w-r');
      if (wn > 0 && wl > 0 && wr >= 0) {
        const total = wn * wl / 1000, loss = total * (1 - wr);
        $('#out-water').innerHTML = '<span class="lab">每日需补充</span><span class="big">' + loss.toFixed(1) + ' m³/天</span>' +
          '总用水 ' + total.toFixed(0) + ' m³/天<br>年补充 ≈ ' + Math.round(loss * 365).toLocaleString() + ' m³';
      }
      // 6 delay
      let au = num('#d-au');
      if (au > 0) {
        const km = au * 1.5e8, one = km / 3e5 / 60;
        $('#out-delay').innerHTML = '<span class="lab">单程时延</span><span class="big">' + one.toFixed(1) + ' 分钟</span>' +
          '往返 ' + (one * 2).toFixed(1) + ' 分钟<br><span style="opacity:.7">t = d / c，c = 3×10⁵ km/s</span>' +
          (one > 5 ? '<br><span style="color:#FFB4A8">远距离：必须本地自治</span>' : '');
      }
    }
    ['#g-g', '#g-r', '#a-r', '#a-w', '#a-p', '#s-p', '#s-d', '#p-p', '#p-e', '#p-i', '#w-n', '#w-l', '#w-r', '#d-au']
      .forEach(s => { const el = $(s); if (el) el.addEventListener('input', upd); });
    upd();
  }

  /* ---------------- anatomy figures ----------------
     图表按需加载：只有当前页出现 data-figure 时才拉 figures/<name>.js。 */
  const FIGURE_BASE = './figures/';
  function mountFigures(root) {
    $$('[data-figure]', root).forEach(el => {
      if (el.dataset.mounted) return;
      const name = el.dataset.figure;
      const mount = () => {
        if (el.dataset.mounted || !el.isConnected) return;
        const fig = window.ANATOMY_FIGURES && window.ANATOMY_FIGURES[name];
        if (!fig || !fig.html) return;
        el.classList.add('iso');
        el.setAttribute('data-theme', 'light');
        el.innerHTML = fig.html;
        const readout = el.querySelector('[data-readout]');
        if (readout) readout.setAttribute('aria-live', 'polite');
        el.dataset.mounted = '1';
        try { fig.init(el); } catch (err) { console.error('figure ' + name, err); }
      };
      if (window.ANATOMY_FIGURES && window.ANATOMY_FIGURES[name]) { mount(); return; }
      if (el.dataset.loading) return;
      el.dataset.loading = '1';
      el.innerHTML = '<div class="anatomy-loading">正在加载交互配图…</div>';
      const s = document.createElement('script');
      s.src = FIGURE_BASE + name + '.js';
      s.onload = () => { el.dataset.loading = ''; mount(); };
      s.onerror = () => { el.dataset.loading = '';
        el.innerHTML = '<div class="anatomy-loading">配图加载失败。可打开 <a href="' + FIGURE_BASE + name + '.html" target="_blank" rel="noopener">独立页面</a>。</div>';
      };
      document.body.appendChild(s);
    });
  }

  /* ---------------- Pele diagrams ----------------
     Mermaid -> static SVG, rendered at build time; only the registry is lazy-loaded. */
  const DIAGRAM_SRC = './figures/diagrams.js';
  let diagramLoad = null;
  function loadDiagrams() {
    if (window.PELE_DIAGRAMS) return Promise.resolve();
    if (diagramLoad) return diagramLoad;
    diagramLoad = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = DIAGRAM_SRC;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('diagrams.js'));
      document.body.appendChild(s);
    });
    return diagramLoad;
  }
  function mountDiagrams(root) {
    const slots = $$('[data-diagram]', root);
    if (!slots.length) return;
    slots.forEach(el => {
      if (!el.dataset.mounted) el.innerHTML = '<div class="pele-loading">正在加载图表…</div>';
    });
    loadDiagrams().then(() => {
      const narrow = matchMedia('(max-width: 560px)');
      slots.forEach(el => {
        if (el.dataset.mounted || !el.isConnected) return;
        const d = window.PELE_DIAGRAMS && window.PELE_DIAGRAMS[el.dataset.diagram];
        if (!d) return;
        el.setAttribute('role', 'img');
        el.setAttribute('aria-label', d.title || '图表');
        const paint = () => {
          el.innerHTML = narrow.matches ? d.narrow : d.wide;
          el.dataset.narrow = narrow.matches ? '1' : '0';
        };
        paint();
        el.dataset.mounted = '1';
        if (narrow.addEventListener) {
          narrow.addEventListener('change', () => { if (el.isConnected) paint(); });
        }
      });
    }).catch(() => {
      slots.forEach(el => {
        if (el.dataset.mounted) return;
        el.innerHTML = '<div class="pele-loading">图表加载失败。可打开 <a href="' + DIAGRAM_SRC + '" target="_blank" rel="noopener">图表数据</a> 检查。</div>';
      });
    });
  }

  /* ---------------- boot ---------------- */
  window.addEventListener('hashchange', () => { if (pageId() !== rendered) route(); });
  document.addEventListener('click', e => {
    const t = e.target;
    const el = t && t.closest ? t.closest('[data-nav],[data-quizmod],[data-quizall]') : null;
    if (!el) return;
    e.preventDefault();
    if (el.dataset.quizmod) {
      store.quizFilter = el.dataset.quizmod;
      store.quiz = { idx: 0, ans: {}, locked: {}, started: true, finished: false };
      save(); go('quiz'); return;
    }
    if (el.dataset.quizall) { store.quizFilter = null; save(); if (el.dataset.nav) { go(el.dataset.nav); return; } }
    if (el.dataset.nav) go(el.dataset.nav);
  });
  $('#nav-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#scroll-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    $('#scroll-top').classList.toggle('show', window.scrollY > 600);
  });
  window.addEventListener('error', e => {
    console.error(e.message);
    const v = $('#view');
    if (v && !v.innerHTML.trim()) v.innerHTML = '<div class="card card-pad"><h3>页面出错了</h3><p class="small">' + esc(e.message) + '</p></div>';
  });
  renderNav();
  route();
})();
