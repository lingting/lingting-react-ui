import { createContext, useContext } from "react";

import type { AppSidebarLayoutProps } from "./AppSidebarLayoutTypes";

export const AppSidebarLayoutContext = createContext<AppSidebarLayoutProps | undefined>(undefined);

export function useAppSidebarLayoutProps() {
  const props = useContext(AppSidebarLayoutContext);
  if (!props) throw new Error("useAppSidebarLayoutProps 必须在 AppSidebarLayout 内使用");
  return props;
}
