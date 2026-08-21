# lingting-react-ui

`lingting-react-ui` 是基于 React、Vite、pnpm、Ant Design v6 与 Ant Design Pro Components 构建的专用高级组件库。

## 定位

- 提供领域无关、可组合、可迁移的基础组件、高级组件、布局、Block、Hook、工具与类型。
- 高级组件通过泛型、配置和回调接收数据源、字段与渲染策略；可提供通用路由、布局、登录表单及抽象权限认证，但不包含业务实体、接口或具体业务状态。
- 所有公开模块从 `src/index.ts` 导出；各分类目录通过自身 `index.ts` 维护公开边界。
- `src/components/region` 的区域数据源来自 [lingting-geo-data](https://github.com/lingting/lingting-geo-data)。

## 开发

```shell
pnpm install
pnpm dev
pnpm build
pnpm format
```

开发约束见 [AGENTS.md](./AGENTS.md)。涉及 Ant Design API、示例、token 或语义结构时，先使用 `.agents/skills/antd/SKILL.md` 规定的 MCP 工具。
