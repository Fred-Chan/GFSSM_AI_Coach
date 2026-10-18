/* ==========================================================
   GFSSM AI Coach · 环境参数题（每年自适应）
   ----------------------------------------------------------
   与 QUIZ（通用原理题）不同，这里的题干、选项、答案、解析
   全部由当前"环境档案"实时计算得出。
   换一份 RFP / 换一个场景 → 题目自动变，答案自动重算。
   ========================================================== */

const ENV_QUIZ_VERSION = 1;

/* 术语题：与年份无关，考的是读英文 RFP 的基本功 */
const TERM_QUIZ = [
  {
    id: 'T1', tag: 'gfssm', type: 'single', kind: 'term',
    stem: 'RFP 里反复出现 "Deliverables"。它指的是：',
    opts: [
      '项目预算的分项明细',
      '必须随提案提交、可被逐项检查的成果物（图纸、表格、报告）',
      '主办方提供的参考资料',
      '评委会给出的反馈意见'
    ],
    ans: [1],
    exp: 'Deliverable = 交付物。它是"可验收"的：有清单、有格式、有页数/比例要求。读 RFP 的第一件事就是把 Deliverables 列成表，逐项打勾——漏一项通常是直接扣分，而不是"内容不足"。',
    ref: 'gfssm'
  },
  {
    id: 'T2', tag: 'review', type: 'single', kind: 'term',
    stem: '英文 RFP 里的 "shall / must / should / may" 四个词，语气从强到弱排序正确的是：',
    opts: [
      'may > should > must > shall',
      'shall = must（强制） > should（建议） > may（可选）',
      'should 最强，因为带"应该"',
      '四个词没有区别，只是行文习惯'
    ],
    ans: [1],
    exp: 'shall 与 must 是强制要求（不满足即不合规）；should 是建议（不照做要说明理由）；may 是可选。写方案时把 must/shall 条目单独列一张"合规对照表"，是最省力的得分动作。<b>别忘了再查一遍 "at least / no more than / zero" 这类数量词</b>——它们往往才是真正卡人的硬指标。',
    ref: 'review'
  }
];

/* ---------- 主生成器 ---------- */
function ENV_QUIZ(env) {
  const e = Object.assign({}, ENV_DEFAULT, env || {});
  const G = 9.80665;
  const gT = (e.gTarget || 0.8);
  const aT = gT * G;                       // 目标重力加速度 m/s²
  /* 算例半径按场地取"这个场景里工程上说得过去"的量级：
     水下/冰下 → 受水深与系泊限制（250 m）；轨道/自由空间 → 可做大（400 m）；
     表面/地下 → 受地形与覆土荷载限制（180 m） */
  const tags0 = e.tags || [];
  const R0 = tags0.indexOf('icy') >= 0 ? 250 : (tags0.indexOf('orbital') >= 0 ? 400 : 180);
  const R0why = tags0.indexOf('icy') >= 0 ? '水下环体受水深与系泊限制'
    : (tags0.indexOf('orbital') >= 0 ? '自由空间不受地形限制，可做大直径'
      : '表面/地下受地形与覆土荷载限制');
  const n = Math.sqrt(aT / R0) * 60 / (2 * Math.PI);       // rpm
  const w2 = 2 * 2 * Math.PI / 60;                         // 2 rpm 的角速度
  const Rcrit = aT / (w2 * w2);                            // 2 rpm 下的最小半径
  const gap = Math.max(0, gT - (e.gNat || 0));
  const fmt = (v, d) => (isFinite(v) ? v.toFixed(d == null ? 2 : d) : '—');
  const isVac = !e.pOut || e.pOut <= 0.001;
  const depth = e.depth || (e.pOut ? Math.round(e.pOut / 0.01) : 0);

  /* 辐射：按"每 20 cm 冰/水衰减一半"的简化半值层，目标 ≤ 0.05 Sv/年 */
  const doseYear = (e.radDay || 0) * 365;
  const targetDose = 0.05;
  const ratio = doseYear > 0 ? doseYear / targetDose : 0;
  const layers = ratio > 1 ? Math.ceil(Math.log2(ratio)) : 0;
  const shieldM = +(layers * 0.2).toFixed(1);

  /* 光伏：1 MW 负荷、效率 20% */
  const PV = e.sun ? 1e6 / (e.sun * 0.2) : 0;
  /* 储能：1 MW 负荷、夜间 = 周期一半 */
  const nightH = e.dayLen ? e.dayLen / 2 : 0;
  const storeKWh = nightH ? 1000 * nightH : 0;

  const list = [];

  /* ---- 1. 天然 vs 人工 ---- */
  list.push({
    id: 'E1', tag: 'env', type: 'single', kind: 'env',
    stem: '当前场景：<b>' + e.name + '</b>（' + e.where + '）。天然重力约 ' + fmt(e.gNat, 3) + ' g，即 ' + fmt(e.gNat * G, 2) + ' m/s²；方案要求居住区达到 ' + fmt(gT, 2) + ' g。下列判断正确的是：',
    opts: [
      '天然重力已经够用，不需要再做人工重力',
      '还差约 ' + fmt(gap, 2) + ' g，必须由旋转（或等效手段）补足；补的是"重力大小"，不是"有没有重力"',
      '把基地建得更深，天然重力会明显增大',
      '缺的这部分可以用提高舱内气压来补'
    ],
    ans: [1],
    exp: '天然重力 g = GM/r²，只由天体质量与半径决定；往深处挖 r 变小，g 反而略微<b>变大一点</b>，但量级上毫无意义（几百米对上千公里半径）。气压也完全不是重力——1 atm 的舱内你依然是失重感。所以缺口只能靠<b>旋转离心加速度</b>（a = ω²R）或持续推力来补。<br>本题数值：' + fmt(gT, 2) + ' − ' + fmt(e.gNat, 3) + ' = <b>' + fmt(gap, 2) + ' g</b>。',
    ref: 'gravity'
  });

  /* ---- 2. 转速 ---- */
  list.push({
    id: 'E2', tag: 'gravity', type: 'single', kind: 'env',
    stem: '本场景取居住环地板半径 R = ' + R0 + ' m（' + R0why + '）。要达到 ' + fmt(gT, 2) + ' g（' + fmt(aT, 2) + ' m/s²），所需转速最接近：',
    opts: [
      fmt(n, 2) + ' rpm',
      fmt(n * 0.7, 2) + ' rpm',
      fmt(n * 1.5, 2) + ' rpm',
      fmt(n / 2, 2) + ' rpm'
    ],
    ans: [0],
    exp: 'a = ω²R → ω = √(a/R) = √(' + fmt(aT, 2) + '/' + R0 + ') = ' + fmt(Math.sqrt(aT / R0), 3) + ' rad/s；<br>n = ω × 60/(2π) = ' + fmt(Math.sqrt(aT / R0), 3) + ' × 9.549 = <b>' + fmt(n, 2) + ' rpm</b>。<br>' +
      (n <= 2 ? '这个转速在 2 rpm 舒适上限之内，方案可行。' : '注意：这个转速<b>超过了 2 rpm 舒适上限</b>，实际设计要么加大半径，要么降低目标重力。') +
      ' 常见错误是忘记把 g 换成 m/s²（直接用 0.8 代进去），或者把 rpm 与 rad/s 混用。',
    ref: 'gravity'
  });

  /* ---- 3. 临界半径 ---- */
  list.push({
    id: 'E3', tag: 'gravity', type: 'single', kind: 'env',
    stem: '工程上把 <b>2 rpm</b> 作为舒适上限（超过后科里奥利效应明显、易头晕）。要在这个上限内达到 ' + fmt(gT, 2) + ' g，居住环半径至少约：',
    opts: [
      fmt(Rcrit * 0.5, 0) + ' m',
      fmt(Rcrit, 0) + ' m',
      fmt(Rcrit * 1.8, 0) + ' m',
      fmt(Rcrit * 3, 0) + ' m'
    ],
    ans: [1],
    exp: '2 rpm → ω = 2 × 2π/60 = ' + fmt(w2, 4) + ' rad/s。由 a = ω²R 得 R = a/ω² = ' + fmt(aT, 2) + ' / ' + fmt(w2 * w2, 4) + ' = <b>' + fmt(Rcrit, 0) + ' m</b>。（本题只由目标重力决定，与场地无关——这正是它值得记住的原因。）<br>这条关系是"目标重力定半径下限"的来源：<b>要的 g 越大、允许的转速越低，环就必须越大</b>。半径一大，结构质量、造价、跨度全部跟着涨——这就是人工重力的真实代价。',
    ref: 'gravity'
  });

  /* ---- 4. 壳体受力 ---- */
  list.push({
    id: 'E4', tag: 'env', type: 'single', kind: 'env',
    stem: isVac
      ? '本场景外部为<b>真空</b>，居住舱内部维持约 1 atm。关于壳体受力，正确的是：'
      : '本场景外部压力约 <b>' + fmt(e.pOut, 2) + ' MPa</b>（' + e.pOutKind + '），舱内维持约 0.1 MPa。关于壳体受力，正确的是：',
    opts: isVac ? [
      '内压向外撑，壳体主要受拉，失效模式以爆裂、疲劳裂纹为主',
      '外压把壳体往里压，主要怕屈曲失稳',
      '内外压力基本平衡，壳体可以不考虑强度',
      '真空不影响结构，只影响散热'
    ] : [
      '外压把壳体往里压，壳体主要受压，失效模式以屈曲失稳为主，与轨道城正好相反',
      '内压向外撑，壳体受拉，可以照抄轨道城的结构做法',
      '压差不大，结构形式和轨道城没有区别',
      '压力只影响气闸数量，不影响壳体形式'
    ],
    ans: [0],
    exp: isVac
      ? '真空 + 内压 1 atm：压力从里往外推，薄壳受<b>拉</b>，怕的是爆裂与疲劳裂纹。所以轨道城多用"压力容器 + 多层冗余密封"的思路。'
      : '外部 ' + fmt(e.pOut, 2) + ' MPa、内部 0.1 MPa，压差方向朝内，壳体受<b>压</b>，怕的是<b>屈曲（buckling）</b>——一根意面被两头挤压时突然弯断，就是屈曲。所以外压容器的设计重点是<b>刚度、加肋、形状（圆柱比平板强）</b>，而不是抗拉强度。<br>这条差异是"能不能照抄轨道城结构"的判据：受力方向反了，结构逻辑就得整套重写。',
    ref: 'layout'
  });

  /* ---- 5. 辐射屏蔽 ---- */
  if (e.radDay > 0) {
    list.push({
      id: 'E5', tag: 'env', type: 'single', kind: 'env',
      stem: '本场景所在位置的辐射剂量约 <b>' + fmt(e.radDay, e.radDay < 0.01 ? 5 : 2) + ' Sv/天</b>（年剂量约 ' + fmt(doseYear, doseYear < 1 ? 3 : 1) + ' Sv）。若按"每 20 cm 冰/水衰减一半"估算，要把年剂量压到 0.05 Sv 以下，屏蔽层至少约：',
      opts: [
        fmt(Math.max(0.2, shieldM * 0.5), 1) + ' m',
        fmt(Math.max(0.2, shieldM), 1) + ' m',
        fmt(Math.max(0.2, shieldM * 2), 1) + ' m',
        '不需要屏蔽，靠药物即可'
      ],
      ans: [1],
      exp: '年剂量 = ' + fmt(e.radDay, 2) + ' × 365 = ' + fmt(doseYear, 1) + ' Sv；需要衰减 ' + fmt(ratio, 0) + ' 倍。<br>每 20 cm 衰减一半 → 层数 = log₂(' + fmt(ratio, 0) + ') ≈ ' + layers + ' 层 → 厚度 ≈ ' + layers + ' × 0.2 = <b>' + fmt(shieldM, 1) + ' m</b>。<br>这个估算很粗（实际取决于粒子种类、材料、几何），但足以让你判断"屏蔽是几十厘米还是几米"——这正是方案里必须给出的量级。若所在地本身就有冰壳/覆土/大气，厚度可以扣除。',
      ref: 'env'
    });
  }

  /* ---- 6. 通信时延 ---- */
  const cmin = e.commMin || 0, cmax = e.commMax || cmin;
  list.push({
    id: 'E6', tag: 'infra', type: 'single', kind: 'env',
    stem: '本场景与地球的单程通信时延约 <b>' + fmt(cmin, cmin < 1 ? 3 : 0) + (cmax > cmin ? '–' + fmt(cmax, 0) : '') + ' 分钟</b>。对设计最直接的影响是：',
    opts: cmax < 0.05 ? [
      '可以像地面远程运维一样实时操控，无需本地自治',
      '往返时延仍有数秒，安全关键动作需要本地闭环与缓冲，不能纯靠手操',
      '时延完全不影响设计',
      '必须全城 AI 自治，人类不得参与决策'
    ] : [
      '必须本地自治：安全关键决策不能等地球指令，AI 在环 + 断链预案是硬需求',
      '只要带宽足够，时延可以被消除',
      '时延只影响娱乐与通话，不影响工程',
      '可以让地球工程师实时遥控施工与维修'
    ],
    ans: [0],
    exp: '时延 = 距离 ÷ 光速，是<b>物理下限</b>，带宽再大也消不掉。单程 ' + fmt(cmin, 0) + ' 分钟意味着往返 (' + fmt(cmin, 0) + '–' + fmt(cmax || cmin, 0) + ') × 2 分钟，人在回路里"等回信"的操作全部不可行：施工、故障处置、医疗急救都必须本地闭环。<br>由此推出的设计动作：自主等级分级、本地决策权限表、断链（loss of signal）预案、以及"哪些操作绝不允许远程触发"的清单。',
    ref: 'infra'
  });

  /* ---- 7. 光伏面积 ---- */
  if (e.sun > 0) {
    list.push({
      id: 'E7', tag: 'power', type: 'single', kind: 'env',
      stem: '本场景太阳辐照约 <b>' + fmt(e.sun, 0) + ' W/m²</b>。若用光伏满足 1 MW 电负荷（系统效率按 20% 计），所需受光面积最接近：',
      opts: [
        fmt(PV / 10, 0) + ' m²',
        fmt(PV, 0) + ' m²',
        fmt(PV * 3, 0) + ' m²',
        fmt(PV / 3, 0) + ' m²'
      ],
      ans: [1],
      exp: 'S = P / (η × I) = 1×10⁶ / (0.2 × ' + fmt(e.sun, 0) + ') = <b>' + fmt(PV, 0) + ' m²</b>（约 ' + fmt(PV / 10000, 1) + ' 公顷）。<br>对比地球附近（1361 W/m²）同功率只需约 3,673 m²。这个比值就是"为什么远离太阳必须考虑核能"的算术依据。别忘了这只是"受光面积"，还没算电池板自身的质量、展开机构、清洗与指向损失。',
      ref: 'power'
    });
  }

  /* ---- 8. 储能 ---- */
  if (e.dayLen > 0) {
    list.push({
      id: 'E8', tag: 'power', type: 'single', kind: 'env',
      stem: '本场景一个昼夜周期约 <b>' + fmt(e.dayLen, 1) + ' 小时</b>。若 1 MW 的基础负荷在夜间（周期的一半）全部靠储能，需要的最小储能量约：',
      opts: [
        fmt(storeKWh / 2, 0) + ' kWh',
        fmt(storeKWh, 0) + ' kWh',
        fmt(storeKWh * 4, 0) + ' kWh',
        '不需要储能，夜间也能发电'
      ],
      ans: [1],
      exp: '夜间时长 = ' + fmt(e.dayLen, 1) + ' / 2 = ' + fmt(nightH, 1) + ' h；能量 = 功率 × 时间 = 1,000 kW × ' + fmt(nightH, 1) + ' h = <b>' + fmt(storeKWh, 0) + ' kWh</b>。<br>注意三件事：① 这是<b>下限</b>，实际要留 20–30% 裕度并考虑低温容量衰减；② 储能是有质量的（锂电约 10 kWh/吨级，具体看体系），这个质量要回到结构章节；③ 若昼夜周期很长（如月球 708 小时），"靠电池过夜"通常不成立，必须走核能或"追光/迁移"策略。',
      ref: 'power'
    });
  }

  /* ---- 9. 建造位置与方式 ---- */
  const whereQ = (e.tags || []).indexOf('icy') >= 0
    ? {
      stem: '本场景的居住区位于冰层之下的水中。关于建造方式，最合理的是：',
      opts: [
        '先打通冰壳通道，再在水中就位环体，靠浮力与系泊维持姿态',
        '像地面施工一样，先浇筑地基再盖楼',
        '直接在冰面上建造，然后整体沉下去',
        '不需要通道，靠机器人从冰面下钻'
      ],
      ans: [0],
      exp: '水下没有"地基"可用——环体必须靠<b>浮力平衡自重</b>、靠<b>系泊索</b>限制漂移，还要考虑水流阻力与海冰顶板的挤压。冰壳通道（竖井）是所有物流、电力、通信的生命线，必须先行且可关闭（气密/水密隔离）。'
    } : (e.tags || []).indexOf('orbital') >= 0
      ? {
        stem: '本场景位于轨道/自由空间。关于建造方式，最合理的是：',
        opts: [
          '模块化发射 + 在轨组装 + 在轨加注，无法使用重型土建机械',
          '先发射挖掘机，在舱内挖地基',
          '整体一次发射，不做在轨组装',
          '先建地面厂房，再把厂房送上轨道'
        ],
        ans: [0],
        exp: '轨道上没有"地"，也没有重力帮你固定工件：所有结构靠<b>对接、螺栓、焊接、张拉</b>连接，所有材料靠发射整流罩尺寸约束。所以"模块划分"不是设计偏好，而是被运载能力逼出来的。'
      }
      : {
        stem: '本场景位于天体表面。关于建造次序，最合理的是：',
        opts: [
          '机器人先遣（勘察、平整、能源与通信先行），人到达时已具备基本生存条件',
          '人先着陆，边住边建',
          '先建居住区，再考虑能源',
          '不需要先遣，一次性建成'
        ],
        ans: [0],
        exp: '表面建造的核心是"人货分离、能源先行"：先送机器人与能源/通信节点，把场地准备好、把生存条件（电、气、水、避护）做出来，人再到场。否则首批人员会变成"用自己的消耗率去换施工进度"，风险与成本都失控。'
      };
  list.push({
    id: 'E9', tag: 'build', type: 'single', kind: 'env',
    stem: whereQ.stem, opts: whereQ.opts, ans: whereQ.ans, exp: whereQ.exp, ref: 'build'
  });

  /* ---- 10. 第一约束 ---- */
  const hazardList = (e.hazard || '').split(/[、,，]/).filter(Boolean);
  const first = hazardList[0] || '环境约束';
  list.push({
    id: 'E10', tag: 'env', type: 'multi', kind: 'env',
    stem: '针对 <b>' + e.name + '</b>，下列哪些是该方案必须正面回应的环境约束（选出所有正确项）：',
    opts: hazardList.slice(0, 3).map(h => '应对：' + h).concat([
      '用"加厚外壳"一句话概括所有环境问题即可',
      '只要人口规模算对了，环境约束会自动满足'
    ]),
    ans: hazardList.slice(0, 3).map((_, i) => i),
    exp: '本场景的硬约束包括：<b>' + (e.hazard || '待填') + '</b>。<br>每一项都要在方案里对应到<b>具体设计动作 + 量化指标</b>：辐射 → 屏蔽厚度与年剂量；极寒 → 保温功率与材料低温韧性；外压 → 屈曲校核与加肋方案；无光 → 人工光照的光谱与照度。<br>评委最反感的是"用一句「采用先进材料」打包所有问题"——那不是设计，是跳过设计。',
    ref: 'env'
  });

  return list;
}

/* 供 UI 判断：环境档案是否可用 */
function envReady(env) {
  const e = env || ENV_DEFAULT;
  return !!(e && e.id && e.id !== 'generic' && (e.gNat != null) && e.source !== 'none');
}
