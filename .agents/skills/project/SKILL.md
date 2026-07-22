---
name: project
description: 在 lingting-react-ui 中开发或维护 React 组件、shadcn/ui 组件、业务 Pro 组件，或执行项目依赖、脚本和本地 CLI 操作时使用。用于判断组件层级，并加载项目命令、shadcn、命名和组件设计约束。
---

# lingting-react-ui 项目技能

本技能用于本项目的 React 组件开发与项目工具操作。项目采用 React、shadcn/ui 与 pnpm；基础组件与业务组件必须严格分层。

## 使用流程

1. 开始实现组件前，先判断其为 Primitive Component 还是 Business Component。
2. 按下表加载与任务直接相关的 refs；涉及多个领域时，加载全部对应 refs。
3. 在 refs 约束与用户明确要求冲突时，优先遵循用户明确要求；项目全局约束始终适用。

## Ref 加载索引

| 任务情形                                                                                               | 必须加载                                             |
|--------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| 新增、修改、设计或拆分任意 React 组件；判断 Primitive / Business；设计 Table、Form、Pro 组件或公开导出 | [refs/component-design.md](refs/component-design.md) |
| 使用、生成、升级、修改或扩展 shadcn/ui；处理 shadcn 组件命名、全局样式或 Tailwind 配置影响             | [refs/shadcn.md](refs/shadcn.md)                     |
| 执行 pnpm 脚本、安装依赖、调用项目本地 CLI、执行组件生成命令或说明命令影响                             | [refs/command-cli.md](refs/command-cli.md)           |
| 新建、移动或命名 TypeScript、TSX、Hook、目录或业务组件；处理名称冲突                                   | [refs/naming.md](refs/naming.md)                     |

## 组件类型预判

用户明确指定组件类型时直接采用该类型。未指定时，先加载 `refs/component-design.md` 完成判定；不要在未完成判定前设计
API、目录或导出方式。
