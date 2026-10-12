# src/layout

通用布局、侧边栏布局与布局级路由。所有布局**领域无关**，不绑定具体业务页面。

## 职责与边界

- 提供应用外壳：主题容器、布局上下文、侧边栏、头部与内容区。
- 提供布局级路由构建能力：把菜单路由与独立路由定义转换为 `@tanstack/react-router` 路由树。
- 菜单、路由、用户与权限只以**配置与回调**形式接收，不写死领域页面、接口或权限数据。
- 目录内部可依赖 [`src/components`](../components/README.md)、[`src/blocks`](../blocks/README.md)、[`src/store`](../store/README.md)、[`src/hooks`](../hooks/README.md)、[`src/lib`](../lib/README.md) 与 [`src/types`](../types/README.md)。

## 目录结构

| 路径                  | 说明                                                     | 是否公开 |
| --------------------- | -------------------------------------------------------- | -------- |
| `BasicLayout.tsx`     | 主题、`App`、`QueryClient` 与布局上下文根容器            | 公开     |
| `BasicLayoutTypes.ts` | `BasicLayout` 的公开类型                                 | 公开     |
| `sidebar-layout/`     | 通用侧边栏布局，支持 `left` / `bottom` 与平铺 / 抽屉     | 公开     |
| `app-sidebar/`        | 带路由、菜单与用户信息的完整应用布局                     | 公开     |
| `desktop-sidebar/`    | 桌面端窗口布局，附带窗口控制与缩放入口                   | 公开     |
| `sidebar-common/`     | 侧边栏通用实现：菜单、用户项、切换按钮、内容壳、路由构建 | 内部     |

`sidebar-common` 不通过 `src/layout/index.ts` 导出，仅供 `app-sidebar` 与 `desktop-sidebar` 复用。

## `BasicLayout`

所有布局的根容器，负责：

1. 创建 `QueryClientProvider`（使用 [`AppHolder.query`](../lib/README.md) 单例）。
2. 维护 `LayoutTheme`（`antd` 主题配置 + Pro Components 配置）并写入布局上下文。
3. 包裹 antd `App`，把 `message` / `notification` / `modal` / `intl` 挂载到 `AppHolder`。
4. **识别屏幕模式**并写入布局上下文。

### 属性

| 属性                    | 说明                                           |
| ----------------------- | ---------------------------------------------- |
| `children`              | 内容                                           |
| `className`             | 根容器类名                                     |
| `defaultTheme`          | 初始主题，`{ antd, pro }`                      |
| `smallScreenBreakpoint` | 判定为小屏幕的宽度阈值（CSS 像素），默认 `768` |

### 布局上下文

```tsx
import { useLayout } from "lingting-react-ui";

const { screenMode, setTheme, theme } = useLayout();
```

| 字段         | 说明                                       |
| ------------ | ------------------------------------------ |
| `screenMode` | `"default"` \| `"small"`                   |
| `theme`      | 当前 `LayoutTheme`                         |
| `setTheme`   | 更新主题的 `Dispatch<SetStateAction<...>>` |

> **屏幕模式必须从布局上下文读取。** `useScreenMode` 的阈值由调用方传入，在 `BasicLayout` 内自行调用可能与 `BasicLayout` 的判定不一致。`useScreenMode` 只用于 `BasicLayout` 之外。

`BasicLayout` 内的内容只有在 `AppHolder` 挂载完成后才会渲染，因此使用 `AppHolder.message` 等实例是安全的。

## `SidebarLayout`

通用侧边栏布局，包含 `BasicLayout` 主题容器。

```tsx
import { SidebarLayout } from "lingting-react-ui";

<SidebarLayout layout="left" sidebarDisplay="auto">
  {content}
</SidebarLayout>;
```

### 属性

| 属性                      | 说明                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `layout`                  | `"left"`（默认）\| `"bottom"`，决定侧栏与头部的相对位置                                      |
| `sidebarDisplay`          | `"auto"`（默认）\| `"inline"` \| `"drawer"`，见下文                                          |
| `sidebarShow`             | 是否渲染侧栏，默认 `true`；设为 `false` 时不渲染侧栏，折叠状态恒为 `Hidden`                  |
| `sidebarCollapsedDefault` | 侧栏初始折叠状态，默认 `SidebarCollapsed.Default`；传入其他值时抽屉与平铺均以其为初始状态    |
| `width`                   | 侧栏展开宽度，默认 `240px`                                                                   |
| `collapsedWidth`          | 侧栏折叠宽度，默认 `64px`                                                                    |
| `baseItems`               | 侧栏主区域节点数组                                                                           |
| `bottomItems`             | 侧栏底部区域节点数组                                                                         |
| `headerLeftItems`         | 头部左侧节点数组                                                                             |
| `headerRightItems`        | 头部右侧节点数组                                                                             |
| `headerProps`             | 透传给 `Layout.Header`，不可覆盖 `children` / `className`                                    |
| `headerShow`              | 是否渲染头部，默认 `true`；设为 `false` 时不渲染头部，`layout` 为 `left` / `bottom` 时均生效 |
| `classNames`              | 语义化类名：`root` / `main` / `sidebar` / `header` / `content` / `baseItems` / `bottomItems` |
| `className`               | 根容器类名                                                                                   |
| `defaultTheme`            | 透传给 `BasicLayout`                                                                         |
| `smallScreenBreakpoint`   | 透传给 `BasicLayout`                                                                         |

### 侧边栏展示方式

| 取值           | 行为                         |
| -------------- | ---------------------------- |
| `auto`（默认） | 小屏幕使用抽屉，其余使用平铺 |
| `inline`       | 始终平铺                     |
| `drawer`       | 始终使用抽屉                 |

抽屉展示方式的行为：

- 侧栏默认隐藏（`sidebarCollapsedDefault` 传入其他值时以该值为初始状态），脱离文档流，统一从左侧滑出（`placement="left"`）。
- 保留 antd 默认遮罩，点击遮罩或按 Esc 关闭。
- `SidebarToggle` 在**隐藏与展示**之间切换，并始终渲染。
- 菜单项在抽屉内被点击后自动关闭抽屉。
- 侧栏内文本内容（用户信息、退出登录等）始终完整展示。

平铺展示方式下，`SidebarToggle` 在**折叠与展开**之间切换，且 `layout="bottom"` 时默认不渲染。

### 隐藏头部

`headerShow={false}` 时不渲染头部，`layout` 为 `left` / `bottom` 时均生效，侧栏与内容区布局保持不变。

> 注意：头部内的交互入口会一并隐藏 —— `AppSidebarLayout` 的 `SidebarToggle`（抽屉展示方式下将失去打开抽屉的入口）、`DesktopSidebarLayout` 的窗口控制按钮（最小化 / 最大化 / 关闭）与拖动热区。隐藏头部时需由调用方另行提供对应入口。

### 侧栏状态

```tsx
import { SidebarCollapsed, useSidebarLayout } from "lingting-react-ui";

const { collapsed, screenMode, sidebarDisplay, setCollapsed, toggleCollapsed } = useSidebarLayout();
```

| 字段              | 说明                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `collapsed`       | `SidebarCollapsed.Collapsed` \| `Expanded` \| `Hidden`；`sidebarShow` 为 `false` 时恒为 `Hidden`                        |
| `screenMode`      | 当前屏幕模式                                                                                                            |
| `sidebarDisplay`  | 解析后的展示方式：`"inline"` \| `"drawer"`                                                                              |
| `setCollapsed`    | 设置状态；`Default` 取展示方式内置默认值，抽屉方式下 `Collapsed` 会被归一为 `Hidden`；`sidebarShow` 为 `false` 时不生效 |
| `toggleCollapsed` | 切换状态；抽屉方式下在 `Hidden` ↔ `Expanded` 间切换；`sidebarShow` 为 `false` 时不生效                                  |

### 隐藏侧栏

`sidebarShow={false}` 时不渲染侧栏本体（不使用隐藏状态下的 `display: none` 收起），仅保留头部与内容区，此时：

- `useSidebarLayout()` 的 `collapsed` 恒为 `SidebarCollapsed.Hidden`，`setCollapsed` 与 `toggleCollapsed` 均为空操作。
- `AppSidebarLayout` 不再渲染 `SidebarToggle`，`showSidebarToggle` 不生效。

### `SidebarLayoutContent`

与 `SidebarLayout` 相同，但**不含** `BasicLayout` 主题容器，供需要自定义外层容器的布局复用。因为要读取布局上下文，它必须渲染在 `BasicLayout` 内部。

## `AppSidebarLayout`

在 `SidebarLayout` 基础上接入路由、菜单与用户信息，是本库推荐的整站布局。

```tsx
import { AppSidebarLayout } from "lingting-react-ui";

<AppSidebarLayout
  menuRoutes={menuRoutes}
  standaloneRoutes={standaloneRoutes}
  notFoundComponent={NotFoundPage}
  loadingComponent={LoadingPage}
  rootRedirectTo="/dashboard"
  title="控制台"
/>;
```

### 额外属性（在 `SidebarLayout` 属性之上）

| 属性                        | 说明                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `menuRoutes`                | 菜单路由定义，必填                                                                                              |
| `standaloneRoutes`          | 独立路由定义，不进入菜单                                                                                        |
| `notFoundComponent`         | 404 组件，默认 `NotFoundPage`                                                                                   |
| `loadingComponent`          | 加载组件，默认 `LoadingPage`                                                                                    |
| `dynamicLoadErrorComponent` | 动态加载异常组件，默认 `DynamicLoadErrorPage`，见下文「路由页面与动态加载异常」                                 |
| `rootRedirectTo`            | 根路径重定向目标，缺省时取第一个菜单叶子路径                                                                    |
| `routeType`                 | 路由类型：`"browser"`（默认）\| `"hash"`，见下文                                                                |
| `title`                     | 文档标题前缀，缺省时取 `document.title` 的第一段                                                                |
| `showSidebarToggle`         | 是否渲染侧栏切换按钮；平铺方式下默认 `layout === "left"`，抽屉方式下强制渲染，`sidebarShow` 为 `false` 时不渲染 |
| `userPosition`              | 用户项位置：`"hidden"` \| `"top"`（默认）\| `"bottom"`                                                          |
| `logoutPosition`            | 退出登录位置：`"hidden"` \| `"user"` \| `"bottom"`（默认）                                                      |

### 行为

- 从 `menuRoutes` / `standaloneRoutes` 生成路由树，并挂载到 [`AppHolder.router`](../lib/README.md)。
- 通过 [`useRoute`](../hooks/README.md) 按用户权限过滤路由。
- 通过 [`UserStore`](../store/README.md) 拉取用户信息，并把用户项与退出登录渲染进侧栏。
- 侧栏展开时同步文档标题为 `标题 - 当前菜单标题`。

### 路由类型

| 取值      | 行为                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `browser` | 浏览器 history 路由（默认），地址形如 `/dashboard`                          |
| `hash`    | hash 路由，地址形如 `/#/dashboard`，适用于 `file://` 或静态托管的桌面端场景 |

切换为 `hash` 后，路由跳转、菜单选中与重定向均由路由历史自动处理，无需调用方改写路径。

## `DesktopSidebarLayout`

面向桌面窗口的布局：在 `AppSidebarLayout` 基础上固定 `layout="bottom"`、`sidebarDisplay="inline"`，并叠加窗口控制与缩放热区。

| 额外属性           | 说明                                        |
| ------------------ | ------------------------------------------- |
| `isMaximized`      | 读取窗口最大化状态，返回 `Promise<boolean>` |
| `onClose`          | 关闭窗口                                    |
| `onMinimize`       | 最小化窗口                                  |
| `onStartDrag`      | 开始拖动窗口                                |
| `onStartResize`    | 开始缩放窗口，接收方向                      |
| `onToggleMaximize` | 切换最大化                                  |

该布局**不参与小屏适配**：窗口尺寸变化不会让它切换到抽屉展示方式。

路由属性（如 `routeType`）继承自 `AppSidebarLayout`；以 `file://` 加载页面时需传入 `routeType="hash"`。

## 路由页面与动态加载异常

### 页面写法

`menuRoutes` 与 `standaloneRoutes` 的页面来源有三类，由 `component` 与 `loader` 二选一表达：

| 写法    | 示例                                                                                                  | 页面加载方式                           |
| ------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| compose | `{ component: Dashboard }`                                                                            | 直接组件，随入口一起加载               |
| lazy    | `{ component: lazy(() => import("./Dashboard")) }`                                                    | `React.lazy` 组件，首次进入时动态导入  |
| loader  | `{ loader: () => import("./Dashboard") }` 或 `{ component: loaderPage(() => import("./Dashboard")) }` | 由本库接管动态导入，模块按 loader 缓存 |

- `component` 与 `loader` 不能同时出现，二者也都不能与 `children` 同时出现。
- loader 的两种写法等价：同一个 loader 只发起一次动态导入，加载成功后再次进入该路由直接复用已解析的模块（与 `React.lazy` 一致，仅首次进入会显示 `loadingComponent`）。
- **不能写成 `component: () => import("./Dashboard")`**：运行时无法与普通组件函数区分（需要调用才能判断，会破坏 Hook 规则），该写法会被当作普通组件渲染。

### 自动重试

`AppSidebarLayout` 与 `DesktopSidebarLayout` 在路由内容外内置 [`DynamicLoadErrorBoundary`](../blocks/README.md)，捕获动态加载失败后按页面类型自动重试：

| 页面类型         | 重试方式                                                                              | 上限 |
| ---------------- | ------------------------------------------------------------------------------------- | ---- |
| compose / loader | 页内重试：路由替换（`router.replace`）并重挂载路由内容，loader 页面会重新发起动态导入 | 3 次 |
| lazy             | 整页刷新（`React.lazy` 会缓存失败的 import，页内重试无法重新加载）                    | 3 次 |

额度按顺序消耗：compose / loader 页面先页内重试 3 次，仍失败再整页刷新 3 次；lazy 页面直接整页刷新 3 次。计数通过 `sessionStorage` 跨刷新保留（30 秒内的连续失败视为同一轮），额度用尽后渲染 `dynamicLoadErrorComponent`（默认 [`DynamicLoadErrorPage`](../blocks/README.md)），其「重新加载」按钮会清空额度并整页刷新。非动态加载类异常不自动重试，直接渲染异常组件。

## 布局级路由

`sidebar-common/createLayoutRouter.tsx` 提供 `createLayoutRouter`，被 `AppSidebarLayout` 与 `DesktopSidebarLayout` 内部使用。它负责：

- 由 `menuRoutes` 生成嵌套路由，目录路由自动重定向到第一个叶子路径。
- 由 `standaloneRoutes` 生成独立路由，交由 [`StandaloneRoute`](../blocks/README.md) 渲染。
- 按 `rootRedirectTo` 或第一个菜单叶子路径生成根重定向。
- 按 `routeType` 选择路由历史：`browser` 使用浏览器 history，`hash` 使用 hash 历史（地址形如 `/#/path`）。

## 相关文档

- 屏幕模式 Hook：[`useScreenMode`](../hooks/README.md)
- 路由 Hook：[`useRouter`](../hooks/README.md)、[`useRoute`](../hooks/README.md)
- 路由工具：[`src/lib/RouteUtils`](../lib/README.md)
- 路由页面组件解析：[`loaderPage`、`resolveRoutePageKind`](../lib/README.md)
- 动态加载异常页与异常边界：[`src/blocks`](../blocks/README.md)
- 权限规则：[`UserStore`](../store/README.md)
- 布局相关类型：[`src/types/Route.tsx`](../types/README.md)、[`src/types/LayoutTypes.ts`](../types/README.md)
