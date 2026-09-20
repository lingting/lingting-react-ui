# src/components

基础组件与通用高级组件。所有组件**领域无关**，通过泛型、配置与回调接收数据源和渲染策略。

## 职责与边界

- 只承担 UI 渲染、样式、基础交互与组合。
- 不包含业务实体、接口地址、菜单结构、权限数据或业务流程。
- 所有对外 Props 与数据结构定义在 [`src/types`](../types/README.md)，实现文件不得内联对外类型。
- 可跨组件复用的计算与转换提取到 [`src/lib`](../lib/README.md)，不在组件中重复实现。

## 组件复用优先级（强制）

实现或改造组件时，选择既有组件必须严格依次检索并复用：

1. 本项目 `src/components/`（LRI 已有组件）
2. Ant Design Pro Components
3. Ant Design（`antd`）原生组件

仅当前一优先级不存在可满足需求的组件时，才可使用下一优先级。禁止绕过高优先级组件直接选用低优先级组件，也禁止用低优先级组件重复实现高优先级已有能力。

Ant Design 原生组件必须直接从 `antd` 导入，图标必须从 `@ant-design/icons` 导入。

## 目录结构

| 目录          | 内容                                        |
| ------------- | ------------------------------------------- |
| `cloudflare/` | Cloudflare Turnstile 人机验证组件与其表单域 |
| `copy/`       | 一键复制组件                                |
| `dict/`       | 字典展示与选择组件族                        |
| `ex-button/`  | 增强按钮族（普通 / 文本 / 链接）            |
| `ex-card/`    | 卡片类组合组件                              |
| `ex-form/`    | 表单域组件（字典、区域）                    |
| `ex-list/`    | 列表类组件                                  |
| `ex-select/`  | 选择器类组件                                |
| `ex-table/`   | 表格组件                                    |
| `region/`     | 区域（国家/地区）相关组件与数据源           |

## 公开导出

### `ex-table`

| 导出      | 说明                                                                              |
| --------- | --------------------------------------------------------------------------------- |
| `ExTable` | 基于 Pro Components `ProTable` 的高级表格，内置分页协议、字典列、区域列与时间戳列 |

核心能力：

- `request` 接收 `(pagination, query)` 并返回 `PaginationResult<T>` 或 `T[]`，分页参数统一为 `{ current, size, sorts }`。
- 列定义使用 `ExTableColumn`，在 `ProColumns` 基础上扩展：
  - `dict`：字典数据或 `{ dict, search, table }`，搜索区按 `search` 渲染为下拉或复选框，表格区按 `table` 渲染为标签、徽标或文本。
  - `region`：`"single"` / `"multiple"` 时按区域选择或标签渲染，`false` 时关闭。
  - `valueType`：额外支持 `"timestamp"`（秒）与 `"timestampMillis"`（毫秒），按 `YYYY-MM-DD HH:mm:ss` 格式化。

```tsx
<ExTable<User>
  columns={[
    { title: "名称", dataIndex: "name" },
    { title: "状态", dataIndex: "status", dict: statusDict, search: "select", table: "tag" },
    { title: "地区", dataIndex: "region", region: "single" },
  ]}
  request={(pagination) => api.pageUsers(pagination)}
/>
```

### `ex-select`

| 导出                 | 说明                                                  |
| -------------------- | ----------------------------------------------------- |
| `PaginationSelector` | 远程分页下拉选择器，支持搜索、防抖、本地过滤与单/多选 |

关键属性：`request`、`toOption`、`multiple`、`lazy`、`debounceDelay`、`requestMode`（`raw` / `filter`）、`filter`、`props`。

### `ex-list` / `ex-card`

| 导出               | 说明                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| `FixedVirtualList` | 固定子项高度的虚拟列表，自动测量自身高度                                  |
| `ListCard`         | `ProCard` + `FixedVirtualList` 组合的列表卡片，支持 `header` 与 `loading` |

> `FixedVirtualList` 必须拥有可计算高度，调用方需通过父容器或自身 CSS 提供固定高度或 `flex: 1; min-height: 0`。

### `ex-button`

| 导出                         | 说明                                                           |
| ---------------------------- | -------------------------------------------------------------- |
| `Button` / `AntdButton`      | 增强按钮，在 `antd` `Button` 基础上支持 `confirm` 与 `tooltip` |
| `Button.Text` / `TextButton` | 文本按钮                                                       |
| `Button.Link` / `LinkButton` | 链接按钮                                                       |

`confirm` 可传 `ReactNode`（作为 `Popconfirm` 标题）或 `Popconfirm` 配置对象；`tooltip` 可传 `ReactNode` 或 `Tooltip` 配置对象。传 `false` / `null` 表示关闭。

### `dict`

| 导出           | 说明                                                                                |
| -------------- | ----------------------------------------------------------------------------------- |
| `Dict`         | 聚合对象：`Dict.Text` / `Dict.Tag` / `Dict.Badge` / `Dict.CheckBox` / `Dict.Select` |
| `DictText`     | 字典文本展示                                                                        |
| `DictTag`      | 字典标签展示                                                                        |
| `DictBadge`    | 字典徽标展示                                                                        |
| `DictCheckBox` | 字典复选框组                                                                        |
| `DictSelect`   | 字典下拉选择（支持 `multiple` / `tags`）                                            |

`dict` 支持三种形态：值数组、`DictItem[]`、或 `Record` 映射。数据项可携带 `color`、`tagColor`、`badgeColor`、`textColor`、`badgeStatus`、`disabled` 等展示信息。

### `ex-form`

表单域组件，与 `@ant-design/pro-components` 的 `ProForm` 配合使用。

| 导出                 | 说明                   |
| -------------------- | ---------------------- |
| `ExFormDictSelect`   | 字典下拉选择表单域     |
| `ExFormDictCheckbox` | 字典复选框表单域       |
| `ExFormDictTag`      | 字典标签表单域（只读） |
| `ExFormDictBadge`    | 字典徽标表单域（只读） |
| `ExFormDictText`     | 字典文本表单域（只读） |
| `ExFormRegion`       | 区域选择表单域         |

### `region`

| 导出           | 说明                           |
| -------------- | ------------------------------ |
| `RegionSelect` | 区域下拉选择，支持单选与多选   |
| `RegionFlag`   | 区域旗帜，支持 `svg` 与 `icon` |
| `RegionTag`    | 区域标签，支持自定义 `render`  |

数据源来自 [lingting-geo-data](https://github.com/lingting/lingting-geo-data)，通过 [`src/lib/RegionUtils`](../lib/README.md) 访问。

### `copy`

| 导出       | 说明                                                             |
| ---------- | ---------------------------------------------------------------- |
| `Copyable` | 一键复制文本，优先使用 Clipboard API，失败时降级为 `execCommand` |

支持 `format` 自定义复制内容、`timeout` 控制成功态时长，以及 `onCopy` / `onSuccess` / `onFailed` 回调。

### `cloudflare`

| 导出                                   | 说明                              |
| -------------------------------------- | --------------------------------- |
| `CloudflareTurnstile`                  | Cloudflare Turnstile 人机验证组件 |
| `CloudflareTurnstileFormField`         | 对应的表单域组件                  |
| `CLOUDFLARE_TURNSTILE_DEFAULT_OPTIONS` | 默认验证选项                      |

## 相关文档

- 类型定义：[`src/types`](../types/README.md)
- 共享工具：[`src/lib`](../lib/README.md)
- 设计规范：[DESIGN.md](../../DESIGN.md)
