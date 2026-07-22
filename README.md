# Lingting React UI

`lingting-react-ui` 是一个基于 shadcn/ui 的 React 组件库，提供主题上下文、可选页面根布局和 shadcn 组件子入口。

## 环境要求

- Node.js 22.22.3 或更高版本
- pnpm 10 或更高版本
- React 19

## 安装

```bash
pnpm add lingting-react-ui
```

`BasicLayout` 或 `ThemeProvider` 会导入主题和基础样式，无需在应用入口额外导入 CSS。单独使用 shadcn 原始组件时，需由上层布局提供基础样式。

## 使用组件

根入口提供库组件与主题能力：

```tsx
import {
  BasicLayout,
  TestButton,
  ThemeProvider,
   Typography,
   TypographyProvider,
  useTheme,
   useTypography,
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
      typography={{defaultTypography: "basic"}}
    >
      <TestButton />
      <ThemeActions />
    </BasicLayout>
  )
}
```

`BasicLayout` 会包裹 `ThemeProvider` 与 `TypographyProvider` 并创建基础页面根容器。`typography`
用于传入排版配置，避免与主题的持久化配置冲突。已有页面布局时，可直接使用 Provider：

```tsx
import { ThemeProvider, TypographyProvider } from "lingting-react-ui"

export function App() {
  return (
    <ThemeProvider defaultTheme="light" persist={false}>
      <TypographyProvider defaultTypography="compact">
        <YourPage />
      </TypographyProvider>
    </ThemeProvider>
  )
}
```

`ThemeProvider` 内置 `light`、`dark`、`desktop-light`、`desktop-dark` 和 `system`。除 `system` 外，主题名称会作为根节点的
`theme-<名称>` class；例如 `setTheme("brand")` 会添加 `theme-brand`。自定义名称必须为不含空白字符的非空字符串，使用方可按该
class 提供自己的 token：

```css
.theme-brand {
  --background: oklch(0.98 0.02 250);
  --foreground: oklch(0.2 0.03 250);
  --typography-link: oklch(0.42 0.16 250);
  --typography-secondary: oklch(0.48 0.03 250);
  --typography-success: oklch(0.62 0.14 160);
  --typography-warning: oklch(0.7 0.16 72);
  --typography-danger: oklch(0.58 0.22 25);
  --typography-disabled: oklch(0.62 0.02 250);
  --typography-mark-background: oklch(0.92 0.12 100);
}
```

`persist` 默认为 `true`，作为首次进入时的持久化默认值。主题值默认使用 `lingting-react-ui/theme-use` 保存，持久化状态默认使用
`${storageKey}-persist` 保存；`storageKey` 与 `persistenceKey` 都可覆盖。通过 `useTheme().setPersist(false)`
关闭后，会清除已保存主题但保留关闭状态；刷新页面后将使用 `defaultTheme`，并继续保持关闭。

## 排版组件

`TypographyProvider` 提供 `basic`、`compact` 与 `spacious` 三套排版方案。其 `persist`、`storageKey` 与 `persistenceKey`
的行为和主题 Provider 一致；可通过 `useTypography()` 读取和切换当前方案。方案名称会作为根节点的 `typography-<名称>` class，
例如 `setTypography("reading")` 会添加 `typography-reading`。可使用以下 token 定义自定义方案：

```css
.typography-reading {
  --typography-body-size: 1rem;
  --typography-body-line-height: 1.75;
  --typography-heading-gap: 1.75rem;
  --typography-paragraph-gap: 1.125rem;
}
```

```tsx
import {
   Paragraph,
   Text,
   Title,
   Typography,
   useTypography,
} from "lingting-react-ui"

function Article() {
  const { setTypography } = useTypography()

  return (
    <>
      <button onClick={() => setTypography("spacious")}>宽松阅读</button>
      <Title level={1}>文章标题</Title>
      <Paragraph copyable editable={{ maxLength: 120 }}>
        <Text strong>强调内容</Text>支持复制与编辑。
      </Paragraph>
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: "collapsible" }}>
        可通过复合组件 API 使用段落。
      </Typography.Paragraph>
    </>
  )
}
```

`Text` 和 `Paragraph` 支持 `type`、`disabled`、`strong`、`italic`、`underline`、`delete`、`mark`、`code`、`keyboard`，以及
`copyable`、`editable`、`ellipsis`。`Link` 支持原生锚点属性及相同的文本状态样式。

排版语义色由主题 token 提供，组件会分别添加 `typography-link`、`typography-secondary`、`typography-success`、
`typography-warning`、`typography-danger` 和 `typography-mark` 类。禁用状态统一使用 `typography-disabled`，可由应用样式覆盖：

```css
.typography-disabled {
  color: var(--muted-foreground);
  opacity: 0.45;
}
```

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
