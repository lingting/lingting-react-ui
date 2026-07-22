# Project Skill: React + shadcn Component Development

## Purpose

本 Skill 用于指导当前项目中 React 前端组件开发、shadcn 组件管理、CLI 执行规范以及代码修改授权流程。

适用范围：

* React 项目
* 基于 shadcn/ui 的组件体系
* pnpm 作为唯一包管理和命令执行工具

---

## Core Rules

### 1. 技术栈约束

项目默认技术栈：

* 前端框架：React
* UI 组件体系：shadcn/ui
* 包管理器：pnpm

所有依赖安装、脚本执行、CLI 调用必须使用 pnpm。

禁止：

```bash
npm install
npm run
yarn add
yarn dev
```

必须使用：

```bash
pnpm install
pnpm run
pnpm add
```

---

## 2. shadcn 信息获取规范

任何涉及 shadcn 组件、配置、版本、registry 或安装状态的操作前，必须先获取当前项目 shadcn 信息。

固定执行：

```bash
pnpm shadcn info --json
```

禁止：

```bash
shadcn info --json
```

原因：

* 禁止依赖全局 shadcn CLI
* 必须使用当前项目锁定版本
* 保证不同项目之间 CLI 行为一致
* 避免全局版本污染项目环境

---

## 3. CLI 使用规范

### 禁止全局 CLI

任何 CLI 工具禁止通过全局安装使用：

禁止：

```bash
npm install -g xxx
xxx command
```

禁止：

```bash
shadcn add button
```

---

### 必须使用项目本地 CLI

优先使用：

```bash
pnpm <cli-name> <command>
```

例如：

正确：

```bash
pnpm shadcn add button
pnpm shadcn info --json
```

错误：

```bash
shadcn add button
shadcn info --json
```

如果项目不存在对应 CLI：

先安装到项目：

```bash
pnpm add -D <cli-name>
```

然后：

```bash
pnpm <cli-name> <command>
```

---

## 4. shadcn 组件修改授权流程

### 默认行为

禁止直接修改 shadcn 生成组件源码。

例如：

禁止直接修改：

```
components/ui/button.tsx
components/ui/dialog.tsx
components/ui/input.tsx
```

---

### 修改前必须请求授权

如果需要修改 shadcn 组件代码，必须先说明：

1. 修改原因
2. 修改目标
3. 影响范围
4. 具体改动概要

格式：

```
需要修改 shadcn 组件：

文件：
components/ui/button.tsx

原因：
当前按钮组件无法满足 XXX 场景，需要支持 XXX。

改动概要：
1. 增加 XXX props
2. 调整 XXX 样式逻辑
3. 保持原有 API 兼容

影响：
会影响所有使用 Button 的页面。

是否授权修改？
```

只有获得明确授权后，才能修改。

---

## 5. shadcn 组件扩展优先级

修改 shadcn 原始组件前，优先考虑：

### 优先方案 1：业务组件封装

推荐：

```
components/
├── ui/
│   └── button.tsx        # shadcn 原始组件
└── common/
    └── app-button.tsx    # 业务封装
```

---

### 优先方案 2：通过 props 扩展

例如：

```tsx
<Button variant="custom">
  Submit
</Button>
```

而不是直接修改内部实现。

---

### 优先方案 3：新增组件

如果需求属于业务能力：

创建：

```
components/features/
```

不要污染：

```
components/ui/
```

---

## 6. 命令执行规范

所有命令必须通过 pnpm。

示例：

启动：

```bash
pnpm dev
```

构建：

```bash
pnpm build
```

检查：

```bash
pnpm lint
```

测试：

```bash
pnpm test
```

---

## 7. 修改代码前检查

执行代码修改前：

1. 检查项目结构
2. 检查 package.json
3. 检查 shadcn 配置

必须确认：

```
components.json
package.json
pnpm-lock.yaml
```

存在且符合项目状态。

---

## 8. 依赖管理规范

新增依赖：

运行时依赖：

```bash
pnpm add package-name
```

开发依赖：

```bash
pnpm add -D package-name
```

禁止：

```bash
npm install package-name
```

禁止：

```bash
yarn add package-name
```

---

## 9. 输出要求

执行任何项目操作时，需要说明：

* 使用的命令
* 为什么使用该命令
* 是否修改项目文件
* 修改影响范围

例如：

```
执行：

pnpm shadcn info --json

原因：
获取当前项目 shadcn 配置信息，确认组件来源和版本。

修改：
无。

影响：
无。
```

---

## 10. 安全边界

以下操作必须提前确认：

* 修改 shadcn/ui 原始组件
* 删除 shadcn 组件
* 修改全局样式影响组件行为
* 修改 tailwind 配置影响已有组件
* 升级 shadcn 相关依赖

确认格式：

```
检测到该操作可能影响已有组件。

操作：
XXX

风险：
XXX

预计改动：
XXX

是否继续？
```

# 11. 命名规范

## 11.1 shadcn 组件命名保护

禁止修改 shadcn 官方生成组件的命名。

包括但不限于：

* 组件文件名
* React Component 名称
* export 名称
* import 路径约定

例如：

原始：

```tsx
components/ui/button.tsx

export function Button() {}
```

必须保持：

```tsx
Button
button.tsx
```

禁止修改为：

```tsx
components/ui/app-button.tsx

export function AppButton() {}
```

或者：

```tsx
components/ui/primary-button.tsx

export function PrimaryButton() {}
```

原因：

* 保持 shadcn 生态兼容
* 避免后续 `pnpm shadcn add/update` 时产生冲突
* 保持组件来源清晰

---

## 11.2 shadcn 组件扩展规则

如果需要业务化命名，必须创建新的业务组件。

正确：

```text
components/
├── ui/
│   └── button.tsx
└── app/
    └── app-button.tsx
```

示例：

```tsx
import { Button } from "@/components/ui/button"

export function AppButton() {
  return <Button />
}
```

禁止：

直接修改：

```text
components/ui/button.tsx
```

然后改名：

```text
components/ui/app-button.tsx
```

---

# 12. 文件与目录命名规范

## 12.1 TypeScript / TSX 文件命名

所有 `.ts` / `.tsx` 文件必须使用大驼峰命名（UpperCamelCase）。

正确：

```text
UserProfile.tsx
AccountSettings.ts
OrderTable.tsx
UseUserData.ts
ApiClient.ts
```

禁止：

```text
user-profile.tsx
user_profile.tsx
UserProfile.tsx
ACCOUNT.ts
```

---

## 12.2 文件夹命名

所有目录必须：

* 全小写
* 使用 `-` 分隔多个单词

格式：

```text
lowercase-kebab-case
```

正确：

```text
components/
user-profile/
account-settings/
order-table/
api-client/
```

禁止：

```text
UserProfile/
user_profile/
userProfile/
ACCOUNT/
```

---

## 12.3 React 组件文件规则

React 组件文件：

文件名：

```text
CamelCase.tsx
```

组件名称：

```tsx
PascalCase
```

示例：

文件：

```text
UserCard.tsx
```

内容：

```tsx
export function UserCard() {
  return <div />
}
```

---

## 12.4 Hook 文件规则

Hook 文件：

文件名：

```text
use + PascalCase
```

采用 camelCase 文件命名。

正确：

```text
useUserInfo.ts
useAuthState.ts
useThemeMode.ts
```

内容：

```ts
export function useUserInfo() {}
```

---

# 13. 新增文件检查规则

创建新文件前必须检查：

1. 是否属于 shadcn 官方组件目录
2. 文件名是否符合 UpperCamelCase
3. 目录名是否符合 kebab-case
4. 是否会覆盖已有组件

检查示例：

```
新增：

components/user-profile/UserCard.tsx

检查：

目录：
user-profile ✅

文件：
UserCard.tsx ✅

是否覆盖 shadcn：
否 ✅
```

---

# 14. 命名冲突处理

如果业务需求名称与 shadcn 组件冲突：

优先级：

1. 保留 shadcn 原命名
2. 创建业务封装组件
3. 使用业务语义命名

示例：

已有：

```text
components/ui/dialog.tsx
```

新增业务弹窗：

正确：

```text
components/order-dialog/OrderConfirmDialog.tsx
```

禁止：

```text
components/ui/orderDialog.tsx
```

---

# 15. 命令执行前规则检查

执行任何涉及文件生成、组件生成、CLI 操作的命令前，需要确认：

* 是否会生成新的 shadcn 组件
* 是否会覆盖已有组件
* 是否会改变组件命名
* 是否符合目录和文件命名规范

涉及 shadcn 生成操作：

必须使用：

```bash
pnpm shadcn <command>
```

禁止：

```bash
shadcn <command>
```

---

## Skill Summary

本项目开发助手必须遵守：

1. React + shadcn/ui 组件体系
2. 所有命令使用 pnpm
3. 禁止全局 CLI
4. CLI 必须使用项目本地版本
5. shadcn 信息必须通过：

```bash
pnpm shadcn info --json
```

6. 修改 shadcn 组件源码必须获得授权
7. 修改前必须说明原因和改动概要
8. 优先封装，不直接修改基础组件
