/* ==========================================================
   GFSSM AI Coach · 学习内容 A：入门 / 项目认知 / 太空环境 / 人工重力
   ========================================================== */
const MODULES = [];

MODULES.push({
  id: 'start', no: '00', kicker: 'START', title: '先读这里：怎么用这套教练',
  minutes: 3,
  sub: '三分钟搞清楚：学什么、怎么练、它不会替你做什么。',
  oneLine: '这套工具只做三件事：把知识讲明白、把 RFP 拆清楚、把问题问到位；方案必须你自己写。',
  sections: [
    { h: '', html: `
      <p class="lead">拿到 RFP 之后最常见的情况不是"不会做"，而是<b>不知道该先学什么</b>：RFP 里全是 must、at least、Deliverable，但背后的物理、工程和评审逻辑没人讲。这套教练就是补这一段。</p>
      <div class="grid-3">
        <div class="obj"><span class="k">板块一 · 学知识</span><div class="v">12 个模块，从项目认知到评审视角。每个 5–8 分钟，配有图和公式。</div></div>
        <div class="obj"><span class="k">板块二 · 做自测</span><div class="v">24 道题，含计算与多选。每题都有解析，错了会告诉你回哪一节看。</div></div>
        <div class="obj"><span class="k">板块三 · 分析 RFP</span><div class="v">上传本年度 RFP，自动拆出交付物、硬指标、关联知识、达标线和追问清单。</div></div>
      </div>
      <h3 class="sec">建议路线</h3>
      <div class="table-wrap"><table>
        <tr><th style="width:88px">阶段</th><th>做什么</th><th style="width:120px">大概用时</th></tr>
        <tr><td><b>第 1 遍</b></td><td>模块 01–03（项目认知、太空环境、人工重力）→ 做对应自测</td><td>60–90 分钟</td></tr>
        <tr><td><b>第 2 遍</b></td><td>模块 04–07（尺度分区、建造次序、空气与水、废物与食物）→ 自测</td><td>90 分钟</td></tr>
        <tr><td><b>第 3 遍</b></td><td>模块 08–11（人居、基础设施、进度成本、呈现与评审）→ 自测</td><td>60 分钟</td></tr>
        <tr><td><b>上手</b></td><td>上传 RFP，拿到"你们这届要交付什么"的清单，再开始组内分工</td><td>30 分钟</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="start-route"></div>
      <p class="pele-cap">图 0-1　三遍学习路线：先建立量级感，再补系统，最后对齐评审；每遍配一次自测。</p>
      <div class="callout c-warn"><span class="ct">边界（很重要）</span>
        这套工具<b>不产出</b>方案、参数、图纸、PPT 文字。它只解释原理、指出 RFP 要求了什么、告诉你评委会从哪里挑问题。所有取舍必须由你们自己做，并且能说出理由——RFP 的评审准则里 "Rationality" 权重最高，评委一问"为什么是这个数"，背不出来的方案就废了。</div>
      <div class="callout c-ok"><span class="ct">一个有效习惯</span>
        从今天开始建一张"共享参数表"：人口、重力等级、环半径、转速、总功率、储能量、水回收率、建造月数、总成本。所有章节的数字都从这张表里取。RFP 明确把"跨章节一致性"写进了 Systematic 评分项，这一条是最容易拿也最容易丢的分。</div>
    ` }
  ],
  review: [],
  check: ['你打算用几天过完这些模块？', '你们的共享参数表建了吗？', '组里谁负责保证各章节数字一致？']
});

MODULES.push({
  id: 'gfssm', no: '01', kicker: 'PROJECT', title: '认识 GFSSM：你在投一个什么标',
  minutes: 8,
  sub: '这不是"画一个太空城"，而是按 RFP 逐条回应、并被四个准则打分的一份投标文件。',
  oneLine: 'GFSSM = 以"航天企业"身份回应 IDSDO 的招标书；评分看四件事：完整、合理、系统、经济。',
  sections: [
    { h: '1.1 场景设定：一份虚构但认真的招标', html: `
      <p>每年组委会会构造一个未来情境（年份通常设定在 2050 年之后，多为本世纪中后期，例如 2100 年前后），由虚构的 <b>IDSDO</b>（International Deep Space Development Organization）发布 <b>RFP</b>（Request for Proposal，需求建议书 / 招标书），邀请"企业"竞标一个太空定居点项目。你们就是那家企业。</p>
      <p>历年主题大致是：月球基地 → 火星基地 → 小行星 → 太空电梯 → 水星 / 金星 → 火星轨道太空城（Vulcan, 2025）→ 小行星带（Psyche, 2026）→ <b>木卫二 Galileo（2027）</b>。主题每年换，但 <b>RFP 的结构几乎不变</b>——这就是为什么"学会读一份 RFP"比"背某一年的答案"有用得多。</p>
      <div class="callout c-key"><span class="ct">一个关键认识</span>
      RFP 里写的是<b>甲方要什么</b>，不是<b>你要怎么做</b>。它给数字（人数、重力要求、运行时限、建造深度）、给交付物（图、表、流程图）、给准则（四个评价维度），但把"怎么实现"留给你。所以读 RFP 的第一层功夫是：<b>把"要求"和"做法"分开</b>。</div>
    ` },
    { h: '1.2 一份提案的标准骨架', html: `
      <p>以历年资格轮 RFP 为例，Statement of Work（工作说明）的章节结构就是你们 PPT 的目录：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:34%">RFP 章节</th><th>它其实在问什么</th><th style="width:22%">对应本工具模块</th></tr>
        <tr><td>Executive Summary</td><td>服务多少人、建成什么样、怎么运营——一段话说清全局</td><td>01 / 04</td></tr>
        <tr><td>Structure and Construction<br><span class="small">2.1 总体 / 2.2 表面港 / 2.3 建造顺序</span></td><td>空间怎么组织、每个体量干什么用、多大、转不转、增不增压、怎么一步步建起来</td><td>03 / 04 / 05</td></tr>
        <tr><td>Operation and Maintenance<br><span class="small">3.1 电力 / 3.2 生保 / 3.3 农业</span></td><td>电从哪来、断供 90 天怎么办；空气水废物怎么循环；饭从哪来</td><td>06 / 07 / 10</td></tr>
        <tr><td>Human Factors<br><span class="small">4.1 居住 / 4.2 心理 / 4.3 应急</span></td><td>人长期住在冰下、低重力、封闭环境里会不会疯、会不会病、出事怎么办</td><td>08</td></tr>
        <tr><td>Infrastructure Design<br><span class="small">5.1 机器人 / 5.2 AI 与通信 / 5.3 模块化实验室</span></td><td>人、货、信息怎么流动；哪些事交给机器</td><td>09</td></tr>
        <tr><td>Schedule and Cost<br><span class="small">6.1 甘特图 / 6.2 成本表</span></td><td>几年建成、每年花多少、总共多少</td><td>11</td></tr>
        <tr><td>Requirements for Submission</td><td>文件格式、页数、比例、命名——<b>这些是硬性扣分项</b></td><td>12</td></tr>
        <tr><td>Criteria of Evaluation</td><td>评委怎么打分：完整 / 合理 / 系统 / 经济</td><td>12</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="proposal-skeleton"></div>
      <p class="pele-cap">图 1-1　提案骨架：RFP 章节直接变成 PPT 目录，也是组内分工表。</p>
      <div class="callout c-warn"><span class="ct">个人能力测评组请注意</span>
      资格轮的个人测评（约 90 分钟、约 20 题、全选择题）<b>不需要你做完整设计</b>，但要求你对结构、运营、人居、基础设施、商业五个方向都有基础了解：通用能力约占 60%，五个方向合计约占 40%。本工具的知识模块就是按这个能力框架排的——<b>模块 03/04/05 = 结构</b>，<b>06/07/10 = 运营与商业</b>，<b>08 = 人居</b>，<b>09 = 基础设施</b>。</div>
    ` },
    { h: '1.3 RFP 里的三层信息', html: `
      <p>把 RFP 拆成三层，你的阅读效率会立刻不一样：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:15%">层级</th><th style="width:26%">语言标志</th><th>典型年份的例子</th><th style="width:20%">漏了会怎样</th></tr>
        <tr><td><span class="badge b-red">硬指标</span></td><td>must / shall / at least / no less than / ≥ / zero / before</td><td>"≥90% oxygen regeneration"、"at least 90 days"、"zero ocean discharge"、"before 2130"、"15 vehicles simultaneously"</td><td>直接判为不满足要求（Thoroughness 掉分）</td></tr>
        <tr><td><span class="badge b-blue">交付物</span></td><td>Deliverable: / shall show / shall describe / provide</td><td>"a set of labeled drawings"、"flow charts of the atmosphere, water, and waste subsystems"、"a Gantt chart (in months)"</td><td>图没画 = 这条要求没有证据</td></tr>
        <tr><td><span class="badge b-amber">隐含要求</span></td><td>形容词与目标句：safe, pleasant, compliant, largely self-sufficient, sense of community</td><td>"safe, pleasant and compliant living environment"、"largely self-sufficient in food"、"promote a sense of community"</td><td>不扣"硬分"，但 Rationality / Systematic 上不去</td></tr>
      </table></div>
      <p class="small">注意"隐含要求"最容易被忽略：RFP 说 "safe, pleasant"，你就要用<b>可验证的设计</b>去回应它（分区隔离、疏散时间、噪声分区、照度、隐私梯度），而不是在 PPT 上写一句"我们的城市很安全"。</p>
    ` },
    { h: '1.4 读 RFP 的四步法', html: `
      <ol>
        <li><b>圈数字</b>：把所有带单位的数字圈出来——人数、尺寸、重力、功率、天数、百分比、年份。这些是后面所有计算的输入，最后要回到这里逐条对账。</li>
        <li><b>列交付物</b>：每一句 "Deliverable:" 抄成一行，变成你们的出图清单。RFP 有几条，你们就该有几张图/表。</li>
        <li><b>找隐含</b>：把形容词和目标句画出来，问"用什么设计证据证明它"。</li>
        <li><b>建参数表</b>：把输入数字 + 你们决定的设计参数放同一张表，全组共用。</li>
      </ol>
      <div class="callout c-key"><span class="ct">顺手就能做的事</span>
      把 RFP 全文粘到"分析 RFP"板块，它会自动把这三层拆出来，并标出每条要求关联到哪个知识模块。但你仍然要自己读一遍——工具会漏，评委不会。</div>
    ` },
    { h: '1.5 术语速查（读英文 RFP 用）', html: `
      <div class="gloss">
        <div><b>RFP</b><span>需求建议书 / 招标书</span></div>
        <div><b>Statement of Work</b><span>工作说明（正文要求部分）</span></div>
        <div><b>Deliverable</b><span>交付物（必须交的图/表/文件）</span></div>
        <div><b>settlement</b><span>定居点 / 太空城</span></div>
        <div><b>artificial gravity</b><span>人工重力</span></div>
        <div><b>pressurized / unpressurized</b><span>增压（可居住）/ 非增压</span></div>
        <div><b>rotating / static</b><span>旋转 / 静止</span></div>
        <div><b>life support system (LSS)</b><span>生命保障系统</span></div>
        <div><b>closed loop</b><span>闭环（物质循环再生）</span></div>
        <div><b>recovery rate</b><span>回收率</span></div>
        <div><b>Sabatier reaction</b><span>萨巴蒂尔反应（CO₂ + H₂ → CH₄ + H₂O）</span></div>
        <div><b>electrolysis</b><span>电解</span></div>
        <div><b>gray / black water</b><span>灰水（洗涤）/ 黑水（污水）</span></div>
        <div><b>bioreactor</b><span>生物反应器</span></div>
        <div><b>vertical cultivation</b><span>垂直（立体）栽培</span></div>
        <div><b>radiation shielding</b><span>辐射屏蔽</span></div>
        <div><b>micrometeoroid / debris</b><span>微陨石 / 空间碎片</span></div>
        <div><b>airlock</b><span>气闸舱</span></div>
        <div><b>contingency plan</b><span>应急预案</span></div>
        <div><b>Gantt chart</b><span>甘特图</span></div>
        <div><b>milestone</b><span>里程碑</span></div>
        <div><b>trade-off analysis</b><span>权衡分析</span></div>
        <div><b>human-in-the-loop</b><span>人在回路（关键决策由人确认）</span></div>
        <div><b>throughput / bandwidth</b><span>吞吐量 / 带宽</span></div>
      </div>
    ` }
  ],
  review: [
    '评委第一眼找的是"你有没有逐条回应 RFP"——他们手上就是那张要求清单。',
    '四准则里 Rationality（合理性）权重最高：每个数字要能解释来源与假设。',
    'Systematic 看跨章节一致性：同一人口数字在总体图、面积表、电力预算、成本表里必须对得上。',
    'Economy 看你有没有做权衡（trade-off），而不是把所有好东西堆在一起。'
  ],
  check: ['这届 RFP 一共有几条 Deliverable？你数过吗？', '哪些数字是 RFP 给的，哪些是你们自己定的？', '你们的提案目录和 RFP 章节对得上吗？']
});

MODULES.push({
  id: 'env', no: '02', kicker: 'ENVIRONMENT', title: '太空环境：先搞清楚"你在哪儿建"',
  minutes: 9,
  sub: '重力、压力、辐射、温度、物质、时间——六个维度决定后面所有设计。',
  oneLine: '环境不是背景介绍，它是所有设计参数的来源：重力定结构，压力定壳体，辐射定屏蔽，温度定热控，时延定自主性。',
  sections: [
    { h: '2.0 先把「环境档案」设好（最先做这一步）', html: `
      <p>这一节以及后面每一节里的<b>具体数字</b>，都不是写死在文章里的，而是从一份叫 <b>环境档案</b> 的配置里读出来的：你在哪儿建、天然重力多大、外面是真空还是高压水、辐射多少、离地球多远、太阳够不够亮。换一份 RFP，只要换掉这份档案，全站的讲解和题目会一起跟着变——你不需要重新学一遍原理。</p>
      <div class="callout c-key"><span class="ct">三个入口，任选一个</span>
      ① <b>每页顶部那条蓝色的提示条</b>，点右侧按钮；② <b>左侧最上方「当前环境」</b>；③ 在「分析 RFP」里上传本年 RFP，它会自动识别场地，并提示你一键应用。</div>
      <p style="margin-top:12px"><button class="btn btn-primary" data-nav="envset">打开环境档案 →</button></p>
      <p class="small" style="margin-top:12px">设定之后，本页出现的 {{gNat}} g、{{radDayShow}}、{{pOut}} MPa 这些数字才是"你们这届的场地"。如果还没设定，它们会显示为 <span class="env-todo">待填</span>，而不是随手编一个数——因为一个错的数字比一个空格更危险。</p>
      <div class="callout c-warn"><span class="ct">工具给的数只是量级</span>
      档案里的预设值是<b>教学用典型值</b>，用来先建立量级感。<b>凡 RFP 原文给了数字，一律以原文为准</b>；原文没给的，写成"假设 + 依据"，并且要能在答辩时把推导说出来。</div>
    ` },
    { h: '2.1 六个环境维度', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:14%">维度</th><th style="width:30%">要问的问题</th><th>它决定了什么设计</th></tr>
        <tr><td><b>重力</b></td><td>天然重力多大？需不需要人工重力？要几 g？</td><td>结构形式（是否旋转）、人的生理对抗措施、功能分区</td></tr>
        <tr><td><b>压力 / 大气</b></td><td>外部是真空、稀薄大气，还是高压海水？</td><td>壳体承压方向（内压 vs 外压）、气闸数量、泄漏与应急</td></tr>
        <tr><td><b>辐射</b></td><td>有没有磁场和大气屏蔽？剂量率多少？</td><td>屏蔽质量与材料、居住深度、舱外活动时长</td></tr>
        <tr><td><b>温度 / 热</b></td><td>外部温度？散热靠辐射、对流还是传导？</td><td>热控系统、保温、散热器面积、材料</td></tr>
        <tr><td><b>物质</b></td><td>微陨石、碎片、尘埃、腐蚀性介质？</td><td>外壳防护（Whipple 结构）、表面港作业方式</td></tr>
        <tr><td><b>时间</b></td><td>昼夜周期？通信时延？补给窗口？</td><td>储能规模、自主控制等级、心理设计（光照节律）</td></tr>
      </table></div>
    ` },
    { h: '2.2 轨道 vs 星球表面：最容易考的一组对比', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:22%">对比项</th><th>轨道太空城</th><th>星球表面基地</th></tr>
        <tr><td>重力来源</td><td>必须旋转产生；轴心 0 g，半径越大 g 越大</td><td>天体天然重力（月 0.17 g、火 0.38 g、木卫二 0.13 g、土卫六 0.14 g；以本轮环境档案为准）</td></tr>
        <tr><td>结构受力</td><td>舱内 1 atm、舱外真空 → <b>内压向外撑</b>，壳体受拉</td><td>同样内压向外，但外壳还要承受风沙、陨石、地形荷载</td></tr>
        <tr><td>热控</td><td>真空只能靠<b>辐射</b>散热，散热器面积是硬约束</td><td>有大气/土壤可传导对流（火星稀薄但仍有效），散热条件较好</td></tr>
        <tr><td>辐射</td><td>无大气屏蔽，靠材料质量；可用"水墙"、储物兼屏蔽</td><td>可用<b>覆土/岩石/冰</b>做屏蔽，代价是挖掘与结构荷载</td></tr>
        <tr><td>物资</td><td>全部从地球/月球运，闭环率决定成本</td><td>可用<b>就地资源</b>（火星大气制氧、水冰、月壤制砖/烧结）</td></tr>
        <tr><td>通信</td><td>近地几乎实时；深空有分钟级时延</td><td>同样受距离约束，且地形遮挡</td></tr>
        <tr><td>建造</td><td>模块化发射 + 在轨组装，无法用重型机械</td><td>可着陆重型设备、可开挖、可"土建"</td></tr>
      </table></div>
      <div class="callout c-key"><span class="ct">一句话</span>
      轨道城的核心矛盾是<b>"没有重力、没有地、没有空气、散热难"</b>；表面基地的核心矛盾是<b>"有重力但不够、有资源但要开采、有灰尘和温差"</b>。抓住这两句，选择题一大半能推出来。</div>
    ` },
    { h: '2.3 参数表：把"场地"翻译成"设计指标"', html: `
      <p>选好场地之后，第一件事不是画图，而是<b>把场地翻译成设计指标</b>。下表由你当前的<b>环境档案</b>自动生成——换一份 RFP、换一个天体，数字就跟着变，但"这一项决定什么"的逻辑永远成立。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:20%">参数</th><th class="num" style="width:20%">本场地</th><th>它直接决定什么</th></tr>
        <tr><td>天然重力</td><td class="num"><b>{{gNat}} g</b><br><span class="small">{{gNatMs}} m/s²</span></td>
          <td>与要求值（{{gTarget}} g）之差，才是你要"造"的重力。差值大 → 必须旋转；天然已达标 → 可以省掉整套旋转结构</td></tr>
        <tr><td>外部压力</td><td class="num"><b>{{pOut}} MPa</b><br><span class="small">{{pOutKind}}</span></td>
          <td>决定壳体<b>受拉还是受压</b>：外部真空 → 内压外撑、怕爆裂；外部高压 → 外压内挤、怕屈曲。两者结构逻辑不能互换</td></tr>
        <tr><td>辐射剂量<br><span class="small">（所在位置）</span></td><td class="num"><b>{{radDayShow}}</b><br><span class="small">≈ {{radYear}}/年</span></td>
          <td>屏蔽层厚度与材料、居住深度、舱外作业时长上限。剂量越高，"质量换安全"的代价越大，会直接推高发射质量</td></tr>
        <tr><td>温度</td><td class="num"><b>{{tMin}} ~ {{tMax}} ℃</b><br><span class="small">平均 {{tAvg}} ℃</span></td>
          <td>材料低温韧性 / 高温蠕变、保温功率、热控方案（辐射散热 or 对流散热）、散热器面积</td></tr>
        <tr><td>昼夜周期</td><td class="num"><b>{{dayLen}}</b></td>
          <td>夜间储能规模、光伏+电池 vs 核能的选择、照明节律与心理设计</td></tr>
        <tr><td>单程通信时延</td><td class="num"><b>{{commMin}}<span class="small">–{{commMax}}</span> 分钟</b></td>
          <td>自主等级、能否远程运维、断链预案、安全关键决策的权限归属（这是"治理结构"的物理来源）</td></tr>
        <tr><td>太阳辐照</td><td class="num"><b>{{sun}} W/m²</b></td>
          <td>光伏面积 = 负荷 ÷（效率 × 辐照）。辐照低到一定程度，"用光伏"就不再是经济选项</td></tr>
        <tr><td>建造位置 / 深度</td><td class="num"><b>{{depth}} m</b></td>
          <td>表面 / 地下 / 水下 / 轨道，四种位置的施工方式、物流通道、屏蔽条件完全不同</td></tr>
        <tr><td>可用屏蔽</td><td class="num">—</td><td>{{shield}}</td></tr>
        <tr><td>主要危害</td><td class="num">—</td><td>{{hazard}}</td></tr>
        <tr><td>就地资源</td><td class="num">—</td><td>{{resources}}</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="env-to-design"></div>
      <p class="pele-cap">图 2-1　环境维度 → 设计动作：储能与自治由昼夜、通信时延共同决定。</p>
      <div class="callout c-key"><span class="ct">这张表才是"环境章节"的正文</span>
      RFP 的场地描述通常只有几段话，但评委要看到的是<b>这十几行指标，以及每一行落到哪个设计动作</b>。抄一遍背景介绍拿不到分，把背景翻译成参数才拿得到分。</div>
      <div class="callout c-warn"><span class="ct">数字从哪来</span>
      本工具的这套数值是<b>教学用典型值</b>，用来让你建立量级感。<b>凡 RFP 原文给了的数，一律以原文为准</b>；原文没给的，写成"假设 + 依据"（如"屏蔽厚度按半值层估算""水压按 ρgh 估算"），并在答辩时能说出推导过程。</div>
      <p class="small" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-sm" data-nav="envset">切换场地 / 改参数</button>
        <span>预设覆盖月球 / 火星 / 木卫二 / 土卫六 / 小行星 / 近地轨道 / 地月空间 / 金星云层；也可以在「分析 RFP」里上传本年 RFP，让它自动识别。</span></p>
    ` },
    { h: '2.4 反直觉：最容易被扣分的三处', html: `
      {{#if icy}}
      <p><b>① 壳体可能是在"抗外压"，不是抗内压。</b>在 {{depth}} m 的水/冰下，外面是约 {{pOut}} MPa 的介质，里面是 1 atm。这与轨道城（里面 1 atm、外面真空）受力方向<b>完全相反</b>。外压主要怕<b>屈曲（buckling）</b>，内压主要怕<b>爆裂与疲劳裂纹</b>——所以"照抄轨道城结构"是不合理的。</p>
      <p><b>② 冰不是"墙"，是会流动的固体。</b>冰在长期应力下会蠕变，冰内挖出的空腔有<b>慢慢闭合</b>的趋势；再叠加潮汐形变，冰内结构需要衬砌、保温、甚至定期扩挖维护。把通道设计成<b>不增压的干井</b>，正是为了避开"既要承压又要防蠕变"的双重难题。</p>
      <p><b>③ 水不缺，但不一定能排。</b>在冰下海洋基地，"节水"往往不是主要动机——<b>零排放</b>才是。此时水循环的目的从"省资源"变成"合法运营"：任何灰水、黑水、固废都不能入介质，必须在舱内处理或封存返运。这一条会连带改变废物处理、农业基质、甚至成本结构。</p>
      <div class="callout c-warn"><span class="ct">常见错误</span>
      把"环保"当口号写进 PPT，却在流程图里画了一条"处理后排放"的箭头。如果 RFP 原文写的是 "NO waste may be discharged"，<b>一条箭头就废掉整章</b>。读 RFP 时把 "no / zero / shall not" 单独抄一份清单。</div>
      {{/if}}
      {{#unless icy}}
      <p><b>① "有重力"不等于"重力够"。</b>本场地天然重力 {{gNat}} g，而方案要求 {{gTarget}} g。差 {{gTarget}} 与 {{gNat}} 之间的那部分，必须自己造。反过来，如果天然重力已经超过要求（例如金星表面 0.9 g），旋转结构就是纯负担——<b>先做减法，再谈技术</b>。</p>
      <p><b>② "有大气"不等于"能呼吸"。</b>外部压力 {{pOut}} MPa 只说明有没有"气"，不说明成分对不对。低气压环境里，散热仍主要靠辐射、声音无法传播、水在接近体温时就沸腾（Armstrong 极限以上才不必加压服）。氧分压、总压、缓冲气体要分开算。</p>
      <p><b>③ "有资源"不等于"能用"。</b>就地资源（ISRU）必须过三关：<b>开采 → 提纯 → 成型</b>，每一关都要能量、设备和时间。方案里写"利用火星大气制氧"很容易，写清"每小时产多少氧、耗多少电、设备多重"才算做了设计。</p>
      <div class="callout c-warn"><span class="ct">常见错误</span>
      把"采用先进材料/智能系统"当成万能答案。评委要看的是<b>可验证的量</b>：多少米屏蔽、多少 kW 加热、多少小时续航。形容词不算设计。</div>
      {{/unless}}
    ` },
    { h: '2.5 通用动作：拿到任何 RFP，先填这张表', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:22%">项目</th><th style="width:38%">你要填的</th><th>找不到时怎么办</th></tr>
        <tr><td>地点 / 天体</td><td>表面？轨道？地下？水下？纬度/深度？</td><td>由 RFP 描述推断，并在方案中写明"依据第 X 节"</td></tr>
        <tr><td>天然重力</td><td>多少 g（查表或用 GM/r² 估）</td><td>轨道 = 微重力；表面查天体参数</td></tr>
        <tr><td>外部压力 / 大气</td><td>真空 / 多少 kPa / 多少 MPa 水压</td><td>大气压 ≈ 密度×g×高度；水压 ≈ ρgh</td></tr>
        <tr><td>辐射剂量</td><td>Sv/年 或 Sv/天</td><td>无数据就写"按深空 GCR + 局部粒子环境估算"，给区间</td></tr>
        <tr><td>温度范围</td><td>最高 / 最低 / 平均</td><td>查天体气候数据；轨道按日照/阴影两态</td></tr>
        <tr><td>昼夜 / 通信</td><td>周期多少小时；时延多少分钟</td><td>时延 = 距离 / 光速（单程）</td></tr>
        <tr><td>本地资源</td><td>水冰、金属、大气成分、日照</td><td>决定"就地资源利用（ISRU）"能不能写</td></tr>
      </table></div>
    ` }
  ],
  review: [
    '评委常问："你这个地点最要命的环境约束是什么？"——答不出，说明环境章节只是抄背景。',
    '所有量化参数（屏蔽厚度、散热面积、储能天数）都应该能回溯到这里的某个环境数字。',
    '对比题最爱考"轨道 vs 表面"的受力、散热、辐射三点差异。'
  ],
  check: ['这个地点的天然重力是多少？为什么还需要人工重力？', '外部压力和内部压力谁大？壳体受拉还是受压？', '从基地到地球，信号单程要多久？这改变了什么设计？']
});

MODULES.push({
  id: 'gravity', no: '03', kicker: 'GRAVITY', title: '人工重力：大小、方向、代价',
  minutes: 10,
  sub: '一条公式 a = ω²R 撑起整个旋转城市，但真正的难点是"方向"和"代价"。',
  oneLine: '人工重力靠旋转：g = ω²R；方向是"脚朝外、头朝轴"；半径越大越舒服，转速越高越难受（≲2 rpm）。',
  sections: [
    { h: '3.1 为什么需要人工重力', html: `
      <p>长期微重力不是"飘着很好玩"，而是一组会累积的生理损伤：<b>骨密度每月下降约 1%–1.5%</b>、肌肉萎缩、心血管去适应（血容量下降、立位耐力变差）、前庭与平衡紊乱、免疫与视力变化。对住 5 年、10 年的居民，这是不可接受的。</p>
      <p>所以旋转城市的设计目标不是"1 g 才叫合格"，而是<b>在生理需求、结构代价、舒适度之间取一个值</b>。本年的要求是 <b>{{gTarget}} g</b>。你要证明的是：这个值怎么实现、代价是什么、为什么不再高一点或低一点。</p>
      <div class="callout c-warn"><span class="ct">注意区分</span>
      本场地的天然重力只有 <b>{{gNat}} g</b>，而要求的 <b>{{gTarget}} g</b> 是<b>人工重力</b>——由旋转产生，不是天体给的。看到"{{gTarget}} g"就回头去查天体参数，是最常见的误读：天体给不了，只能自己造。</div>
    ` },
    { h: '3.2 公式与算例：半径与转速是绑死的', html: `
      <div class="formula"><span class="lbl">向心加速度 = 人工重力</span>
a = ω²R　→　ω = √(a / R)　→　n (rpm) = ω × 60 / (2π) ≈ 9.549 × ω

a：目标重力（{{gTarget}} g = {{gTargetMs}} m/s²）
R：居住地板到旋转轴的距离（m）
ω：角速度（rad/s）　n：转速（rpm）
      </div>
      <div class="table-wrap"><table>
        <tr><th class="num">目标重力</th><th class="num">半径 R</th><th class="num">ω (rad/s)</th><th class="num">转速 n (rpm)</th><th>评价</th></tr>
        {{@spin}}
      </table></div>
      <div class="callout c-key"><span class="ct">只需记住一个上限，其余都能推</span>
      <b>2 rpm 是舒适上限</b>（经验值，超过后多数人会出现头晕、转头时恶心、物体"拐弯下落"）。由此推出：<b>要 {{gTarget}} g，半径至少约 180 m 量级</b>（见上表最后一行，随目标重力变化）。反过来，<b>半径一定，转速就被公式算死了</b>——这就是为什么"我想转快点让重力大一点"在工程上不成立：转速一高，人先受不了。</div>
      <div class="callout c-warn"><span class="ct">换星球时这个表怎么变</span>
      公式不变，只有 <b>a</b> 跟着目标重力变。若某年 RFP 要求 0.4 g（火星本地重力水平），最小半径会降到约 {{gTarget}} g 版本的 40%——结构代价相差一个量级。<b>所以"要求几 g"是一个工程决策，不是抄来的常数。</b></div>
    ` },
    { h: '3.3 方向：脚朝外，头朝轴', html: `
      <p>人站在旋转环里，跟着环一起转，必须有向心加速度指向轴心；环的地板给人的支持力提供这个加速度，人感受到的是<b>惯性离心力</b>，方向<b>沿半径向外</b>。所以：</p>
      <ul>
        <li><b>脚踩外壁，头朝轴心</b>——"下"是外壁，"上"是轴心。</li>
        <li>不同高度 g 不同：头部半径更小 → g 更小；<b>身高 1.7 m 的人在 R=180 m 时，头部比脚部轻约 1.9%</b>，几乎无感；但 R=30 m 时差距会超过 6%，人会明显不适。</li>
        <li>扔出去的物体会"拐弯"（科里奥利），倒水会偏向一侧；转身时血液被扰动 → 这是低转速要求的来源。</li>
      </ul>
      <figure>
        <svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="旋转环人工重力方向示意图">
          <defs>
            <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#2F5BEA"></path>
            </marker>
            <marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#C78318"></path>
            </marker>
            <marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#0E9F9F"></path>
            </marker>
          </defs>

          <line x1="340" y1="18" x2="340" y2="168" stroke="#C9D1E4" stroke-width="1.2" stroke-dasharray="5 5"></line>
          <text x="348" y="32" font-size="11" fill="#6B7488">自转轴（0 g）</text>

          <path d="M340 40 A130 130 0 1 1 339.9 40 Z M340 78 A92 92 0 1 0 340.1 78 Z"
                fill="#E7EDFD" fill-rule="evenodd" stroke="#AFC2EF" stroke-width="1.2"></path>

          <circle cx="340" cy="170" r="46" fill="#FFF" stroke="#C9D1E4"></circle>
          <text x="340" y="165" font-size="11.5" fill="#111729" text-anchor="middle" font-weight="600">对接港</text>
          <text x="340" y="180" font-size="10.5" fill="#6B7488" text-anchor="middle">0 g / 微重力</text>

          <line x1="340" y1="170" x2="470" y2="170" stroke="#C78318" stroke-width="1.4" marker-end="url(#ar2)"></line>
          <text x="418" y="161" font-size="11.5" fill="#C78318" text-anchor="middle" font-weight="600">R = 250 m</text>
          <text x="418" y="189" font-size="10.5" fill="#8A6A2A" text-anchor="middle">地板半径</text>
          <text x="482" y="167" font-size="10.5" fill="#8A6A2A">地板处 0.8 g</text>

          <line x1="248" y1="78" x2="212" y2="42" stroke="#2F5BEA" stroke-width="2" marker-end="url(#ar)"></line>
          <line x1="432" y1="78" x2="468" y2="42" stroke="#2F5BEA" stroke-width="2" marker-end="url(#ar)"></line>

          <path d="M229 170 A111 111 0 0 1 340 59" fill="none" stroke="#0E9F9F" stroke-width="1.4" marker-end="url(#ar3)"></path>
          <text x="176" y="112" font-size="10.5" fill="#0E9F9F" text-anchor="middle">旋转方向</text>

          <!-- 人：脚踩外壁（下），头朝圆心（上） -->
          <g transform="translate(340,291)">
            <ellipse cx="0" cy="9" rx="9" ry="2.6" fill="#2F5BEA" opacity=".22"></ellipse>
            <circle cx="0" cy="-25" r="5.4" fill="#111729"></circle>
            <line x1="0" y1="-20" x2="0" y2="-3" stroke="#111729" stroke-width="2.4"></line>
            <line x1="0" y1="-3" x2="-5" y2="8" stroke="#111729" stroke-width="2.2"></line>
            <line x1="0" y1="-3" x2="5" y2="8" stroke="#111729" stroke-width="2.2"></line>
            <line x1="0" y1="-15" x2="-7" y2="-7" stroke="#111729" stroke-width="2"></line>
            <line x1="0" y1="-15" x2="7" y2="-7" stroke="#111729" stroke-width="2"></line>
          </g>

          <line x1="340" y1="302" x2="340" y2="342" stroke="#2F5BEA" stroke-width="2" marker-end="url(#ar)"></line>
          <text x="340" y="362" font-size="11.5" fill="#2F5BEA" text-anchor="middle" font-weight="600">离心力指向外 → 脚踩外壁（"下"= 外壁）</text>
          <text x="304" y="272" font-size="10.5" fill="#6B7488" text-anchor="end">头朝轴心</text>

          <text x="40" y="252" font-size="11" fill="#6B7488">内圈半径小</text>
          <text x="40" y="268" font-size="11" fill="#6B7488">→ g 更小</text>
        </svg>
        <figcaption>图 3-1　旋转环剖面：重力沿半径向外，轴心为 0 g；同一转速下半径越大 g 越大。</figcaption>
      </figure>
    ` },
    { h: '3.4 代价：半径、转速与结构质量', html: `
      <p>同一个 0.8 g，可以用"大半径慢转"或"小半径快转"实现，但代价完全不同：</p>
      <ul>
        <li><b>大半径</b>：舒适度好，但环体周长、壳体面积、屏蔽质量都按 R 线性增长，结构质量与建造成本大幅上升（受外压时还要额外抗屈曲）。</li>
        <li><b>高转速</b>：结构省，但科里奥利效应让人难受；而且旋转界面、密封和噪声也更难处理。</li>
      </ul>
      <p>这就是一个典型的 <b>trade-off</b>：RFP 只给"0.8 g"，没给半径和转速，是因为它想看你<b>怎么权衡并论证</b>。写方案时至少要做一张两方案对比表（半径/转速/结构质量/舒适度/成本）。</p>
      <div class="pele-fig" data-diagram="gravity-rpm"></div>
      <p class="pele-cap">图 3-2　0.8 g 时的半径—转速设计空间：R 从 120 m 到 260 m，转速从 2.44 降到 1.66 rpm；水平线是 2 rpm 舒适上限。</p>
      <div class="callout c-eval"><span class="ct">评审视角</span>
      评委看三件事：① 图纸上有没有标<b>重力方向</b>；② 有没有给<b>半径 + 转速 + 计算过程</b>；③ 这个半径和你们的建筑面积、结构方案、成本表是否<b>自洽</b>。只写"我们采用 0.8 g"而不给数字，等于没做。</div>
    ` },
    { h: '3.5 分级重力：让每个功能待在它该在的半径上', html: `
      <p>旋转体里<b>半径就是资源</b>：轴心 0 g、外圈高 g，中间连续过渡。合理的城市会把不同功能放到不同半径层：</p>
      <figure>
        <svg viewBox="0 0 680 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="分级重力功能分区示意图">
          <circle cx="330" cy="165" r="140" fill="#F4F7FF" stroke="#C9D6F5"></circle>
          <circle cx="330" cy="165" r="108" fill="#EAF3F3" stroke="#BEE3E3"></circle>
          <circle cx="330" cy="165" r="76" fill="#E9F7F0" stroke="#C6E8D8"></circle>
          <circle cx="330" cy="165" r="40" fill="#FFF7E8" stroke="#EBD7B0"></circle>
          <text x="330" y="160" font-size="11.5" fill="#8A6A2A" text-anchor="middle" font-weight="700">0 g</text>
          <text x="330" y="176" font-size="10.5" fill="#8A6A2A" text-anchor="middle">对接港 / 微重力工业</text>
          <text x="330" y="115" font-size="11.5" fill="#1E7C5A" text-anchor="middle" font-weight="700">0.3–0.4 g</text>
          <text x="330" y="131" font-size="10.5" fill="#1E7C5A" text-anchor="middle">农业 / 仓储</text>
          <text x="330" y="72" font-size="11.5" fill="#0E7C7C" text-anchor="middle" font-weight="700">0.5–0.6 g</text>
          <text x="330" y="88" font-size="10.5" fill="#0E7C7C" text-anchor="middle">工作 / 科研</text>
          <text x="330" y="36" font-size="11.5" fill="#2F5BEA" text-anchor="middle" font-weight="700">0.8 g（外圈居住）</text>
          <line x1="470" y1="165" x2="470" y2="60" stroke="#A8B6D8" stroke-width="1" stroke-dasharray="3 3"></line>
          <text x="478" y="70" font-size="10.5" fill="#6B7488">半径增大 →</text>
          <text x="478" y="86" font-size="10.5" fill="#6B7488">g 增大</text>
          <line x1="330" y1="165" x2="438" y2="165" stroke="#C78318" stroke-width="1.2"></line>
          <text x="384" y="158" font-size="10.5" fill="#C78318" text-anchor="middle">R</text>
          <text x="40" y="300" font-size="11" fill="#6B7488">图：以转轴为圆心，按重力需求分层布置功能区；外圈居住，轴心港口。</text>
        </svg>
        <figcaption>图 3-3　分级重力布局。注意：这只是原理示意，具体半径由你们的 0.8 g 要求反算，不能照抄。</figcaption>
      </figure>
      <p><b>为什么港口要放在轴心？</b>三个理由：① 飞船不需要在旋转状态下对接，接口最简单；② 轴心 0 g 便于大质量货物漂浮转运；③ 避免在旋转界面上开大开口（每个穿越旋转面的通道都是泄漏与结构风险点）。</p>
      <p><b>为什么农业常放中间层？</b>如果 RFP 没规定农业重力，就按作物适应性选（很多作物在 0.3 g 左右可正常生长），同时靠近生保与废物处理，缩短物质流路径。</p>
      <div class="anatomy-slot" data-figure="gravity"></div>
      <p class="anatomy-cap">图 3-4　人工重力试验台：转动曲柄改半径 R，转动旋钮改目标重力；转速表红线是 2 rpm 舒适上限。试块压缩量、转速表与右下角读数由同一个 a = ω²R 模型驱动。<a href="./figures/gravity.html" target="_blank" rel="noopener">单独打开</a></p>
    ` },
    { h: '3.6 深度界线：哪些要会，哪些知道就行', html: `
      <p>旋转城市确实有大量真实的工程难题。但<b>本项目的考点不是让你去做机构设计</b>——你的任务是想清楚空间怎么排、系统怎么配、代价怎么算。所以这一节只保留两个"必须能说出来"的点，其余的了解即可。</p>
      <p><b>① 旋转的部分和静止的部分怎么接上。</b>电、水、气、数据、人员，都得穿过那个"转与不转"的界面。最省事的做法是在<b>轴心留一条静止通道</b>——这也是港口放轴心的原因。你不需要设计接头，但要在图上标出接口在哪、失效了怎么隔离。</p>
      <p><b>② 万一停转了怎么办。</b>一旦停转，全城瞬间失重：水不会往下流、灰尘不落、火焰变成球形、人一推就飘走。生保和消防必须有"失重模式"的预案（至少写清哪些系统能撑多久）。这一条评委会问，因为它检验你有没有想过"运行中会出事"。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:28%">必须会（会被考到）</th><th style="width:30%">知道就行（能说一句）</th><th>不必涉及（不是本项目考点）</th></tr>
        <tr>
          <td>目标 g → 半径 R → 转速 n 的换算；2 rpm 舒适上限；"脚朝外、头朝轴"的重力方向；半径变大带来的结构代价</td>
          <td>旋转体与静止体之间需要接口；接口越少越好；停转后全城失重，要有预案；港口放轴心可以回避旋转对接</td>
          <td>轴承选型、动平衡配平、章动抑制、消旋机构、旋转密封的具体形式、水下旋转的水阻与涡流</td>
        </tr>
      </table></div>
      <div class="callout c-key"><span class="ct">一句话判断标准</span>
      如果你能在图上<b>指着重力方向、写出 R 和 n、说明接口在哪、说清停转后谁先失效</b>，这一章就够了。再往下的机械细节，<b>写进方案反而会挤掉真正得分的内容</b>（空间、系统、成本、可行性论证）。</div>
      <div class="callout c-eval"><span class="ct">评审视角</span>
      评委不会追问你"用哪种轴承"，但一定会问"你这个环怎么让飞船停进来""停转了人怎么办"。<b>把深度用在能被追问的地方。</b></div>
    ` }
  ],
  review: [
    '图纸必须标"重力方向"、半径 R、转速 n，三者与计算过程一致。',
    '"0.8 g"不是设计成果，把 0.8 g 变成 R 和 n 才是。',
    '半径选择要能解释：为什么不是 150 m，也不是 500 m？'
  ],
  check: ['R=250 m 时 0.8 g 对应多少 rpm？', '"上"在旋转环里是哪个方向？', '停转之后，哪些系统会立刻失效？']
});
