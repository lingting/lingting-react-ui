import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { AppSidebarLayoutMenuItem } from "./AppSidebarLayoutMenuItem"
import { resolveAppSidebarLayoutMenuTree } from "./AppSidebarLayoutMenuModel"
import { SidebarMenu } from "@/components/shadcn/ui/sidebar"
import {
  getMenuAncestorPaths,
  normalizeMenuPath,
  resolveMenuItems,
  toggleMenuExpandedPaths,
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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activePath = normalizeMenuPath(currentRoute)
  const menuTree = useMemo(
    () => resolveAppSidebarLayoutMenuTree(items),
    [items]
  )
  const resolvedItems = useMemo(() => resolveMenuItems(items), [items])
  const activeDirectoryPaths = useMemo(
    () => new Set(getMenuAncestorPaths(resolvedItems, activePath)),
    [activePath, resolvedItems]
  )
  const [expandedPathValues, setExpandedPathValues] = useState<readonly string[]>(
    () => getMenuAncestorPaths(resolvedItems, activePath)
  )
  const [openPath, setOpenPath] = useState<string | null>(null)
  const expandedPaths = useMemo(
    () => new Set(expandedPathValues),
    [expandedPathValues]
  )

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return

    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])
  const openPopup = useCallback(
    (path: string) => {
      clearCloseTimer()
      setOpenPath(path)
    },
    [clearCloseTimer]
  )
  const closePopup = useCallback(() => {
    clearCloseTimer()
    setOpenPath(null)
  }, [clearCloseTimer])
  const schedulePopupClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpenPath(null), 120)
  }, [clearCloseTimer])
  const toggleExpanded = useCallback(
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

  useEffect(() => {
    setExpandedPathValues((previous) => [
      ...new Set([...previous, ...activeDirectoryPaths]),
    ])
  }, [activeDirectoryPaths])
  useEffect(
    () => () => {
      clearCloseTimer()
    },
    [clearCloseTimer]
  )
  useEffect(() => {
    if (!collapsed) closePopup()
  }, [closePopup, collapsed])

  return (
    <div className="app-sidebar-layout-menu" data-slot="app-sidebar-layout-menu">
      <SidebarMenu>
        {menuTree.map((node) => (
          <AppSidebarLayoutMenuItem
            activeDirectoryPaths={activeDirectoryPaths}
            activePath={activePath}
            collapsed={collapsed}
            expandedPaths={expandedPaths}
            key={node.path}
            navigate={navigate}
            node={node}
            onPopupClose={closePopup}
            onPopupOpen={openPopup}
            onPopupScheduleClose={schedulePopupClose}
            onToggle={toggleExpanded}
            openPath={openPath}
          />
        ))}
      </SidebarMenu>
    </div>
  )
}
