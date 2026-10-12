import type {
  MenuRouteDefinition,
  MenuRoutePageDefinition,
  StandaloneRouteDefinition,
} from "@lri/types";

/** 判断路由定义是否为页面（叶子）定义 */
export function isRoutePageDefinition(
  definition: MenuRouteDefinition,
): definition is MenuRoutePageDefinition {
  return definition.component !== undefined || definition.loader !== undefined;
}

export function joinRoutePath(parentPath: string, path: string) {
  return `/${[parentPath, path]
    .flatMap((part) => part.split("/"))
    .filter(Boolean)
    .join("/")}`;
}

export function normalizeRoutePath(path: string) {
  const normalized = joinRoutePath("", path);
  return normalized === "/" ? normalized : normalized.replace(/\/+$/, "");
}

export function findMenuRoute(
  definitions: readonly MenuRouteDefinition[],
  pathname: string,
  parentPath = "",
): MenuRoutePageDefinition | undefined {
  for (const definition of definitions) {
    const fullPath = joinRoutePath(parentPath, definition.path);
    if (isRoutePageDefinition(definition) && normalizeRoutePath(fullPath) === pathname) {
      return definition;
    }

    if (!isRoutePageDefinition(definition)) {
      const child = findMenuRoute(definition.children, pathname, fullPath);
      if (child) return child;
    }
  }
}

export function findStandaloneRoute(
  definitions: readonly StandaloneRouteDefinition[],
  pathname: string,
) {
  return definitions.find((definition) => normalizeRoutePath(definition.path) === pathname);
}

export function findFirstMenuLeafPath(
  definitions: readonly MenuRouteDefinition[],
  parentPath = "",
): string | undefined {
  for (const definition of definitions) {
    const fullPath = joinRoutePath(parentPath, definition.path);
    if (isRoutePageDefinition(definition)) return fullPath;

    const childPath = findFirstMenuLeafPath(definition.children, fullPath);
    if (childPath) return childPath;
  }
}

export function findMenuAncestorPaths(
  definitions: readonly MenuRouteDefinition[],
  pathname: string,
  parentPath = "",
): string[] {
  for (const definition of definitions) {
    const fullPath = joinRoutePath(parentPath, definition.path);
    if (isRoutePageDefinition(definition) && normalizeRoutePath(fullPath) === pathname) return [];

    if (
      !isRoutePageDefinition(definition) &&
      pathname.startsWith(`${normalizeRoutePath(fullPath)}/`)
    ) {
      return [fullPath, ...findMenuAncestorPaths(definition.children, pathname, fullPath)];
    }
  }

  return [];
}
