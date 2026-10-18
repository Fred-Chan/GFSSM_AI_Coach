# 交互配图（Anatomy）

站点里两张可操作的等距配图，用 [Anatomy](https://github.com/wheresryan22/anatomy) 的 kit 构建。纯 SVG + 原生 JS，无外部依赖，离线版（直接打开 `index.html`）同样可用。

| 图 | 位置 | 讲什么 | 交互 |
| --- | --- | --- | --- |
| 图 3-3 人工重力试验台 | 模块 03 · 3.5 之后 | `a = ω²R`、半径-转速-舒适度的取舍 | 拖旋钮改目标 g，拖曲柄改半径 R；↑↓←→ 键同样可用 |
| 图 6-1 闭环生保试验台 | 模块 06 · 6.4 之后 | Sabatier 的氢平衡、甲烷热解闭合氢循环 | 点击阀门 / 空格切换热解；氢收支、补氢浮子、O₂ 读数联动 |

## 文件

- `build-gravity.mjs` / `build-life.mjs`：构建脚本（Node.js 20+）。
- `vendor/iso-kit.mjs`：Anatomy kit 的 ESM 版本，MIT，来源 `github.com/wheresryan22/anatomy`。为了构建可离线复现而随仓库保留。
- `iso.css`：kit 自带样式；`theme.css`：本站的蓝灰纸面主题（色板与站点一致）。
- `gravity.js` / `life.js`：生成给站点按需加载的脚本（内含 kit + SVG + 交互逻辑），站点通过 `data-figure` 懒加载。
- `gravity.html` / `life.html`：独立预览页，方便单独查看/调试。
- `shots/`：验收截图，已加入 `.gitignore`。

## 重建

```bash
node figures/build-gravity.mjs
node figures/build-life.mjs
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

## 与站点的连接

`data-learn-a.js` / `data-learn-b.js` 里放 `<div class="anatomy-slot" data-figure="gravity|life"></div>`；`app.js` 的 `mountFigures()` 在路由渲染后按需加载 `figures/<name>.js`，把 `html` 注入槽位并调用 `init()`。样式在 `styles.css` 的 `.anatomy-slot` 一段。

## 许可

Anatomy kit：MIT（`github.com/wheresryan22/anatomy`）。本页两张图的几何、文案与本站主题为本项目产物。
