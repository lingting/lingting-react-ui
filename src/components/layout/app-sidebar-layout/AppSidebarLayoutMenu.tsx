import { useCallback, useEffect, useMemo, useState } from "react"

import { AppSidebarLayoutMenuCollapsed } from "./AppSidebarLayoutMenuCollapsed"
import { AppSidebarLayoutMenuExpanded } from "./AppSidebarLayoutMenuExpanded"
import {
  getMenuAncestorPaths,
  normalizeMenuPath,
  resolveMenuItems,
  toggleMenuExpandedPaths,
  type ResolvedMenuItem,
} from "@/lib/menu-utils"
import type { MenuExpandMode, MenuItem } from "@/types/menu"

interface AppSidebarLayoutMenuProps {
  collapsed: boolean
  currentRoute: string
  expandMode: MenuExpandMode
  items: readonly MenuItem[]
  navigate: (path: string) => void
}

export function AppSidebarLayoutMenu({
  collapsed,
  currentRoute,
  expandMode,
  items,
  navigate,
}: AppSidebarLayoutMenuProps) {
  const activePath = normalizeMenuPath(currentRoute)
  const resolvedItems = useMemo<readonly ResolvedMenuItem[]>(
    () => resolveMenuItems(items),
    [items]
  )
  const autoExpandedPaths = useMemo(
    () => getMenuAncestorPaths(resolvedItems, currentRoute),
    [currentRoute, resolvedItems]
  )
  const [expandedPathValues, setExpandedPathValues] = useState<
    readonly string[]
  >(() => getMenuAncestorPaths(resolvedItems, currentRoute))

  useEffect(() => {
    setExpandedPathValues((previous) => [
      ...new Set([...previous, ...autoExpandedPaths]),
    ])
  }, [autoExpandedPaths])

  const expandedPaths = useMemo(
    () => new Set(expandedPathValues),
    [expandedPathValues]
  )
  const activeDirectoryPaths = useMemo(
    () => new Set(autoExpandedPaths),
    [autoExpandedPaths]
  )
  const handleToggle = useCallback(
    (path: string, parentPath?: string) => {
      setExpandedPathValues((previous) =>
        toggleMenuExpandedPaths({
          expandMode,
          expandedPaths: previous,
          parentPath,
          path,
          resolvedItems,
        })
      )
    },
    [expandMode, resolvedItems]
  )

  return (
    <nav aria-label="主导航" className="app-sidebar-layout-menu">
      {collapsed ? (
        <AppSidebarLayoutMenuCollapsed
          activeDirectoryPaths={activeDirectoryPaths}
          activePath={activePath}
          items={items}
          navigate={navigate}
        />
      ) : (
        <AppSidebarLayoutMenuExpanded
          activeDirectoryPaths={activeDirectoryPaths}
          activePath={activePath}
          expandedPaths={expandedPaths}
          items={items}
          navigate={navigate}
          onToggle={handleToggle}
        />
      )}
    </nav>
  )
}
