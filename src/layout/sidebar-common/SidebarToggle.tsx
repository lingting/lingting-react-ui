import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { AntdButton } from "@lri/components";

import { SidebarCollapsed, useSidebarLayout } from "@lri/layout";

export function SidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebarLayout();
  const expanded = collapsed === SidebarCollapsed.Expanded;
  return (
    <AntdButton
      aria-label="切换侧边栏"
      icon={expanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      type="text"
      onClick={toggleCollapsed}
    />
  );
}
