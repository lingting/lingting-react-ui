import { useRouterState } from "@tanstack/react-router";
import { Children, useEffect, useMemo, useState, type ReactNode } from "react";

import { useRouter } from "@lri/hooks";
import { findMenuAncestorPaths, normalizeRoutePath } from "@lri/lib";
import { useUserStore } from "@lri/store";
import type { MenuRouteDefinition } from "@lri/types";

import { SidebarMenu } from "./SidebarMenu";
import type { SidebarLogoutPosition, SidebarUserPosition } from "./SidebarTypes";
import { SidebarToggle } from "./SidebarToggle";
import { SidebarUser, SidebarUserLogout } from "./SidebarUser";

const ROUTE_MENU_KEY = "__sidebar-routes";
const USER_ITEM_KEY = "__sidebar-user";
const LOGOUT_ITEM_KEY = "__sidebar-logout";

export type UseSidebarShellOptions = {
  baseItems?: readonly ReactNode[];
  bottomItems?: readonly ReactNode[];
  headerLeftItems?: readonly ReactNode[];
  logoutPosition?: SidebarLogoutPosition;
  menuRoutes: readonly MenuRouteDefinition[];
  showSidebarToggle?: boolean;
  title?: string;
  userPosition?: SidebarUserPosition;
};

/**
 * 组装侧边栏应用的通用内容：路由菜单、用户项、折叠按钮与文档标题同步。
 */
export function useSidebarShell({
  baseItems = [],
  bottomItems = [],
  headerLeftItems: sourceHeaderLeftItems = [],
  logoutPosition = "bottom",
  menuRoutes,
  showSidebarToggle = true,
  title,
  userPosition = "top",
}: UseSidebarShellOptions) {
  const { user } = useUserStore();
  const { current } = useRouter();
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
      Children.toArray([
        showSidebarToggle ? <SidebarToggle key="__sidebar-toggle" /> : undefined,
        sourceHeaderLeftItems,
      ]),
    [showSidebarToggle, sourceHeaderLeftItems],
  );

  useEffect(() => {
    setOpenKeys((current) => Array.from(new Set([...current, ...ancestorPaths])));
  }, [ancestorPaths]);

  const showUser = userPosition !== "hidden" && user !== undefined;
  const routeMenu = (
    <SidebarMenu
      key={ROUTE_MENU_KEY}
      menuRoutes={menuRoutes}
      openKeys={openKeys}
      pathname={pathname}
      setOpenKeys={setOpenKeys}
    />
  );
  const userMenu = useMemo(
    () =>
      showUser ? (
        <SidebarUser key={USER_ITEM_KEY} logoutPosition={logoutPosition} user={user} />
      ) : undefined,
    [logoutPosition, showUser, user],
  );

  const documentTitle = useMemo(() => document.title?.split("-")[0] || "", []);
  const prefixTitle = useMemo(() => title || documentTitle, [title, documentTitle]);

  useEffect(() => {
    let value = prefixTitle.trim();
    const subTitle = current.title?.trim();
    if (value) {
      value = `${value} -`;
    }
    if (subTitle) {
      value = `${value} ${subTitle}`;
    }
    document.title = value;
  }, [current, prefixTitle]);

  return {
    baseItems: Children.toArray([
      userMenu && userPosition === "top" ? userMenu : undefined,
      baseItems,
      routeMenu,
    ]),
    bottomItems: Children.toArray([
      bottomItems,
      userMenu && userPosition === "bottom" ? userMenu : undefined,
      showUser && logoutPosition === "bottom" ? (
        <SidebarUserLogout key={LOGOUT_ITEM_KEY} />
      ) : undefined,
    ]),
    headerLeftItems,
    title: prefixTitle,
  };
}
