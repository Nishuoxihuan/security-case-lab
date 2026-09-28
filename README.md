# 近五年攻防案例实验室（security-case-lab）

一个聚焦近五年真实安全事件与漏洞案例的中文攻防知识站：解释风险为什么发生、如何发现、
怎样修复，以及如何验证修复真的有效。

- 技术栈：Next.js 16 + TypeScript + Tailwind CSS v4，内容以 MDX 存于 Git，经 Zod 校验后静态生成，部署于 Vercel。
- 内容政策：防守导向，不提供针对未授权目标的攻击操作；选题、来源与审核规范见 `docs/`。

## 本地启动

```bash
git clone <repo-url>
cd security-case-lab
npm install
npm run dev
```

打开 http://localhost:3000。

常用命令：

| 命令                       | 说明                                            |
| -------------------------- | ----------------------------------------------- |
| `npm run dev`              | 本地开发                                        |
| `npm run build`            | 生产构建（构建前自动生成搜索索引）              |
| `npm run lint`             | ESLint 检查                                     |
| `npm run format:check`     | Prettier 格式检查                               |
| `npm run typecheck`        | TypeScript 类型检查                             |
| `npm run validate:content` | 内容校验（frontmatter、来源、章节、安全边界）   |
| `npm run validate:radar`   | 雷达候选校验                                    |
| `npm run build:search`     | 生成搜索索引 `data/generated/search-index.json` |
| `npm test`                 | Vitest 单元测试                                 |

## 内容提交与审核流程

1. 在 `content/cases/<攻击面>/<slug>.mdx` 新建案例（攻击面目录见 `content/cases/`）。
2. frontmatter 按三层填写：
   - **发布必填**（缺失则 CI 失败）：`id`、`slug`、`title`、`summary`、`status`、`firstDisclosedAt`、`lastReviewedAt`、`surfaces`、`tags`、`references`；
   - **推荐增强**（缺失仅 warning）：`patchedAt`、`kevAddedAt`、`vendor`、`products`、`affectedVersions`、`severity`、`cvss`、`cves`、`cwes`、`owasp`、`attack`、`aliases`、`relatedCases`、`featured`、`attackChain`；
   - **自动生成**（不要手填）：`readingTime`、`searchKeywords`、`windowEligible` 等由构建时计算。
3. 正文必须包含 11 个区块：三十秒结论、为什么值得研究、时间线、影响条件、攻击模型与信任边界、根因解析、检测与排查、修复与缓解、修复验证、关联知识、来源与变更记录。
4. 本地运行 `npm run validate:content` 通过后再提交 PR；main 分支受保护，所有修改走 PR。
5. 发布前对照检查表（`docs/editorial-policy.md`）：双来源（一级至少一条）、三个日期区分标注、无可武器化细节、标注不确定事实。

## 部署说明（Vercel）

1. 将仓库推送到 GitHub，`main` 为生产分支。
2. Vercel → Add New → Project，导入仓库，框架选 Next.js，保持默认构建命令。
3. 首期无数据库、无外部 API，无需配置环境变量（`NEXT_PUBLIC_SITE_URL` 可选，用于生成绝对 URL）。
4. PR 自动获得 Preview Deployment；合并到 `main` 自动上线生产环境。
5. 上线后：在 Google Search Console 与百度站长平台提交 sitemap（`/sitemap.xml`）。

## 目录速览

```text
app/(site)/        页面（首页、案例库、专题、路径、雷达、搜索…）
app/feed.xml/      RSS 输出
components/        展示组件（案例卡片、攻击链、检测面板…）
content/cases/     案例 MDX（按攻击面分子目录）
content/topics/    专题 MDX
content/paths/     学习路径 MDX
data/              radar-candidates.json、source-registry.json、generated/
lib/               内容读取、schema、搜索、筛选、时间窗口
scripts/           内容校验、搜索索引、雷达校验（tsx 运行）
docs/              编辑规范、来源规范、本地实验边界
```
