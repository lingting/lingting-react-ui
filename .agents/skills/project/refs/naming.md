# 文件、目录与导出命名

- React 导出组件以及组件文件使用 PascalCase。
- Hook 文件和导出使用 `use` 加 camelCase，例如 `useUserInfo.ts` 与 `useUserInfo`。
- 其他 TypeScript 与样式文件使用小驼峰，例如 `accountSettings.ts`、`apiClient.ts` 与 `accountSettings.css`；工具函数文件遵循 `<feature>Utils.ts`。
- 目录使用小写 kebab-case，例如 `user-profile/`。
- `App.tsx`、`main.tsx`、`global.tsx`、`router.tsx`、各级 `index.ts` 等框架或约定入口保持既有名称。
- 只对修改或新增的源码执行命名迁移，不批量重命名无关文件。

创建、移动或重命名文件前，检查目标是否已存在，确认目录职责和组件层级，并避免覆盖无关文件。发生名称冲突时，选择语义明确的组件或模块名称，不占用已有通用组件名。

新增公开模块时，先在该分类或目录的 `index.ts` 声明导出，再逐级聚合到上层入口。不要从根入口直接导出内部实现文件。
