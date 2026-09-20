# src/hooks

领域无关的通用 Hook。

## 职责与边界

- 只封装与具体业务无关的状态、订阅与派生逻辑。
- 不包含请求、接口地址或领域模型；需要数据时通过参数接收。
- 与 Store 相关的 `use` Hook 必须与 Store 同文件（见 [`src/store`](../store/README.md)），不放在本目录。

## 公开导出

### `useDict`

字典数据的派生 Hook，基于 [`src/lib/DictUtils`](../lib/README.md)。

| Hook             | 返回值                         | 说明                       |
| ---------------- | ------------------------------ | -------------------------- |
| `useDictItems`   | `NormalizedDictItem<T>[]`      | 归一化字典数据为数据项     |
| `useDictOptions` | `{ label, value, disabled }[]` | 归一化字典数据为下拉选项   |
| `useDictValue`   | `{ items, item }`              | 同时返回数据项与当前命中项 |

```tsx
const { item } = useDictValue(statusDict, record.status);
const options = useDictOptions(statusDict);
```

### `useScreenMode`

识别屏幕模式并随窗口尺寸变化同步更新。

```tsx
const screenMode = useScreenMode(); // "default" | "small"
const screenMode850 = useScreenMode(850);
const isMobile = useIsMobile();
```

| 导出            | 说明                                                      |
| --------------- | --------------------------------------------------------- |
| `useScreenMode` | 返回 `"default"` \| `"small"`，可传入宽度阈值，默认 `768` |
| `useIsMobile`   | 等价于 `useScreenMode() === "small"`                      |

实现基于 `window.matchMedia` + `useSyncExternalStore`，阈值变化时会重新订阅，不会产生额外渲染。

> **在 `BasicLayout` 内部不要使用本 Hook。** 阈值由调用方传入，可能与 `BasicLayout` 的判定不一致，应改为通过 [`useLayout`](../layout/README.md) 读取 `screenMode`。本 Hook 只用于 `BasicLayout` 之外。

### `useRouter`

读取当前路由状态与导航方法，数据来源于 [`RouterContextProvider`](#routercontextprovider) 注入的上下文。

const { current, match, navigate, reload } = useRouter();

````

| 字段       | 说明                                                              |
| ---------- | ----------------------------------------------------------------- |
| `current`  | `{ icon?, mode, path?, title? }`，`mode` 为 `"layout"` / `"basic"` / `"none"` |
| `match`    | 当前命中的路由定义：`{ definition, type: "menu" \| "standalone" }` 或 `undefined` |
| `navigate` | `(to: string, options?: { replace?, reloadDocument? }) => Promise<void>` |
| `reload`   | 以 `replace` 方式重新导航到当前路径                                |

### `RouterContextProvider`

为 `useRouter` 注入路由上下文，由 [`AppSidebarLayout`](../layout/README.md) 内部使用。

```tsx
<RouterContextProvider menuRoutes={menuRoutes} router={router} standaloneRoutes={standaloneRoutes}>
  {children}
</RouterContextProvider>
````

### `useRoute`

按用户权限过滤菜单路由与独立路由，依赖 [`UserStore`](../store/README.md)。

```tsx
const { loading, menuRoutes, standaloneRoutes, refresh } = useRoute({
  menuRoutes,
  standaloneRoutes,
});
```

| 字段               | 说明                                             |
| ------------------ | ------------------------------------------------ |
| `menuRoutes`       | 过滤后的菜单路由（目录若子项全被过滤则一并移除） |
| `standaloneRoutes` | 过滤后的独立路由                                 |
| `loading`          | 用户信息加载中或路由过滤尚未同步完成             |
| `refresh`          | 手动重新过滤                                     |

过滤规则：路由声明了 `auth` 时按 [`allowUser`](../lib/README.md) 判定；未声明 `auth` 时要求用户已登录。

### `useWindowMaximized`

同步桌面窗口的最大化状态。

```tsx
const maximized = useWindowMaximized(isMaximized);
```

`isMaximized` 返回 `Promise<boolean>`，Hook 会在挂载时与 `window` resize 时重新读取。

## 内部实现

`useAntdExt.ts` 直接转发 `antd` 的 `theme.useToken` 与 `App.useApp`，供组件库内部统一引用，**不对外导出**。

## 相关文档

- 布局与屏幕模式：[`src/layout`](../layout/README.md)
- 字典工具：[`src/lib`](../lib/README.md)
- 用户与权限：[`src/store`](../store/README.md)
- Hook 类型：[`src/types`](../types/README.md)
