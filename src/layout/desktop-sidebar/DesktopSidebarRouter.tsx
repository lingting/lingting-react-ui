import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  ProRouteType,
  StandaloneRouteDefinition,
} from "@lri/types";

import { createLayoutRouter } from "../sidebar-common";
import { DesktopSidebarContent } from "./DesktopSidebarContent";

type CreateDesktopSidebarRouterOptions = {
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  routeType?: ProRouteType;
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};

export function createDesktopSidebarRouter(options: CreateDesktopSidebarRouterOptions) {
  return createLayoutRouter({
    ...options,
    appRouteComponent: DesktopSidebarContent,
    appRouteId: "desktop-sidebar",
  });
}
