import { createContext, useContext } from "react";

import type { SidebarLayoutState } from "./SidebarLayoutTypes";

export const SidebarLayoutContext = createContext<SidebarLayoutState | undefined>(undefined);

export function useSidebarLayout() {
  const value = useContext(SidebarLayoutContext);
  if (!value) throw new Error("useSidebarLayout 必须在 SidebarLayout 内使用");

  return value;
}
