import {
  Navigate,
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type AnyRoute,
} from "@tanstack/react-router";
import type { ComponentType } from "react";

import { StandaloneRoute } from "@lri/blocks";
import { findFirstMenuLeafPath, joinRoutePath } from "@lri/lib";
import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  ProRouteType,
  ProRouteStaticData,
  StandaloneRouteDefinition,
} from "@lri/types";

export type CreateLayoutRouterOptions = {
  appRouteComponent: ComponentType;
  appRouteId: string;
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  routeType?: ProRouteType;
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};

function createRedirectComponent(to: string) {
  return function RouteRedirect() {
    return <Navigate replace to={to} />;
  };
}

function createMenuRoute(
  parentRoute: AnyRoute,
  definition: MenuRouteDefinition,
  parentPath = "",
): AnyRoute {
  const fullPath = joinRoutePath(parentPath, definition.path);
  const staticData: ProRouteStaticData = {
    menu: { icon: definition.icon, title: definition.title },
  };
  const Component = definition.component;
  const route = createRoute({
    component: Component ? () => <Component /> : Outlet,
    getParentRoute: () => parentRoute,
    path: definition.path,
    staticData,
  });

  if (definition.component) return route;

  const children = definition.children.map((child) => createMenuRoute(route, child, fullPath));
  const firstLeafPath = findFirstMenuLeafPath(definition.children, fullPath);
  if (firstLeafPath) {
    children.unshift(
      createRoute({
        component: createRedirectComponent(firstLeafPath),
        getParentRoute: () => route,
        path: "/",
      }),
    );
  }

  return route.addChildren(children);
}

function createStandaloneRoute(parentRoute: AnyRoute, definition: StandaloneRouteDefinition) {
  const staticData: ProRouteStaticData = {
    standalone: {
      component: definition.component,
      mode: definition.mode ?? "basic",
    },
  };

  return createRoute({
    component: StandaloneRoute,
    getParentRoute: () => parentRoute,
    path: definition.path,
    staticData,
  });
}

/**
 * 创建布局级路由树，仅 appRouteId 与 appRouteComponent 随布局不同。
 */
export function createLayoutRouter({
  appRouteComponent,
  appRouteId,
  menuRoutes,
  notFoundComponent,
  rootRedirectTo,
  routeType = "browser",
  standaloneRoutes,
}: CreateLayoutRouterOptions) {
  const rootRoute = createRootRoute({ component: Outlet, notFoundComponent });
  const AppRouteComponent = appRouteComponent;
  const appRoute = createRoute({
    component: () => <AppRouteComponent />,
    getParentRoute: () => rootRoute,
    id: appRouteId,
  });
  const menuRouteTree = menuRoutes.map((definition) => createMenuRoute(appRoute, definition));
  const standaloneRouteTree = standaloneRoutes.map((definition) =>
    createStandaloneRoute(rootRoute, definition),
  );
  const redirectTo = rootRedirectTo?.trim() || findFirstMenuLeafPath(menuRoutes);
  const rootChildren: AnyRoute[] = [appRoute.addChildren(menuRouteTree), ...standaloneRouteTree];

  if (redirectTo) {
    rootChildren.unshift(
      createRoute({
        component: createRedirectComponent(joinRoutePath("", redirectTo)),
        getParentRoute: () => rootRoute,
        path: "/",
      }),
    );
  }

  return createRouter({
    history: routeType === "hash" ? createHashHistory() : undefined,
    routeTree: rootRoute.addChildren(rootChildren),
  });
}
