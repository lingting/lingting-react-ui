# src/desktop

桌面端窗口能力组件。仅在桌面窗口容器（如 Electron / Tauri 外壳）内使用时才有意义。

## 职责与边界

- 只提供与宿主窗口系统交互的**入口组件**，具体窗口操作由调用方通过回调注入。
- 不依赖任何具体的桌面运行时，也不内置窗口控制实现。

## 公开导出

### `WindowResizeBorder`

窗口八方向缩放热区。渲染一圈透明的鼠标热区，按下左键时按方向回调，由调用方执行真正的窗口缩放。

```tsx
import { WindowResizeBorder } from "lingting-react-ui";

<WindowResizeBorder onStartResize={(direction) => windowApi.resize(direction)} />;
```

| 属性            | 说明                                                             |
| --------------- | ---------------------------------------------------------------- |
| `onStartResize` | `(direction: WindowResizeDirection) => void`，仅在左键按下时触发 |

```ts
type WindowResizeDirection =
  "north" | "south" | "west" | "east" | "northWest" | "northEast" | "southWest" | "southEast";
```

组件内部对左键之外的操作不做响应，并会 `preventDefault` / `stopPropagation`，避免与内容区的交互冲突。热区本身带 `aria-hidden`，不参与无障碍树。

## 使用场景

[`DesktopSidebarLayout`](../layout/README.md) 会在窗口未最大化时渲染该组件，把 `onStartResize` 透传给宿主。

## 相关文档

- 布局：[`src/layout`](../layout/README.md)
