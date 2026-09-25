import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  ProRouteType,
  StandaloneRouteDefinition,
} from "@lri/types";

import { createLayoutRouter } from "../sidebar-common";
import { AppSidebarContent } from "./AppSidebarContent";

type CreateAppSidebarRouterOptions = {
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  routeType?: ProRouteType;
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};

export function createAppSidebarRouter(options: CreateAppSidebarRouterOptions) {
  return createLayoutRouter({
    ...options,
    appRouteComponent: AppSidebarContent,
    appRouteId: "app-sidebar",
  });
}
