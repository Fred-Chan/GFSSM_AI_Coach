/* ==========================================================
   GFSSM AI Coach · RFP 分析用的环境库与评审规则库
   ========================================================== */

/* ---------- 一、地点环境库 ---------- */
const THEMES = [
  {
    id: 'europa', name: '木卫二 / 木星系统',
    keys: ['europa', 'galileo', 'jupiter', '木卫二', '木星', '欧罗巴'],
    env: [
      ['表面重力', '1.31 m/s²（0.134 g）', '天然重力仅地球 1/7，居住重力必须靠旋转'],
      ['表面温度', '约 −160 ℃', '极寒真空，表面作业需机器人或重度保温'],
      ['表面辐射', '约 5.4 Sv/天', '数小时即致命；冰层是天然屏蔽'],
      ['冰壳厚度', '站点约 600 m', '既是屏蔽层，也是可开挖的结构介质（会蠕变）'],
      ['冰下海洋', '深 60–150 km', '水几乎无限，但受零排放公约约束'],
      ['外部压力', '约 6 MPa（600 m 水深）', '壳体受外压，需抗屈曲'],
      ['太阳辐照', '约 50 W/m²（地球 3.7%）', '光伏面积需 27 倍，核能更合理'],
      ['通信时延', '单程 35–52 分钟', '无法实时遥控，必须本地自治'],
      ['自转周期', '3.55 天（潮汐锁定）', '潮汐形变引起结构疲劳；辐射带剂量随位置变化']
    ],
    points: [
      '居住环浸没在海水中 → 散热条件好（对流），但存在浮力、系泊、水阻与结冰问题。',
      '冰内空腔需要衬砌与热管理，否则冰蠕变会缓慢闭合。',
      'EPC 零排放是法規约束，不是环保口号：所有废物必须处理或封存。',
      '表面港（15 泊位）在强辐射环境下，加注与维护应默认无人化。'
    ],
    risks: [
      '把轨道城的结构方案直接搬过来（内压 vs 外压受力方向相反）',
      '流程图上画了"处理后排放至海洋"的箭头',
      '把 0.8 g 当成木卫二天然重力'
    ]
  },
  {
    id: 'mars-surface', name: '火星表面',
    keys: ['mars surface', 'martian surface', '火星表面', '火星基地', 'mars base'],
    env: [
      ['表面重力', '3.71 m/s²（0.38 g）', '天然重力可用，但长期 0.38 g 的生理影响需评估'],
      ['大气', '约 0.6 kPa，95% CO₂', '极稀薄，无法呼吸但可用于制氧（MOXIE 类）'],
      ['平均温度', '约 −63 ℃（−140 ~ +20 ℃）', '温差大，热控与材料热应力是重点'],
      ['辐射', '表面约 0.7 mSv/天（无全球磁场）', '需覆土/水墙屏蔽；舱外活动限时'],
      ['尘暴', '全球性沙尘暴可持续数月', '光伏积尘、机械磨损、通信衰减'],
      ['昼夜', '24 小时 39 分', '与地球节律接近，人因友好'],
      ['太阳辐照', '约 590 W/m²', '光伏可行，但要考虑尘积与倾角'],
      ['通信时延', '单程 3–22 分钟', '可远程监督，但不能实时遥控']
    ],
    points: [
      '就地资源（大气 CO₂、水冰、风化层）是经济性关键，ISRU 应写进方案。',
      '覆土屏蔽（regolith shielding）比运材料便宜，但要算结构荷载。',
      '沙尘对光伏、气闸、密封件是长期磨损源。'
    ],
    risks: ['忽略尘暴对电力与维护的影响', '把 0.38 g 当 1 g 做人体设计', '忘记火星大气可用于制氧/制甲烷']
  },
  {
    id: 'mars-orbit', name: '火星轨道',
    keys: ['mars orbit', 'martian orbit', '火星轨道', 'vulcan'],
    env: [
      ['重力', '微重力（需旋转产生）', '必须人工重力；轴心 0 g'],
      ['太阳辐照', '约 590 W/m²', '光伏面积按 S=P/(ηI) 计算'],
      ['辐射', '无行星屏蔽，GCR + 太阳粒子事件', '需质量屏蔽与水墙'],
      ['散热', '真空，仅辐射散热', '散热面积是硬约束'],
      ['碎片/微陨石', '存在，需 Whipple 防护', '外壳多层结构'],
      ['通信时延', '单程 3–22 分钟', '本地自治 + 异步协作']
    ],
    points: ['轨道城的核心矛盾是"无重力、无资源、散热难"', '物资全部依赖补给，闭环率决定成本'],
    risks: ['把轨道当表面（以为有大气/重力）', '散热面积没算']
  },
  {
    id: 'moon', name: '月球表面 / 月球轨道',
    keys: ['moon', 'lunar', '月球', '月面'],
    env: [
      ['表面重力', '1.62 m/s²（0.166 g）', '低重力，人体对抗措施必需'],
      ['大气', '几乎没有（外逸层）', '真空，需完全密闭'],
      ['温度', '−173 ~ +127 ℃', '昼夜温差极大，热控难'],
      ['昼夜', '约 29.5 天一个周期', '连续 14 天黑夜 → 储能与核能需求'],
      ['辐射', '无磁场无大气，约 0.2–0.4 Sv/年', '需覆土或厚壁屏蔽'],
      ['太阳辐照', '约 1,361 W/m²', '光伏可行，但月夜需储能'],
      ['通信时延', '约 1.3 秒', '可遥操作，但深空网络带宽有限'],
      ['资源', '月壤（可烧结制砖）、极区水冰', 'ISRU 潜力大']
    ],
    points: ['月夜 14 天是储能/核电源的关键约束', '月壤可作为屏蔽与建材，但开采与烧结耗能'],
    risks: ['低估月夜储能需求', '忽略月尘对密封件与健康的危害']
  },
  {
    id: 'cislunar', name: '近地 / 近月轨道',
    keys: ['cis-lunar', 'cislunar', 'low earth orbit', 'leo', 'near-earth', '近地轨道', '近月空间'],
    env: [
      ['重力', '微重力', '需旋转或接受微重力'],
      ['太阳辐照', '约 1,361 W/m²', '光伏效率最高，是最有利的能源环境'],
      ['辐射', 'GCR + 南大西洋异常区', '低倾角轨道相对友好'],
      ['碎片', '空间碎片密度高', '防护与规避机动必需'],
      ['散热', '真空辐射散热', '散热器面积仍是约束'],
      ['通信', '近实时（秒级）', '可远程遥控，容错空间大'],
      ['补给', '发射窗口频繁', '补给成本相对低，闭环率要求可放宽']
    ],
    points: ['近地轨道最大的优势是"补给方便"，最大的风险是"碎片"', '可作为深空任务的试验场与建造地'],
    risks: ['把近地的低补给成本套用到深空', '忽略碎片规避的推进剂预算']
  },
  {
    id: 'asteroid', name: '小行星 / 小行星带',
    keys: ['asteroid', 'psyche', '小行星', '贝努', 'itokawa'],
    env: [
      ['重力', '微重力（10⁻³ ~ 10⁻⁵ g）', '几乎无重力，锚固与采矿是难题'],
      ['形状', '不规则、自转快', '着陆/锚泊困难，表面可能不稳定'],
      ['温度', '随日照剧烈变化', '热控与材料疲劳'],
      ['辐射', '无屏蔽', '需质量屏蔽'],
      ['通信时延', '数分钟至数十分钟', '自治要求高'],
      ['资源', '金属/水冰丰富', '经济性来自就地取材与加工']
    ],
    points: ['核心矛盾是"没有重力、没有稳定地面"', '锚固、采矿、粉尘控制是关键技术'],
    risks: ['按"地面基地"思维设计', '忽略微重力下粉尘与碎屑的危害']
  },
  {
    id: 'venus', name: '金星（云层城市）',
    keys: ['venus', '金星'],
    env: [
      ['重力', '8.87 m/s²（0.90 g）', '接近地球重力，是独特优势'],
      ['云层环境', '约 50–55 km 高度：1 atm、30–50 ℃', '浮空城市可避开 460 ℃ 地表'],
      ['大气', 'CO₂ + 硫酸云', '材料腐蚀是核心问题'],
      ['太阳辐照', '约 2,600 W/m²', '光伏强，但云层遮挡需评估'],
      ['通信时延', '单程 2–14 分钟', '可监督，不能实时遥控'],
      ['资源', '大气可提取 CO₂/N₂/SO₂', '水与金属需外部输入']
    ],
    points: ['浮力城市：浮力 = 排开大气的重量，需算浮升气体体积', '硫酸腐蚀决定材料选择'],
    risks: ['用地面基地思路设计（金星地表不可能长期驻留）', '忽略硫酸对结构与密封的腐蚀']
  },
  {
    id: 'mercury', name: '水星',
    keys: ['mercury', '水星'],
    env: [
      ['表面重力', '3.70 m/s²（0.38 g）', '与火星接近'],
      ['大气', '几乎没有', '真空，需完全密闭'],
      ['温度', '−180 ~ +430 ℃', '昼夜温差极端，热控是首要难题'],
      ['昼夜', '176 个地球日', '极长昼夜 → 能源与储能方案特殊'],
      ['太阳辐照', '约 9,100 W/m²（地球 6.7 倍）', '光伏面积小，但散热极难'],
      ['通信时延', '单程 5–13 分钟', '自治要求高'],
      ['资源', '极区永久阴影区可能有水冰', '水冰是关键战略资源']
    ],
    points: ['辐照极强 → 发电容易、散热极难，热控成为主约束', '极区永夜坑是水冰与低温的"避难所"'],
    risks: ['只算发电不算散热', '忽略极端温差对材料的影响']
  },
  {
    id: 'titan', name: '土卫六',
    keys: ['titan', '土卫六'],
    env: [
      ['表面重力', '1.35 m/s²（0.14 g）', '低重力'],
      ['大气', '约 1.5 bar，95% N₂ + 甲烷', '气压高于地球，壳体受外压；可提取氮/甲烷'],
      ['温度', '约 −179 ℃', '极寒，材料与密封挑战'],
      ['太阳辐照', '约 15 W/m²', '光伏几乎不可行，必须核能'],
      ['辐射', '大气屏蔽较好', '相对友好'],
      ['通信时延', '单程 70–90 分钟', '高度自治'],
      ['资源', '甲烷湖、水冰', '能源与化工原料丰富']
    ],
    points: ['大气厚 → 可用气球/飞机，也可提取甲烷作为燃料', '极寒 + 弱光 → 核能为主'],
    risks: ['把 1 atm 当真空（实际是 1.5 bar 外压）', '用光伏做主电源']
  },
  {
    id: 'generic', name: '未识别地点（通用）',
    keys: [],
    env: [
      ['重力', '待从 RFP 确认', '天然重力 / 人工重力要分清'],
      ['外部压力', '待确认（真空 / 稀薄大气 / 高压）', '决定壳体受内压还是外压'],
      ['辐射', '待确认', '决定屏蔽质量与居住深度'],
      ['温度', '待确认', '决定热控方式（辐射 / 对流）'],
      ['通信时延', '待确认', '决定自主等级'],
      ['资源', '待确认', '决定 ISRU 可行性']
    ],
    points: ['先在 RFP 里找地点、人口、时限、重力、功率这几个数字，再谈设计。'],
    risks: ['环境参数没查清就开始画图']
  }
];

/* ---------- 二、要求类型 → 知识模块 ---------- */
const MODULE_KEYS = {
  gfssm: ['rfp', 'proposal', 'deliverable', 'honor code', 'statement of work', 'executive summary'],
  env: ['environment', 'radiation', 'temperature', 'atmosphere', 'pressure', 'ocean', 'ice shell', 'jupiter', 'europa', 'mars', 'moon', 'vacuum', 'dose', 'thermal', 'meteoroid', 'debris'],
  gravity: ['gravity', 'rotate', 'rotation', 'rpm', 'spin', 'artificial gravity', 'g level'],
  layout: ['layout', 'dimension', 'volume', 'area', 'zone', 'compartment', 'section drawing', 'map', 'enclosed volume'],
  build: ['construction', 'sequence', 'assembly', 'build', 'phased', 'deploy'],
  airwater: ['atmosphere', 'oxygen', 'water', 'air', 'recycl', 'sabatier', 'electrolysis', 'humidity'],
  foodwaste: ['waste', 'food', 'agricultur', 'crop', 'algae', 'farm', 'discharge', 'gray water', 'solid waste'],
  human: ['residential', 'community', 'psycholog', 'human', 'privacy', 'well-being', 'contingency', 'emergency', 'evacuat', 'isolation'],
  infra: ['robot', 'communication', 'artificial intelligence', 'ai ', 'laborator', 'transport', 'logistic', 'docking', 'bandwidth'],
  power: ['power', 'electric', 'energy', 'kwh', ' kw', 'fusion', 'solar', 'storage', 'reactor'],
  business: ['schedule', 'cost', 'gantt', 'budget', 'billion', 'milestone', 'month', 'human resources'],
  review: ['submission', 'slide', 'evaluation', 'criteria', 'page', 'ratio', 'honor', 'filename']
};

/* ---------- 三、评审规则库（按主题匹配） ---------- */
const SECTION_RULES = [
  {
    id: 'overall', name: '总体设计与体量标注',
    keys: ['overall design', 'every major enclosed volume', 'overview and design', '总体设计', '总平面'],
    tags: ['layout', 'gravity', 'env'],
    minimum: [
      '每个主要封闭体量都要标四项：<b>功能 / 尺寸[m] / 旋转或静止 / 增压或不增压</b>',
      '画清各体量之间的连接：竖井、通道、气闸、旋转接口分别在哪个界面',
      '居住环标出<b>重力方向 + 半径 R + 转速 n</b>，并给出计算过程',
      '总图能一眼区分：表面段 / 静止段 / 旋转段（用颜色或线型）'
    ],
    review: '完整性从这里开始看：任何一个没标注的体量，评委会立刻问"这个空间干什么、多大、人能不能待"。',
    ask: ['你们一共有几个主要体量？请逐个说出功能与尺寸。', 'R 与 n 是怎么定出来的？如果改成 200 m 会怎样？', '旋转段与静止段在哪个界面连接？接口怎么密封？'],
    pitfalls: ['只有外观渲染图，没有剖面', '尺寸写"约""若干层"', '整张图看不出哪里转、哪里增压']
  },
  {
    id: 'port', name: '表面港 / 发射与着陆区',
    keys: ['space port', 'launching', 'landing pad', 'warehouse', '港口', '发射'],
    tags: ['layout', 'infra', 'env'],
    minimum: [
      '泊位数量与 RFP 数字一致（如 15 个同时作业），并说明周转方式',
      '标注加注、维修、仓储、待发区的相对位置与尺寸[m]',
      '说明与主基地的连接（竖井/通道）与货物如何从飞船进入屏蔽区',
      '在强辐射/极寒环境下，给出"无人化作业"或"人员限时"的依据'
    ],
    review: 'RFP 明确要求"布局图 + 全部尺寸[m]"，并对同时作业数量给了硬指标。少一个泊位就是少一条要求。',
    ask: ['15 个泊位怎么排？飞机/飞船怎么进、怎么出？', '加注的推进剂从哪来、怎么送过来？', '表面作业人员一天能待多久？依据是什么？'],
    pitfalls: ['只画几个方块不标尺寸', '加注区紧贴居住区', '没有说明货物如何过竖井']
  },
  {
    id: 'construction', name: '建造次序与分阶段投用',
    keys: ['construction sequence', 'construction', 'assembly', '建造', '施工'],
    tags: ['build', 'business', 'layout'],
    minimum: [
      '至少 <b>6 个步骤</b>，每步写清"做什么 / 谁来做 / 交付什么能力"',
      '体现<b>机器人先遣</b>与<b>能源先行</b>，并说明理由',
      '每一步都要说明"如何让一部分设施提前投用"（RFP 原话）',
      '给出预算与运营理由（每步花多少、投用后产生什么）',
      '与甘特图、成本表的阶段划分一一对应'
    ],
    review: '这是"系统性"最容易得分的一章：评委要看的是逻辑链，而不是漂亮的流程图。',
    ask: ['哪一步第一次有人进入？之前靠什么运行？', '如果第 3 步失败，第 4 步还能做吗？', '每步的预算占比是多少？早期运营能带来什么？'],
    pitfalls: ['画了 8 个方框但没有一步产生可用能力', '先建港口/先让环旋转', '步骤数与甘特图对不上']
  },
  {
    id: 'power', name: '电力与储能',
    keys: ['power', 'electricity', 'energy', 'kwh', 'storage', '电力', '能源'],
    tags: ['power', 'foodwaste', 'infra'],
    minimum: [
      '给出<b>总功耗（kW）</b>、<b>发电功率（kW）</b>、<b>储能（kWh）</b>三个数，单位正确',
      '负荷要有依据：设备清单或人均指标 + 系数，而不是一个凭空的数',
      '说明<b>应急最低功率</b>如何定义（哪些负荷保留、哪些切除）',
      '说明储能载体（电池/燃料/热）与 90 天（或 RFP 规定天数）的匹配逻辑',
      '发电有冗余（N+1 或分区），并说明故障时的降级路径'
    ],
    review: '单位错（kW/kWh 混用）是硬伤；只给总数不给依据，Rationality 会被压分。',
    ask: ['总负荷怎么算出来的？最大的三项是什么？', '90 天要多少 kWh？用什么装？质量多少？', '聚变堆停堆后，多久能恢复？'],
    pitfalls: ['储能写成 kW', '农业照明电没算进去', '"90 天"直接堆电池，不给质量估算']
  },
  {
    id: 'lss', name: '生命保障：空气、水、废物',
    keys: ['life support', 'atmosphere', 'water', 'waste', 'oxygen', '生保', '生命保障'],
    tags: ['airwater', 'foodwaste'],
    minimum: [
      '三张流程图：<b>大气 / 水 / 废物</b>，每张都有物质名称、流向、数量',
      '回收率与 RFP 数字对齐（如氧 ≥90%、水 ≥90%），并说明损失如何补',
      '废物<b>零排放</b>：每条流都有最终形态（基质/建材/封存返运），没有"排海"箭头',
      '说明与农业、能源的接口（CO₂ 去农业、废水去电解、浓盐水去哪）',
      '关键设备有冗余（N+1），并给出故障降级模式'
    ],
    review: '这一章最看"物质平衡"：箭头连不成闭环、或出现"魔法消失"的质量，就是没做过核算。',
    ask: ['1000 人每天需要多少氧？谁产的？', 'Sabatier 的氢从哪来？甲烷去哪了？', '水回收 90%，剩下 10% 从哪补？'],
    pitfalls: ['流程图没有数量', '氧气"90%+30%"直接相加', '废物处理后的产物没有用途']
  },
  {
    id: 'food', name: '农业与食物生产',
    keys: ['agricultur', 'food', 'crop', 'farm', '农业', '食物'],
    tags: ['foodwaste', 'power', 'layout'],
    minimum: [
      '计算热量与蛋白需求，给出<b>自给率</b>（并说明缺口怎么补）',
      '给出栽培面积、产量、照明电耗，并与电力预算对上',
      '布局图标注生产区、功能区、与生保/储存/加工的连接',
      '说明废物（残渣）如何回到基质/饲料，形成小闭环'
    ],
    review: '自给率不是形容词，是一个百分比 + 面积 + 电量三件套。',
    ask: ['每人多少 m² 栽培面？产多少 kcal？', '照明要多少 kW？从哪来？', '种不了的东西（如某些维生素）怎么补？'],
    pitfalls: ['只写"垂直农场"不给面积', '农业电耗没进电力预算', '残渣去向不明']
  },
  {
    id: 'human', name: '人居与社区',
    keys: ['residential', 'community', 'public space', 'human factor', 'psycholog', '居住', '人居'],
    tags: ['human', 'layout', 'gravity'],
    minimum: [
      '平面/布局图，标尺寸与功能，能看出私有—半私有—公共的层次',
      '说明如何促进社区感：具体空间 + 具体活动机制（不是"会很温馨"）',
      '回应特殊人群：家庭住户、访客（尤其零重力到达者）、夜班人员',
      '与重力等级、生保、交通接口一致'
    ],
    review: '人居看"可验证的设计证据"：面积、座位数、路径长度、照度，而不是形容词。',
    ask: ['1000 人吃饭，食堂要多少座位？翻台几次？', '访客刚到时在哪里做重力再适应？', '孩子在哪玩？安全怎么保证？'],
    pitfalls: ['平面图没有尺寸', '公共空间只有大厅没有小尺度空间', '忘记访客与家庭住户']
  },
  {
    id: 'contingency', name: '应急预案',
    keys: ['contingency', 'emergency', 'evacuat', 'hazard', '应急', '灾害'],
    tags: ['human', 'lss', 'infra'],
    minimum: [
      '<b>分级表</b>（L1–L4）：每级有触发条件、响应动作、恢复程序',
      '触发条件可量化（压力下降速率、温度、剂量、功率缺口）',
      '明确决策权限（谁能下令隔离/疏散/停堆）——在长时延下不能等地球',
      '与分舱隔离、生保冗余、90 天储备三者对应'
    ],
    review: 'RFP 让"自己识别主要风险"，所以风险清单本身就是评分内容：漏掉主要风险=没做。',
    ask: ['最大的三个风险是什么？为什么是这三个？', '失压后 30 秒内发生什么？谁下令？', 'L3 与 L4 的界线在哪？'],
    pitfalls: ['只有一张疏散图', '没有触发阈值', '响应动作没有责任人/时限']
  },
  {
    id: 'robot', name: '机器人 / 作业装备',
    keys: ['robot', 'underwater', 'vehicle', '机器', '机器人'],
    tags: ['infra', 'env'],
    minimum: [
      '三视图或总图 + 主要尺寸[m] + 功能标注',
      '载人能力（如 4 人）对应的舱容、生保、逃生方案',
      '耐压设计（外压）、推进、机械臂、照明、通信、电源',
      '与主基地的对接接口（密封、供电、数据）'
    ],
    review: '看"功能—子系统"的对应关系：说了四个功能，就要有四个对应的硬件。',
    ask: ['4 个人在里面待多久？氧气从哪来？', '下潜到 600 m 外压多大？壳体怎么设计？', '对接时怎么保证不漏水？'],
    pitfalls: ['只画外形不给尺寸', '没有对接接口细节', '忽略外压（按内压设计）']
  },
  {
    id: 'ai', name: 'AI 与通信',
    keys: ['artificial intelligence', 'ai ', 'communication', 'bandwidth', 'ai–human', '通信', '人工智能'],
    tags: ['infra', 'env'],
    minimum: [
      '按功能列出 AI 与人的分工：全自主 / 人监督 / 人在环',
      '架构图能看出数据流、决策流、断链后的降级模式',
      '说明时延与带宽约束如何影响自主等级',
      '安全关键决策明确"人"的位置'
    ],
    review: '架构图最怕"一堆服务器 + 一朵云"，要能读出"谁在什么时候做决定"。',
    ask: ['哪些任务 AI 可以完全自己做？失败了怎么办？', '通信断了 3 天，基地还能运行吗？', '谁有权停堆/隔离舱段？'],
    pitfalls: ['只写"AI 赋能"没有分工', '所有决策都写"由地球确认"', '没有断链预案']
  },
  {
    id: 'lab', name: '模块化实验室',
    keys: ['laborator', 'module', '实验室', '模块'],
    tags: ['infra', 'layout'],
    minimum: [
      '外部尺寸[m]、内部可用容积、对接接口三项齐全',
      '说明同一模块如何适配多种部署场地（水体/冰面/海床）',
      '标准化带来的经济性（减少种类、备件、培训）'
    ],
    review: '这题考"标准化"，不是考实验室里放什么仪器。',
    ask: ['一个模块多重？怎么运到海床？', '三种场地的接口有何不同？', '10 个实验室要几种模块？'],
    pitfalls: ['把实验室画成房间', '没有对接口', '忽略运输与部署']
  },
  {
    id: 'schedule', name: '进度计划',
    keys: ['schedule', 'gantt', 'milestone', '进度', '甘特'],
    tags: ['business', 'build'],
    minimum: [
      '<b>甘特图按月</b>，覆盖授予到全面运营',
      '标出里程碑与依赖关系，能看出关键路径',
      '与建造次序的步骤一一对应',
      '给出并行的理由（哪些任务重叠、风险如何控制）'
    ],
    review: '时间轴要和 RFP 的年份对得上（如 2125.6 授予、2130 前运营 = 约 54 个月）。',
    ask: ['总共几个月？关键路径是哪几条？', '哪两件事在并行？返工风险怎么控？', '如果运输推迟 6 个月，怎么补？'],
    pitfalls: ['甘特图没有月份刻度', '只有任务条没有里程碑', '与建造步骤数量不一致']
  },
  {
    id: 'cost', name: '成本与人力',
    keys: ['cost', 'budget', 'billion', 'human resources', '成本', '预算'],
    tags: ['business'],
    minimum: [
      '分阶段（设计/建造/运营）列<b>年度计费</b>，单位与 RFP 一致（如十亿元/年）',
      '给出项目<b>总成本</b>，且年度之和与总额一致',
      '列出各阶段人力投入',
      '主要成本项有依据（结构/运输/设备/人力/不可预见费）'
    ],
    review: '成本表最容易露馅的地方是"合计对不上"和"没有单位"。',
    ask: ['总成本多少？最大三项是什么？', '年度加起来等于总额吗？', '如果预算砍 30%，先砍哪？'],
    pitfalls: ['单位混用（亿元/十亿元）', '年度之和 ≠ 总额', '人力数与甘特图阶段不符']
  },
  {
    id: 'submission', name: '提交规范',
    keys: ['submission', 'slide', 'filename', 'ratio', '提交', '文件'],
    tags: ['review', 'gfssm'],
    minimum: [
      'PDF 版幻灯片；比例 <b>16:9</b>',
      '文件名：Proposal_[Team Name]_12-member Team.pdf',
      '页数建议 ≤30 页（原文是 recommended，但超页影响阅读）',
      '所有示意图标<b>公制尺寸 [m]</b>；遵守 Honor Code 与 AI 使用声明'
    ],
    review: '这些是不看设计水平就看格式的"送分/送命"项。',
    ask: ['文件名对了吗？', '导出 PDF 后比例还是 16:9 吗？', '每张图都有 [m] 吗？'],
    pitfalls: ['文件名写错（明确要扣分）', 'PPT 里 16:9，导出后变形', '手绘图没有尺寸']
  },
  {
    id: 'evaluation', name: '评审准则',
    keys: ['criteria of evaluation', 'evaluation', '评审', '评价'],
    tags: ['review', 'gfssm'],
    minimum: [
      '逐条对照四准则：Thoroughness / Rationality / Systematic / Economy',
      '每条准则至少有一个"可指出的证据"（图、表、计算）',
      '一致性：同一数字在全文各处相同'
    ],
    review: 'Rationality 权重最高：任何数字都要有依据或假设说明。',
    ask: ['哪一页证明"完整"？哪一页证明"合理"？', '跨章节的数字对得上吗？', '做过哪些权衡？'],
    pitfalls: ['把准则当口号写在目录页', '有创新但无法解释原理', '同一参数在不同章节不同值']
  }
];

/* ---------- 四、呈现形式自查 ---------- */
const SELF_CHECK = [
  '文件名是 Proposal_[队名]_12-member Team.pdf',
  '导出为 PDF 后仍然是 16:9，文字没有错位',
  '总页数 ≤ 30 页（超出会影响阅读）',
  '每张图都有尺寸标注，单位统一为 [m]',
  '每张图都有图例（旋转/静止、增压/不增压、危险区）',
  '居住环图上标了重力方向、半径 R、转速 n',
  '所有流程图都有物质名称、流向和数量',
  '人口数字（常驻/访客/峰值）在全文一致',
  '重力等级（如 0.8 g）在结构、人居、农业章节一致',
  '总功耗、发电、储能三个数单位正确（kW / kW / kWh）',
  '储能 = 最低功率 × 最少天数 × 24 小时，算得对',
  '水与氧的回收率与流程图上的数字一致',
  '建造步骤数 = 甘特图任务组数 = 成本表阶段数',
  '成本表年度之和 = 项目总成本',
  '甘特图按月，覆盖 RFP 规定的授予到运营区间',
  '每条 RFP 的 Deliverable 都有一页对应内容',
  '应急预案分 L1–L4，每级有触发条件、响应、恢复',
  '没有出现"排放至海洋/舱外"的违规箭头',
  '引用的数据/假设都有来源或标注',
  '遵守 Honor Code：AI 只用于概念与提纲，正文与图纸由学生完成'
];


/* ---------- 五、示例 RFP（2027 Galileo，仅供课堂演示） ---------- */
const SAMPLE_RFP = {
  name: '2027 Galileo（木卫二）· 示例',
  text: `Welcome to the Year 2125
January 1st, 2125
Dear Aerospace Enterprises,
Welcome to this year's bidding meeting for the Galileo Space Settlement. The International Deep Space Development Organization (IDSDO) is delighted to invite you to join our centennial program.
Founded in 2025, the IDSDO has spent a hundred years advancing the exploration, development, and utilization of deep-space resources. Space settlements now rise in cis-lunar space and around Mars, floating cities drift through the atmosphere of Venus, and mining bases span the Moon, Mars, and the asteroid belt. Having largely mastered the inner solar system, we now turn our gaze outward — to Europa, Jupiter's second Galilean moon. There, beneath the ice shell, we will build Galileo, the first space settlement beyond the asteroid belt, centered on the space fuel industry.
The timing could not be more urgent. Since Demeter — the first asteroid-belt space city — came online in 2105, space mining has flourished. The asteroid belt has become one of the busiest regions in the solar system, with thousands of spacecraft ferrying supplies and products between inner-solar-system cities every day. Yet despite a century of advances in propulsion, chemical propulsion remains the standard, and its fuel — liquid oxygen (LOX) and liquid hydrogen (LH2), the "oil" of the space age — has soared in price as deep-space operations expand. The need for a new space energy base has never been clearer.
IDSDO answered that call. After a series of unmanned probes around Jupiter and its moons, Europa emerged as the ideal site for the next space fuel hub. Beneath its thick ice shell lies a vast ocean, and near the equator we have identified a construction site where the ice is just 600 meters thick. Located within a region of reduced magnetospheric radiation, the site is protected by a natural ice shield against the residual ionizing radiation and extreme cold. A thermal-drilling probe has already reached the ocean, discovering multiple hydrothermal vents directly beneath the drill hole. In 2120, a manned probe named Nautilus even reached the seabed of Europa and detected traces of primitive life. This makes the ice-covered moon an ideal laboratory for life and planetary science.
In 2123, ahead of this decision, IDSDO and the global aerospace community adopted the Europa Protection Convention (EPC), committing to zero discharge into the ocean, protection of the marine ecosystem, strict control of contamination and biological material, and full compliance with planetary-protection protocols.
Now, in 2125, we are moving forward. IDSDO has resolved to build humanity’s first space city on Europa. The settlement will produce LOX and LH2 from ocean water and grow fresh vegetables and crops for spacecraft and future infrastructure beyond the asteroid belt. It will offer refueling, resupply, maintenance, and rescue services to passenger and cargo spacecraft, along with recreational and medical care for travelers after their long journeys.
The announcement has already stirred great excitement across the scientific community. Distinguished planetary scientists, geologists, and life scientists have approached the IDSDO, eager to relocate their laboratories to the new settlement once it is complete.
We have named this settlement "Galileo" after the great Italian astronomer, physicist, and engineer — a, if not the, central figure of the seventeenth-century Scientific Revolution. With his telescope, Galileo discovered Jupiter's four largest moons, turning humanity's exploration of the universe from imagination into observation. It is fitting that his name now marks our next step into the outer solar system.
The Request for Proposal (RFP), containing the detailed requirements, will be officially released shortly. We warmly invite your company to join this noble endeavor by designing and submitting a proposal that fulfills all specifications. We wish you the best of luck in the exciting challenges ahead.

Dr. Richard Doe  Richard Doe
Chair of International Deep Space Development Organization

Request for Proposal
1 January 2125
“Galileo” Space Settlement
The purpose of this Request for Proposal (RFP) is to invite entities with expertise in various aspects of deep space development to submit proposals to the IDSDO (International Deep Space Development Organization). The contenders will bid on the project of development of “Galileo”, humanity's first space settlement on Europa (the second satellite of Jupiter). The project will be awarded in June 2125. Once awarded, the contractor shall kick off the design and construction work to complete Galileo and ensure its full operation before 2130.
Statement of Work
Executive Summary
Galileo must provide a safe, pleasant and compliant living and working environment for 1,000 full-time residents (up to 15% of whom may be long-term settlers accompanied by families) and a transient population of up to 250 (peak 1,250). The contractor shall describe the design, construction, operation (maintenance) and industrial development plan for the Galileo space settlement.
Structure and Construction
Galileo will be composed of 3 separate parts:  (a) the main body, built both within the 600 m ice shell (the non-rotating service and industrial spine, excavated directly into the ice) and beneath it in the ocean (the rotating habitation ring, suspended in the water column directly under the ice shell); (b) a surface space port on the ice next to two reinforced access shafts (each 30 m diameter); and (c) a fleet of relocatable modular field laboratories, designed to be deployed - according to the active research program - either into the ocean water column, on the ice-cap surface, or on the seafloor near the hydrothermal vent.
2.1 Overall Design
The contractor shall show the overview and design of Galileo by drawings that identify the attributes and uses of every major enclosed volume, both in the in-ice spine and in the in-ocean ring. For each volume, label: (i) its function (residential and commercial area, control module, industrial area, scientific area, agricultural area, airlocks, entrances/exits, etc.); (ii) its dimensions in [m]; (iii) whether it ROTATES or is STATIC; (iv) whether it is PRESSURIZED (habitable, ~1atm) or UNPRESSURIZED (dry void, flooded, or ambient-pressure). Drawings should show the sizes of each volume, specify how the volumes connect to one another, and show how the in-ice spine, the in-ocean rotating ring and the surface port are linked through the two access shafts. The non-rotating spine is excavated within the 600 m ice shell; the rotating 0.8 g ring is suspended in the ocean directly beneath the ice shell.
Deliverable: a set of labeled drawings of the overall design, identifying the function, dimensions [m], rotation and pressurization status, and connectivity of every major enclosed volume. Indicate the direction of artificial gravity in the habitat ring and major parameters such as radius and rotation rate.
2.2  Surface Space Port Layout
The surface space port sits on the ice next to the two access shafts. The contractor shall show a layout of the launching site and the warehouses. The launching site shall accommodate 15 vehicles simultaneously. The launching pads must include facilities to provide refueling and maintenance services to visiting vehicles. Dimensions must be clearly labeled in [m].
Deliverable: a layout drawing of the launching site and warehouses, with all dimensions labeled in [m].
2.3 Construction Sequence
Well-designed assembly method and building process will greatly improve the efficiency of construction, lower the cost, and enhance the early-stage operation capability. Galileo’s construction should begin with robotic, unmanned deployment and the immediate commencement of in-ice survey and excavation, and end with the arrival of the first crew, the full functional operation of the entire base, and its overall handover to IDSDO for subsequent operation. The sequence, content, and rationale of the intermediate steps shall be planned and justified by the contractor, and the proposal must explain how each step brings a part of Galileo into operation ahead of schedule.
Deliverable: a construction sequence diagram with at least 6 steps, together with the budget and operational rationale.
Operation and Maintenance
Galileo must provide a safe, pleasant and compliant living, working, and entertainment environment for 1,000 residents and up to 250 visitors. Specify the design of facilities and subsystems for operation and maintenance under closed-loop constraints.
3.1 Electrical Power Generation
Galileo requires sufficient electricity supply for its basic operations, life support systems, industrial and agricultural production. At the same time, it must be able to reserve energy to sustain its operation at minimum power for at least 90 days in case of emergency. Primary power comes from compact fusion reactor modules installed in a shielded subsurface bay.
Deliverable: a quantitative power budget with rationale, covering total power consumption (kW), power generation (kW), and energy storage (kWh) for the 90-day minimum-power scenario.
3.2 Life Support System
Galileo design must show elements of life support infrastructures and subsystems. Use flow charts to specify the atmosphere, water and waste subsystems. Under the Europa Protection Convention, NO waste (gray, black or solid) may be discharged into the ocean; all residues are processed on-board.
Deliverable: flow charts of the atmosphere, water, and waste subsystems.
● Atmosphere: >=90% oxygen regeneration via the mechanical loop, augmented by an algal/photosynthetic bioreactor that supplies at least 30% of total oxygen demand  as a supplementary margin. Combined capacity exceeds 100%; values are not additive to avoid double-counting.
● Water: >=90% recovery from humidity, gray water and urine.
● Waste: zero ocean discharge. Solid and liquid waste are processed on-board into agricultural substrate, construction feedstock, or stored mass for return on resupply flights.
3.3 Agriculture and Food Production
Galileo must be largely self-sufficient in food, as fresh supplies cannot be reliably shipped from other space cities. The contractor shall design the layout of an on-site agricultural factory that integrates, but is not limited to, vertical (stacked) cultivation, microalgae (e.g., Chlorella) farming, and synthetic food production. The layout shall show the production areas, their functional relationships, and their connection to the life-support loop and to food storage and processing.
Deliverable: a layout diagram of the agricultural factory.
Human Factors
The population of Galileo will mainly consist of staff, researchers, and visiting spacecraft crew members, up to 15% of whom may be long-term settlers accompanied by their families. The community design must take into full account the psychological and physical needs of residents and visitors to provide a safe and comfortable living environment for them. A good work-life balance will be critical for these residents and visitors to thrive, especially for those who have been travelling in zero-G environment prior to arriving at the site. This requires special design considerations for both physical and mental well-being.
4.1 Residential and Community Design
The residents and visitors should be able to live together in the community. Please show map(s) or layout(s) of the residential area and public spaces with dimensions and features clearly labeled. Please describe how the design will promote a sense of community and human connections.
Deliverable: map(s)/layout(s) of the residential area and public spaces, with dimensions and features clearly labeled.
4.2 Psychological Well-being Facility
Galileo’s residential areas lie up to 600 m beneath the ice with no natural light, and residents undertake long-duration missions. The design shall propose a facility or device to mitigate residents’ psychological anxiety and isolation.
Deliverable: concept design of this psychological relief facility/device with dimensional and functional labeling.
4.3 Contingency Plan
Galileo lies up to 600 m beneath the ice, adjacent to Jupiter's intense radiation belts, has long self-sufficiency cycles, and is subject to the hard constraints of the Europa Protection Convention. Contenders shall identify the major risks themselves and design a tiered contingency plan table (L1–L4 is suggested), specifying for each tier the trigger criteria,  response actions, and recovery procedures.
Deliverable: a tiered contingency plan table.
Infrastructure Design
Galileo is expected to be a large-scale and expandable industrial and research center. Please describe in this section the facilities and infrastructures of it.
5.1 Multipurpose Underwater Robot
Design a multipurpose underwater robot capable of accommodating up to 4 crew members and performing tasks such as exploration, environmental monitoring, fault diagnosis and troubleshooting, and other operations. The robot must be able to dock with the main base.
Deliverable: a design drawing of the robot with dimensions and function annotations.
5.2 Artificial Intelligence and Communication Facilities
List the base's primary functions of Galileo (life-support operation, fuel plant operations, traffic scheduling, scientific experiment support, inspection and maintenance, emergency response, etc.), and explain how AI and humans collaborate in each: which tasks are executed by AI in a fully closed loop, which are supervised by on-site personnel, which critical decisions require human-in-the-loop.
Deliverable: an AI–human collaboration system architecture diagram.
5.3 Modular Field Laboratories
It is estimated that 10 world-class science labs will be set up in Galileo. The contractor shall design a standardized modular field laboratory that is rugged enough to be reconfigured and deployed to all three mission sites: (i) in the ocean water column, (ii) on the ice-cap surface, and (iii) on the seafloor near the hydrothermal vents. Draw the module with its external dimensions [m], internal laboratory volume and dock interface.
Deliverable: a drawing of the standardized modular field laboratory showing its external dimensions [m], internal laboratory volume, and dock interface.
Schedule and Cost
6.1 Schedule
The project will be awarded in June 2125. Once awarded, the contractor shall kick off the design and construction work to ensure the full operation of Galileo before 2130. Please design detailed project plan, including major stages and milestones of the project from the time of contract award (June 2125) until the full operation and occupation of Galileo by using a Gantt chart (in months).
Deliverable: a Gantt chart (in months) covering the major stages and milestones of the project.
6.2 Cost
Please propose the human resources and the cost billed to IDSDO per year (in billion yuan/RMB) in each stage of the project (from design, construction to operation) as well as the total cost of the project (in billion yuan/RMB).
Deliverable: a cost table showing the annual cost billed to IDSDO per stage, and the total project cost, in billion yuan/RMB.

Requirements for Submission
The submission should be a PDF version of the presentation slideshow. Please use appropriate software to create the slides.
Please use the following filename convention: “Proposal_[Team Name]_12-member Team.pdf”, e.g. Proposal_Skywork Parabolas_12-member Team.pdf. A penalty of point deduction will be applied to submissions that violate the naming convention.
The aspect ratio of the submission must be set to 16:9.
It is recommended that the submission does not exceed 30 pages of slides
The diagrams and drawings in the slides can be created using any CAD modeling software or as hand-drawn illustrations. However, regardless of the method used, it is imperative to provide dimensions for the schematic designs in metric units, e.g., [m].
AI may assist in certain aspects such as drafting concepts and outlines, but students must complete research, writing, and structure. Compliance with Honor Code is required. Moreover, although AI can be used, it is not recommended to directly generate graphs with it, as they often lack scientific and rational elements and may not meet the RFP requirements.

Criteria of Evaluation
The entry will be evaluated by a panel of juries from aerospace industry and related scientific research areas. The evaluation process will encompass a comprehensive assessment of the following factors:
(1) Thoroughness
The proposal requirements, including implied requirements, are fully outlined in the "Statement of Work" section attached to this document. Qualified proposals must satisfactorily address all specified requirements.
(2) Rationality
A strong emphasis will be placed on designs with a sound scientific foundation and a reasonable application of engineering technology. Innovation and original thinking will be highly encouraged. Contestants can present reasonable predictions for future technological advancements, as long as they align with the principles of science and engineering. The rationality of the proposed scheme will be the most crucial factor in the evaluation.
(3) Systematic
Considering the magnitude of the project, it is essential that the chosen contractor showcases a strong capacity for systematic problem-solving. Your proposal should present substantial evidence of these capabilities. One of the key evaluation criteria will be the consistency demonstrated throughout various sections of the proposal, including descriptions, dimensions, units, and both quantitative and qualitative analyses.
(4) Economy
Given the limited availability of equipment, materials, and space in outer space, the efficiency of the design will be of utmost importance. The committee places significant value on trade-off analyses that aim to identify the most balanced solutions when multiple options are presented. It is crucial to demonstrate a thorough understanding of resource constraints and the ability to optimize design choices accordingly.`
};
