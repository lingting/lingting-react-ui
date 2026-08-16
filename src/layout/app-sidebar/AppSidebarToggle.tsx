import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { SidebarCollapsed, useSidebarLayout } from "@/layout";

export default function AppSidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebarLayout();
  return (
    <Button
      aria-label="切换侧边栏"
      icon={collapsed === SidebarCollapsed.Collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      type="text"
      onClick={toggleCollapsed}
    />
  );
}
