# src/types

组件库的公开类型。所有非业务组件的 Props、数据项、请求参数与响应结构都定义在这里，组件实现文件**不得内联对外类型**。

## 职责与边界

- 只声明类型，不含任何运行时逻辑。
- 类型默认使用 `type`；仅在声明合并、模块扩展或无法等价表达时使用 `interface`；扩展对象类型优先使用 `&`。
- 按功能分文件，通过 `src/types/index.ts` 逐级导出。

## 模块清单

| 文件                          | 主要内容                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `globals.tsx`                 | 通用响应与分页协议：`R`、`PaginationSort`、`PaginationParams`、`PaginationResult`                       |
| `Menu.ts`                     | 通用菜单结构：`MenuItem`、`MenuExpandMode`                                                              |
| `Route.tsx`                   | 路由定义：`MenuRouteDefinition`、`StandaloneRouteDefinition`、`ProRouteStaticData`、`UseRouteResult`    |
| `UserStore.ts`                | 用户与权限：`User`、`AuthRule`、`UserAction`、`UserStoreInitializeOptions`、`UseUserStoreResult`        |
| `LayoutTypes.ts`              | 布局：`LayoutScreenMode`                                                                                |
| `RegionTypes.ts`              | 区域：`RegionItem`、`RegionName`、`RegionM49`、`RegionSelectProps`、`RegionFlagProps`、`RegionTagProps` |
| `DictTypes.ts`                | 字典：`DictValue`、`DictItem`、`DictData`、`DictProps` 与各展示/选择组件 Props                          |
| `ExTableTypes.ts`             | 表格：`ExTableProps`、`ExTableColumn`、`ExTableDict`、`ExTableRequestParams`                            |
| `ExFormTypes.ts`              | 表单域：`ExFormDictSelectProps` 等与 `ExFormRegionProps`                                                |
| `ButtonTypes.ts`              | 按钮：`ExButtonProps`、`ExButtonConfirm`、`ExButtonTooltip`、`TextButtonProps`                          |
| `CopyTypes.ts`                | 复制：`CopyOptions`、`CopyResult`、`CopyMethod`、`CopyableProps`                                        |
| `ListCardTypes.ts`            | 卡片：`ListCardProps`                                                                                   |
| `FixedVirtualListTypes.ts`    | 虚拟列表：`FixedVirtualListProps`                                                                       |
| `PaginationSelectorTypes.ts`  | 分页选择器：`PaginationSelectorProps`                                                                   |
| `CloudflareTurnstileTypes.ts` | 人机验证：`CloudflareTurnstileProps`、`CloudflareTurnstileFormFieldProps`                               |
| `SimpleLoginFormTypes.ts`     | 登录表单：`SimpleLoginFormProps`、`SimpleLoginFormValues`、`SimpleLoginFormForget`                      |

## 关键类型说明

### 分页协议（`globals.tsx`）

```ts
type PaginationParams = { current: number; size: number; sorts: PaginationSort[] };
type PaginationResult<T> = { total: number; records: T[] };
type R<T> = { code: number; message: string; data?: T | null };
```

[`ExTable`](../components/README.md) 与 [`PaginationSelector`](../components/README.md) 的 `request` 都使用该协议。

### 路由定义（`Route.tsx`）

- `MenuRouteDefinition` 是**目录或页面**的联合类型：有 `children` 时不能有 `component`，有 `component` 时不能有 `children`。
- `component` 支持同步组件、`React.lazy` 与 TanStack Router 的 `RouteComponent`。
- `auth` 为可选的 `AuthRule`，由 [`useRoute`](../hooks/README.md) 用于过滤。
- `StandaloneRouteDefinition` 额外支持 `mode`：`"basic"` 渲染在 `BasicLayout` 内，`"none"` 不套布局。

### 权限规则（`UserStore.ts`）

`AuthRule` 支持 `roles` / `permissions` / `organizations` / `tenantIds` 及其 `*Any` 变体，以及递归的 `rules` / `rulesAny`。判定逻辑见 [`allowUser`](../lib/README.md)。

### 字典数据（`DictTypes.ts`）

```ts
type DictData<T> =
  | T[]
  | DictItem<T>[]
  | Record<string, DictItem<T> | ReactNode | Primitive | Record<string, unknown>>;
```

三种形态都可以作为 `dict` 传入，归一化逻辑见 [`normalizeDictData`](../lib/README.md)。

### 布局（`LayoutTypes.ts`）

```ts
type LayoutScreenMode = "default" | "small";
```

由 [`BasicLayout`](../layout/README.md) 识别并通过布局上下文下发。

## 相关文档

- 使用这些类型的实现：[`src/components`](../components/README.md)、[`src/layout`](../layout/README.md)、[`src/hooks`](../hooks/README.md)、[`src/store`](../store/README.md)
