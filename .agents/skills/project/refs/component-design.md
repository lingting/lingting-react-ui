# React 组件设计约束

本项目是企业级 React 组件库。实现任何组件前，必须先判断其为 Primitive Component（基础组件）或 Business Component（业务组件）。

## 类型判定

判定优先级为：用户明确指定 > 本项目规范 > 自动判断。用户指定“基础 Table”时按 Primitive 实现；指定“ProTable”时按 Business
实现。用户未指定时，组件只要包含请求、查询、分页、排序、权限、数据处理或业务流程中的任一项，即为 Business；否则为 Primitive。

## Primitive Component

通用 UI 元素、没有业务流程与接口请求、不管理业务状态、可跨场景复用或接近 HTML 原生能力的组件属于 Primitive，例如
Button、Input、Select、Checkbox、Radio、Dialog、Drawer、Tabs、Card、Table、Form Field 与 Pagination。

Primitive 必须采用组合式 API，优先组件组合而非配置对象：

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Tom</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Primitive 只负责 UI 渲染、样式、无障碍、基础交互与组件组合。禁止 API 请求、数据获取、权限逻辑、业务规则、工作流和领域模型；例如
Button 不得接受 `permission` 或 `api` 等业务 props。

Primitive 位于 `src/components/` 体系。复合 Primitive 可按组件目录拆分，例如 `Table/Table.tsx`、`Table/TableRow.tsx`、
`Table/TableCell.tsx` 与 `Table/index.ts`。

对外发布的自研 Primitive 从 `lingting-react-ui` 根入口导入；已有 shadcn 原始组件继续从 `lingting-react-ui/shadcn`
导入。两类入口均不得混入 Business 组件。

## Business Component

包含业务流程、数据加载、查询、分页、排序、权限、CRUD 或面向具体业务场景的组件属于 Business，例如
ProTable、SearchTable、CRUDTable、ProForm、PageContainer、UserSelector、PermissionTree 与 BusinessDashboard。

Business 必须采用配置驱动 API，在业务效率优先的场景中配置优于组合：

```tsx
<ProTable
  request={queryUsers}
  columns={[
    {title: "Name", dataIndex: "name"},
    {title: "Status", dataIndex: "status"},
  ]}
  pagination
/>
```

Business 负责数据状态、请求封装、查询、分页、排序、加载、空状态、错误状态、权限控制与常用业务流程。Business 可以使用
Primitive；Primitive 严禁导入或依赖 Business。

Business 位于 `src/pro/` 体系。新增第一个需要公开发布的 Business 组件时，同步创建 `src/pro.ts` 聚合入口并在 `package.json`
增加 `./pro` export，使消费者从 `lingting-react-ui/pro` 导入。Business 不得进入 `lingting-react-ui` 根入口或
`lingting-react-ui/shadcn` 子入口。

本规则只定义未来新增时的结构；当前没有 Business 组件时，不创建空的 `src/pro.ts`，也不修改 `package.json`。

## Table 与 Form 分层

Table Primitive 仅提供 table 结构、header、body、row 与 cell 的组合组件，不接受 `columns`、`request`、`pagination` 或 `filter`
。ProTable 位于 Business 层，负责 columns、request、分页、查询、排序和导出。

基础 Form 通过 `<Form><FormItem><Input /></FormItem></Form>` 组合，负责布局、校验绑定与字段组合。ProForm 位于 Business 层，通过
schema 等配置负责 schema 渲染、提交、重置与请求：

```tsx
<ProForm
  schema={[
    {name: "username", type: "input"},
  ]}
/>
```

## 实现原则

低层组件采用组合 API，高层组件采用配置 API。禁止将业务智能放入 Primitive 组件。
