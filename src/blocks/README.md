# src/blocks

由组件与布局组合而成的**通用界面区块与页面壳**。仅在具有明确通用性时保留。

## 职责与边界

- 组合 [`src/components`](../components/README.md) 与 [`src/layout`](../layout/README.md) 中的能力，形成开箱可用的页面级区块。
- 所有展示内容与行为必须通过 Props 接收，不得写死领域页面、接口或业务状态。
- 页面级区块（`LoadingPage`、`NotFoundPage`、`StandaloneRoute`、`DynamicLoadErrorPage`）自行包裹 `BasicLayout`，调用方无需重复搭建主题与上下文容器；`SimpleLoginForm`、`PlaceholderPage` 是纯内容区块，由调用方决定外层容器。

## 公开导出

| 组件                       | 说明                                                       |
| -------------------------- | ---------------------------------------------------------- |
| `LoadingPage`              | 全屏加载页，内部已包裹 `BasicLayout` 与 `Spin fullscreen`  |
| `NotFoundPage`             | 404 结果页，提供「返回首页」按钮并跳转到 `/`               |
| `PlaceholderPage`          | 占位页，展示当前路由标题（取 `useRouter().current.title`） |
| `StandaloneRoute`          | 独立路由渲染器，按路由静态数据渲染页面组件                 |
| `SimpleLoginForm`          | 通用登录表单                                               |
| `DynamicLoadErrorPage`     | 动态加载异常页，说明加载失败情况并提供「重新加载」按钮     |
| `DynamicLoadErrorBoundary` | 动态加载异常边界，按额度自动重试并在用尽后渲染异常组件     |

## 用法

### 路由级区块

`LoadingPage`、`NotFoundPage` 通常直接作为路由选项传入，无需额外包装：

```tsx
import { LoadingPage, NotFoundPage } from "lingting-react-ui";

<AppSidebarLayout
  loadingComponent={LoadingPage}
  notFoundComponent={NotFoundPage}
  menuRoutes={menuRoutes}
/>;
```

### `StandaloneRoute`

由 [`createLayoutRouter`](../layout/README.md) 在生成独立路由时自动使用。当路由静态数据的 `standalone.mode` 为 `"none"` 时直接渲染页面组件，否则渲染在 `BasicLayout` 内。

```tsx
const standaloneRoutes = [
  {
    path: "/preview/:id",
    title: "预览",
    mode: "none", // 不套 BasicLayout
    loader: () => import("./pages/Preview"),
  },
];
```

### `SimpleLoginForm`

通用登录表单，字段与提交逻辑全部由调用方提供。

| 属性          | 说明                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `onFinish`    | 提交回调，接收 `{ username, password, ...T }`，返回 `Promise<void>`  |
| `title`       | 表单标题                                                             |
| `forget`      | 忘记密码入口：`false` 关闭、函数时渲染为链接按钮、也可传 `ReactNode` |
| `afterButton` | 提交按钮之后的节点数组                                               |
| `bottomForm`  | 表单底部的节点数组，接收 `(form, onSubmit)`                          |
| `formProps`   | 透传给内部 `ProForm`，不可覆盖 `children` / `form` / `onFinish`      |
| `formRef`     | 表单实例                                                             |

```tsx
<SimpleLoginForm
  forget={(form) => navigate("/forget")}
  title="登录"
  onFinish={async ({ username, password }) => {
    await login({ username, password });
  }}
/>
```

表单提交期间自动管理 `loading`，`onFinish` 抛出的错误会以 `Alert` 形式展示在按钮上方。

### 动态加载异常

路由页面动态加载失败时，由 `DynamicLoadErrorBoundary` 拦截并按额度自动重试，用尽后渲染 `DynamicLoadErrorPage`。`AppSidebarLayout` / `DesktopSidebarLayout` 已默认接入（可用 `dynamicLoadErrorComponent` 替换），也可单独使用：

```tsx
<DynamicLoadErrorBoundary onRetry={retry} target="订单详情">
  <Suspense fallback={<LoadingPage />}>
    <Outlet />
  </Suspense>
</DynamicLoadErrorBoundary>
```

`DynamicLoadErrorBoundary` 属性：

| 属性             | 说明                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `onRetry`        | 页内重试动作（compose/loader 页面为路由替换）；不传则只做整页刷新 |
| `errorComponent` | 自定义异常组件，默认 `DynamicLoadErrorPage`                       |
| `target`         | 加载目标，透传给异常组件                                          |

重试额度：页内重试 3 次 + 整页刷新 3 次，跨刷新记录且 30 秒内视为同一轮；非动态加载类异常不自动重试。

`DynamicLoadErrorPage` 属性：

| 属性         | 说明                                   |
| ------------ | -------------------------------------- |
| `target`     | 加载目标，通常是路由标题或地址         |
| `message`    | 失败信息，通常是动态加载失败的具体原因 |
| `onReload`   | 「重新加载」回调，默认为整页刷新       |
| `reloadText` | 「重新加载」按钮文案，默认 `重新加载`  |

## 相关文档

- 组件：[`src/components`](../components/README.md)
- 布局与路由：[`src/layout`](../layout/README.md)
- 类型：[`src/types`](../types/README.md)
