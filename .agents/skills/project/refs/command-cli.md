# 命令与本地 CLI

使用 pnpm 管理依赖、执行脚本和调用 Node CLI；不使用 npm、yarn、全局安装的 CLI 或 shadcn 命令。

```powershell
pnpm install
pnpm dev
pnpm build
pnpm format
pnpm add <package>
pnpm add -D <package>
pnpm <local-cli> <command>
```

执行会修改依赖、锁文件或生成源码的命令前：确认 `package.json` 与 `pnpm-lock.yaml` 当前状态，确认命令目标、覆盖行为和影响范围。所需 CLI 未被项目声明时，先作为开发依赖安装。

仓库现有脚本：`dev`、`build`、`format`。优先运行能覆盖改动的最窄命令；没有测试脚本时，不虚构测试命令。
