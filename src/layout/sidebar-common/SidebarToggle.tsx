import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { AntdButton } from "@lri/components";

import { SidebarCollapsed, useSidebarLayout } from "../SidebarLayout";

export function SidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebarLayout();
  return (
    <AntdButton
      aria-label="切换侧边栏"
      icon={
        collapsed === SidebarCollapsed.Collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
      }
      type="text"
      onClick={toggleCollapsed}
    />
  );
}
