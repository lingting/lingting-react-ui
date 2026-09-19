import type { ComponentType } from "react";

import type {
  MenuRouteDefinition,
  ProRouteNotFoundComponent,
  StandaloneRouteDefinition,
} from "@lri/types";

import type { SidebarLayoutProps } from "@lri/layout";
import type { SidebarLogoutPosition, SidebarUserPosition } from "../sidebar-common/SidebarTypes";

export type AppSidebarUserPosition = SidebarUserPosition;
export type AppSidebarLogoutPosition = SidebarLogoutPosition;

export type AppSidebarLayoutProps = Omit<SidebarLayoutProps, "children"> & {
  loadingComponent?: ComponentType;
  logoutPosition?: SidebarLogoutPosition;
  menuRoutes: readonly MenuRouteDefinition[];
  notFoundComponent?: ProRouteNotFoundComponent;
  rootRedirectTo?: string;
  standaloneRoutes?: readonly StandaloneRouteDefinition[];
  userPosition?: SidebarUserPosition;
  title?: string;
};
