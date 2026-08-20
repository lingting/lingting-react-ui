import { createContext, useContext, useRef } from "react";

import { useUserStore } from "@lri/store";

import type { AppSidebarLayoutProps } from "./AppSidebarLayoutTypes";

export const AppSidebarLayoutContext = createContext<AppSidebarLayoutProps | undefined>(undefined);

export function useAppSidebarLayout() {
  const props = useContext(AppSidebarLayoutContext);
  if (!props) throw new Error("useAppSidebarLayout 必须在 AppSidebarLayout 内使用");

  const { loading } = useUserStore();
  const initialized = useRef(false);

  if (!loading) initialized.current = true;
  return { props, loading: loading && !initialized.current };
}
