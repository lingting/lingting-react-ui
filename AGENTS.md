# 组件样式约束

1. 新组件的颜色必须由主题提供。
2. 禁止在组件内部写死样式，必须通过 CSS 类提供样式，以便外部覆盖。

## 基础组件使用约束

1. 业务组件与应用源码中，禁止直接使用原生 `button`、`input`、`textarea`、`select`、`option`、`label`、`checkbox`、`radio` 等已有 shadcn 对应基础组件的标签。
2. 必须优先复用 `src/components/shadcn/ui/` 中已有的 shadcn 基础组件；例如操作使用 `Button`，文本输入使用 `Input` 或 `Textarea`，表单标签使用 `Label`，选择与勾选使用对应的 `Select`、`Checkbox`、`RadioGroup`、`Switch`。
3. `src/components/shadcn/ui/` 是受保护的原始组件实现目录，其内部为实现 shadcn 组件而使用的原生标签不受本规则限制，除非已获得修改原始组件的明确授权。

## 导出入口约束

1. `src/index.ts` 仅允许通过 `export * from "./components"`、`"./hooks"`、`"./lib"` 与 `"./types"` 聚合导出，禁止逐项列举组件、类型或工具函数。
2. `src/lib`、`src/types` 与 `src/hooks` 必须各自维护 `index.ts`，仅导出对应目录中允许对外使用的模块。
3. 每个组件分类目录必须维护 `index.ts`，只导出该分类允许对外使用的组件、Props 与类型；`src/components/index.ts` 负责聚合这些组件入口。
4. 新增公开模块时，必须先在其所属目录的 `index.ts` 声明导出，再由上层入口逐级聚合；内部实现文件不得直接从根入口导出。
