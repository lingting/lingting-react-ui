import { useRouterState } from "@tanstack/react-router";
import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";

import { findMenuRoute, findStandaloneRoute, normalizeRoutePath } from "@lri/lib";
import type { MenuRouteDefinition, StandaloneRouteDefinition } from "@lri/types";

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

  const current = useMemo<RouterCurrent>(() => {
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
        title: match.definition.title,
      };
    }

    return {
      icon: match.definition.icon,
      mode: match.definition.mode ?? "basic",
      path: pathname,
      title: match.definition.title,
    };
  }, [match, pathname]);

  const navigate = useCallback(
    (to: string, options?: Omit<RouterNavigationOptions, "to">) => {
      return context.router.navigate({
        ...options,
        to,
      });
    },
    [context.router],
  );

  const reload = useCallback(() => {
    return context.router.navigate({ to: pathname, replace: true });
  }, [context.router, pathname]);

  return {
    current,
    match,
    navigate,
    reload,
  };
}
