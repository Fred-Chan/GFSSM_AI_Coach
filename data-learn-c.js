/* ==========================================================
   GFSSM AI Coach · 学习内容 C：人居 / 基础设施 / 能源 / 进度成本 / 呈现与评审
   ========================================================== */

MODULES.push({
  id: 'human', no: '08', kicker: 'HUMAN FACTORS', title: '人居与人因：让人活得下去，也活得像个人',
  minutes: 9,
  sub: '人居不是装修，是在低重力、密闭、无自然光、远离地球的条件下维持人的身心功能。',
  oneLine: '人居 = 需求分层（马斯洛）+ 三类人群（常驻/家庭/访客）+ 四个压力源（无光、密闭、低重力、危险）+ 分级应急。',
  sections: [
    { h: '8.1 先分清"给谁设计"', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:20%">人群</th><th style="width:16%">典型 RFP</th><th>他们的特殊需求</th></tr>
        <tr><td>常驻工作人员 / 科研人员</td><td class="num">约 850 人</td><td>长期居住、轮班作息、职业暴露、社交圈固定</td></tr>
        <tr><td>携家庭长期定居者</td><td class="num">≤ 15%（约 150 人）</td><td>需要更大套型、教育/育儿空间、家庭隐私、儿童安全</td></tr>
        <tr><td>过境访客 / 船员</td><td class="num">峰值 250 人</td><td>短期住宿、<b>刚从长期 0 g 到达</b>，需要重力适应与医疗观察；不熟悉环境，需要清晰导向</td></tr>
      </table></div>
      <p>"刚从零重力环境到达"这一句在 RFP 里是明确写的（especially for those who have been travelling in zero-G environment prior to arriving at the site）。它意味着：<b>到达区需要一个"再适应"空间</b>——渐进重力、康复训练、医学监测。这是很多队伍漏掉的隐含要求。</p>
    ` },
    { h: '8.2 需求分层：马斯洛在太空城的用法', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:22%">层级</th><th style="width:30%">在太空城对应什么</th><th>设计证据（要能画出来）</th></tr>
        <tr><td>生理</td><td>空气、水、食物、睡眠、温度</td><td>生保参数、居住单元净面积、噪声与照度标准</td></tr>
        <tr><td>安全</td><td>结构安全、消防、失压、医疗</td><td>分舱隔离、疏散路线与时间、避难舱、诊所/手术能力</td></tr>
        <tr><td>归属与社交</td><td>社区感、家庭、友谊</td><td>公共空间尺度、食堂/市集/社团空间、可举办的集体活动</td></tr>
        <tr><td>尊重</td><td>隐私、领地感、被需要</td><td>私密—半私密—公共的空间梯度、可关闭的门、个人储物</td></tr>
        <tr><td>自我实现</td><td>成长、创造、探索</td><td>实验室、工坊、教育、观景/自然体验</td></tr>
      </table></div>
    ` },
    { h: '8.3 四个压力源与对应设计', html: `
      <h4 class="sub">① 无自然光（地下 / 冰下，或轨道昼夜过快）</h4>
      <p>没有日照会打乱昼夜节律（褪黑素分泌紊乱、睡眠障碍、情绪低落）。设计证据：<b>可调色温与照度的全光谱照明</b>（晨间高色温、夜间低色温）、模拟日照的"光墙/光庭"、<b>虚拟窗</b>（实时或延时传输地表/地球影像）、室内绿植与自然材质。</p>
      <h4 class="sub">② 密闭与隔离</h4>
      <p>长期无法离开、社交圈固定、与地球通信有 35–52 分钟延迟（不能随时视频聊天）。设计证据：<b>隐私梯度</b>（私密舱室 → 半私密小群空间 → 公共大厅）、可"退避"的安静空间、噪音分区、<b>社交催化剂</b>（食堂、市集、共享厨房、社团工坊）而不是空旷的大厅。</p>
      <h4 class="sub">③ 低重力</h4>
      <p>即使有 0.8 g，仍低于地球 1 g。RFP 给的方案是"0.8 g 居住 + 每日在更高重力环境下锻炼"。设计证据：锻炼区位置与重力等级、器材数量（按人口与班次算）、<b>每日 1 小时运动/2 小时休闲</b>的时间-空间容量核算、医疗监测。</p>
      <h4 class="sub">④ 危险与不确定</h4>
      <p>失压、火灾、断电、生保故障。设计证据：<b>分舱 + 独立生保 + 可隔离</b>、双向疏散路径、避难舱容量与 72 小时自持、应急照明与通信、演练机制。</p>
      <div class="pele-fig" data-diagram="human-factors"></div>
      <p class="pele-cap">图 8-1　四个压力源与设计证据：无自然光、密闭、低重力、危险；6 个独立舱段是 RFP 的硬指标。</p>
      <div class="callout c-key"><span class="ct">RFP 的硬要求（示例）</span>
      居住区必须能分成<b>至少 6 个相互独立、各配完整生保系统的舱段</b>，事故时可隔离危险区并疏散人员。这是一条"数得出来"的硬指标：6 个舱段 × 各自的生保能力 = 你们的分舱方案与生保冗余设计。</div>
    ` },
    { h: '8.4 应急不是一句话，是分级表', html: `
      <p>RFP 要求做 <b>L1–L4 分级应急预案表</b>，每级写清<b>触发条件 / 响应动作 / 恢复程序</b>。分级的意义是：不同严重程度用不同代价的手段，避免"小事大动干戈、大事反应不过来"。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:10%">级别</th><th style="width:26%">典型触发</th><th style="width:34%">响应</th><th>恢复</th></tr>
        <tr><td>L1</td><td>单点设备异常、局部报警</td><td>系统自动切换冗余，值班人员确认</td><td>维修、复位、记录</td></tr>
        <tr><td>L2</td><td>子系统部分失效（如一台电解槽停机）</td><td>降负荷运行、启动备用、限制非必要活动</td><td>更换模块、恢复满负荷</td></tr>
        <tr><td>L3</td><td>舱段失压 / 局部火灾 / 主电源中断</td><td>隔离舱段、疏散到避难舱、切负荷至最低功率</td><td>灭火/补压、结构评估、分批返迁</td></tr>
        <tr><td>L4</td><td>全城性灾难（堆故障、大面积结构失效）</td><td>全城撤离至避难区/返运飞船，启动 90 天最低功率模式</td><td>外部救援（35–52 分钟时延下几乎只能靠自治）</td></tr>
      </table></div>
      <div class="callout c-eval"><span class="ct">评审视角</span>
      "我们有完善的应急系统"= 0 分。评委会看：<b>触发阈值是数字吗？响应有时间吗？谁有权决策？</b>（在 35–52 分钟通信延迟下，"等地球指示"不是方案。）</div>
    ` },
    { h: '8.5 一张合格的人居平面图要有什么', html: `
      <ul>
        <li><b>尺寸</b>：每个空间的长宽/面积，通道宽度，净高。</li>
        <li><b>功能标注</b>：居住单元、公共空间、医疗、教育、健身、商业/市集、quiet room。</li>
        <li><b>人数容量</b>：每个空间按多少人设计（食堂座位数 × 翻台率 = 供餐能力）。</li>
        <li><b>流线</b>：到达 → 再适应 → 分配住处的路径；日常通勤；疏散（双向）。</li>
        <li><b>重力标注</b>：哪些区在 0.8 g，哪些在更高/更低重力。</li>
        <li><b>界面</b>：与生保、交通、结构接口的位置（竖井口、气闸、管井）。</li>
      </ul>
    ` }
  ],
  review: [
    '人居的分不在"好看"，而在"能不能证明人在这里住 5 年不出问题"。',
    '访客的零重力到达、家庭住户、夜间班次，是三个常被漏掉的人群变量。',
    '应急要分级、要数字、要决策权限。'
  ],
  check: ['无自然光怎么解决？给出具体的照度/色温/空间做法。', '6 个独立舱段怎么分？每个舱段的生保能力是多少？', '访客刚到时在哪里做重力再适应？']
});

MODULES.push({
  id: 'infra', no: '09', kicker: 'INFRASTRUCTURE', title: '基础设施：把各系统连成一个能用的城',
  minutes: 9,
  sub: '人、货、信息三条流；以及"哪些事该交给机器"这道判断题。',
  oneLine: '基础设施的价值在接口：连得上、流得动、断得开、修得快。',
  sections: [
    { h: '9.1 三条流线与分层交通', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:14%">流线</th><th style="width:30%">典型距离/场景</th><th>合理方式</th></tr>
        <tr><td rowspan="3"><b>人</b></td><td>同一环内短距（&lt;500 m）</td><td>步行、小型电动接驳车</td></tr>
        <tr><td>跨重力层（0.8 g ↔ 0 g ↔ 1.3 g）</td><td>沿轮辐布置的电梯/轨道车，需考虑<b>重力过渡</b>与换乘节点</td></tr>
        <tr><td>表面 ↔ 地下（{{depth}} m 竖井）</td><td>提升舱（人员）、货运提升机（货物），两条 30 m 竖井可分客货</td></tr>
        <tr><td rowspan="2"><b>物</b></td><td>大宗补给（LOX/LH₂/液氮/干冰）</td><td>专用管路 + 增压货物通道 + 自动化运输线，避免与人员流线交叉</td></tr>
        <tr><td>固废/产品</td><td>封闭式输送（气力/轨道），防止污染居住区</td></tr>
        <tr><td><b>信息</b></td><td>全城</td><td>有线主干 + 无线覆盖 + 与地球的深空链路（高时延、断续）</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="infra-flows"></div>
      <p class="pele-cap">图 9-1　人、物、信息三条流线：信息分支的 35–52 分钟时延，直接决定自治等级与治理结构。</p>
      <div class="callout c-warn"><span class="ct">常见错误</span>
      把人流和货流画在同一条通道上，还标着"高效"。在封闭环境里，这是污染、拥堵与安全的复合风险。</div>
    ` },
    { h: '9.2 通信：时延决定的不是网速，是治理结构', html: `
      <p>本场景到地球单程 <b>{{commMin}}–{{commMax}} 分钟</b>。这意味着：</p>
      <ul>
        <li><b>不能遥控</b>：建造、维修、医疗急救都必须本地闭环，地球只能"事后建议"。</li>
        <li><b>通信是"邮件式"的</b>：每天若干次窗口，带宽宝贵，要分优先级（安全 > 生保 > 科研数据 > 个人通信）。</li>
        <li><b>心理影响</b>：与家人无法实时对话 → 需要用"异步陪伴"设计（留言、影像包、虚拟共处空间）。</li>
        <li><b>自主等级</b>：越远的基地，AI 与本地决策权限必须越高，这是被物理定律逼出来的，不是技术偏好。</li>
      </ul>
      <div class="formula"><span class="lbl">顺手算一下（也常考）</span>
单程时延 = 距离 / c　　c = 3×10⁵ km/s
木星距地球 4.2–6.2 AU（1 AU ≈ 1.5×10⁸ km）→ 6.3–9.3 亿 km
→ 单程 ≈ 35–52 分钟，往返 70–104 分钟
      </div>
    ` },
    { h: '9.3 AI 与人的分工：三级模型', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:20%">等级</th><th style="width:30%">含义</th><th>典型任务</th></tr>
        <tr><td><b>全自主闭环</b></td><td>AI 感知—决策—执行，人只监控</td><td>生保参数调节、温室环境控制、配电切换、常规巡检、交通调度</td></tr>
        <tr><td><b>人监督</b></td><td>AI 提案，人确认后执行</td><td>燃料厂工艺调整、非关键维修、科研实验排程、资源分配</td></tr>
        <tr><td><b>人在环（HITL）</b></td><td>关键决策必须人确认</td><td>疏散与隔离、反应堆停堆、医疗处置、对外救援承诺</td></tr>
      </table></div>
      <p>RFP 要求"列出主要功能，并说明每一项里 AI 与人怎么协作"——所以你们的架构图必须<b>按功能分工</b>，而不是画一堆服务器和云。</p>
      <p>一条实用判断：<b>不可逆 + 涉及人命 = 人在环</b>；<b>高频 + 可回滚 = 全自主</b>；中间的交给人监督。</p>
    ` },
    { h: '9.4 机器人与模块化实验室', html: `
      <p>本场景的舱外环境（{{tAvg}} ℃、{{radDayShow}}、外部压力 {{pOut}} MPa）基本排除了常规舱外作业。所以 RFP 要求一台 <b>可载 4 人的多功能水下机器人</b>：探测、环境监测、故障诊断与排除、能与主基地对接。</p>
      <p>看这类题的方法：<b>把"功能"翻译成"子系统"</b>——耐压壳（外压！）、推进与姿态、机械臂、照明与摄像、生命支持（4 人）、对接机构、通信（水下声学/有线）、电源。再检查：<b>4 人需要多大耐压壳？电池能撑多久？对接时怎么密封？</b></p>
      <p><b>模块化实验室</b>（10 个）的设计关键不是"实验室里放什么"，而是<b>标准化接口</b>：外形尺寸、内部容积、对接接口、供电/数据/气液快接、以及"能在三种场地（水体中 / 冰面 / 海床）部署"的适应性。这是 Economy 的典型考点：<b>一套模块，三种用途，降低总数量与备件种类</b>。</p>
    ` },
    { h: '9.5 接口清单：基础设施章节真正的交付物', html: `
      <div class="compact-list">
        <div class="kvline"><span class="k">电力接口</span><span class="v">母线电压等级、孤岛切换、关键负荷优先顺序</span></div>
        <div class="kvline"><span class="k">热接口</span><span class="v">废热来源、散热路径（水下对流 / 辐射）、温度等级</span></div>
        <div class="kvline"><span class="k">物质接口</span><span class="v">水/气/燃料的管路走向、阀门隔离点、泄漏检测</span></div>
        <div class="kvline"><span class="k">人员接口</span><span class="v">气闸、更衣、除尘、减压/增压程序</span></div>
        <div class="kvline"><span class="k">信息接口</span><span class="v">主干网、无线覆盖、与地球链路的带宽分配</span></div>
        <div class="kvline"><span class="k">机器接口</span><span class="v">机器人/实验室的对接标准、充电/加注、数据回传</span></div>
      </div>
      <div class="pele-fig" data-diagram="infra-interfaces"></div>
      <p class="pele-cap">图 9-2　六类接口清单：电力、热、物质、人员、信息、机器；每一类都要有隔离点和失效方案。</p>
    ` }
  ],
  review: [
    '架构图要能看出"谁决策、谁执行、断链了怎么办"。',
    '交通方式要和距离、重力、环境匹配，不能一句"电梯"带过。',
    '模块化/标准化的价值在于减少种类与备件，这是经济性论证。'
  ],
  check: ['从表面港到居住环，一个人要经过几步？每步的环境是什么？', '哪些任务必须人在环？为什么？', '水下机器人的耐压壳要承受多大外压？']
});

MODULES.push({
  id: 'power', no: '10', kicker: 'POWER', title: '能源与电力：kW、kWh 与 90 天',
  minutes: 10,
  sub: '这一章最容易拿分也最容易翻车：功率和能量混了，整张表就废了。',
  oneLine: 'kW 是"多快"，kWh 是"多少"；发电看功率，储能看能量，90 天看的是"最低功率 × 时间"。',
  sections: [
    { h: '10.1 kW 与 kWh：一句话分清', html: `
      <div class="grid-2">
        <div class="obj"><span class="k">功率 kW</span><div class="v">瞬时"干活的速度"。发电能力、用电负荷、设备容量都用 kW。</div></div>
        <div class="obj"><span class="k">能量 kWh</span><div class="v">一段时间内"总共用了多少"。储能容量、发电量、耗电量都用 kWh。</div></div>
      </div>
      <div class="formula"><span class="lbl">唯一需要记住的换算</span>
能量 (kWh) = 功率 (kW) × 时间 (h)
例：4,000 kW 的最低功率运行 90 天 → 4,000 × 90 × 24 = <b>8,640,000 kWh ≈ 8.64 GWh</b>
      </div>
      <p>RFP 的措辞很精确："covering <b>total power consumption (kW)</b>, <b>power generation (kW)</b>, and <b>energy storage (kWh)</b> for the 90-day minimum-power scenario"。三个数、两个单位，写错单位就是没读懂。</p>
    ` },
    { h: '10.2 先算负荷：自下而上列清单', html: `
      <p>不要凭"人均 20 kW"拍脑袋（可以作为校核）。正确做法是列设备清单：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:26%">负荷类别</th><th style="width:18%">量级</th><th>说明</th></tr>
        <tr><td>生保（环控生保）</td><td class="num">3–8 kW/人</td><td>电解、CO₂ 去除、泵、风机、水处理、温控</td></tr>
        <tr><td>农业照明</td><td class="num">100–200 W/m² 栽培面</td><td>往往单项最大；按栽培面积算，不是按人</td></tr>
        <tr><td>居住与公共</td><td class="num">1–3 kW/人</td><td>照明、厨卫、办公、娱乐、商业</td></tr>
        <tr><td>工业 / 燃料厂</td><td class="num">MW 级</td><td>水电解制氢制氧是电老虎（每 kg H₂ 约 50 kWh）</td></tr>
        <tr><td>科研</td><td class="num">0.5–3 MW</td><td>10 个实验室，低温/真空/计算需求差异大</td></tr>
        <tr><td>热控与泵阀</td><td class="num">总负荷的 5–10%</td><td>不要漏掉"系统自身的电"</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="power-load"></div>
      <p class="pele-cap">图 10-1　1250 人的示例分类负荷：生保 6 kW/人、农业 150 W/m²、居住 2 kW/人；未含 1.2–1.3 损耗/同时率。</p>
      <p>把清单加起来，再乘 <b>1.2–1.3</b> 的损耗与同时率系数，得到总负荷。然后分三级：<b>生命攸关（vital）/ 必要（essential）/ 可中断（sheddable）</b>。"最低功率"就是只保留前两级时的功率。</p>
    ` },
    { h: '10.3 发电方式：光伏什么时候就不够用了', html: `
      <p>本场景的太阳辐照约 <b>{{sun}} W/m²</b>（地球附近为 1361 W/m²）。<b>这个数一出来，电源路线基本就定了</b>——因为光伏面积与辐照成反比，而面积就是质量、就是钱。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:26%">辐照档位</th><th style="width:26%">典型场地</th><th>结论</th></tr>
        {{@pv}}
      </table></div>
      <div class="callout c-key"><span class="ct">本场景的算术</span>
      1 MW 电负荷、组件效率按 20% 计，所需受光面积约 <b>{{@pvarea}}</b>。这只是"受光面积"——还没算支架、展开机构、指向损失、清洗、以及昼夜与尘暴造成的容量折减。<b>如果这个面积已经大到无法在方案里画出来，就该换电源了。</b></div>
      <div class="table-wrap"><table>
        <tr><th style="width:20%">方式</th><th style="width:26%">适合的条件</th><th>必须交代的代价</th></tr>
        <tr><td>光伏 + 储能</td><td>辐照强、有稳定日照或可控昼夜</td><td>面积、质量、清洗/除霜、电池循环寿命、夜间容量</td></tr>
        <tr><td>核裂变（小型堆）</td><td>大功率、长周期、远离太阳</td><td>屏蔽质量、散热面积、停堆与应急、燃料补给、退役</td></tr>
        <tr><td>核聚变（若 RFP 给定）</td><td>RFP 直接指定的场景</td><td>屏蔽、巨大散热、燃料储备、与居住区的隔离距离</td></tr>
        <tr><td>RTG（同位素）</td><td>百瓦级、远端小负载</td><td>功率小、逐年衰减、只能做应急或仪器供电</td></tr>
        <tr><td>燃料电池 / 化学储能</td><td>短时峰值、UPS</td><td>能量密度、氧化剂储存、与推进剂系统的耦合</td></tr>
      </table></div>
      <div class="formula"><span class="lbl">光伏面积公式（常考）</span>
S = P / (η × I)
P：所需电功率（W）　η：组件效率　I：当地辐照（W/m²）

例：P = 1 MW，η = 0.20，I = 1361 W/m²（地球附近）→ S ≈ 3,700 m²
同功率在 I = {{sun}} W/m² 的本场景 → S ≈ {{@pvarea}}
      </div>
      <div class="callout c-eval"><span class="ct">评审视角</span>
      电源章节最容易被写成"我们采用光伏 + 核能 + 储能，多种能源互补"——这是没有做选择。合格的写法是：<b>逐年/逐段列出负荷 → 给出一个主电源的容量与理由 → 说明 N-1 故障时谁能顶多久 → 给出燃料/备件的补给周期</b>。评委要看到"你算过"，不是"你都有"。</div>
    ` },
    { h: '10.4 90 天储能：这道题的"陷阱"在这里', html: `
      <p>RFP 说"能保留能量，以最低功率维持运行至少 90 天"。很多方案直接算 8.64 GWh，然后写"用锂电池"——<b>8.64 GWh 的锂电池约需数万吨</b>，飞船运不起，也不经济。这就是典型的"算对了数、答错了题"。</p>
      <p>理性的做法是<b>先把"最低功率"定义清楚</b>（只保留生命攸关负荷，可能只有总负荷的 10–20%），再选择<b>能量载体</b>：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:22%">载体</th><th style="width:22%">能量密度（量级）</th><th>适用性</th></tr>
        <tr><td>锂离子电池</td><td class="num">0.15–0.25 kWh/kg</td><td>适合小时级（调峰、UPS），不适合 90 天</td></tr>
        <tr><td>液氢 + 液氧（燃料电池/燃烧）</td><td class="num">≈ 3–4 kWh/kg（按 H₂ 计）</td><td><b>适合长周期</b>；而这座城本来就是燃料工厂，燃料储备天然存在</td></tr>
        <tr><td>聚变燃料储备 + 降功率运行</td><td class="num">极高</td><td>最合理：不是"存电"，而是"存燃料 + 降低发电"</td></tr>
        <tr><td>飞轮 / 超级电容</td><td class="num">低</td><td>只做秒级—分钟级</td></tr>
        <tr><td>热储存</td><td class="num">中</td><td>保温、农业夜间供热可用</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="storage-quadrant"></div>
      <p class="pele-cap">图 10-2　90 天储能载体：横轴能量密度、纵轴适用时长；要往右上选，而不是堆电池。</p>
      <div class="callout c-eval"><span class="ct">评审视角（这一条很值钱）</span>
      评委问"90 天怎么实现"，最好的回答不是"堆电池"，而是：<b>①定义最低功率与负荷清单 → ②说明燃料/热/电三种储备的分工 → ③给出可核查的 kWh 数与质量估算 → ④说明恢复供电的路径</b>。这体现的是系统思维，而不是算术。</div>
    ` },
    { h: '10.5 别忘了散热', html: `
      <p>输入的电最终几乎全部变成热。真空环境只能靠<b>辐射</b>散热：<span class="mono">P = εσAT⁴</span>。这意味着散热面积是硬约束，而且温度越低，所需面积越大（T⁴）。在冰下场景，环体浸在液态水里，<b>对流散热条件极好</b>——这是水下选址的一个隐性优势，但冰内的聚变堆舱仍需专门的热管理系统（把热量导到海水或冰层）。</p>
      <p>写方案时给一句"废热 X MW，通过 Y 方式排散，散热面积 Z m²"，比十句"我们重视热控"有用。</p>
    ` }
  ],
  review: [
    '三个数：总功耗 kW、发电 kW、储能 kWh——单位错一个就废。',
    '光伏面积、储能量、人均功率，是最常考的三个计算。',
    '"90 天"考的不是算术，是"如何定义最低功率 + 如何选载体"。'
  ],
  check: ['总负荷是多少 kW？分几级？最低功率是多少？', '90 天要多少 kWh？你打算用什么载体装它？', '种菜的照明电算进去了吗？']
});

MODULES.push({
  id: 'business', no: '11', kicker: 'SCHEDULE & COST', title: '进度与成本：甘特图与钱的说法',
  minutes: 8,
  sub: '两张表就能看出一个团队有没有工程感：甘特图看依赖关系，成本表看口径一致。',
  oneLine: '甘特图 = 任务 × 时间 + 里程碑 + 关键路径；成本表 = 阶段 × 年度 × 人力，单位统一、合计对得上。',
  sections: [
    { h: '11.1 把 RFP 的时间轴变成月数', html: `
      <p>RFP 一般会给出"授予 → 全面运营"的年份区间（例：某年 6 月授予 → 五年后全面运营）。这中间只有约 <b>54 个月</b>（4.5 年）。一个 1000 人规模的冰下城市，54 个月建成，本身就是"压缩到极限"的工程——这恰恰是进度章节要论证的东西。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:26%">阶段</th><th class="num" style="width:18%">月数</th><th>要点</th></tr>
        <tr><td>设计与详细工程</td><td class="num">9–12</td><td>与长周期设备采购<b>并行</b>，不要串行</td></tr>
        <tr><td>机器人先遣与场地准备</td><td class="num">6–9</td><td>钻探、竖井、冰内空腔开挖</td></tr>
        <tr><td>能源 / 通信 / 生保核心</td><td class="num">12–18</td><td>与结构施工部分并行</td></tr>
        <tr><td>居住环与主要舱段</td><td class="num">18–24</td><td>关键路径通常在大型结构件运输与组装</td></tr>
        <tr><td>工业 / 农业 / 港口</td><td class="num">12–18</td><td>可分段投用</td></tr>
        <tr><td>联调、验收、移交</td><td class="num">6</td><td>不可省；RFP 要求移交 IDSDO 运营</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="gantt-54"></div>
      <p class="pele-cap">图 11-1　54 个月示例进度：设计与长周期采购并行，能源/生保先行；按你们的 RFP 日期重排，并标出关键路径。</p>
      <div class="callout c-key"><span class="ct">关键路径（Critical Path）</span>
      从起点到终点<b>最长</b>的那条任务链。它决定总工期：这条链上任何一天延误，整体就延误一天。压缩工期只有两种办法：<b>压缩关键路径上的任务</b>，或<b>把串行改成并行</b>（前提是能承担返工风险）。</div>
    ` },
    { h: '11.2 成本表怎么才"像真的"', html: `
      <ul>
        <li><b>口径统一</b>：RFP 要求"每年向 IDSDO 计费（十亿元/年）+ 项目总成本（十亿元）"。全部用同一单位，且<b>年度之和 = 总额</b>（允许四舍五入误差，但要说明）。</li>
        <li><b>分阶段</b>：设计 / 建造 / 运营（可加"调试与移交"），每阶段有人力数量。</li>
        <li><b>自下而上</b>：主要成本项 = 结构材料与制造 + 运输发射 + 设备（生保/能源/农业）+ 人力 + 备件 + 不可预见费（15–20%）。</li>
        <li><b>单位成本校核</b>：每 kW 发电成本、每 m² 加压面积成本、每人年运营成本。用这些指标横向比较，能看出你们的数字是否离谱。</li>
      </ul>
      <div class="pele-fig" data-diagram="cost-structure"></div>
      <p class="pele-cap">图 11-2　示例成本结构：比例只用于说明“分项 + 不可预见费”的写法；用你们自己的成本表替换。</p>
      <div class="callout c-warn"><span class="ct">常见翻车</span>
      甘特图写 54 个月，成本表却按 60 个月分摊；或者建造阶段的人数写 200 人，人力成本却按 2000 人算。这类内部矛盾会被 Systematic 直接扣分。</div>
    ` },
    { h: '11.3 权衡分析：经济性分的真正来源', html: `
      <p>RFP 的 Economy 准则原文关注的是 <b>trade-off analysis</b>：在多个选项中找到最平衡的解，并证明你理解资源约束。所以方案里至少要有一张对比表：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:20%">方案</th><th class="num">初投资</th><th class="num">运行成本</th><th class="num">风险</th><th>结论</th></tr>
        <tr><td>A：单一大环 R=470 m</td><td class="num">高</td><td class="num">中</td><td class="num">结构风险集中</td><td>不选</td></tr>
        <tr><td>B：居住环 + 独立农业环</td><td class="num">中</td><td class="num">低</td><td class="num">分散、可分段投用</td><td><b>选 B</b></td></tr>
        <tr><td>C：全地下隧道式</td><td class="num">低</td><td class="num">高</td><td class="num">开挖风险、无重力</td><td>不满足 0.8 g</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="tradeoff-quadrant"></div>
      <p class="pele-cap">图 11-3　A/B/C 方案取舍：把“为什么选 B”放到同一张图上；位置按 11.3 的高/中/低相对示意。</p>
      <p>注意：<b>"我们选了 B 因为更便宜"不是权衡</b>；要写清"B 的初投资比 A 低 X%，因为周长减少 Y 米、屏蔽质量减少 Z 吨；代价是增加一处旋转接口，年维护成本 +W"。</p>
    ` }
  ],
  review: [
    '甘特图必须按月、有里程碑、能看出依赖关系。',
    '成本表的单位、口径、合计三项必须自洽。',
    '经济性不是"省钱"，是"有论证的取舍"。'
  ],
  check: ['从授予到运营一共几个月？关键路径是哪几条任务？', '总成本多少？年度加起来等于总额吗？', '你们做过哪几个方案的对比？'
  ]
});

MODULES.push({
  id: 'review', no: '12', kicker: 'REVIEW', title: '呈现与评审：评委到底在找什么',
  minutes: 9,
  sub: '同样的设计，表达方式不同，分数能差一档。这一节讲"怎么让评委看见你做对了"。',
  oneLine: '评审四准则：完整（逐条回应）、合理（数字有依据）、系统（跨章节自洽）、经济（有权衡）。',
  sections: [
    { h: '12.0 先看评分：四准则各自要什么证据', html: `
      <p>评委不是在找“最酷的方案”，而是在四个维度上找证据。把这张图贴在组内，每次写完一章就回头问：这一章给哪条准则提供了什么证据？</p>
      <div class="pele-fig" data-diagram="review-criteria"></div>
      <p class="pele-cap">图 12-1　评审四准则与证据：每一组都能在方案里找到对应的图或数。</p>
    ` },
    { h: '12.1 文件规范：这些是"不商量"的硬要求', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:26%">要求</th><th>典型 RFP 原文要点</th><th style="width:20%">违规后果</th></tr>
        <tr><td>格式</td><td>提交 <b>PDF</b> 版的演示幻灯片</td><td>格式不符可能不予评审</td></tr>
        <tr><td>比例</td><td><b>16:9</b></td><td>排版错乱、扣分</td></tr>
        <tr><td>页数</td><td>建议不超过 <b>30 页</b></td><td>超页可能不被阅读</td></tr>
        <tr><td>命名</td><td>Proposal_[Team Name]_12-member Team.pdf</td><td><b>明确写明要扣分</b></td></tr>
        <tr><td>尺寸单位</td><td>所有示意图必须标<b>公制尺寸 [m]</b>，手绘也可但必须标</td><td>图纸不合格</td></tr>
        <tr><td>AI 使用</td><td>可用于概念与提纲，但研究、写作、结构必须学生完成；遵守 Honor Code；不建议用 AI 直接生成图</td><td>学术诚信问题</td></tr>
      </table></div>
      <div class="callout c-warn"><span class="ct">最容易丢的分</span>
      文件名写错、比例不是 16:9、图没有尺寸标注。这三件事和设计水平无关，但每年都有人栽。</div>
    ` },
    { h: '12.2 30 页怎么分配（一个可用的模板）', html: `
      <div class="table-wrap"><table>
        <tr><th class="num" style="width:14%">页</th><th style="width:34%">内容</th><th>对应 RFP 章节</th></tr>
        <tr><td class="num">1–2</td><td>封面 + 目录 + 执行摘要（一页说清全局）</td><td>Executive Summary</td></tr>
        <tr><td class="num">3–7</td><td>总体设计：轴测图、剖面图、体量表、重力方向</td><td>§2.1</td></tr>
        <tr><td class="num">8–10</td><td>表面港布局、建造序列（≥6 步）</td><td>§2.2–2.3</td></tr>
        <tr><td class="num">11–14</td><td>电力预算、生保三张流程图、农业布局</td><td>§3.1–3.3</td></tr>
        <tr><td class="num">15–19</td><td>居住与公共空间、心理设施、分级应急表</td><td>§4.1–4.3</td></tr>
        <tr><td class="num">20–24</td><td>机器人、AI-人协同架构、模块化实验室</td><td>§5.1–5.3</td></tr>
        <tr><td class="num">25–27</td><td>甘特图、成本表、权衡分析</td><td>§6.1–6.2</td></tr>
        <tr><td class="num">28–30</td><td>风险与对策、团队分工、参考文献</td><td>加分项</td></tr>
      </table></div>
      <div class="pele-fig" data-diagram="page-budget"></div>
      <p class="pele-cap">图 12-2　30 页提案的页面预算：前 2 页说清全局，中间按 RFP 章节展开。</p>
    ` },
    { h: '12.3 图纸七要素：一张图能不能被"读懂"', html: `
      <div class="grid-2">
        <div class="obj"><span class="k">① 比例 / 指北</span><div class="v">有比例尺或明确比例；在轨道城用"重力方向"代替指北。</div></div>
        <div class="obj"><span class="k">② 尺寸 [m]</span><div class="v">主要体量的长宽高，单位统一写 m，不写"约 3 层楼"。</div></div>
        <div class="obj"><span class="k">③ 图例</span><div class="v">颜色/线型代表什么（旋转/静止、增压/不增压、危险区）。</div></div>
        <div class="obj"><span class="k">④ 功能标注</span><div class="v">每个空间有名称 + 用途，不需要翻正文就能看懂。</div></div>
        <div class="obj"><span class="k">⑤ 剖切 / 轴测</span><div class="v">鸟瞰图看不出内部，至少配一张剖面或轴测。</div></div>
        <div class="obj"><span class="k">⑥ 连接关系</span><div class="v">通道、竖井、气闸、管路画出来，不能"漂"着。</div></div>
        <div class="obj"><span class="k">⑦ 方向与流向</span><div class="v">人流、物流、气流、水流的箭头方向。</div></div>
        <div class="obj"><span class="k">⑧ 数据来源</span><div class="v">关键数字标注"依据 RFP §x"或"假设值，见附录"。</div></div>
      </div>
    ` },
    { h: '12.4 图表选型：什么内容用什么图', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:22%">你要表达</th><th style="width:26%">该用什么</th><th>别用什么</th></tr>
        <tr><td>空间组织</td><td>平面 + 剖面 + 轴测（三件套）</td><td>只有一张炫酷的外观渲染图</td></tr>
        <tr><td>物质循环</td><td>流程图（带量、带方向）</td><td>一段文字描述</td></tr>
        <tr><td>系统关系</td><td>架构图（分层 + 接口）</td><td>一堆图标连线</td></tr>
        <tr><td>进度</td><td>甘特图（按月、带里程碑）</td><td>文字"第一阶段、第二阶段…"</td></tr>
        <tr><td>成本</td><td>分年度表 + 结构饼图/柱图</td><td>只写一个总数</td></tr>
        <tr><td>取舍</td><td>对比矩阵（多准则打分）</td><td>"综合考虑后我们选择…"</td></tr>
        <tr><td>应急</td><td>分级表（L1–L4 × 触发/响应/恢复）</td><td>一段"我们有完善预案"</td></tr>
      </table></div>
    ` },
    { h: '12.5 一致性检查：提交前必做的 10 项对账', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:6%">#</th><th>检查项</th></tr>
        <tr><td class="num">1</td><td>人口数字（常驻/访客/峰值）在摘要、总体图、面积表、电力、成本中是否一致</td></tr>
        <tr><td class="num">2</td><td>重力等级（0.8 g）在结构、人居、农业章节是否一致</td></tr>
        <tr><td class="num">3</td><td>环半径 R 与转速 n 是否满足 a = ω²R，且 n ≤ 2 rpm</td></tr>
        <tr><td class="num">4</td><td>面积表合计 = 各分区之和（含附加系数）</td></tr>
        <tr><td class="num">5</td><td>总功耗 = 各类负荷之和 × 系数；发电 ≥ 总功耗 + 冗余</td></tr>
        <tr><td class="num">6</td><td>储能量 = 最低功率 × 90 天 × 24 h（kWh）</td></tr>
        <tr><td class="num">7</td><td>生保回收率（水 ≥90%、氧 ≥90%）与流程图上的数字一致</td></tr>
        <tr><td class="num">8</td><td>食物自给率 × 人口 = 农业产量；农业面积与电力预算对得上</td></tr>
        <tr><td class="num">9</td><td>建造步骤数 = 甘特图任务组数 = 成本表阶段划分</td></tr>
        <tr><td class="num">10</td><td>所有图纸都有 [m] 标注、图例、重力方向</td></tr>
      </table></div>
    ` },
    { h: '12.6 答辩预演：评委最爱问的 12 个问题', html: `
      <ol>
        <li>为什么选这个地点？最要命的环境约束是什么？</li>
        <li>0.8 g 是怎么实现的？半径和转速为什么是这个值？</li>
        <li>1000 人住在哪里？人均面积多少？依据是什么？</li>
        <li>断电 90 天，靠什么撑住？最低功率是多少？</li>
        <li>水和氧的回收率怎么达到 90%？损失的部分怎么办？</li>
        <li>废物最后去哪了？真的零排放吗？</li>
        <li>食物能自给多少？种菜要多少电？</li>
        <li>失压了怎么办？6 个舱段怎么隔离？</li>
        <li>为什么先建这个、后建那个？哪一步能提前运营？</li>
        <li>AI 决定什么、人决定什么？通信断了怎么办？</li>
        <li>总成本多少？和同类项目比合理吗？</li>
        <li>如果预算砍掉 30%，你先砍哪里？为什么？</li>
      </ol>
      <p class="small">把这些问题当作业：每个都要能用<b>一个数字 + 一句理由</b>回答。</p>
    ` }
  ],
  review: [
    '四准则不是四个章节，而是贯穿全文的四种证据。',
    '格式类硬要求（命名、比例、页数、单位）先做到，再谈设计。',
    '答辩是"数字对账"，不是"讲故事"。'
  ],
  check: ['你们的文件名符合规范吗？', '10 项一致性检查做了几项？', '12 个问题里，有几个能立刻答出来？']
});
