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
      "@ant-design/cssinjs",
      "@ant-design/icons",
      "@ant-design/plots",
      "@ant-design/pro-components",
      "@ant-design/x",
      "@ant-design/x-markdown",
      "@ant-design/x-sdk",
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

const menuRoutes = [
  {
    path: "/dashboard",
    title: "仪表盘",
    loader: () => import("./pages/Dashboard"),
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

> 路由页面支持三种写法：直接组件（`component: Dashboard`）、`React.lazy` 组件（`component: lazy(() => import("./pages/Dashboard"))`）、加载器（`loader: () => import("./pages/Dashboard")` 或 `component: loaderPage(() => import("./pages/Dashboard"))`）。三者的加载与自动重试行为见 [layout/README.md](./src/layout/README.md)。

> 样式由入口自动引入：源码模式下由 `src/index.ts` 的 `import "./index.css"` 引入全局样式，各组件由自身文件引入自己的 CSS；构建产物由 `vite.config.ts` 的 `injectCssImports` 插件把样式引用回填到对应模块，并为每个目录入口补上全局样式。按目录入口或根入口导入时宿主无需单独引入 CSS。
> 本库只提供组件自身样式，**不注入任何页面级样式**。宿主需要自行保证 `html`、`body`、`#root` 的高度链（例如 `height: 100%`），否则 `BasicLayout`、`SidebarLayout` 等使用 `h-full` 的布局组件会塌陷；`body` 的外边距与页面滚动行为同样由宿主决定。
> 宿主以源码符号链接方式引用本库时，上述包名应替换为宿主自身配置的路径别名（如 `@lri`）。

权限认证与用户数据通过初始化 `UserStore` 注入，本库不内置任何业务接口：

```tsx
import { UserStore } from "lingting-react-ui";

UserStore.initialize({
  getUser: () => api.getCurrentUser(),
  logout: () => api.logout(),
});
```

## 按需导入

构建产物按模块拆分，导入说明符支持三种粒度，三者都只加载实际用到的代码：

```tsx
// 1. 根入口：依赖宿主构建的 tree-shaking 剔除未使用的组件
import { Dict, ExTable } from "lingting-react-ui";

// 2. 目录入口：直接命中该目录的产物文件
import { RegionFlag, RegionSelect } from "lingting-react-ui/components/region";

// 3. 单文件入口：只命中该组件文件
import { RegionFlag } from "lingting-react-ui/components/region/RegionFlag";
```

`package.json` 已声明 `"sideEffects": ["**/*.css"]`，这是 tree-shaking 与本库样式引入能同时生效的前提，宿主不要覆盖它。

样式随入口引入：目录入口会自动引入全局样式（`lingting-react-ui/index.css`，含 Tailwind preflight 与主题变量），组件自身的样式由所在模块引入。**只使用单文件入口时不会带上全局样式**，此时需要宿主自行引入 `lingting-react-ui/index.css`。

`components/region/RegionFlag` 会加载全部 246 个旗帜 SVG（约 2MB），它本身无法更细粒度拆分；不需要旗帜时请从 `components` 或 `components/region` 导入并依赖 tree-shaking。

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
