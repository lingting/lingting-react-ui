import type { ReactNode } from "react";

import type { WindowResizeDirection } from "@lri/desktop";

import type { AppSidebarLayoutProps } from "../app-sidebar/AppSidebarLayoutTypes";

export type DesktopSidebarLayoutProps = AppSidebarLayoutProps & {
  icon?: ReactNode;
  isMaximized: () => Promise<boolean>;
  onClose: () => void;
  onMinimize: () => void;
  onStartDrag: () => void;
  onStartResize: (direction: WindowResizeDirection) => void;
  onToggleMaximize: () => void;
};
