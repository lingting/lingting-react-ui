import { RouterProvider } from "@tanstack/react-router";
import { Suspense, useEffect, useMemo } from "react";

import { LoadingPage, NotFoundPage } from "@lri/blocks";
import type { StandaloneRouteDefinition } from "@lri/types";
import { RouterContextProvider, useRoute } from "@lri/hooks";
import { UserStore } from "@lri/store";

import {
  AppSidebarLayoutContext,
  useAppSidebarLayout,
} from "./app-sidebar/AppSidebarLayoutContext";
import { createAppSidebarRouter } from "./app-sidebar/AppSidebarRouter";
import type { AppSidebarLayoutProps } from "./app-sidebar/AppSidebarLayoutTypes";
import { AppHolder } from "@lri/lib";

export type {
  AppSidebarLayoutProps,
  AppSidebarLogoutPosition,
  AppSidebarUserPosition,
} from "./app-sidebar/AppSidebarLayoutTypes";

const EMPTY_STANDALONE_ROUTES: readonly StandaloneRouteDefinition[] = [];

function AppSidebarLayoutRouter({ router }: { router: ReturnType<typeof createAppSidebarRouter> }) {
  const { loading, props } = useAppSidebarLayout();
  const { loadingComponent: LoadingComponent = LoadingPage } = props;

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

function AppSidebarLayoutContent({ props }: { props: AppSidebarLayoutProps }) {
  const {
    loadingComponent = LoadingPage,
    menuRoutes,
    notFoundComponent = NotFoundPage,
    rootRedirectTo,
    standaloneRoutes = EMPTY_STANDALONE_ROUTES,
  } = props;
  const routeOptions = useMemo(
    () => ({ menuRoutes, standaloneRoutes }),
    [menuRoutes, standaloneRoutes],
  );
  const route = useRoute(routeOptions);
  const router = useMemo(
    () =>
      createAppSidebarRouter({
        menuRoutes: route.menuRoutes,
        notFoundComponent,
        rootRedirectTo,
        standaloneRoutes: route.standaloneRoutes,
      }),
    [notFoundComponent, rootRedirectTo, route.menuRoutes, route.standaloneRoutes],
  );

  useEffect(() => {
    AppHolder.mount({ router });
  }, [router]);

  useEffect(() => {
    void UserStore.refresh().catch(() => undefined);
  }, []);

  return (
    <RouterContextProvider
      menuRoutes={route.menuRoutes}
      router={router}
      standaloneRoutes={route.standaloneRoutes}
    >
      <AppSidebarLayoutContext.Provider value={{ props: { ...props, loadingComponent }, route }}>
        <AppSidebarLayoutRouter router={router} />
      </AppSidebarLayoutContext.Provider>
    </RouterContextProvider>
  );
}

export function AppSidebarLayout(props: AppSidebarLayoutProps) {
  return <AppSidebarLayoutContent props={props} />;
}
