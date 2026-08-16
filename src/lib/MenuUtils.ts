import type { MenuExpandMode, MenuItem } from "@lri/types/Menu";

export type ResolvedMenuItem = {
  item: MenuItem;
  parent?: ResolvedMenuItem;
  parentPath?: string;
  path: string;
};

export function normalizeMenuPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  return `/${segments.join("/")}`;
}

export function isMenuDirectory(item: MenuItem) {
  return item.dir === true || Boolean(item.children?.length);
}

export function resolveMenuItems(
  items: readonly MenuItem[],
  parent?: ResolvedMenuItem,
): readonly ResolvedMenuItem[] {
  return items.flatMap((item) => {
    const path = normalizeMenuPath(`${parent?.path ?? ""}/${item.path}`);
    const current: ResolvedMenuItem = {
      item,
      parent,
      parentPath: parent?.path,
      path,
    };
    const children = item.children ? resolveMenuItems(item.children, current) : [];

    if (isMenuDirectory(item) && children.length === 0) return [];

    return [current, ...children];
  });
}

export function getFirstNavigableMenuItem(items: readonly ResolvedMenuItem[]) {
  return items.find((item) => !isMenuDirectory(item.item));
}

export function getMenuAncestorPaths(items: readonly ResolvedMenuItem[], currentRoute: string) {
  const current = items.find((item) => item.path === normalizeMenuPath(currentRoute));
  if (!current) return [];

  const paths: string[] = [];
  let parent = current.parent;
  while (parent) {
    paths.push(parent.path);
    parent = parent.parent;
  }

  return paths;
}

export function getMenuItemChain(item: ResolvedMenuItem) {
  const items: Omit<MenuItem, "children">[] = [];
  let current: ResolvedMenuItem | undefined = item;

  while (current) {
    items.push(current.item);
    current = current.parent;
  }

  return items;
}

export function getCurrentMenuItems(items: readonly MenuItem[], currentRoute: string) {
  const activePath = normalizeMenuPath(currentRoute);
  const current = resolveMenuItems(items).find((item) => item.path === activePath);

  return current ? getMenuItemChain(current) : [];
}

export function getResolvedMenuChildren(
  items: readonly ResolvedMenuItem[],
  parent?: ResolvedMenuItem,
) {
  return items.filter((item) => item.parent === parent);
}

export function getResolvedMenuDepth(item: ResolvedMenuItem) {
  let depth = 0;
  let parent = item.parent;

  while (parent) {
    depth += 1;
    parent = parent.parent;
  }

  return depth;
}

export function isResolvedMenuItemVisible(
  item: ResolvedMenuItem,
  expandedPaths: ReadonlySet<string>,
) {
  let parent = item.parent;

  while (parent) {
    if (!expandedPaths.has(parent.path)) return false;
    parent = parent.parent;
  }

  return true;
}

type ToggleMenuExpandedPathsOptions = {
  expandMode: MenuExpandMode;
  expandedPaths: readonly string[];
  parentPath?: string;
  path: string;
  resolvedItems: readonly ResolvedMenuItem[];
};

export function toggleMenuExpandedPaths({
  expandMode,
  expandedPaths,
  parentPath,
  path,
  resolvedItems,
}: ToggleMenuExpandedPathsOptions) {
  if (expandedPaths.includes(path)) {
    return expandedPaths.filter((value) => value !== path && !value.startsWith(`${path}/`));
  }
  if (expandMode === "multiple") return [...expandedPaths, path];

  return [
    ...expandedPaths.filter(
      (value) => resolvedItems.find((item) => item.path === value)?.parentPath !== parentPath,
    ),
    path,
  ];
}
