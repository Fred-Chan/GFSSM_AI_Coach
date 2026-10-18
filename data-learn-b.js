/* ==========================================================
   GFSSM AI Coach · 学习内容 B：尺度分区 / 建造次序 / 空气与水 / 废物与食物
   ========================================================== */

MODULES.push({
  id: 'layout', no: '04', kicker: 'LAYOUT', title: '空间尺度与功能分区：从人数算出体积',
  minutes: 10,
  sub: '先算需要多少平方米，再决定长什么形状；顺序反过来就会画出一个装不下人的城。',
  oneLine: '尺度 = 人口 × 人均指标 + 附加系数；分区 = 重力分层 + 洁污分离 + 危险隔离 + 流线最短。',
  sections: [
    { h: '4.1 从人口到面积：先把账算出来', html: `
      <p>RFP 给的第一个硬数字通常是人口（例：<b>1000 名常驻 + 最多 250 名访客，峰值 1250</b>）。下面的算法用这个规模做示例——换成你那年的人口，按比例缩放即可。所有空间需求都从这里长出来。做法是先列<b>人均指标</b>，再乘人口，再加附加系数。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:24%">功能</th><th class="num" style="width:14%">人均指标</th><th class="num" style="width:16%">1250 人时</th><th>说明</th></tr>
        <tr><td>居住净面积</td><td class="num">20 m²/人</td><td class="num">25,000 m²</td><td>含卧室、卫浴、家庭套间；15% 家庭住户需要更大套型</td></tr>
        <tr><td>公共 / 社区</td><td class="num">12 m²/人</td><td class="num">15,000 m²</td><td>食堂、社交、娱乐、教育、医疗</td></tr>
        <tr><td>工作 / 科研</td><td class="num">15 m²/人</td><td class="num">18,750 m²</td><td>实验室、控制中心、办公、维修车间</td></tr>
        <tr><td>农业 / 食物生产</td><td class="num">25 m²/人</td><td class="num">31,250 m²</td><td>立体栽培按"栽培面"计，实际占地可小于此</td></tr>
        <tr><td>工业 / 仓储 / 物流</td><td class="num">10 m²/人</td><td class="num">12,500 m²</td><td>燃料厂、推进剂储存、备件库</td></tr>
        <tr><td>交通 / 结构 / 设备</td><td class="num">+15%</td><td class="num">≈ 15,400 m²</td><td>通道、竖井、机房、气闸、结构厚度</td></tr>
        <tr><td><b>合计（加压建筑面积）</b></td><td class="num">—</td><td class="num"><b>≈ 118,000 m²</b></td><td>约 118 m²/人；这是"能住得像个城市"的量级</td></tr>
      </table></div>
      <div class="callout c-warn"><span class="ct">这些数字不是标准答案</span>
      人均指标必须作为<b>假设</b>写进方案，并说明依据（类比国际空间站、极地科考站、邮轮、地面社区）。评委不会因为"你用了 20 m²"扣分，但会因为你<b>没有说明为什么是 20</b>而扣分。</div>
    ` },
    { h: '4.2 环带几何：面积怎么变成半径', html: `
      <p>旋转居住环最常用的形态是一个<b>环带</b>（像轮胎的内侧）：地板面积 ≈ 周长 × 环带宽度。</p>
      <div class="formula"><span class="lbl">环带可用地板面积</span>
A ≈ 2πR × W　　（R = 地板半径，W = 沿转轴方向的环带宽度）

例：R = 250 m，W = 40 m → A = 2 × 3.14 × 250 × 40 ≈ <b>62,800 m²</b>
若需要 118,000 m²，同宽度下 R ≈ 118000 / (2π × 40) ≈ <b>470 m</b>
若把 W 加到 75 m，则 R ≈ 250 m（但跨度、疏散、结构难度都上升）
      </div>
      <p>这就是"尺度—形状—代价"的第一处耦合：<b>面积不变时，环越宽半径越小，但宽环的跨度、采光、疏散距离、结构质量都会变差</b>。常见做法是把不同功能拆到<b>不同半径的多个环/筒</b>，而不是硬塞进一个巨环。</p>
      <div class="callout c-key"><span class="ct">体积也要算</span>
      层高按 3.5 m 估，118,000 m² 对应约 <b>41 万 m³</b> 加压体积，空气约 <b>500 吨</b>。加压体积决定了：空气储备与泄漏补给量、火灾荷载与灭火介质、壳体结构质量、热容与空调负荷。<b>体积越大，生保与结构代价越高</b>——所以"少而精的空间"比"大而空的城"更经济。</div>
    ` },
    { h: '4.3 分区四原则', html: `
      <div class="grid-2">
        <div class="obj"><span class="k">原则一 · 重力分层</span><div class="v">需要 0.8 g 的（居住、医疗、锻炼）放外圈；不怕微重力的（对接、大件装配）放轴心；农业按作物适应性放中间层。</div></div>
        <div class="obj"><span class="k">原则二 · 洁污分离</span><div class="v">"洁净流"（食品、药品、洁净实验）与"污染流"（废物、污水、工业废气）不走同一条通道，避免交叉污染。</div></div>
        <div class="obj"><span class="k">原则三 · 危险隔离</span><div class="v">聚变堆、推进剂（LOX/LH₂）、燃料厂、气闸、航天器加注区必须与居住区<b>物理隔离 + 缓冲段</b>，并能在事故时独立切断。</div></div>
        <div class="obj"><span class="k">原则四 · 流线最短</span><div class="v">人、物、气、水、信息五条流线尽量短且不交叉。农业↔生保↔废物三者应相邻，因为它们的物质流最密。</div></div>
      </div>
      <p>把四个原则叠在一起，你会得到一个"<b>剖面图</b>"而不是"平面图"：在旋转城市里，<b>半径方向就是最重要的分区轴</b>；在星球基地里，分区轴是<b>水平距离 + 埋深</b>。</p>
    ` },
    { h: '4.4 分段：把"环境不同"变成"体量不同"', html: `
      <p>一个基地里，往往有 2–3 个体量处在<b>完全不同的环境</b>：表面（真空或低压、温差大、辐射强）、地下或冰内（屏蔽好、温度稳、没有光）、水下或轨道（外压或失重）。<b>分段的依据不是"功能"，而是"环境"</b>——每一个体量对应一套受力逻辑、屏蔽逻辑、温控逻辑。把环境相同的功能塞在一起，就是省事；把环境不同的功能硬凑在一起，就是自找麻烦。</p>
      {{#if icy}}
      <p>以冰下城市为例，常见的三段划分不是随便分的，而是<b>每一段对应一种环境</b>：</p>
      <div class="table-wrap"><table>
        <tr><th style="width:24%">段落</th><th style="width:22%">环境</th><th>为什么必须在这儿</th></tr>
        <tr><td><b>表面太空港</b></td><td>真空、{{tMin}} ℃ 量级、{{radDayShow}}、{{gNat}} g</td><td>飞船只能从外面来；必须紧邻竖井，货物一进井就进入屏蔽区。表面停留时间要用剂量倒算</td></tr>
        <tr><td><b>冰内通道（干井）</b></td><td>固体冰、约 {{pOut}} MPa 静压、天然屏蔽、<b>不增压</b></td><td>作为垂直主通道与工业/服务干管。不增压可同时避开"承压"与"冰蠕变闭腔"两个难题</td></tr>
        <tr><td><b>冰下旋转环</b></td><td>液态水、外压、无自然光、{{gTarget}} g（人工）</td><td>只有浸在水里，才有可能"悬浮"一个大直径环；水同时提供浮力、散热与屏蔽</td></tr>
      </table></div>
      {{/if}}
      {{#unless icy}}
      <div class="table-wrap"><table>
        <tr><th style="width:24%">段落</th><th style="width:24%">环境特征</th><th>为什么必须在这儿</th></tr>
        <tr><td><b>表面港 / 进出港</b></td><td>真空或低压、温差最大、辐射最高</td><td>飞船只能停在外表面；这里是全城唯一"对外接口"，必须与居住区用气闸 + 缓冲段隔开</td></tr>
        <tr><td><b>居住与公共区</b></td><td>有屏蔽、温度稳定、有光（人工）</td><td>用覆土/岩层/水体换屏蔽，把"每天都要待 20 小时"的空间放在最安全的位置</td></tr>
        <tr><td><b>工业与能源区</b></td><td>振动、噪声、热、危险介质</td><td>与居住区物理隔离 + 缓冲，事故时可独立切断；也方便把废热直接排到外部</td></tr>
        <tr><td><b>物流 / 中继枢纽</b></td><td>微重力或无遮挡</td><td>货物中转、通信中继、航天器维护放在这里，不占用宝贵的居住屏蔽体积</td></tr>
      </table></div>
      {{/unless}}
      <p><b>连接方式本身就是设计内容。</b>RFP 通常会要求"说清各体量之间怎么连"。竖向通道是人员、货物、管线的共同主脉；如果居住区是旋转的，环与静止段之间还需要<b>旋转接口</b>（在轴心取一个静止通道最省事）。每多一个穿越旋转面或压力边界的接口，就多一处泄漏、维护与失效风险——<b>接口数量是要被数出来的</b>，不是画上去就行。</p>
      <div class="callout c-key"><span class="ct">一条通用判据</span>
      画完分区图，逐个接口问三个问题：<b>它穿过了什么边界</b>（压力？旋转？洁净？辐射？）、<b>失效时怎么隔离</b>、<b>检修要不要停掉整段</b>。答不上来的接口，就是评委会追问的地方。</div>
    ` },
    { h: '4.5 图纸四要素：RFP 原话在查什么', html: `
      <p>RFP 通常要求每个主要封闭体量标注：<b>(i) 功能 (ii) 尺寸 [m] (iii) 旋转 / 静止 (iv) 增压 / 不增压</b>。这四项是"送分项"，但每年都有队伍漏。</p>
      <div class="table-wrap"><table>
        <tr><th style="width:18%">要素</th><th>合格做法</th><th style="width:26%">常见扣分</th></tr>
        <tr><td>功能</td><td>每个体量有名称 + 一句话用途，图例统一</td><td>只画形状不写用途</td></tr>
        <tr><td>尺寸 [m]</td><td>主尺寸 + 关键净空；单位统一为 m</td><td>写"很大""约 3 层楼"；用像素/比例尺代替数字</td></tr>
        <tr><td>旋转 / 静止</td><td>用不同填充或图标区分，并标转速</td><td>整张图看不出哪里转</td></tr>
        <tr><td>增压 / 不增压</td><td>用颜色/线型区分，标压力等级</td><td>把不增压区画成可居住</td></tr>
        <tr><td>连接</td><td>画出通道/竖井/气闸，说明人流物流走向</td><td>各体量"漂"在一起，没有连接件</td></tr>
      </table></div>
    ` }
  ],
  review: [
    '"合理性"首先看规模是否撑得住人口：1250 人需要十万平方米量级的加压面积。',
    '分区要能说出理由（重力、洁净、危险、流线），不能只说"我们这样布置比较好看"。',
    '剖面图往往比鸟瞰图更有说服力——评委想看的是"里面怎么组织"。'
  ],
  check: ['你们的加压面积是多少？怎么算出来的？', '危险设施离居住区多远？中间有什么隔离？', '每个人均指标的依据是什么？']
});

MODULES.push({
  id: 'build', no: '05', kicker: 'CONSTRUCTION', title: '建设次序：为什么不能先盖房子',
  minutes: 8,
  sub: '建造顺序不是施工组织问题，而是"依赖关系 + 早期收益 + 风险前置"的综合题。',
  oneLine: '先机器人勘察，再能源与生保，再首批居住（开始有人运营），然后工业、农业、港口，最后联调移交。',
  sections: [
    { h: '5.1 判断次序的三条硬逻辑', html: `
      <p>看到"建造顺序"题，不要凭感觉，用三条逻辑去推：</p>
      <ul>
        <li><b>依赖逻辑</b>：没有电 → 生保、热控、通信、照明全停；没有生保 → 人不能进；没有结构 → 设备没处放。<b>被依赖的必须先建</b>。</li>
        <li><b>早期运营逻辑</b>：RFP 通常要求"每一步都让一部分功能提前投用"。所以不是"全部建完再启用"，而是<b>每完成一段就能产生产出</b>（发电、制水、制氧、科研、加注）。</li>
        <li><b>风险前置逻辑</b>：最不确定的事要最早验证（冰层结构、开挖可行性、辐射环境），否则后期返工代价最大。<b>机器人先遣就是在做这件事</b>。</li>
      </ul>
      <div class="callout c-warn"><span class="ct">为什么"先建太空港/先让环转起来"是错的</span>
      港口没有货物可运（还没建成），环没有内部结构就旋转只会带来动平衡与密封风险；而能源与生保是<b>所有后续步骤的前提</b>。顺序错了，后面的每一步都缺少支撑。</div>
    ` },
    { h: '5.2 通用七步模板（可按 RFP 调整）', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:8%">步</th><th style="width:26%">做什么</th><th style="width:26%">交付的能力</th><th>关键理由</th></tr>
        <tr><td class="num">1</td><td>机器人先遣：勘察、钻探、开挖竖井与冰内空腔</td><td>场地数据 + 通道雏形</td><td>无人、无生命风险；先把最不确定的地质/冰层问题验证掉</td></tr>
        <tr><td class="num">2</td><td>能源与通信主干：聚变堆舱 + 储能 + 通信中继</td><td>电与信息</td><td>后续所有设备都要用电；通信是远程支持的前提</td></tr>
        <tr><td class="num">3</td><td>生保核心 + 首批居住舱</td><td>可容纳首批人员的密闭环境</td><td>从"无人"跨到"有人"，这是最关键的一次门槛跨越</td></tr>
        <tr><td class="num">4</td><td>工业/燃料厂（LOX + LH₂）</td><td>对外服务能力 + 收入</td><td>城市的"主业"提前投产，形成正循环</td></tr>
        <tr><td class="num">5</td><td>农业与废物处理闭环</td><td>食物自给 + 零排放能力</td><td>人口扩张的前提；同时把闭环补齐</td></tr>
        <tr><td class="num">6</td><td>表面港与物流：15 个泊位、仓库、加注维护</td><td>吞吐能力</td><td>货运量上来后才需要；位置在竖井旁，越早建越早形成通道</td></tr>
        <tr><td class="num">7</td><td>扩展、联调、验收、移交 IDSDO</td><td>全功能运营</td><td>RFP 明确要求"移交给 IDSDO 后续运营"</td></tr>
      </table></div>
      <figure>
        <svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="建设次序与早期运营能力曲线">
          <defs><marker id="bld-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#9AA6C4"></path></marker></defs>
          <line x1="40" y1="196" x2="650" y2="196" stroke="#C9D1E4" stroke-width="1"></line>
          <g font-size="10.5" fill="#111729" text-anchor="middle">
            <rect x="44" y="140" width="78" height="40" rx="6" fill="#EDF1FE" stroke="#B9C8F2"></rect>
            <text x="83" y="156">机器人</text><text x="83" y="170">先遣</text>
            <rect x="132" y="120" width="78" height="60" rx="6" fill="#EDF1FE" stroke="#B9C8F2"></rect>
            <text x="171" y="143">能源</text><text x="171" y="157">+通信</text>
            <rect x="220" y="100" width="78" height="80" rx="6" fill="#E8F7F7" stroke="#BEE3E3"></rect>
            <text x="259" y="130">生保</text><text x="259" y="144">+首批居住</text>
            <rect x="308" y="88" width="78" height="92" rx="6" fill="#E9F7F0" stroke="#C6E8D8"></rect>
            <text x="347" y="124">工业</text><text x="347" y="138">燃料厂</text>
            <rect x="396" y="80" width="78" height="100" rx="6" fill="#E9F7F0" stroke="#C6E8D8"></rect>
            <text x="435" y="122">农业</text><text x="435" y="136">+废物</text>
            <rect x="484" y="76" width="78" height="104" rx="6" fill="#FDF4E4" stroke="#F0DDB8"></rect>
            <text x="523" y="120">表面港</text><text x="523" y="134">物流</text>
            <rect x="572" y="72" width="72" height="108" rx="6" fill="#F1EFFD" stroke="#DCD4FA"></rect>
            <text x="608" y="118">联调</text><text x="608" y="132">移交</text>
          </g>
          <g stroke="#9AA6C4" stroke-width="1.4" marker-end="url(#bld-ar)">
            <line x1="122" y1="160" x2="130" y2="160"></line>
            <line x1="210" y1="150" x2="218" y2="150"></line>
            <line x1="298" y1="140" x2="306" y2="140"></line>
            <line x1="386" y1="135" x2="394" y2="135"></line>
            <line x1="474" y1="130" x2="482" y2="130"></line>
            <line x1="562" y1="126" x2="570" y2="126"></line>
          </g>
          <path d="M44 190 L171 170 L259 140 L347 112 L435 92 L523 80 L644 72" fill="none" stroke="#2F5BEA" stroke-width="2" stroke-dasharray="5 4"></path>
          <text x="646" y="60" font-size="10.5" fill="#2F5BEA" text-anchor="end">累计可运营能力（每一步都要"能干活"）</text>
          <text x="40" y="220" font-size="10.5" fill="#6B7488">时间 →</text>
          <text x="44" y="236" font-size="10.5" fill="#6B7488">原则：能源先行 · 早期运营 · 风险前置 · 每步可独立失败</text>
        </svg>
        <figcaption>图 5-1　七步建造与"累计可运营能力"曲线：好的次序让曲线尽早抬起来。</figcaption>
      </figure>
    ` },
    { h: '5.3 每一步都要回答四个问题', html: `
      <div class="grid-2">
        <div class="obj"><span class="k">① 交付什么能力</span><div class="v">不是"完成某舱段结构"，而是"可供 N 人居住 / 可产 X 吨氧 / 可加注 Y 艘船"。</div></div>
        <div class="obj"><span class="k">② 谁来干</span><div class="v">机器人 / 远程 / 现场人员？在强辐射或冰下场景，前 3 步通常必须无人。</div></div>
        <div class="obj"><span class="k">③ 花多少钱、多久</span><div class="v">要能和甘特图、成本表对上；RFP 明确要求"预算与运营理由"。</div></div>
        <div class="obj"><span class="k">④ 失败了怎么办</span><div class="v">哪一步可以重来？哪一步失败会导致整体延期？这就是关键路径。</div></div>
      </div>
      <div class="callout c-eval"><span class="ct">评审视角</span>
      RFP 要"至少 6 步 + 预算 + 运营理由"，并特别强调"<b>说明每一步如何让一部分设施提前投入运营</b>"。如果你画了 8 个方框，却没有任何一步产生可用能力，评分点等于没答。</div>
    ` },
    { h: '5.4 与甘特图、成本表的接口', html: `
      <p>建造次序是<b>逻辑</b>，甘特图是<b>时间</b>，成本表是<b>钱</b>。三者必须一一对应：7 个步骤 → 7 组任务条 → 7 组分年度费用。常见错误是次序图画了 7 步，甘特图只有 4 条，成本表又按 3 个阶段分摊——评委会直接判"不一致"。</p>
      <p>另外记住两个进度常识：<b>关键路径</b>上任何延误都会整体延期；<b>并行化</b>（长周期设备提前采购、设计与建造准备重叠）是最有效的压缩手段，但会提高前期投入与返工风险。</p>
    ` }
  ],
  review: [
    '每一步都要有"可交付能力"，不是"完成结构"。',
    '机器人先行不是炫技：辐射、低温、真空、无光照的环境下人根本干不了。',
    '建造顺序、甘特图、成本表三段必须同构。'
  ],
  check: ['为什么能源必须排在居住之前？', '哪一步失败会让整个项目延期最久？', '每一步分别让"什么"提前投用？']
});

MODULES.push({
  id: 'airwater', no: '06', kicker: 'LIFE SUPPORT', title: '生命保障 I：空气与水怎么循环',
  minutes: 11,
  sub: '看懂流程图比背反应式重要：物质从哪来、经过什么、回到哪去、损失多少。',
  oneLine: '空气靠"CO₂ 还原 + 水电解 + 生物补充"，水靠"收集—净化—回用"，所有环节都要标回收率和损失。',
  sections: [
    { h: '6.1 闭环系统的四个指标', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:22%">指标</th><th>含义</th><th style="width:34%">为什么评委会问</th></tr>
        <tr><td><b>回收率</b></td><td>某物质被回收再利用的比例（质量口径）</td><td>RFP 直接给了 ≥90% 的水回收、≥90% 的氧再生，这是硬指标</td></tr>
        <tr><td><b>闭环度</b></td><td>系统总质量中可自给的比例</td><td>决定每年要从地球/其他城市补给多少吨</td></tr>
        <tr><td><b>比质量</b></td><td>每人每天需要的补给 kg/(人·天)</td><td>乘人口乘天数 = 补给飞船需求，直接进成本表</td></tr>
        <tr><td><b>缓冲储量</b></td><td>关键物质能撑多少天</td><td>与"最低功率运行 90 天"是同一类问题：故障时的生存窗口</td></tr>
      </table></div>
      <p>画流程图时，<b>每一条箭头都要有物质名称和量</b>。没有量的流程图只是"示意图"，评委会认为你没做过质量平衡。</p>
    ` },
    { h: '6.2 空气：一个人每天要消耗什么', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:34%">项目</th><th class="num" style="width:20%">每人每天</th><th>说明</th></tr>
        <tr><td>耗氧 O₂</td><td class="num">≈ 0.84 kg</td><td>与活动强度有关，运动日更高</td></tr>
        <tr><td>产生 CO₂</td><td class="num">≈ 1.0 kg</td><td>呼吸商 RQ ≈ 0.85–0.9</td></tr>
        <tr><td>饮水 + 食品制备水</td><td class="num">≈ 3–4 L</td><td>卫生用水另计（太空站通常严格限水）</td></tr>
        <tr><td>代谢产热</td><td class="num">≈ 100–120 W</td><td>1000 人 ≈ 0.1 MW，别忘进热负荷</td></tr>
      </table></div>
      <p>1000 人 → 每天约 <b>840 kg O₂</b>、<b>1 吨 CO₂</b>。这个量级决定了设备规模：靠高压瓶存氧是不可能的（一天就要 840 kg，一年 300 吨），<b>必须在线再生</b>。</p>
    ` },
    { h: '6.3 三条产氧路线，各有各的用途', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:17%">路线</th><th style="width:30%">原理</th><th style="width:24%">优点 / 缺点</th><th>适合放在哪</th></tr>
        <tr><td><b>水电解</b></td><td>2H₂O → 2H₂ + O₂（用电）</td><td>成熟、可控、产氧纯度高；但极耗电（每 kg O₂ 约 12–15 MJ）</td><td>主力产氧，与电力系统绑定</td></tr>
        <tr><td><b>Sabatier 反应</b></td><td>CO₂ + 4H₂ → CH₄ + 2H₂O（再把水电解）</td><td>把 CO₂ 变回水和氧，闭环关键；但<b>消耗氢、副产甲烷</b></td><td>CO₂ 还原段，接在电解之前</td></tr>
        <tr><td><b>生物（藻类/光合）</b></td><td>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</td><td>同时产氧和食物，心理友好；但体积大、光照耗电、受温度与污染影响</td><td>补充产能 + 食物系统的一部分</td></tr>
        <tr><td><b>氧烛（氯酸盐）</b></td><td>加热分解快速放氧</td><td>不耗电、瞬时大流量；一次性、放热、不可持续</td><td>应急（火灾/失压/断电后的首小时）</td></tr>
      </table></div>
      <div class="callout c-key"><span class="ct">为什么 RFP 说"不能相加"</span>
      若 RFP 写明（历年措辞相近）："机械环路再生 ≥90% 的氧，藻类/光合反应器<b>额外</b>提供至少 30% 的总氧需求，作为补充余量；<b>combined capacity exceeds 100%，但数值不可相加，以避免重复计算</b>。"<br>
      原因：藻类吃的 CO₂ 和机械环吃的是同一个 CO₂ 池，产的 O₂ 也进同一个舱内气氛。<b>它们是"同一批原子的两条路径"，不是两台并联的机器</b>。你在方案里写"90% + 30% = 120%"，评委会认为你没理解系统。</div>
    ` },
    { h: '6.4 一张合格的空气流程图长什么样', html: `
      <div class="flow">
        <div class="node"><b>舱内大气</b>CO₂ 1.0 kg/人·天</div><span class="arw">→</span>
        <div class="node"><b>CO₂ 浓缩</b>分子筛 / 胺洗</div><span class="arw">→</span>
        <div class="node hot"><b>Sabatier</b>CO₂ + 4H₂ → CH₄ + 2H₂O</div><span class="arw">→</span>
        <div class="node"><b>水电解</b>2H₂O → 2H₂ + O₂</div><span class="arw">→</span>
        <div class="node out"><b>O₂ 回舱</b>≈ 840 kg/天</div>
      </div>
      <div class="flow">
        <div class="node"><b>藻类反应器</b>补 30% 氧需求</div><span class="arw">→</span>
        <div class="node out"><b>O₂ + 生物量</b>进大气 / 进食物链</div><span class="arw">→</span>
        <div class="node"><b>CH₄ 处理</b>热解 → C + 2H₂（回收氢）</div><span class="arw">→</span>
        <div class="node"><b>H₂ 回 Sabatier</b>闭合氢循环</div>
      </div>
      <p class="small">注意两处"隐藏考点"：① <b>氢平衡</b>——Sabatier 消耗 4 份 H₂、电解 2 份 H₂O 只回收 2 份 H₂，差额必须由额外电解水补，否则系统会"缺氢"；② <b>甲烷</b>是氢的漏点，直接排掉就等于持续丢氢，要闭环就得热解回收。</p>
      <div class="callout c-warn"><span class="ct">常见扣分</span>
      流程图上出现"<b>排气至舱外</b>"或"<b>排放至海洋</b>"的箭头。在零排放（zero discharge）框架下，任何向外部介质的排放都是违规；向舱外排气也必须核算质量损失并给出补偿方案。</div>
    ` },
    { h: '6.5 水：回收率 90% 意味着什么', html: `
      <p>水源有四类：<b>冷凝水</b>（呼吸、汗、厨房蒸汽）、<b>灰水</b>（洗涤、淋浴）、<b>尿液</b>（含尿素与盐）、<b>卫生/实验废水</b>。典型处理链：</p>
      <div class="flow">
        <div class="node"><b>收集</b>冷凝 / 灰水 / 尿</div><span class="arw">→</span>
        <div class="node"><b>预处理</b>过滤 + 杀菌</div><span class="arw">→</span>
        <div class="node"><b>主处理</b>反渗透 / 多效蒸发</div><span class="arw">→</span>
        <div class="node"><b>精处理</b>催化氧化 + 离子交换</div><span class="arw">→</span>
        <div class="node out"><b>回用</b>饮用 / 卫生 / 电解</div>
      </div>
      <div class="formula"><span class="lbl">回收率的算术（写进方案会比只写"90%"强得多）</span>
假设 1250 人 × 100 L/(人·天) = 125,000 L/天
回收率 90% → 回用 112,500 L/天，<b>损失 12,500 L/天（12.5 m³/天）</b>
一年损失 ≈ 4,563 m³ —— 这些必须由<b>就地取水（融冰）</b>或补给补上
      </div>
      <p>这一步决定了两个后续结论：<b>①</b> 每年要开采多少冰（或从地球运多少水）；<b>②</b> 处理系统的能耗（反渗透约 3–5 kWh/m³，蒸发法高一个量级），要进电力预算。</p>
      <div class="callout c-key"><span class="ct">在零排放场景，水的逻辑变了</span>
      这里最不缺的就是水（脚下是上百公里深的海洋）。所以 <b>90% 回收率不是为了省水，而是为了"零排放"合规</b>：不能把废水排进海洋，只能处理到可回用、或浓缩封存。方案里如果写"我们节约用水所以回收率 90%"，是把因果搞反了。</div>
    ` },
    { h: '6.6 生保系统怎么"自证合理"', html: `
      <ul>
        <li><b>物质平衡闭合</b>：输入（人、食物、补给）− 输出（废物、产品、损失）= 储存变化。算不平就说明有箭头被漏画。</li>
        <li><b>容量留余量</b>：关键设备按 N+1 冗余；峰值人口（1250）而不是常驻人口（1000）做设计。</li>
        <li><b>故障可降级</b>：任一子系统失效后，剩余系统能维持"最低生存模式"多少天？这要和 90 天应急储备对上。</li>
        <li><b>与其它系统接口</b>：生保吃电（电解、泵、风机）、吃热（温控）、产废物（浓盐水、废树脂），这些都要在系统架构图上画出来。</li>
      </ul>
    ` }
  ],
  review: [
    '生保章节的评分核心是"流程图 + 回收率 + 质量平衡"，不是文字描述。',
    '三个子系统（大气/水/废物）必须都有图，且相互之间有接口。',
    '"≥90%"是下限不是目标；写 95% 就要给出多出来的能耗与设备代价。'
  ],
  check: ['1000 人每天需要多少氧气？靠什么产？', 'Sabatier 的氢从哪来？甲烷去哪了？', '水回收率 90% 时，每天要补多少水？从哪来？']
});

MODULES.push({
  id: 'foodwaste', no: '07', kicker: 'CLOSED LOOP', title: '生命保障 II：废物、食物与闭环核算',
  minutes: 9,
  sub: '"零排放"不是一句口号，它是一条条必须有着落的物质流。',
  oneLine: '废物要么变成资源（基质、建材），要么被封存返运；食物自给率由面积与能量决定，而能量又回到电力预算。',
  sections: [
    { h: '7.1 废物：三类、四条出路', html: `
      <div class="table-wrap"><table>
        <tr><th style="width:16%">类别</th><th style="width:28%">来源</th><th>可行去向</th></tr>
        <tr><td>有机固废</td><td>厨余、植物残渣、粪便固形物</td><td>厌氧消化 / 堆肥 → <b>农业基质</b> + 沼气（可发电/供热）</td></tr>
        <tr><td>纸/塑料/纺织</td><td>包装、耗材、衣物</td><td>清洗再生 / 热解 / 粉碎后 3D 打印原料 / 压缩封存</td></tr>
        <tr><td>金属/电子</td><td>备件、设备报废</td><td>拆解回收贵金属；剩余部分作为结构配重或封存</td></tr>
        <tr><td>液体废物</td><td>尿液、灰水、废液</td><td>水回收后的<b>浓盐水</b>：提盐 / 电解制氯 / 封存（绝不排海）</td></tr>
        <tr><td>气体废物</td><td>CO₂、微量 VOC、CH₄</td><td>进 CO₂ 还原链；VOC 催化氧化；CH₄ 热解回收氢</td></tr>
      </table></div>
      <p>RFP 给的三条出路是：<b>农业基质 / 建材原料 / 封存待返运</b>。你可以在三条里分配比例，但必须<b>每一条都有量</b>，并且加起来等于产生量——这就是"零排放"的证据。</p>
      <div class="callout c-warn"><span class="ct">最容易被抓的漏洞</span>
      "固体废物经处理后作为建材"——处理需要能量、需要设备、产物需要用途。如果建材用量远小于废物产量，多出来的部分去哪了？没有答案，就是没有闭环。</div>
    ` },
    { h: '7.2 食物：自给率的三个约束', html: `
      <p>"largely self-sufficient in food" 是隐含要求，落地要回答三件事：</p>
      <div class="grid-3">
        <div class="obj"><span class="k">热量</span><div class="v">约 2,500 kcal/人·天 → 1250 人 ≈ 3.1 Gcal/天。谷物、薯类、油脂是热量主力。</div></div>
        <div class="obj"><span class="k">营养结构</span><div class="v">蛋白质（含必需氨基酸）、维生素、膳食纤维。微藻提供蛋白与部分脂类，但不能替代全部。</div></div>
        <div class="obj"><span class="k">面积与能量</span><div class="v">立体栽培靠 LED，照明功率约 100–200 W/m² 栽培面——这是全城最大的用电项之一。</div></div>
      </div>
      <div class="table-wrap"><table>
        <tr><th style="width:20%">路线</th><th style="width:24%">产出效率</th><th>优点 / 限制</th></tr>
        <tr><td>立体（垂直）栽培</td><td>叶菜 2–4 kg/m²·月；谷物更低</td><td>品种可控、心理价值高；<b>能耗高</b>、对温湿度与病虫害敏感</td></tr>
        <tr><td>微藻（小球藻等）</td><td>干重 20–30 g/m²·天</td><td>蛋白含量高、占地小、可接 CO₂；口感单一、需要采收设备</td></tr>
        <tr><td>合成/发酵食品</td><td>单位体积产出高</td><td>可补特定营养（蛋白、油脂）；依赖原料与生物反应器</td></tr>
        <tr><td>昆虫/细胞培养</td><td>蛋白转化率高</td><td>心理接受度是问题；适合做饲料或加工品</td></tr>
      </table></div>
      <div class="formula"><span class="lbl">算一遍就知道规模</span>
假设每人 30 m² 栽培面（混合叶菜/谷物/微藻）
1250 人 → 37,500 m² 栽培面
照明 150 W/m² → 5,600 kW ≈ <b>5.6 MW</b> 仅用于种菜照明
（还没算空调、水泵、采收、冷藏）
      </div>
      <p>所以"农业"不是软性章节：<b>它同时是面积大户、用电大户、水耗大户、废物产生大户</b>。这也解释了为什么很多方案把农业单独放一个 0.3–0.4 g 的环——为了在结构、重心、物流上解耦。</p>
    ` },
    { h: '7.3 闭环核算表：一张表证明你懂系统', html: `
      <p>建议在方案里放一张"物质流平衡表"，行是物质，列是"产生—处理—去向—损失"。评委看到这张表，基本就认可你做过系统核算。</p>
      <div class="table-wrap"><table>
        <tr><th>物质</th><th class="num">日产生</th><th>处理</th><th>去向</th><th class="num">日损失</th></tr>
        <tr><td>CO₂</td><td class="num">1,000 kg</td><td>Sabatier + 藻类</td><td>CH₄ / 生物量 / O₂</td><td class="num">≈0</td></tr>
        <tr><td>废水</td><td class="num">125 m³</td><td>多级回收</td><td>回用 112.5 m³</td><td class="num">12.5 m³</td></tr>
        <tr><td>有机固废</td><td class="num">≈250 kg</td><td>厌氧消化</td><td>基质 150 kg + 沼气</td><td class="num">≈20 kg（封存）</td></tr>
        <tr><td>塑料/纸</td><td class="num">≈120 kg</td><td>清洗/热解</td><td>原料 90 kg</td><td class="num">≈30 kg（封存）</td></tr>
        <tr><td>CH₄</td><td class="num">≈364 kg</td><td>热解</td><td>C（建材）+ H₂（回用）</td><td class="num">≈0</td></tr>
      </table></div>
      <p class="small">以上为教学示意数量级，实际数值请按你们的人口、饮食结构和工艺效率重算。</p>
    ` },
    { h: '7.4 一个高级但好用的概念：比质量（kg/人·天）', html: `
      <p>把所有需要从外部运进来的东西加起来，除以人口和天数，就是<b>比质量</b>。它是最能体现"经济性"的单一指标：比质量 0.5 kg/(人·天) 的城市，和 5 kg/(人·天) 的城市，补给飞船数量差 10 倍，成本差一个量级。</p>
      <p>在方案里给出"闭环度 X%，比质量 Y kg/(人·天)，年补给 Z 吨"，比写十句"我们非常环保"都有说服力。</p>
    ` }
  ],
  review: [
    '"零排放"要有物质流证据：每条废物都有量、有去向、有最终形态。',
    '食物自给要给出热量/蛋白/面积/电耗四个数，缺一个就不成立。',
    '农业与能源、水、废物四个系统是耦合的，单独写会露出破绽。'
  ],
  check: ['你们的废物最终以什么形态留在城内或运走？', '食物自给率是多少？剩下靠什么补？', '种菜要多少电？这笔电算进电力预算了吗？']
});
