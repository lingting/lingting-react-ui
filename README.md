# lingting-react-ui

基于 React 19、Ant Design v6、Ant Design Pro Components、TanStack Router/Query 与 Tailwind CSS v4 构建的专用高级组件库。

## 定位

- 提供**领域无关、可组合、可迁移**的基础组件、高级组件、布局、Block、Hook、工具与类型。
- 高级组件通过泛型、配置、回调或适配接口接收数据源、字段、路由与权限规则，**不包含业务实体、接口地址或具体业务状态**。
- 通用路由、菜单、路由状态与权限认证以类型、配置和回调形式对外提供，不绑定具体领域页面。
- 唯一的根导出入口是 `src/index.ts`；各分类目录通过自身 `index.ts` 维护公开边界。

## 宿主接入

如果本库以**源码符号链接**方式被宿主项目引用，写入 `dependencies` 的运行时依赖不会被宿主解析，因此需要遵循以下两条强制约定。

### 1. 运行时依赖由宿主提供

所有第三方运行时依赖（`react`、`antd`、`@ant-design/pro-components`、`@tanstack/react-router`、`clsx`、`dayjs` 等）都声明在 `peerDependencies`，由宿主提供实际实例。不要把它们装进本库的 `dependencies`。

### 2. 宿主构建必须去重

`peerDependencies` 是宿主构建去重列表的**唯一来源**。宿主必须把其中全部包名写入构建配置的去重项（Vite 为 `resolve.dedupe`）：

```ts
// 宿主的 vite.config.ts
export default defineConfig({
  resolve: {
    dedupe: [
      "@ant-design/icons",
      "@ant-design/pro-components",
      "@marsidev/react-turnstile",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "@tanstack/react-store",
      "antd",
      "clsx",
      "dayjs",
      "react",
      "react-dom",
    ],
  },
});
```

缺少任一条目时，构建产物会包含同一包的两份实现，React Context 与模块级单例无法跨实例共享。该问题在 dev 下常被预打包掩盖，**仅在构建产物中复现**；宿主出现「dev 正常、构建异常」的组件行为差异时，应优先排查此项。

## 快速开始

```tsx
import { AppSidebarLayout, LoadingPage, NotFoundPage } from "lingting-react-ui";
import "lingting-react-ui/index.css";

const menuRoutes = [
  {
    path: "/dashboard",
    title: "仪表盘",
    component: () => import("./pages/Dashboard"),
  },
];

function App() {
  return (
    <AppSidebarLayout
      loadingComponent={LoadingPage}
      menuRoutes={menuRoutes}
      notFoundComponent={NotFoundPage}
    />
  );
}
```

> 样式由根入口 `src/index.ts` 自动引入（`import "./index.css"`），宿主无需单独引入 CSS。
> 宿主以源码符号链接方式引用本库时，上述包名应替换为宿主自身配置的路径别名（如 `@lri`）。

权限认证与用户数据通过初始化 `UserStore` 注入，本库不内置任何业务接口：

```tsx
import { UserStore } from "lingting-react-ui";

UserStore.initialize({
  getUser: () => api.getCurrentUser(),
  logout: () => api.logout(),
});
```

## 模块索引

`src` 下每个一级目录都有自己的说明文档，点击进入查看详细职责、公开导出与用法。

| 目录              | 职责                                                         | 文档                                               |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `src/components/` | 基础组件与通用高级组件（表格、表单、字典、区域、按钮、复制） | [components/README.md](./src/components/README.md) |
| `src/blocks/`     | 由组件与布局组合而成的通用界面区块与页面壳                   | [blocks/README.md](./src/blocks/README.md)         |
| `src/layout/`     | 通用应用布局、侧边栏布局与布局级路由                         | [layout/README.md](./src/layout/README.md)         |
| `src/hooks/`      | 领域无关的通用 Hook                                          | [hooks/README.md](./src/hooks/README.md)           |
| `src/lib/`        | 组件库共享工具、运行时单例与数据访问辅助                     | [lib/README.md](./src/lib/README.md)               |
| `src/store/`      | 基于 `@tanstack/react-store` 的通用 Store                    | [store/README.md](./src/store/README.md)           |
| `src/types/`      | 组件库公开类型                                               | [types/README.md](./src/types/README.md)           |
| `src/desktop/`    | 桌面端窗口能力组件                                           | [desktop/README.md](./src/desktop/README.md)       |

依赖方向（不可逆向）：

```text
components ─┐
blocks ─────┼─→ hooks / lib / types
layout ─────┤
store ──────┘
```

`src/components/` 内部选择既有组件时必须严格依次复用：**本项目 `src/components/` → Ant Design Pro Components → Ant Design 原生组件**。禁止绕过高优先级组件直接选用低优先级组件，也禁止用低优先级组件重复实现高优先级已有能力。

## 开发

```shell
pnpm install
pnpm dev
pnpm build
pnpm lint
```

- `pnpm build` 会执行 `vp build` 并通过 `tsc -p tsconfig.build.json` 生成类型声明。
- `pnpm lint` 等于 `vp fmt && vp check --fix`，会自动修复常规问题。

## 约束

完整开发约束见 [AGENTS.md](./AGENTS.md)，设计规范见 [DESIGN.md](./DESIGN.md)。涉及 Ant Design API、示例、token 或语义结构时，先使用 `.agents/skills/antd/SKILL.md` 规定的 MCP 工具。
