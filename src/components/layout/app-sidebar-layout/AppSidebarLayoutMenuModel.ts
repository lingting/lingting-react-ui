import { isMenuDirectory, normalizeMenuPath } from "@/lib/menu-utils"
import type { MenuItem } from "@/types/menu"

export interface AppSidebarLayoutMenuNode {
  children: readonly AppSidebarLayoutMenuNode[]
  isDirectory: boolean
  item: MenuItem
  parentPath?: string
  path: string
}

export function resolveAppSidebarLayoutMenuTree(
  items: readonly MenuItem[],
  parentPath?: string
): readonly AppSidebarLayoutMenuNode[] {
  return items.map((item) => {
    const path = normalizeMenuPath(`${parentPath ?? ""}/${item.path}`)

    return {
      children: item.children
        ? resolveAppSidebarLayoutMenuTree(item.children, path)
        : [],
      isDirectory: isMenuDirectory(item),
      item,
      parentPath,
      path,
    }
  })
}
