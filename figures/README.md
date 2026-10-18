# 交互配图与图表（Anatomy + Pele）

站点里有两类可视化，全部输出为静态 SVG，离线版（直接打开 `index.html`）同样可用：

- **两套可操作的等距配图**：用 [Anatomy](https://github.com/wheresryan22/anatomy) 的 kit 构建，纯 SVG + 原生 JS，无外部依赖。
- **19 张 Mermaid 图表**：用 [Pele](https://pele.run) 在构建时渲染成静态 SVG，运行时只按需加载注册表。

| 图 | 位置 | 讲什么 | 交互 |
| --- | --- | --- | --- |
| 图 3-4 人工重力试验台 | 模块 03 · 3.5 之后 | `a = ω²R`、半径-转速-舒适度的取舍 | 拖旋钮改目标 g，拖曲柄改半径 R；↑↓←→ 键同样可用 |
| 图 6-2 闭环生保试验台 | 模块 06 · 6.4 之后 | Sabatier 的氢平衡、甲烷热解闭合氢循环 | 点击阀门 / 空格切换热解；氢收支、补氢浮子、O₂ 读数联动 |

## 文件

- `build-gravity.mjs` / `build-life.mjs`：两张 Anatomy 配图的构建脚本（Node.js 20+）。
- `diagrams.mjs`：19 张 Mermaid 图表的源与构建脚本；`diagrams.js`：生成给站点按需加载的注册表。
- `package.json` / `package-lock.json`：仅构建用，固定 `pele@1.6.0`；`node_modules/` 已忽略。
- `vendor/iso-kit.mjs`：Anatomy kit 的 ESM 版本，MIT，来源 `github.com/wheresryan22/anatomy`。为了构建可离线复现而随仓库保留。
- `iso.css`：kit 自带样式；`theme.css`：本站的蓝灰纸面主题（色板与站点一致）。
- `gravity.js` / `life.js`：生成给站点按需加载的脚本（内含 kit + SVG + 交互逻辑），站点通过 `data-figure` 懒加载。
- `gravity.html` / `life.html`：独立预览页，方便单独查看/调试。
- `shots/`：验收截图，已加入 `.gitignore`。

## 重建

```bash
npm install --prefix figures     # 只装构建依赖 pele@1.6.0
node figures/build-gravity.mjs
node figures/build-life.mjs
node figures/diagrams.mjs
```

构建后检查：直接打开两张独立页面，或按需用 Anatomy skill 的 `scripts/capture.mjs` 截图。

```bash
open figures/gravity.html
open figures/life.html
```

## 数字模型

**人工重力**：`n = 9.5493 × √(g / R)`，`R` 取 120–260 m，`g` 取 0.40–1.00 g；转速表红线为 2 rpm 舒适上限。右下角读数、转速表、试块压缩量都从同一个 `ω = √(g/R)` 模型来。

**生保**：按 1000 人、O₂ 0.84 kg/(人·天)、CO₂ 1.0 kg/(人·天) 计算：

- Sabatier：CO₂ + 4H₂ → CH₄ + 2H₂O；耗 H₂ 183 kg/天，产 CH₄ 364 kg/天。
- 电解 945.7 kg 水 → 840 kg O₂ + 105.7 kg H₂。
- 不热解甲烷：缺 H₂ 77.5 kg/天，取 **−78**。
- 热解 364 kg CH₄ → C + 2H₂，回收 91.7 kg H₂；净收支 **+14 kg/天**。

## 图表清单

| 位置 | 图 | 类型 |
| --- | --- | --- |
| 00 开始 | 图 0-1 三遍学习路线 | timeline |
| 01 项目 | 图 1-1 提案骨架 | mindmap |
| 02 环境 | 图 2-1 环境维度 → 设计动作 | mindmap |
| 03 人工重力 | 图 3-2 R–rpm 设计空间 | xychart |
| 04 尺度分区 | 图 4-1 1250 人面积预算 | pie |
| 06 生保 I | 图 6-1 空气主循环 | flowchart |
| 06 生保 I | 图 6-3 水回收链 | flowchart |
| 07 生保 II | 图 7-1 废物闭环 | mindmap |
| 08 人居 | 图 8-1 四个压力源 | mindmap |
| 09 基础设施 | 图 9-1 三条流线 | mindmap |
| 09 基础设施 | 图 9-2 六类接口 | mindmap |
| 10 能源 | 图 10-1 分类负荷 | pie |
| 10 能源 | 图 10-2 90 天储能载体 | quadrant |
| 11 进度成本 | 图 11-1 54 个月进度 | gantt |
| 11 进度成本 | 图 11-2 示例成本结构 | pie |
| 11 进度成本 | 图 11-3 A/B/C 方案取舍 | quadrant |
| 12 评审 | 图 12-1 四准则与证据 | mindmap |
| 12 评审 | 图 12-2 30 页页面预算 | pie |
| RFP 工具 | 图 R-1 RFP 分析流程 | flowchart |

每张图在构建时分别渲染 **wide（680 px）** 与 **narrow（360 px）** 两个版本；`mountDiagrams()` 按 `matchMedia(max-width: 560px)` 选择，并在窗口尺寸变化时切换。

## 与站点的连接

- Anatomy：`data-learn-a/b.js` 里放 `<div class="anatomy-slot" data-figure="gravity|life"></div>`；`app.js` 的 `mountFigures()` 在路由渲染后按需加载 `figures/<name>.js`，把 `html` 注入槽位并调用 `init()`。样式在 `styles.css` 的 `.anatomy-slot` 一段。
- Pele：内容里放 `<div class="pele-fig" data-diagram="<key>"></div>` + `<p class="pele-cap">图 …</p>`；`app.js` 的 `mountDiagrams()` 首次遇到图表时加载 `figures/diagrams.js`，之后按 key 注入 SVG。样式在 `.pele-fig` / `.pele-cap`。

## 许可

Anatomy kit：MIT（`github.com/wheresryan22/anatomy`）。Pele：MIT（`github.com/obsidianmd/pele`）。本页的几何、Mermaid 源、文案与本站主题为本项目产物。
