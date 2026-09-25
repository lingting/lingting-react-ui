import { RouterProvider } from "@tanstack/react-router";
import { Suspense, useEffect, useMemo } from "react";

import { LoadingPage, NotFoundPage } from "@lri/blocks";
import { RouterContextProvider, useRoute, useWindowMaximized } from "@lri/hooks";
import { AppHolder } from "@lri/lib";
import { UserStore } from "@lri/store";
import type { StandaloneRouteDefinition } from "@lri/types";

import {
  DesktopSidebarLayoutContext,
  useDesktopSidebarLayout,
} from "./desktop-sidebar/DesktopSidebarLayoutContext";
import { createDesktopSidebarRouter } from "./desktop-sidebar/DesktopSidebarRouter";
import type { DesktopSidebarLayoutProps } from "./desktop-sidebar/DesktopSidebarLayoutTypes";

export type { DesktopSidebarLayoutProps } from "./desktop-sidebar/DesktopSidebarLayoutTypes";

const EMPTY_STANDALONE_ROUTES: readonly StandaloneRouteDefinition[] = [];

function DesktopSidebarLayoutRouter({
  router,
}: {
  router: ReturnType<typeof createDesktopSidebarRouter>;
}) {
  const { loading, props } = useDesktopSidebarLayout();
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

function DesktopSidebarLayoutContent({ props }: { props: DesktopSidebarLayoutProps }) {
  const {
    isMaximized,
    loadingComponent = LoadingPage,
    menuRoutes,
    notFoundComponent = NotFoundPage,
    rootRedirectTo,
    routeType = "browser",
    standaloneRoutes = EMPTY_STANDALONE_ROUTES,
  } = props;
  const routeOptions = useMemo(
    () => ({ menuRoutes, standaloneRoutes }),
    [menuRoutes, standaloneRoutes],
  );
  const route = useRoute(routeOptions);
  const router = useMemo(
    () =>
      createDesktopSidebarRouter({
        menuRoutes: route.menuRoutes,
        notFoundComponent,
        rootRedirectTo,
        routeType,
        standaloneRoutes: route.standaloneRoutes,
      }),
    [notFoundComponent, rootRedirectTo, route.menuRoutes, route.standaloneRoutes, routeType],
  );
  const maximized = useWindowMaximized(isMaximized);

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
      <DesktopSidebarLayoutContext.Provider
        value={{ maximized, props: { ...props, loadingComponent }, route }}
      >
        <DesktopSidebarLayoutRouter router={router} />
      </DesktopSidebarLayoutContext.Provider>
    </RouterContextProvider>
  );
}

export function DesktopSidebarLayout(props: DesktopSidebarLayoutProps) {
  return <DesktopSidebarLayoutContent props={props} />;
}
