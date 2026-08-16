import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  StandaloneRouteDefinition,
} from "@/types";

import type { SidebarLayoutProps } from "@/layout";

export type AppSidebarUserPosition = "hidden" | "top" | "bottom";
export type AppSidebarLogoutPosition = "hidden" | "user" | "bottom";

export type AppSidebarLayoutProps = Omit<SidebarLayoutProps, "children"> & {
  logoutPosition?: AppSidebarLogoutPosition;
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent?: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  standaloneRoutes?: readonly StandaloneRouteDefinition[];
  userPosition?: AppSidebarUserPosition;
};
