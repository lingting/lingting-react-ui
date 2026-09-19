import type { WindowResizeDirection } from "@lri/desktop";

import type { AppSidebarLayoutProps } from "../app-sidebar/AppSidebarLayoutTypes";

export type DesktopSidebarLayoutProps = Omit<
  AppSidebarLayoutProps,
  "layout" | "showSidebarToggle"
> & {
  isMaximized: () => Promise<boolean>;
  onClose: () => void;
  onMinimize: () => void;
  onStartDrag: () => void;
  onStartResize: (direction: WindowResizeDirection) => void;
  onToggleMaximize: () => void;
};
