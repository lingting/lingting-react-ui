# src/store

基于 `@tanstack/react-store` 的通用 Store。

## 职责与边界

- 只承载与业务无关的通用状态与其操作。
- 不包含领域状态、硬编码权限数据，也不重复或转发其他模块已有的逻辑。
- 每个 Store 只有一个实现文件，`use` Hook 必须与 Store 同文件；共享类型定义在 [`src/types`](../types/README.md)。
- 对外只从 `src/store/index.ts` 导出。

## `UserStore`

用户与权限认证 Store。**不内置任何业务接口**：登录态获取、退出登录都由宿主通过 `UserStore.initialize` 注入。

### 初始化

```tsx
import { UserStore } from "lingting-react-ui";

UserStore.initialize({
  getUser: () => api.getCurrentUser(),
  logout: () => api.logout(),
  keyPrefix: "my-app", // 可选，默认 "lingting-react-ui/user-store"
});
```

| 选项        | 说明                                                                |
| ----------- | ------------------------------------------------------------------- |
| `getUser`   | 获取当前用户，返回 `UserAction`                                     |
| `logout`    | 退出登录，返回 `UserAction`                                         |
| `keyPrefix` | 缓存键前缀，默认 `${PREFIX}/user-store`，用于错误信息与本地缓存命名 |

`UserAction` 的语义：

| 形态                                | 行为                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| `{ type: "login", value: User }`    | 写入用户信息并视为已登录                                                                      |
| `{ type: "redirect", url: string }` | 清除用户信息并跳转；`http(s)://` 使用 `window.location`，以 `/` 开头的内部路径使用当前 router |

未初始化时调用任何静态方法都会抛出明确错误。

### 静态 API

| 方法                    | 说明                                                                  |
| ----------------------- | --------------------------------------------------------------------- |
| `UserStore.initialize`  | 初始化运行时，必须在渲染布局前调用                                    |
| `UserStore.getStore`    | 获取底层 `Store<UserStoreState>`                                      |
| `UserStore.setUser`     | 直接写入用户信息                                                      |
| `UserStore.allow(rule)` | 按权限规则判定；传字符串或字符串数组时等价于 `{ permissions: [...] }` |
| `UserStore.refresh()`   | 拉取用户信息，并发调用会复用同一个请求                                |
| `UserStore.logout()`    | 退出登录                                                              |

### `useUserStore`

订阅用户状态，返回静态 API 的绑定版本：

```tsx
import { useUserStore } from "lingting-react-ui";

const { allow, loading, logout, refresh, setUser, user } = useUserStore();
```

| 字段      | 说明                                                |
| --------- | --------------------------------------------------- |
| `user`    | 当前用户，未登录为 `undefined`                      |
| `loading` | 是否正在加载用户信息                                |
| `allow`   | `(rule: string \| string[] \| AuthRule) => boolean` |
| `refresh` | 重新拉取用户信息                                    |
| `logout`  | 退出登录                                            |
| `setUser` | 直接写入用户信息                                    |

## 权限规则

`AuthRule` 的判定由 [`allowUser`](../lib/README.md) 实现：

| 字段                                                                | 语义                                 |
| ------------------------------------------------------------------- | ------------------------------------ |
| `anonymous`                                                         | 为 `true` 时直接通过，不校验登录态   |
| `roles` / `permissions` / `organizations` / `tenantIds`             | 要求**全部命中**                     |
| `rolesAny` / `permissionsAny` / `organizationsAny` / `tenantIdsAny` | 要求**任一命中**（空数组视为通过）   |
| `rules`                                                             | 全部子规则必须通过                   |
| `rulesAny`                                                          | 任一子规则通过即可（空数组视为通过） |

```tsx
const canEdit = allow({ permissions: ["user:update"], rolesAny: ["admin", "operator"] });
```

## 与路由的协作

[`useRoute`](../hooks/README.md) 会用 `allow` 过滤菜单路由与独立路由；[`AppSidebarLayout`](../layout/README.md) 在挂载时自动调用 `refresh()`。

## 相关文档

- 权限工具：[`src/lib/UserUtils.ts`](../lib/README.md)
- 用户与权限类型：[`src/types/UserStore.ts`](../types/README.md)
- 路由过滤：[`src/hooks`](../hooks/README.md)
