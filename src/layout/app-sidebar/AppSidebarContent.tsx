import { Outlet, useRouterState } from "@tanstack/react-router";
import { Menu, type MenuProps } from "antd";
import { Children, Suspense, useEffect, useMemo, useState } from "react";

import { LoadingPage } from "@lri/blocks";
import { SidebarCollapsed, SidebarLayout, useSidebarLayout } from "@lri/layout";
import { findMenuAncestorPaths, joinRoutePath, normalizeRoutePath } from "@lri/lib";
import { useUserStore } from "@lri/store";
import type { MenuRouteDefinition } from "@lri/types";

import { useAppSidebarLayout } from "./AppSidebarLayoutContext";
import AppSidebarToggle from "./AppSidebarToggle";
import "../AppSidebarLayout.css";
import { AppSidebarUser, AppSidebarUserLogout } from "@lri/layout/app-sidebar/AppSidebarUser";
import { useRouter } from "@lri/hooks";

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
      onClick={({ key }) => void router.navigate(key)}
      onOpenChange={setOpenKeys}
      openKeys={collapsed === SidebarCollapsed.Collapsed ? [] : openKeys}
      selectedKeys={[pathname]}
      tooltip={collapsed === SidebarCollapsed.Collapsed ? { placement: "right" } : false}
    />
  );
}

export function AppSidebarContent() {
  const { menuRoutes, props } = useAppSidebarLayout();
  const {
    title,
    baseItems = [],
    bottomItems = [],
    headerLeftItems: sourceHeaderLeftItems,
    loadingComponent: LoadingComponent = LoadingPage,
    logoutPosition = "bottom",
    userPosition = "top",
    ...sidebarProps
  } = props;
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
  const userMenu = useMemo(
    () =>
      showUser ? (
        <AppSidebarUser key={USER_ITEM_KEY} logoutPosition={logoutPosition} user={user} />
      ) : undefined,
    [logoutPosition, showUser, user],
  );

  const documentTitle = useMemo(() => document.title?.split("-")[0] || "", []);
  const prefixTitle = useMemo(() => title || documentTitle, [title, documentTitle]);

  const { current } = useRouter();

  useEffect(() => {
    let title = prefixTitle.trim();
    let subTitle = current.title?.trim();
    let value = title;
    if (value) {
      value = `${value} -`;
    }
    if (subTitle) {
      value = `${value} ${subTitle}`;
    }
    document.title = value;
  }, [current, prefixTitle]);

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
          <AppSidebarUserLogout key={LOGOUT_ITEM_KEY} />
        ) : undefined,
      ])}
      headerLeftItems={headerLeftItems}
    >
      <Suspense fallback={<LoadingComponent />}>
        <Outlet />
      </Suspense>
    </SidebarLayout>
  );
}
