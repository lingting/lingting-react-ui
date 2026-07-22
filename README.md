# Lingting React UI

`lingting-react-ui` 是一个基于 shadcn/ui 的 React 组件库，提供主题上下文、可选页面根布局和 shadcn 组件子入口。

## 环境要求

- Node.js 22.22.3 或更高版本
- pnpm 10 或更高版本
- React 19

## 安装与样式

```bash
pnpm add lingting-react-ui
```

在应用入口导入完整样式。该入口包含基础样式、共享 token 和 `light`、`dark`、`desktop-light`、`desktop-dark` 四套主题定义。

```tsx
import "lingting-react-ui/styles/all.css"
```

## 使用组件

根入口提供库组件与主题能力：

```tsx
import {
  BasicLayout,
  TestButton,
  ThemeProvider,
  useTheme,
} from "lingting-react-ui"

function ThemeActions() {
  const { setTheme } = useTheme()

  return <button onClick={() => setTheme("desktop-dark")}>切换主题</button>
}

export function App() {
  return (
    <BasicLayout
      defaultTheme="desktop-light"
      storageKey="my-app/theme"
      persist
    >
      <TestButton />
      <ThemeActions />
    </BasicLayout>
  )
}
```

`BasicLayout` 会包裹 `ThemeProvider` 并创建基础页面根容器。已有页面布局时，直接使用 `ThemeProvider`：

```tsx
import { ThemeProvider } from "lingting-react-ui"

export function App() {
  return (
    <ThemeProvider defaultTheme="light" persist={false}>
      <YourPage />
    </ThemeProvider>
  )
}
```

`persist` 默认为 `true`，作为首次进入时的持久化默认值。主题值默认使用 `lingting-react-ui/theme-use` 保存，持久化状态默认使用
`${storageKey}-persist` 保存；`storageKey` 与 `persistenceKey` 都可覆盖。通过 `useTheme().setPersist(false)`
关闭后，会清除已保存主题但保留关闭状态；刷新页面后将使用 `defaultTheme`，并继续保持关闭。

shadcn 组件可从聚合子入口引入。ESM 使用方会由打包器进行摇树优化：

```tsx
import { Button, Dialog } from "lingting-react-ui/shadcn"
```

需要让 CJS 环境或不进行摇树优化的构建工具只加载单个组件时，请使用组件子路径：

```tsx
import {Button} from "lingting-react-ui/components/shadcn/ui/button"
import {Dialog} from "lingting-react-ui/components/shadcn/ui/dialog"
```

构建产物会保留 `src/` 的模块目录，同时提供 ESM 和 CJS 文件；根入口和 `shadcn` 入口仍为兼容性聚合入口。

## 本地编译与文件链接

在组件库根目录安装依赖并构建：

```bash
pnpm install
pnpm build
```

构建产物位于 `dist/`。在另一个项目中通过 `file:` 依赖引用当前目录的构建结果：

```bash
pnpm add "file:../lingting-react-ui"
```

每次修改组件库后重新执行 `pnpm build`，再刷新使用方项目的依赖解析。

## Components 演示

仓库内的 Vite components 工作区通过 `workspace:*` 使用库的公开入口。它按需加载“扩展”和“shadcn”页面，顶部可切换主题与持久化状态。构建库和
components：

```bash
pnpm build:components
```

components 构建产物位于 `components-dist/`，并演示 `TestButton`、`lingting-react-ui/shadcn`、四种主题、自定义存储 key
与关闭后的持久化状态。

## 发布 npm

1. 确认 npm 已登录，并更新 `package.json` 中的 `version`。
2. 构建并检查待发布内容：

   ```bash
   pnpm build
   pnpm pack --dry-run
   ```

3. 发布公开包：

   ```bash
   pnpm publish --access public
   ```

`prepublishOnly` 会在发布前重新构建。首次发布前请确认 npm 上的 `lingting-react-ui` 名称可用。
