# 文件与命名约束

除 Hook 文件外，TypeScript 与 TSX 文件使用 UpperCamelCase，例如 `UserProfile.tsx`、`AccountSettings.ts`、`OrderTable.tsx` 与
`ApiClient.ts`。目录使用全小写 kebab-case，例如 `user-profile/`、`account-settings/` 与 `order-table/`。

React 组件文件使用 `PascalCase.tsx`，其导出组件名使用 `PascalCase`。Hook 文件使用 `use` 加 PascalCase 的 camelCase 文件名，例如
`useUserInfo.ts`、`useAuthState.ts`，导出 Hook 名称与文件名一致。

创建或移动文件前，确认不属于 `src/components/shadcn/ui/` 的受保护原始组件修改，文件与目录命名正确，不覆盖已有文件，且符合
`refs/component-design.md` 的组件层级。

业务需求与 shadcn 组件同名时，保留 shadcn 原名称与路径，在对应业务目录创建语义明确的封装组件。例如，已有
`src/components/shadcn/ui/dialog.tsx` 时，订单确认弹窗应命名为 `src/pro/order-dialog/OrderConfirmDialog.tsx`，不得放入
shadcn 目录或重命名 shadcn 的 `Dialog`。
