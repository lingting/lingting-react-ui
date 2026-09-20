import type { WindowResizeDirection } from "@lri/desktop";

import type { AppSidebarLayoutProps } from "@lri/layout";

export type DesktopSidebarLayoutProps = Omit<
  AppSidebarLayoutProps,
  "layout" | "showSidebarToggle" | "sidebarDisplay"
> & {
  isMaximized: () => Promise<boolean>;
  onClose: () => void;
  onMinimize: () => void;
  onStartDrag: () => void;
  onStartResize: (direction: WindowResizeDirection) => void;
  onToggleMaximize: () => void;
};
