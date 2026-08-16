---
name: project
description: 在本专用高级组件库中开发或维护 React、Ant Design v6、Tailwind CSS v4 代码，以及执行 pnpm 项目命令时使用。用于按任务加载参考资料并执行组件库工作流。
---

# 组件库开发

本 skill 与仓库根目录的 `AGENTS.md` 配套使用。开始任何工作前先阅读 `AGENTS.md`；其中的组件库边界、依赖方向、命名、导出、Ant Design、样式和验证约束是唯一规范来源，本文件不重复这些约束。

## 工作流

1. 检查与改动相邻的实现、入口和类型，按 `AGENTS.md` 确认模块保持领域无关并采用最小范围改动。
2. 设计实现前可检索 GitHub、GitLab 等公开来源，优先寻找使用相同基础框架与主要依赖版本的相近组件。检索结果仅用于理解 API、交互和边界条件；独立完成实现，不直接复制源码，避免许可证和版权冲突。
3. 只加载下表与任务相关的参考文件；多个任务条件同时成立时全部加载。
4. 实现后检查组件库依赖方向、命名、类型和导出入口；运行与改动相称的现有验证命令。涉及 antd 时遵循 antd skill 的 MCP 工具优先规则；仅在 MCP 不支持时使用 `pnpm antd`。

| 任务 | 必须加载 |
| --- | --- |
| 修改或新增 React/TSX 组件、表单、表格、高级组件、Block、Layout、Store，或确定公开导出 | [refs/component-design.md](refs/component-design.md) |
| 新建、移动、命名 TS/TSX 文件、目录、Hook、组件或公开模块 | [refs/naming.md](refs/naming.md) |
| 安装依赖、执行 pnpm 脚本、本地 CLI，或判断命令影响 | [refs/command-cli.md](refs/command-cli.md) |