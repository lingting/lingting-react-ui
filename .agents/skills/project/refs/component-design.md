# 组件库归属与组件设计

先按以下顺序判定：用户明确要求、`AGENTS.md`、当前目录的既有实现，最后才自行判断。归属未确定前不得设计 API、目录或导出。

| 类型 | 归属 | 可依赖 | 禁止包含 |
| --- | --- | --- | --- |
| Primitive | `src/components/` | `hooks`、`lib`、`types` | 领域语义、业务接口、硬编码权限数据或业务工作流 |
| 通用高级组件 | `src/components/` 或 `src/blocks/` | Primitive、`hooks`、`lib`、`types`、`layout` | 写死的领域实体、接口地址、业务菜单或业务流程 |
| 通用布局 | `src/layout/` | `blocks`、`components`、`store`、`types` | 具体领域页面、接口、模型或流程 |
| 通用 Store | `src/store/` | 组件库通用模块与 `types` | 领域状态、硬编码权限数据、独立类型文件、重复或转发逻辑 |
| 路由能力 | `src/layout/`、`src/hooks/`、`src/lib/`、`src/types/` | 组件库模块与路由依赖 | 具体业务页面、路由配置、接口或权限数据 |

## Primitive 与高级组件

Primitive 只承担 UI 渲染、样式、基础交互和组合，优先使用组合式 API。Ant Design 已提供的基础能力直接使用 ANTD；不要为基础 `Table` 创建项目封装。新增组件必须符合根目录 `DESIGN.md`。

通用高级组件可以处理请求、数据拉取、表格、分页、路由和权限认证适配，但必须通过泛型、配置、回调或适配接口接收数据源、字段、路由、用户与权限规则。保持领域无关，例如：

```tsx
<ExTable<User>
  request={queryUsers}
  columns={columns}
/>
```

`request` 与 `columns` 由使用方提供，组件库不导入业务 API 或领域模型。

## 结构规则

- Block 组合可复用的界面区块或页面壳；必须通过 Props 接收展示内容和行为。
- Layout 只实现通用应用或页面布局及其私有控制逻辑；不得绑定具体业务页面。
- 每个 Store 只有一个实现文件，相关 `use` Hook 必须与 Store 同文件；共享类型定义在 `src/types/`。
- 类型默认使用 `type`。仅在声明合并、模块扩展或无法等价表达时使用 `interface`；扩展对象类型优先使用 `&`。
- 将组件内与 UI 无关的计算和转换提取到 `src/lib/<Component>Utils.ts`。发现可跨组件复用时，迁移到按功能命名的 `src/lib/*Utils.ts`，先检查并合并同类工具，再从 `src/lib/index.ts` 导出。
- 颜色、表面和状态使用 ANTD 主题 token；不写内联硬编码主题色。可由 Tailwind 表达的结构 CSS 优先使用 `@apply`。

## 验收

确认公开模块不导入业务实现；确认公开模块从所属 `index.ts` 逐级导出；确认高级组件通过 Props、泛型、回调或适配接口承载差异；确认 ANTD 导入、token、文本与事件 API 符合主技能约束。
