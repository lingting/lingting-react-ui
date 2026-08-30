import { createContext, useContext } from "react";

import type { UseRouteResult } from "@lri/types";

import type { AppSidebarLayoutProps } from "./AppSidebarLayoutTypes";

type AppSidebarLayoutContextValue = {
  props: AppSidebarLayoutProps;
  route: UseRouteResult;
};

export const AppSidebarLayoutContext = createContext<AppSidebarLayoutContextValue | undefined>(
  undefined,
);

export function useAppSidebarLayout() {
  const context = useContext(AppSidebarLayoutContext);
  if (!context) throw new Error("useAppSidebarLayout 必须在 AppSidebarLayout 内使用");

  return { props: context.props, ...context.route };
}
