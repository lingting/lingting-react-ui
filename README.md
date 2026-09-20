# lingting-react-ui

`lingting-react-ui` 是基于 React、Vite、pnpm、Ant Design v6 与 Ant Design Pro Components 构建的专用高级组件库。

## 定位

- 提供领域无关、可组合、可迁移的基础组件、高级组件、布局、Block、Hook、工具与类型。
- 高级组件通过泛型、配置和回调接收数据源、字段与渲染策略；可提供通用路由、布局、登录表单及抽象权限认证，但不包含业务实体、接口或具体业务状态。
- 所有公开模块从 `src/index.ts` 导出；各分类目录通过自身 `index.ts` 维护公开边界。
- `src/components/region` 的区域数据源来自 [lingting-geo-data](https://github.com/lingting/lingting-geo-data)。

## 布局

`src/layout` 提供 `BasicLayout`、`SidebarLayout`、`AppSidebarLayout` 与 `DesktopSidebarLayout`。

### 屏幕模式

- `BasicLayout` 统一识别屏幕模式并写入布局上下文，默认以 768px 为宽度阈值，可通过 `smallScreenBreakpoint` 调整。
- **在 `BasicLayout` 内必须通过布局上下文读取屏幕模式**，不要自行调用 `useScreenMode`：

```tsx
import { useLayout } from "lingting-react-ui";

function Content() {
  const { screenMode } = useLayout(); // "default" | "small"
  // ...
}
```

- `useScreenMode` 的阈值由调用方传入，在 `BasicLayout` 内自行调用可能与 `BasicLayout` 的判定不一致，因此仅用于 `BasicLayout` 之外。
- `SidebarLayout`、`AppSidebarLayout`、`DesktopSidebarLayout` 会把 `smallScreenBreakpoint` 传给内部 `BasicLayout`，宿主只需在布局组件上传入一次。

### 侧边栏展示方式

`SidebarLayoutProps.sidebarDisplay` 控制侧栏展示方式：

| 取值           | 行为                         |
| -------------- | ---------------------------- |
| `auto`（默认） | 小屏幕使用抽屉，其余使用平铺 |
| `inline`       | 始终平铺                     |
| `drawer`       | 始终使用抽屉                 |

抽屉展示方式下侧栏默认隐藏，`SidebarToggle` 在隐藏与展示之间切换，并且始终渲染。

## 开发

```shell
pnpm install
pnpm dev
pnpm build
pnpm format
```

开发约束见 [AGENTS.md](./AGENTS.md)。涉及 Ant Design API、示例、token 或语义结构时，先使用 `.agents/skills/antd/SKILL.md` 规定的 MCP 工具。
