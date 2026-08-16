import type { MenuRouteDefinition, StandaloneRouteDefinition } from "@lri/types";

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
): MenuRouteDefinition | undefined {
  for (const definition of definitions) {
    const fullPath = joinRoutePath(parentPath, definition.path);
    if (definition.component && normalizeRoutePath(fullPath) === pathname) return definition;

    if (!definition.component) {
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
    if (definition.component) return fullPath;

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
    if (definition.component && normalizeRoutePath(fullPath) === pathname) return [];

    if (!definition.component && pathname.startsWith(`${normalizeRoutePath(fullPath)}/`)) {
      return [fullPath, ...findMenuAncestorPaths(definition.children, pathname, fullPath)];
    }
  }

  return [];
}
