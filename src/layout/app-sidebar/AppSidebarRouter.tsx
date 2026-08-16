import {
  Navigate,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  type AnyRoute,
} from "@tanstack/react-router";

import { ProStandaloneRoute } from "@/blocks";
import { findFirstMenuLeafPath, joinRoutePath } from "@/lib";
import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  ProRouteStaticData,
  StandaloneRouteDefinition,
} from "@/types";

import { AppSidebarContent } from "./AppSidebarContent";

type CreateAppSidebarRouterOptions = {
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
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
  const route = createRoute({
    component: definition.component ?? Outlet,
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
    component: ProStandaloneRoute,
    getParentRoute: () => parentRoute,
    path: definition.path,
    staticData,
  });
}

export function createAppSidebarRouter({
  menuRoutes,
  notFoundComponent,
  rootRedirectTo,
  standaloneRoutes,
}: CreateAppSidebarRouterOptions) {
  const rootRoute = createRootRoute({ component: Outlet, notFoundComponent });
  const appRoute = createRoute({
    component: AppSidebarContent,
    getParentRoute: () => rootRoute,
    id: "app-sidebar",
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

  return createRouter({ routeTree: rootRoute.addChildren(rootChildren) });
}
