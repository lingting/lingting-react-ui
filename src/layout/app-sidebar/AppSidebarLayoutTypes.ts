import type { ComponentType } from "react";

import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  StandaloneRouteDefinition,
} from "@lri/types";

import type { SidebarLayoutProps } from "@lri/layout";

export type AppSidebarUserPosition = "hidden" | "top" | "bottom";
export type AppSidebarLogoutPosition = "hidden" | "user" | "bottom";

export type AppSidebarLayoutProps = Omit<SidebarLayoutProps, "children"> & {
  loadingComponent?: ComponentType;
  logoutPosition?: AppSidebarLogoutPosition;
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent?: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  standaloneRoutes?: readonly StandaloneRouteDefinition[];
  userPosition?: AppSidebarUserPosition;
  title?: string
};
