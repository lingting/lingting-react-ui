# src/lib

组件库共享工具、运行时单例与数据访问辅助。所有能力**领域无关**，可被组件、Block、布局、Hook 与 Store 复用。

## 职责与边界

- 承载可被两个及以上模块复用的纯函数、常量、运行时单例与数据归一化逻辑。
- 不包含 UI 渲染，不导入 React 组件。
- 不包含业务接口、领域模型或权限数据；只做通用转换与访问。
- 所有模块通过 `src/lib/index.ts` 统一导出。

## 模块清单

### `AppHolder`

组件库的运行时实例容器。`BasicLayout` 挂载时把 antd `App` 提供的实例写入栈中，组件库内部即可在非组件上下文安全使用。

| 导出                                 | 说明                                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `AppHolder`                          | 聚合对象：`mount`、`message`、`modal`、`notification`、`intl`、`query`、`router`、`consumerQueries` |
| `message` / `modal` / `notification` | antd 实例代理，取值时才解析当前挂载实例                                                             |
| `intl`                               | Pro Components 国际化实例代理，额外提供 `format(id, defaultMessage?)`                               |
| `query`                              | `QueryClient` 单例代理                                                                              |
| `router`                             | 返回当前挂载的 `AnyRouter`，未挂载时为 `null`                                                       |

```tsx
import { AppHolder, message } from "lingting-react-ui";

message.success("已保存");
void AppHolder.router()?.navigate({ to: "/home" });
```

未挂载时调用 `message` 等方法会抛出明确错误；`AppHolder` 内部按栈管理，支持多层 `BasicLayout` 嵌套。

### `RegionUtils`

区域（国家/地区）数据源与查询工具，数据来自 [lingting-geo-data](https://github.com/lingting/lingting-geo-data)。

| 导出                   | 说明                                         |
| ---------------------- | -------------------------------------------- |
| `regionItems`          | 区域列表（`RegionItem[]`）                   |
| `regionItemMap`        | `iso` → `RegionItem` 的查找表                |
| `regionM49`            | M49 区域层级数据                             |
| `regionPhones`         | 区号数据                                     |
| `regionPhoneMap`       | 按区域聚合的区号索引                         |
| `normalizeRegionValue` | 归一化区域值（转大写）                       |
| `findRegionItem`       | 按 `iso` 查找区域项                          |
| `filterRegionItems`    | 默认过滤器，匹配 `iso`、区号、英文名与中文名 |

### `DictUtils`

字典数据归一化与配色解析。

| 导出                 | 说明                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| `NormalizedDictItem` | 归一化后的数据项类型，`label` 保证为 `ReactNode`                               |
| `normalizeDictData`  | 把三种字典形态（值数组 / `DictItem[]` / `Record`）归一为数据项数组             |
| `toDictOptions`      | 归一为 `{ label, value, disabled }[]`                                          |
| `findDictItem`       | 按值在字典数据中查找数据项                                                     |
| `findDictItemByData` | 在已归一化的数据项数组中查找                                                   |
| `resolveDictColor`   | 解析配色：预设色名、语义别名（如 `primary`）或显式 CSS 颜色，均落到 antd token |

### `MenuUtils`

菜单树归一化与展开状态计算。

| 导出                        | 说明                                         |
| --------------------------- | -------------------------------------------- |
| `ResolvedMenuItem`          | 带 `parent` / `parentPath` / `path` 的菜单项 |
| `normalizeMenuPath`         | 归一化菜单路径                               |
| `isMenuDirectory`           | 是否为目录（`dir` 为真或有子项）             |
| `resolveMenuItems`          | 展平菜单树，剔除无子项的目录                 |
| `getFirstNavigableMenuItem` | 取第一个可导航项                             |
| `getMenuAncestorPaths`      | 取当前路径的所有祖先路径                     |
| `getMenuItemChain`          | 取菜单项到根的链路                           |
| `getCurrentMenuItems`       | 取当前路径命中的菜单项                       |
| `getResolvedMenuChildren`   | 取已解析的子项                               |
| `getResolvedMenuDepth`      | 取菜单项深度                                 |
| `isResolvedMenuItemVisible` | 按展开模式判断是否可见                       |
| `toggleMenuExpandedPaths`   | 按展开模式切换展开路径集合                   |

### `RouteUtils`

路由路径拼接与查找。

| 导出                    | 说明                                      |
| ----------------------- | ----------------------------------------- |
| `joinRoutePath`         | 拼接父子路径，保证以 `/` 开头且无重复斜杠 |
| `normalizeRoutePath`    | 归一化路径，去除尾部斜杠                  |
| `findMenuRoute`         | 在菜单路由中按路径查找                    |
| `findStandaloneRoute`   | 在独立路由中按路径查找                    |
| `findFirstMenuLeafPath` | 取第一个叶子路径，用于根重定向            |
| `findMenuAncestorPaths` | 取当前路径的菜单祖先路径                  |

### `ButtonUtils`

按钮交互包装的渲染辅助，供 [`Button`](../components/README.md) 族使用。

| 导出                    | 说明                                  |
| ----------------------- | ------------------------------------- |
| `isConfigObject`        | 判断是否为配置对象（排除 React 元素） |
| `hasConfirm`            | 是否需要二次确认                      |
| `renderConfirm`         | 按 `confirm` 配置包裹 `Popconfirm`    |
| `renderTooltip`         | 按 `tooltip` 配置包裹 `Tooltip`       |
| `resolveButtonContent`  | 按图标位置与加载态组合按钮内容        |
| `resolveButtonDisabled` | 按 `disabled` 与 `loading` 计算禁用态 |

### `UserUtils`

| 导出        | 说明                                                           |
| ----------- | -------------------------------------------------------------- |
| `allowUser` | 按 `AuthRule` 判定用户是否通过，支持 `rules` / `rulesAny` 递归 |

规则语义：`roles` / `permissions` / `organizations` / `tenantIds` 要求**全部命中**，对应 `*Any` 版本要求**任一命中**（空数组视为通过）；`anonymous: true` 直接通过。

### `CopyUtils`

| 导出       | 说明                                                       |
| ---------- | ---------------------------------------------------------- |
| `copyText` | 仅复制文本，优先 Clipboard API，失败时降级为 `execCommand` |
| `copy`     | 在 `copyText` 基础上支持 `format` 自定义内容与各类回调     |

### `ImageUtils`

| 导出            | 说明                                                          |
| --------------- | ------------------------------------------------------------- |
| `AvatarSource`  | 头像来源类型：`empty` / `image` / `text`                      |
| `resolveSource` | 判断字符串是 URL、data URI、base64 图片还是文本，返回对应来源 |

### `DateUtils`

| 导出              | 说明                                           |
| ----------------- | ---------------------------------------------- |
| `formatTimestamp` | 把秒或毫秒时间戳格式化为 `YYYY-MM-DD HH:mm:ss` |

### `AuthTokenStorage`

认证令牌的本地存储读写，存储键为 `${PREFIX}/auth-token`。

| 导出             | 说明                           |
| ---------------- | ------------------------------ |
| `readAuthToken`  | 读取令牌，空值返回 `undefined` |
| `saveAuthToken`  | 写入令牌，空值等价于清除       |
| `clearAuthToken` | 清除令牌                       |

## 相关文档

- 使用方：[`src/components`](../components/README.md)、[`src/layout`](../layout/README.md)、[`src/hooks`](../hooks/README.md)、[`src/store`](../store/README.md)
- 类型：[`src/types`](../types/README.md)
