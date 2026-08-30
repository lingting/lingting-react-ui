import { useCallback, useEffect, useState } from "react";

import { useUserStore } from "@lri/store";
import type { MenuRouteDefinition, UseRouteOptions, UseRouteResult } from "@lri/types";

type AvailableRoutes = Pick<UseRouteResult, "menuRoutes" | "standaloneRoutes">;

function filterMenuRoutes(
  routes: readonly MenuRouteDefinition[],
  allow: (rule: NonNullable<MenuRouteDefinition["auth"]>) => boolean,
  userLoggedIn: boolean,
): readonly MenuRouteDefinition[] {
  const filteredRoutes: MenuRouteDefinition[] = [];
  for (const route of routes) {
    if (route.auth ? !allow(route.auth) : !userLoggedIn) continue;

    if (route.component) {
      filteredRoutes.push(route);
      continue;
    }

    const children = filterMenuRoutes(route.children, allow, userLoggedIn);
    if (children.length > 0) filteredRoutes.push({ ...route, children });
  }

  return filteredRoutes;
}

function filterRoutes(
  { menuRoutes, standaloneRoutes }: UseRouteOptions,
  allow: (rule: NonNullable<MenuRouteDefinition["auth"]>) => boolean,
  userLoggedIn: boolean,
): AvailableRoutes {
  return {
    menuRoutes: filterMenuRoutes(menuRoutes, allow, userLoggedIn),
    standaloneRoutes: standaloneRoutes.filter((route) =>
      route.auth ? allow(route.auth) : userLoggedIn,
    ),
  };
}

export function useRoute(options: UseRouteOptions): UseRouteResult {
  const { allow, loading: userLoading, user } = useUserStore();
  const [routes, setRoutes] = useState<AvailableRoutes>(() =>
    filterRoutes(options, allow, user !== undefined),
  );
  const [routesOptions, setRoutesOptions] = useState(options);
  const [routesUser, setRoutesUser] = useState(user);
  const [refreshing, setRefreshing] = useState(false);
  const routesOutdated = routesOptions !== options || routesUser !== user;

  useEffect(() => {
    if (userLoading || !routesOutdated) return;

    setRoutes(filterRoutes(options, allow, user !== undefined));
    setRoutesOptions(options);
    setRoutesUser(user);
    setRefreshing(false);
  }, [allow, options, routesOutdated, user, userLoading]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    setRoutes(filterRoutes(options, allow, user !== undefined));
    setRoutesOptions(options);
    setRoutesUser(user);
    setRefreshing(false);
  }, [allow, options, user]);

  return { ...routes, loading: userLoading || refreshing || routesOutdated, refresh };
}
