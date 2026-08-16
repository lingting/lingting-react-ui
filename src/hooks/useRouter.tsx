import { useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { findMenuRoute, findStandaloneRoute, normalizeRoutePath } from "@lri/lib";
import type { MenuRouteDefinition, StandaloneRouteDefinition } from "@lri/types";

type RouterNavigation = {
  navigate: (options: { replace?: boolean; to: string }) => void | Promise<void>;
};

type RouterContextValue = {
  menuRoutes: readonly MenuRouteDefinition[];
  router: RouterNavigation;
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};

export type RouterCurrent = {
  icon?: ReactNode;
  mode: "layout" | "basic" | "none";
  path?: string;
  title?: string;
};

export type RouterMatch =
  | { definition: MenuRouteDefinition; type: "menu" }
  | { definition: StandaloneRouteDefinition; type: "standalone" }
  | undefined;

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterContextProvider({
  children,
  menuRoutes,
  router,
  standaloneRoutes,
}: RouterContextValue & { children: ReactNode }) {
  const value = useMemo(
    () => ({ menuRoutes, router, standaloneRoutes }),
    [menuRoutes, router, standaloneRoutes],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter 必须在 AppSidebarLayout 内使用");

  const pathname = useRouterState({
    select: (state) => normalizeRoutePath(state.location.pathname),
  });
  const menuRoute = findMenuRoute(context.menuRoutes, pathname);
  const standaloneRoute = menuRoute
    ? undefined
    : findStandaloneRoute(context.standaloneRoutes, pathname);
  const match: RouterMatch = menuRoute
    ? { definition: menuRoute, type: "menu" }
    : standaloneRoute
      ? { definition: standaloneRoute, type: "standalone" }
      : undefined;
  const current: RouterCurrent = menuRoute
    ? {
        icon: menuRoute.icon,
        mode: "layout",
        path: pathname,
        title: menuRoute.title,
      }
    : standaloneRoute
      ? {
          icon: standaloneRoute.icon,
          mode: standaloneRoute.mode ?? "basic",
          path: pathname,
          title: standaloneRoute.title,
        }
      : { mode: "none", path: pathname };

  return {
    current,
    match,
    navigate: (to: string, options?: { replace?: boolean }) =>
      context.router.navigate({ ...options, to }),
  };
}
