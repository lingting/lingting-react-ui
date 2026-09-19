import { Menu, type MenuProps } from "antd";
import { useMemo } from "react";

import { useRouter } from "@lri/hooks";
import { joinRoutePath } from "@lri/lib";
import type { MenuRouteDefinition } from "@lri/types";

import { SidebarCollapsed, useSidebarLayout } from "@lri/layout";

import './SidebarMenu.css'

function createRouteMenuItems(
  definitions: readonly MenuRouteDefinition[],
  parentPath = "",
): NonNullable<MenuProps["items"]> {
  return definitions.map((definition) => {
    const fullPath = joinRoutePath(parentPath, definition.path);
    return {
      children: definition.component
        ? undefined
        : createRouteMenuItems(definition.children, fullPath),
      icon: definition.icon,
      key: fullPath,
      label: definition.title,
    };
  });
}

export type SidebarMenuProps = {
  menuRoutes: readonly MenuRouteDefinition[];
  openKeys: string[];
  pathname: string;
  setOpenKeys: (keys: string[]) => void;
};

export function SidebarMenu({ menuRoutes, openKeys, pathname, setOpenKeys }: SidebarMenuProps) {
  const router = useRouter();
  const { collapsed } = useSidebarLayout();
  const routeItems = useMemo(() => createRouteMenuItems(menuRoutes), [menuRoutes]);

  return (
    <Menu
      className={"sidebar-layout__menu"}
      inlineCollapsed={collapsed === SidebarCollapsed.Collapsed}
      items={routeItems}
      mode="inline"
      onClick={({ key }) => void router.navigate(key)}
      onOpenChange={setOpenKeys}
      openKeys={collapsed === SidebarCollapsed.Collapsed ? [] : openKeys}
      selectedKeys={[pathname]}
      tooltip={collapsed === SidebarCollapsed.Collapsed ? { placement: "right" } : false}
    />
  );
}
