import type { ComponentType } from "react";

import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  ProRouteType,
  StandaloneRouteDefinition,
} from "@lri/types";

import type { SidebarLayoutProps } from "@lri/layout";
import type { SidebarLogoutPosition, SidebarUserPosition } from "@lri/layout/sidebar-common";

export type AppSidebarUserPosition = SidebarUserPosition;
export type AppSidebarLogoutPosition = SidebarLogoutPosition;

export type AppSidebarLayoutProps = Omit<SidebarLayoutProps, "children"> & {
  loadingComponent?: ComponentType;
  logoutPosition?: SidebarLogoutPosition;
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent?: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  routeType?: ProRouteType;
  showSidebarToggle?: boolean;
  standaloneRoutes?: readonly StandaloneRouteDefinition[];
  userPosition?: SidebarUserPosition;
  title?: string;
};
