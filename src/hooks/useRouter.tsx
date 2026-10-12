import { useRouterState } from "@tanstack/react-router";
import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";

import {
  findMenuRoute,
  findStandaloneRoute,
  normalizeRoutePath,
  resolveRoutePageKind,
} from "@lri/lib";
import type {
  MenuRouteDefinition,
  MenuRoutePageDefinition,
  StandaloneRouteDefinition,
} from "@lri/types";

type RouterNavigationOptions = {
  replace?: boolean;
  to: string;
  reloadDocument?: boolean;
};

type RouterNavigation = {
  navigate: (options: RouterNavigationOptions) => Promise<void>;
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
  /** 页内重试加载当前页面（compose/loader 页面为路由替换）；lazy 页面只能整页刷新，不提供 */
  retry?: () => void;
  title?: string;
};

export type RouterMatch =
  | { definition: MenuRoutePageDefinition; type: "menu" }
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

  const match = useMemo<RouterMatch>(() => {
    const menuRoute = findMenuRoute(context.menuRoutes, pathname);

    if (menuRoute) {
      return {
        definition: menuRoute,
        type: "menu",
      };
    }

    const standaloneRoute = findStandaloneRoute(context.standaloneRoutes, pathname);

    if (standaloneRoute) {
      return {
        definition: standaloneRoute,
        type: "standalone",
      };
    }

    return undefined;
  }, [context.menuRoutes, context.standaloneRoutes, pathname]);

  const reload = useCallback(() => {
    return context.router.navigate({ to: pathname, replace: true });
  }, [context.router, pathname]);

  const current = useMemo<RouterCurrent>(() => {
    // lazy 页面失败过的 import 会被 React.lazy 缓存，页内重试无法重新加载，只能整页刷新
    const retry = match && resolveRoutePageKind(match.definition) !== "lazy" ? reload : undefined;

    if (!match) {
      return {
        mode: "none",
        path: pathname,
      };
    }

    if (match.type === "menu") {
      return {
        icon: match.definition.icon,
        mode: "layout",
        path: pathname,
        retry,
        title: match.definition.title,
      };
    }

    return {
      icon: match.definition.icon,
      mode: match.definition.mode ?? "basic",
      path: pathname,
      retry,
      title: match.definition.title,
    };
  }, [match, pathname, reload]);

  const navigate = useCallback(
    (to: string, options?: Omit<RouterNavigationOptions, "to">) => {
      return context.router.navigate({
        ...options,
        to,
      });
    },
    [context.router],
  );

  return {
    current,
    match,
    navigate,
    reload,
  };
}
