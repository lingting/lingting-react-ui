import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { ProNotFoundPage } from "@/blocks";
import { RouterContextProvider } from "@/hooks";
import { UserStore } from "@/store";

import { AppSidebarLayoutContext } from "./app-sidebar/AppSidebarLayoutContext";
import { createAppSidebarRouter } from "./app-sidebar/AppSidebarRouter";
import type { AppSidebarLayoutProps } from "./app-sidebar/AppSidebarLayoutTypes";

export type {
  AppSidebarLayoutProps,
  AppSidebarLogoutPosition,
  AppSidebarUserPosition,
} from "./app-sidebar/AppSidebarLayoutTypes";

export function AppSidebarLayout(props: AppSidebarLayoutProps) {
  const {
    menuRoutes,
    notFoundComponent = ProNotFoundPage,
    rootRedirectTo,
    standaloneRoutes = [],
  } = props;
  const router = useMemo(
    () =>
      createAppSidebarRouter({
        menuRoutes,
        notFoundComponent,
        rootRedirectTo,
        standaloneRoutes,
      }),
    [menuRoutes, notFoundComponent, rootRedirectTo, standaloneRoutes],
  );

  useEffect(() => {
    UserStore.setRouter(router);
    void UserStore.refresh().catch(() => undefined);
  }, [router]);

  return (
    <RouterContextProvider
      menuRoutes={menuRoutes}
      router={router}
      standaloneRoutes={standaloneRoutes}
    >
      <AppSidebarLayoutContext.Provider value={props}>
        <RouterProvider router={router} />
      </AppSidebarLayoutContext.Provider>
    </RouterContextProvider>
  );
}
