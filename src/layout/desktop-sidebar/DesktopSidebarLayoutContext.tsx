import { createContext, useContext } from "react";

import type { UseRouteResult } from "@lri/types";

import type { DesktopSidebarLayoutProps } from "./DesktopSidebarLayoutTypes";

type DesktopSidebarLayoutContextValue = {
  maximized: boolean;
  props: DesktopSidebarLayoutProps;
  route: UseRouteResult;
};

export const DesktopSidebarLayoutContext = createContext<
  DesktopSidebarLayoutContextValue | undefined
>(undefined);

export function useDesktopSidebarLayout() {
  const context = useContext(DesktopSidebarLayoutContext);
  if (!context) throw new Error("useDesktopSidebarLayout 必须在 DesktopSidebarLayout 内使用");

  return { maximized: context.maximized, props: context.props, ...context.route };
}
