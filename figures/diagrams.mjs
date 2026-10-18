/* Build-time only: render this site's Mermaid diagrams to static SVG with Pele.
   Run: node figures/diagrams.mjs
   Requires figures/node_modules/pele (see figures/package.json). */
import { render } from "pele";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WIDE = 680;
const NARROW = 360;

/** @type {{key:string,title:string,source:string}[]} */
const diagrams = [
  {
    key: "start-route",
    title: "三遍学习路线",
    source: `timeline
  title 三遍学习路线
  第 1 遍 : 模块 01–03 : 项目 / 环境 / 重力 : 60–90 分钟
  第 2 遍 : 模块 04–07 : 尺度 / 建造 / 生保 : 90 分钟
  第 3 遍 : 模块 08–11 : 人居 / 基础设施 / 商业 : 60 分钟
  上手 : 上传 RFP : 拆交付物清单 : 组内分工`,
  },
  {
    key: "proposal-skeleton",
    title: "提案骨架",
    source: `mindmap
  root((提案骨架))
    Executive Summary
      人口 / 规模 / 运营
    结构与建造
      总体布局
      表面港
      建造顺序
    运营与维护
      电力
      生保
      农业
    人居
      居住
      心理
      应急
    基础设施
      机器人
      AI 与通信
      模块实验室
    进度与成本
      甘特图
      成本表
    提交与评审
      格式 / 页数
      四准则`,
  },
  {
    key: "env-to-design",
    title: "环境维度到设计动作",
    source: `mindmap
  root((环境档案))
    重力
      结构形式
      功能分区
    压力 / 大气
      壳体受拉 / 受压
      气闸与应急
    辐射
      屏蔽与埋深
      舱外作业时长
    温度 / 热
      热控与材料
      散热器面积
    物质 / 资源
      外壳与港口防护
      ISRU 与物流
    昼夜周期
      储能规模
      光照与节律
    通信时延
      自治等级
      治理结构`,
  },
  {
    key: "gravity-rpm",
    title: "半径与转速：0.8 g 的设计空间",
    source: `xychart-beta
  title "0.8 g：半径越大，转速越低"
  x-axis "地板半径 R (m)" [120, 140, 160, 180, 200, 220, 240, 260]
  y-axis "转速 n (rpm)" 0 --> 3
  line [2.44, 2.26, 2.12, 1.99, 1.89, 1.80, 1.73, 1.66]
  line [2, 2, 2, 2, 2, 2, 2, 2]`,
  },
  {
    key: "area-budget",
    title: "1250 人的面积预算",
    source: `pie title 1250 人 · 约 118,000 m² 加压面积
  "农业 / 食物" : 31250
  "居住" : 25000
  "工作 / 科研" : 18750
  "交通 / 结构" : 15400
  "公共 / 社区" : 15000
  "工业 / 仓储" : 12500`,
  },
  {
    key: "air-loop",
    title: "空气主循环与氢平衡",
    source: `flowchart TD
  A["舱内 CO₂<br/>1.0 kg/人·天"] --> B["CO₂ 浓缩"]
  B --> C["Sabatier 反应"]
  C -->|H₂O| D["水电解"]
  D -->|H₂| C
  D --> E["O₂ 回舱<br/>≈ 840 kg/天"]
  C -->|CH₄| F["CH₄ 热解"]
  F -->|H₂| G["H₂ 回 Sabatier"]
  G -->|H₂| C
  B --> H["藻类反应器<br/>补 30% 氧需求"]
  H --> I["O₂ + 生物量<br/>→ 食物链"]
  I --> E`,
  },
  {
    key: "water-loop",
    title: "水回收链与 90% 回收率",
    source: `flowchart TD
  A["冷凝水"] --> D["收集<br/>125 m³/天"]
  B["灰水"] --> D
  C["尿液"] --> D
  S["卫生 / 实验废水"] --> D
  D --> E["预处理<br/>过滤 + 杀菌"]
  E --> F["主处理<br/>反渗透 / 多效蒸发"]
  F --> G["精处理<br/>催化氧化 + 离子交换"]
  G --> H["回用<br/>112.5 m³/天"]
  H --> J["饮用 / 卫生 / 电解"]
  F --> I["浓盐水 / 损失<br/>12.5 m³/天"]
  I --> K["提盐 / 封存"]`,
  },
  {
    key: "waste-streams",
    title: "废物流的三条去向",
    source: `mindmap
  root((废物闭环))
    有机固废 250 kg/天
      厌氧消化
        农业基质 150
        沼气 电 / 热
      封存 20
    纸 / 塑料 120 kg/天
      清洗 / 热解
        再生原料 90
        封存 30
    液体废物 125 m³/天
      多级水回收
        回用 112.5
        浓盐水 12.5
      提盐 / 封存
    气体废物 CO₂ 1,000 kg/天
      Sabatier / 藻类
        O₂ / 生物量
      CH₄ 热解
        H₂ 回用`,
  },
  {
    key: "human-factors",
    title: "四个压力源与设计证据",
    source: `mindmap
  root((人居与人因))
    无自然光
      全光谱照明
      虚拟窗
      昼夜节律
    密闭与隔离
      隐私梯度
      社交催化剂
      35–52 min 时延
    低重力
      0.8 g 居住
      每日 1 h 锻炼
      医疗监测
    危险
      6 个独立舱段
      双向疏散
      72 h 避难
      L1–L4 分级`,
  },
  {
    key: "infra-flows",
    title: "人、物、信息三条流线",
    source: `mindmap
  root((三条流线))
    人
      同环 <500 m：步行 / 接驳
      跨重力层：电梯 / 轨道
      竖井：提升舱
    物
      大宗补给：专用管路
      固废 / 产品：封闭输送
    信息
      有线主干 + 无线覆盖
      深空链路 35–52 min
      自治优先 + 人监督`,
  },
  {
    key: "infra-interfaces",
    title: "基础设施的六类接口",
    source: `mindmap
  root((接口清单))
    电力
      母线电压
      孤岛切换
      关键负荷顺序
    热
      废热来源
      散热路径
      温度等级
    物质
      水 / 气 / 燃料
      阀门隔离
      泄漏检测
    人员
      气闸
      更衣 / 除尘
      加减压
    信息
      主干网
      无线
      深空链路
    机器
      对接标准
      充电 / 加注
      数据回传`,
  },
  {
    key: "power-load",
    title: "1250 人的示例负荷结构",
    source: `pie title 1250 人 · 示例分类负荷 (MW)
  "生保 7.5" : 7.5
  "农业照明 5.6" : 5.6
  "工业与燃料 5.0" : 5.0
  "居住与公共 2.5" : 2.5
  "科研 1.5" : 1.5
  "热控与泵阀 1.8" : 1.8`,
  },
  {
    key: "storage-quadrant",
    title: "90 天储能的载体选择",
    source: `quadrantChart
  title 90 天储能：能量密度 vs 适用时长
  x-axis 低能量密度 --> 高能量密度
  y-axis 短时 --> 长周期
  quadrant-1 长周期首选
  quadrant-2 需要大质量
  quadrant-3 秒级—分钟级
  quadrant-4 小时级调峰
  锂离子: [0.25, 0.25]
  飞轮: [0.05, 0.08]
  热储存: [0.2, 0.55]
  液氢液氧: [0.9, 0.85]
  聚变燃料 + 降功率: [0.98, 0.98]`,
  },
  {
    key: "gantt-54",
    title: "54 个月示例进度",
    source: `gantt
  title 54 个月示例进度（2030-06 → 2034-12）
  dateFormat YYYY-MM-DD
  axisFormat %Y-%m
  todayMarker off
  section 设计与准备
  设计与详细工程 :a1, 2030-06-01, 10M
  机器人先遣 / 场地准备 :a2, 2030-10-01, 8M
  section 建造
  能源 / 通信 / 生保核心 :b1, 2031-02-01, 16M
  居住环与主要舱段 :b2, 2031-10-01, 22M
  工业 / 农业 / 港口 :b3, 2032-10-01, 16M
  section 联调移交
  联调 / 验收 / 移交 :c1, 2034-06-01, 6M`,
  },
  {
    key: "cost-structure",
    title: "示例成本结构",
    source: `pie title 示例成本结构（比例示意）
  "结构材料与制造" : 30
  "运输与发射" : 18
  "设备 生保 / 能源 / 农业" : 22
  "人力" : 10
  "备件" : 5
  "不可预见费" : 15`,
  },
  {
    key: "tradeoff-quadrant",
    title: "A/B/C 方案的取舍",
    source: `quadrantChart
  title A/B/C 方案：初投资 vs 运行成本
  x-axis 低初投资 --> 高初投资
  y-axis 低运行成本 --> 高运行成本
  quadrant-1 高投入高运行
  quadrant-2 低投入高运行
  quadrant-3 低投入低运行
  quadrant-4 高投入低运行
  A 单一大环: [0.82, 0.62]
  B 居住环与农业环: [0.55, 0.25]
  C 全地下隧道: [0.22, 0.82]`,
  },
  {
    key: "review-criteria",
    title: "评审四准则与证据",
    source: `mindmap
  root((评审四准则))
    完整 Thoroughness
      逐条回应 RFP
      交付物齐全
      硬指标有证据
    合理 Rationality
      数字有来源
      假设有依据
      取舍有计算
    系统 Systematic
      跨章节一致
      接口闭合
      质量 / 能量平衡
    经济 Economy
      有权衡分析
      单位成本可校核
      运行可负担`,
  },
  {
    key: "page-budget",
    title: "30 页提案的页面预算",
    source: `pie title 30 页提案 · 页面预算
  "总体设计 5" : 5
  "表面港 / 建造 3" : 3
  "电力 / 生保 / 农业 4" : 4
  "人居 / 心理 / 应急 5" : 5
  "机器人 / AI / 实验室 5" : 5
  "进度 / 成本 / 权衡 3" : 3
  "风险 / 团队 / 参考 3" : 3
  "封面 / 目录 / 摘要 2" : 2`,
  },
  {
    key: "rfp-pipeline",
    title: "从 RFP 到可执行清单",
    source: `flowchart LR
  A["上传 / 粘贴 RFP"] --> B["本地解析<br/>PDF / DOCX / TXT"]
  B --> C["拆出四类信息<br/>章节 / 交付物 / 硬指标 / 数字"]
  C --> D["关联知识模块<br/>01–12"]
  D --> E["最小达标线<br/>评审视角 / 追问清单"]`,
  },
];

const out = {};
for (const d of diagrams) {
  try {
    const wide = render(d.source, {
      maxWidth: WIDE,
      fontSize: 14,
      padding: 12,
      idPrefix: `pele-${d.key}-w`,
      autoDirection: true,
      responsive: true,
    });
    const narrow = render(d.narrowSource || d.source, {
      maxWidth: NARROW,
      fontSize: 14,
      padding: 10,
      idPrefix: `pele-${d.key}-n`,
      autoDirection: true,
      responsive: true,
    });
    out[d.key] = {
      title: d.title,
      wide: wide.svg,
      narrow: narrow.svg,
      width: wide.width,
      height: wide.height,
      nwidth: narrow.width,
      nheight: narrow.height,
    };
    console.log(`${d.key.padEnd(20)} wide ${wide.width}x${wide.height}  narrow ${narrow.width}x${narrow.height}`);
  } catch (error) {
    console.error(`FAILED ${d.key}: ${error.message}`);
    process.exitCode = 1;
  }
}

writeFileSync(join(HERE, "diagrams.js"), `window.PELE_DIAGRAMS = ${JSON.stringify(out)};\n`);
console.log(`\nwrote ${Object.keys(out).length} diagrams -> figures/diagrams.js (${(JSON.stringify(out).length / 1024).toFixed(0)} kB)`);
