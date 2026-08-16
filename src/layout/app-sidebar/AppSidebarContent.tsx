import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { Avatar, Dropdown, Menu, type MenuProps, Typography } from "antd";
import { Children, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { SidebarCollapsed, SidebarLayout, useSidebarLayout } from "@/layout";
import { findMenuAncestorPaths, joinRoutePath, normalizeRoutePath } from "@/lib";
import { useUserStore } from "@/store";
import type { MenuRouteDefinition, ProUser } from "@/types";

import { useAppSidebarLayoutProps } from "./AppSidebarLayoutContext";
import type { AppSidebarLayoutProps } from "./AppSidebarLayoutTypes";
import AppSidebarToggle from "./AppSidebarToggle";

import "../AppSidebarLayout.css";

const USER_ITEM_KEY = "__app-sidebar-user";
const LOGOUT_ITEM_KEY = "__app-sidebar-logout";

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

function UserText({ user }: { user: ProUser }) {
  return (
    <div className="app-sidebar-layout__user-text">
      <Typography.Text ellipsis>{user.nickname}</Typography.Text>
      {user.desc ? (
        <Typography.Text ellipsis type="secondary">
          {user.desc}
        </Typography.Text>
      ) : null}
    </div>
  );
}

function UserDropdown({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  return (
    <Dropdown
      menu={{
        items: [{ icon: <LogoutOutlined />, key: LOGOUT_ITEM_KEY, label: "退出登录" }],
        onClick: onLogout,
      }}
      trigger={["click"]}
    >
      {children}
    </Dropdown>
  );
}

function AppSidebarMenu({
  menuRoutes,
  openKeys,
  pathname,
  setOpenKeys,
}: {
  menuRoutes: readonly MenuRouteDefinition[];
  openKeys: string[];
  pathname: string;
  setOpenKeys: (keys: string[]) => void;
}) {
  const router = useRouter();
  const { collapsed } = useSidebarLayout();
  const routeItems = useMemo(() => createRouteMenuItems(menuRoutes), [menuRoutes]);

  return (
    <Menu
      inlineCollapsed={collapsed === SidebarCollapsed.Collapsed}
      items={routeItems}
      mode="inline"
      onClick={({ key }) => void router.navigate({ to: key })}
      onOpenChange={setOpenKeys}
      openKeys={collapsed === SidebarCollapsed.Collapsed ? [] : openKeys}
      selectedKeys={[pathname]}
      tooltip={collapsed === SidebarCollapsed.Collapsed ? { placement: "right" } : false}
    />
  );
}

function AppSidebarUserMenu({
  logoutPosition,
  user,
}: {
  logoutPosition: AppSidebarLayoutProps["logoutPosition"];
  user: ProUser;
}) {
  const { collapsed } = useSidebarLayout();
  const { logout } = useUserStore();
  const handleLogout = useCallback(() => void logout().catch(() => undefined), [logout]);
  const withLogout = logoutPosition === "user";
  const avatar = (
    <Avatar
      className="app-sidebar-layout__user-avatar"
      icon={!user.avatar ? <UserOutlined /> : undefined}
      src={user.avatar}
    />
  );
  const text = <UserText user={user} />;

  return (
    <Menu
      className="app-sidebar-layout__user"
      inlineCollapsed={collapsed === SidebarCollapsed.Collapsed}
      items={[
        {
          icon: withLogout ? <UserDropdown onLogout={handleLogout}>{avatar}</UserDropdown> : avatar,
          key: USER_ITEM_KEY,
          label: withLogout ? <UserDropdown onLogout={handleLogout}>{text}</UserDropdown> : text,
          title: [user.nickname, user.desc].filter(Boolean).join(" - "),
        },
      ]}
      mode="inline"
      selectable={false}
      tooltip={collapsed === SidebarCollapsed.Collapsed ? { placement: "right" } : false}
    />
  );
}

function AppSidebarLogoutMenu() {
  const { collapsed } = useSidebarLayout();
  const { logout } = useUserStore();
  const handleLogout = () => void logout().catch(() => undefined);

  return (
    <Menu
      inlineCollapsed={collapsed === SidebarCollapsed.Collapsed}
      items={[{ icon: <LogoutOutlined />, key: LOGOUT_ITEM_KEY, label: "退出登录" }]}
      mode="inline"
      onClick={handleLogout}
      selectable={false}
      tooltip={collapsed === SidebarCollapsed.Collapsed ? { placement: "right" } : false}
    />
  );
}

export function AppSidebarContent() {
  const {
    baseItems = [],
    bottomItems = [],
    headerLeftItems: sourceHeaderLeftItems,
    logoutPosition = "bottom",
    menuRoutes,
    userPosition = "top",
    ...sidebarProps
  } = useAppSidebarLayoutProps();
  const { user } = useUserStore();
  const pathname = useRouterState({
    select: (state) => normalizeRoutePath(state.location.pathname),
  });
  const ancestorPaths = useMemo(
    () => findMenuAncestorPaths(menuRoutes, pathname),
    [menuRoutes, pathname],
  );
  const [openKeys, setOpenKeys] = useState<string[]>(ancestorPaths);
  const headerLeftItems = useMemo(
    () =>
      Children.toArray([<AppSidebarToggle key="__app-sidebar-toggle" />, sourceHeaderLeftItems]),
    [sourceHeaderLeftItems],
  );

  useEffect(() => {
    setOpenKeys((current) => Array.from(new Set([...current, ...ancestorPaths])));
  }, [ancestorPaths]);

  const showUser = userPosition !== "hidden" && user !== undefined;
  const routeMenu = (
    <AppSidebarMenu
      key="__app-sidebar-routes"
      menuRoutes={menuRoutes}
      openKeys={openKeys}
      pathname={pathname}
      setOpenKeys={setOpenKeys}
    />
  );
  const userMenu = showUser ? (
    <AppSidebarUserMenu key={USER_ITEM_KEY} logoutPosition={logoutPosition} user={user} />
  ) : undefined;

  return (
    <SidebarLayout
      {...sidebarProps}
      className="app-sidebar-layout"
      baseItems={Children.toArray([
        userMenu && userPosition === "top" ? userMenu : undefined,
        baseItems,
        routeMenu,
      ])}
      bottomItems={Children.toArray([
        bottomItems,
        userMenu && userPosition === "bottom" ? userMenu : undefined,
        showUser && logoutPosition === "bottom" ? (
          <AppSidebarLogoutMenu key={LOGOUT_ITEM_KEY} />
        ) : undefined,
      ])}
      headerLeftItems={headerLeftItems}
    >
      <Outlet />
    </SidebarLayout>
  );
}
