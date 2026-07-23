import type { MenuExpandMode, MenuItem } from "@/types/menu"

export interface ResolvedMenuItem {
  item: MenuItem
  parentPath?: string
  path: string
}

export function normalizeMenuPath(path: string) {
  const segments = path.split("/").filter(Boolean)
  return `/${segments.join("/")}`
}

export function isMenuDirectory(item: MenuItem) {
  return item.dir === true || Boolean(item.children?.length)
}

export function resolveMenuItems(
  items: readonly MenuItem[],
  parentPath?: string
): readonly ResolvedMenuItem[] {
  return items.flatMap((item) => {
    const path = normalizeMenuPath(`${parentPath ?? ""}/${item.path}`)
    const current = { item, parentPath, path }
    const children = item.children ? resolveMenuItems(item.children, path) : []

    return [current, ...children]
  })
}

export function getMenuAncestorPaths(
  items: readonly ResolvedMenuItem[],
  currentRoute: string
) {
  const current = items.find(
    (item) => item.path === normalizeMenuPath(currentRoute)
  )
  if (!current) return []

  const paths: string[] = []
  let parentPath = current.parentPath
  while (parentPath) {
    paths.push(parentPath)
    parentPath = items.find((item) => item.path === parentPath)?.parentPath
  }

  return paths
}

interface ToggleMenuExpandedPathsOptions {
  expandMode: MenuExpandMode
  expandedPaths: readonly string[]
  parentPath?: string
  path: string
  resolvedItems: readonly ResolvedMenuItem[]
}

export function toggleMenuExpandedPaths({
  expandMode,
  expandedPaths,
  parentPath,
  path,
  resolvedItems,
}: ToggleMenuExpandedPathsOptions) {
  if (expandedPaths.includes(path)) {
    return expandedPaths.filter(
      (value) => value !== path && !value.startsWith(`${path}/`)
    )
  }
  if (expandMode === "multiple") return [...expandedPaths, path]

  return [
    ...expandedPaths.filter(
      (value) =>
        resolvedItems.find((item) => item.path === value)?.parentPath !==
        parentPath
    ),
    path,
  ]
}
