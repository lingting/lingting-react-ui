# 命令与 CLI 约束

## pnpm 唯一入口

涉及项目依赖管理、项目脚本或 Node CLI 时，必须使用 pnpm，不使用 npm、yarn 或全局安装的 CLI。

```bash
pnpm install
pnpm run build
pnpm add package-name
pnpm add -D package-name
pnpm shadcn add button
```

禁止 `npm install`、`npm run`、`yarn add`、全局安装 CLI，以及直接调用 `shadcn`。若项目未声明所需 CLI，先以开发依赖安装到项目，再通过
`pnpm <cli-name> <command>` 调用。

## shadcn 信息与生成前检查

任何涉及 shadcn 组件、配置、版本、registry 或安装状态的操作前，执行：

```bash
pnpm shadcn info --json
```

执行文件生成、组件生成或 CLI 操作前，确认是否生成 shadcn 组件、覆盖已有文件、改变组件命名，以及是否符合命名规范。修改代码前确认
`components.json`、`package.json` 与 `pnpm-lock.yaml` 存在并检查其当前状态。

新增运行时依赖使用 `pnpm add <package-name>`；新增开发依赖使用 `pnpm add -D <package-name>`。

执行项目操作时，说明实际命令、使用原因、是否修改项目文件及影响范围。除非用户明确要求，不创建测试用例、也不执行或提供测试命令。
