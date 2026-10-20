# 协同开发规范（GFSSM AI Coach）

两人（或多人）直接往 `main` 推代码，**Vercel 会在每次 push 后自动发布到线上**
（<https://gfssm-ai.itccc.app>）。本规范的目的只有一个：**保证任何一方的更新都不会丢、不会被覆盖，且推上去就能正常发布。**

## 一、核心原则

1. **本地提交不会覆盖远程。** `git push` 只接受"快进"（fast-forward）。如果你本地落后于远程，push 会被直接拒绝并提示 `non-fast-forward`——这时同事的提交是安全的。
2. **唯一能覆盖远程的操作是 `git push --force`。** 仓库已在 GitHub 侧禁止 force push 和删除 `main` 分支，所以这条底线被强制守住了。
3. **推上去 = 立即上线。** 没有审核关卡。所以纪律是：**能跑通再推，不要推半成品。**

## 二、每天的标准动作

```bash
# 1. 开工前：拿同事的最新代码
git pull --rebase origin main

# 2. 开发，小步提交（一个主题一个 commit）
git add -A
git commit -m "说清楚这次改了什么"

# 3. 推之前：再拉一次，把同事这期间的新提交"摘"到自己前面
git pull --rebase origin main
#    有冲突就地解决：打开冲突文件 → 改成想要的样子 → git add 该文件 → git rebase --continue
#    想放弃这次 rebase：git rebase --abort（回到拉取前的状态，安全）

# 4. 推送，Vercel 自动发布（一般 10~30 秒）
git push origin main
```

> 本仓库已配置 `pull.rebase = true`，`git pull` 默认就是 rebase，历史保持线性，不会出现一堆 "Merge branch 'main' of ..." 的噪音提交。

## 三、绝对不要做的事

- ❌ `git push --force` / `git push -f`（会被 GitHub 拒绝；它也是唯一能真正抹掉同事提交的操作）
- ❌ `git reset --hard origin/main` 丢掉自己未提交的改动前不确认
- ❌ 跳过第 3 步直接 push（会被拒，白折腾一次）
- ❌ 在 Vercel 控制台手改文件或"用 CLI 覆盖部署"——所有变更必须走 Git，保证线上 = 仓库代码

## 四、文件分工建议（减少冲突）

项目已经把内容拆成模块，**优先改自己负责的数据文件，少动公共骨架：**

| 文件 | 内容 | 谁改 |
|---|---|---|
| `data-learn-a/b/c.js` | 知识模块正文 | 按模块分工 |
| `data-quiz.js` / `data-quiz-env.js` | 题库 | 按题目分工 |
| `data-env.js` | 环境档案与场景预设 | 一方负责 |
| `data-rfp.js` | RFP 示例数据 | 一方负责 |
| `index.html` | **整站结构骨架（导航 + 各页静态 HTML）** | ⚠️ 高频冲突源 |
| `app.js` / `styles.css` | 逻辑与样式 | ⚠️ 高频冲突源 |

**约定**：要改 `index.html` 的导航结构、增删页面区块，或改 `app.js` 的核心渲染逻辑前，先在群里说一声，避免两人同时动同一处。

## 五、需要"先自测再发布"时（可选）

当前是直推 main 即时发布。如果某次改动没把握，用分支 + Vercel 预览：

```bash
git checkout -b feature/新功能名
# 改完
git push origin feature/新功能名
# Vercel 会自动生成一个预览网址（形如 xxx-gfssm-ai-coach.vercel.app），自测通过后：
git checkout main
git merge feature/新功能名
git push origin main          # 这时才正式发布
```

分支推送**不会**影响线上，可以放心自测。日常小改仍然建议直推 main。

## 六、出问题怎么回滚

线上出问题时的最快恢复顺序：

1. **Vercel 控制台一键回滚**：Deployments → 选上一个好的部署 → ⋯ → Rollback。秒级生效，不动 Git。
2. **Git 回退**：`git revert <问题提交的sha>` 然后 push（留下可追溯记录）。
3. 永远不用 force push 来"撤销"——历史被改写后谁都说不清线上跑的是哪份代码。

## 七、常用检查命令

```bash
git status                    # 本地改了什么 / 是否落后远程
git log --oneline -5          # 最近 5 个提交
git fetch && git status       # 只看远程有没有新东西，不动本地
```
