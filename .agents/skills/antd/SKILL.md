---
name: antd
description: >
  Use when the user's task involves Ant Design (antd): writing components,
  debugging issues, querying APIs, tokens, demos, semantic structure,
  migrations, or analyzing antd usage.
allowed-tools:
  - mcp__antd__antd_list
  - mcp__antd__antd_info
  - mcp__antd__antd_doc
  - mcp__antd__antd_demo
  - mcp__antd__antd_token
  - mcp__antd__antd_design_md
  - mcp__antd__antd_semantic
  - mcp__antd__antd_changelog
  - Bash(pnpm antd *)
  - Bash(pnpm add -D @ant-design/cli*)
  - Bash(pnpm install*)
---

# Ant Design 工具

## 工具优先级

涉及 antd 组件、API、示例、设计语言或版本变更时，先使用 antd MCP 工具，不要先运行 `pnpm antd`：

| 需求 | 首选工具 |
| --- | --- |
| 组件列表 | `antd_list` |
| Props、类型、默认值 | `antd_info` |
| 完整组件文档 | `antd_doc` |
| Demo 源码 | `antd_demo` |
| 全局或组件 token | `antd_token` |
| 设计语言 | `antd_design_md` |
| 语义 classNames/styles | `antd_semantic` |
| 版本 changelog 或 API 差异 | `antd_changelog` |

如果 MCP 工具不支持所需行为，才使用项目本地 `pnpm antd` CLI。典型 CLI-only 行为包括 `lint`、`usage`、`env`、`doctor`、`migrate`、`bug`、`bug-cli` 和 `upgrade`。

## 编码流程

1. 先通过 `antd_info` 查询组件 API；需要完整背景时再查 `antd_doc`，需要范例时查 `antd_demo`。
2. 根据项目实际 antd 主版本查询；不要凭记忆猜测 Props 或事件签名。
3. 修改 antd 代码后，MCP 不支持 lint，因此使用 `pnpm antd lint <changed-files> --format json`；优先只检查改动文件。
4. 结构化 CLI 输出使用 `--format json`。CLI 首次使用或缺失时才安装项目本地 CLI；不要使用全局 CLI：
   ```bash
   pnpm antd --version ~6.5.1 || pnpm add -D @ant-design/cli
   ```
5. CLI 输出出现 “Update available” 时运行 `pnpm antd upgrade`。

## 版本迁移与问题报告

版本迁移前优先用 `antd_changelog` 比较版本；实际迁移使用 CLI 的 `migrate`。报告 antd 或 CLI 问题时使用 CLI 的 `bug` 或 `bug-cli`，先预览并取得用户确认后再提交。环境和项目级诊断使用 `env`、`doctor`；项目用法统计和最佳实践检查使用 `usage`、`lint`。

## 关键规则

- 始终先查询再编写；遵循仓库 `AGENTS.md` 的架构、样式和验证约束。
- 只使用当前项目版本支持的 API；不把旧版本兼容 Props 带入实现。
- 所有 antd CLI 命令都通过 `pnpm antd` 调用。
- 若设置 `ANTD_NO_AUTO_REPORT=1`，除非用户直接要求，不建议使用 `bug` 或 `bug-cli`。
