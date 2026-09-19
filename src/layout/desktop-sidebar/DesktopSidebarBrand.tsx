import { Avatar, Typography } from "antd";
import type { MouseEvent, ReactNode } from "react";

import { SidebarCollapsed, useSidebarLayout } from "../SidebarLayout";

export type DesktopSidebarBrandProps = {
  icon?: ReactNode;
  onStartDrag: () => void;
  onToggleMaximize: () => void;
  title?: string;
};

/**
 * 侧边栏顶部品牌区，同时作为桌面窗口的拖拽区域。
 */
export function DesktopSidebarBrand({
  icon,
  onStartDrag,
  onToggleMaximize,
  title,
}: DesktopSidebarBrandProps) {
  const { collapsed } = useSidebarLayout();

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (event.button !== 0 || event.detail >= 2) {
      return;
    }

    onStartDrag();
  };

  return (
    <div
      className="desktop-sidebar-layout__brand"
      onDoubleClick={onToggleMaximize}
      onMouseDown={handleMouseDown}
    >
      {icon && <Avatar shape="square" size={30} src={icon} />}
      {collapsed === SidebarCollapsed.Expanded && (
        <Typography.Text ellipsis strong>
          {title}
        </Typography.Text>
      )}
    </div>
  );
}
