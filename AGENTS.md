# 专用高级组件库约束

本项目是专用的 React 高级组件库。所有公开能力必须保持领域无关、可组合且可迁移；可提供通用路由、布局、登录表单及抽象权限认证等高级组件，但不得包含业务页面、领域模型、接口或具体业务状态。

## 目录职责与依赖方向

- `src/components/`：基础组件与通用高级组件。
- `src/hooks/`：领域无关的通用 Hook。
- `src/lib/`：组件库共享工具与运行时辅助。
- `src/types/`：组件库公开类型。
- `src/layout/`：可组合的通用布局组件。
- `src/blocks/`：由组件与布局组成的通用界面区块；仅在具有明确通用性时保留。
- `src/index.ts`：组件库唯一的根导出入口。

组件、Hook、Layout、Block 与 `lib`、`types` 只能依赖其他组件库模块和第三方通用依赖，禁止导入或实现业务代码。通用路由、菜单、路由状态与权限认证可通过类型、配置、回调和适配接口对外提供，但不得绑定具体领域页面、接口或权限数据。Ant Design 原生组件必须直接从 `antd` 导入，图标必须从 `@ant-design/icons` 导入。

### 组件组合优先级（强制）

任何内部组件实现（包括组件、Layout、Block 与 JSX 包装）在选择既有组件时，必须严格依次检索并优先复用：项目 `src/components/`（LRI 已有组件）→ Ant Design Pro Components → Ant Design（`antd`）原生组件。仅当前一优先级不存在可满足需求的组件时，才可使用下一优先级；禁止绕过任一高优先级组件而直接选用低优先级组件，也禁止以低优先级组件重复实现高优先级已有能力。

## 依赖声明与宿主去重（强制）

本库以源码符号链接方式被宿主项目引用，第三方依赖只从本库 `node_modules` 解析，写入 `dependencies` 的运行时依赖不会被宿主解析。

- 所有第三方运行时依赖必须声明在 `peerDependencies`，由宿主提供实际实例；不得为运行时依赖写入 `dependencies`。
- `peerDependencies` 是宿主构建去重列表的唯一来源：宿主必须把其中全部包名写入构建配置的去重项（Vite 为 `resolve.dedupe`）。缺少任一条目时，构建产物会包含同一包的两份实现，React Context 与模块级单例无法跨实例共享。
- 该问题在 dev 下常被预打包掩盖（裸模块说明符被统一改写为同一 chunk），仅在构建产物中复现；宿主出现“dev 正常、构建异常”的组件行为差异时，应优先排查此项。
- 新增第三方运行时依赖时，必须同步更新 `peerDependencies`，并通知宿主补齐其去重列表。

## 工具与类型约束

- 新增或修改组件前，先检查 `src/lib/` 与 `src/types/` 是否已有可复用能力；存在时必须复用或完善，禁止在组件中重复实现。
- 可被两个及以上组件复用的领域无关工具、JSX 包装、状态归一化和交互拦截逻辑必须置于 `src/lib/`，并通过 `src/lib/index.ts` 导出。
- 所有非业务组件的 Props、数据项、请求参数与响应结构必须定义于 `src/types/`；组件实现文件不得内联对外类型。
- 公开类型、组件、Hook 与工具必须经所属目录的 `index.ts` 逐级导出；内部实现不得直接从根入口导出。
- 通用高级组件可以通过泛型、配置、回调或适配接口接收数据源、字段与渲染策略，但不得写死领域实体、接口地址、菜单结构、权限或业务流程。

## Ant Design 与样式约束

- 使用 Ant Design v6 API；编写或分析 antd 代码前，优先使用 antd MCP 工具查询当前 API、文档、示例、语义结构与 token。仅当 MCP 不支持时才使用项目内 `pnpm antd` CLI。
- 新增组件必须符合根目录 `DESIGN.md`。静态布局、颜色、间距、边框与状态样式使用语义化类名，并在对应 CSS 中通过 Tailwind CSS 的 `@apply` 组合；不得建立平行主题体系或硬编码主题色。`src/blocks/` 下的非示例组件不受此限制：除非样式必须依赖 class，否则将样式直接内置在组件中；无需为使用方覆盖样式提供扩展点，需调整时由使用方复制组件源码后自行修改。
- 基础展示组件优先复用 `src/components/`，其次使用 Ant Design 原生组件；文本展示优先使用 `Typography`。
- 对稳定 Props 下可跳过渲染的基础组件使用 `React.memo`；非平凡派生内容使用 `useMemo`；仅在需要稳定身份时使用 `useCallback`，且保持依赖数组完整。
- 不保留 shadcn 配置、源码、路径别名、依赖或兼容入口。

## 命名与导出

- `src` 下普通 TypeScript、TSX 与样式文件使用小驼峰；组件文件与导出组件使用 PascalCase。
- 目录使用小写 kebab-case；`index.ts` 等约定入口保持既有名称。
- 只在修改或新增文件时执行命名迁移，不批量改动无关文件。
- `src/lib`、`src/types`、`src/hooks` 与每个组件分类目录必须维护只导出公开模块的 `index.ts`；`src/components/index.ts` 聚合组件分类入口。

<!-- antd-cli setup start -->

## Ant Design Skill

编写或分析 Ant Design 代码前，使用 `.agents/skills/antd/SKILL.md`。该 skill 规定 antd MCP 工具优先级，以及可使用项目本地 `pnpm antd` CLI 的有限场景。

<!-- antd-cli setup end -->
