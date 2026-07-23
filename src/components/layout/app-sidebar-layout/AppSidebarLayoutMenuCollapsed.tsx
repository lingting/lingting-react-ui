import { useCallback, useEffect, useRef, useState } from "react"

import { AppSidebarLayoutMenuIcon } from "./AppSidebarLayoutMenuIcon"
import { AppSidebarLayoutMenuCollapsedItems } from "./AppSidebarLayoutMenuCollapsedItems"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"
import { Button } from "@/components/shadcn/ui/button"
import { isMenuDirectory, normalizeMenuPath } from "@/lib/menu-utils"
import type { MenuItem } from "@/types/menu"

interface AppSidebarLayoutMenuCollapsedProps {
  activeDirectoryPaths: ReadonlySet<string>
  activePath: string
  items: readonly MenuItem[]
  navigate: (path: string) => void
}

export function AppSidebarLayoutMenuCollapsed({
  activeDirectoryPaths,
  activePath,
  items,
  navigate,
}: AppSidebarLayoutMenuCollapsedProps) {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [openPath, setOpenPath] = useState<string | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])
  const openMenu = useCallback(
    (path: string) => {
      clearCloseTimer()
      setOpenPath(path)
    },
    [clearCloseTimer]
  )
  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpenPath(null), 120)
  }, [clearCloseTimer])
  const closeMenu = useCallback(() => {
    clearCloseTimer()
    setOpenPath(null)
  }, [clearCloseTimer])

  useEffect(
    () => () => {
      clearCloseTimer()
    },
    [clearCloseTimer]
  )

  return (
    <ul className="app-sidebar-layout-menu__list">
      {items.map((item) => {
        const path = normalizeMenuPath(`/${item.path}`)
        const isDirectory = isMenuDirectory(item)
        const isActive = !isDirectory && path === activePath
        const isActiveDirectory =
          isDirectory &&
          (path === activePath || activeDirectoryPaths.has(path))
        const icon = (
          <span className="app-sidebar-layout-menu__icon">
            <AppSidebarLayoutMenuIcon
              fallbackTitle={item.title}
              icon={item.icon}
            />
          </span>
        )

        if (!isDirectory) {
          const tooltip = item.tooltip ?? item.title

          return (
            <li className="app-sidebar-layout-menu__item" key={path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-current={isActive ? "page" : undefined}
                    className="app-sidebar-layout-menu__button"
                    data-active={isActive || undefined}
                    onClick={() => navigate(path)}
                    size="lg"
                    type="button"
                  >
                    {icon}
                    <span className="app-sidebar-layout-menu__title">
                      {item.title}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tooltip}</TooltipContent>
              </Tooltip>
            </li>
          )
        }

        return (
          <li className="app-sidebar-layout-menu__item" key={path}>
            <DropdownMenu
              modal={false}
              onOpenChange={(open) => {
                if (open) openMenu(path)
                else closeMenu()
              }}
              open={openPath === path}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  aria-expanded={openPath === path}
                  className="app-sidebar-layout-menu__button"
                  data-active-directory={isActiveDirectory || undefined}
                  data-directory="true"
                  onPointerEnter={() => openMenu(path)}
                  onPointerLeave={scheduleClose}
                  size="lg"
                  type="button"
                >
                  {icon}
                  <span className="app-sidebar-layout-menu__title">
                    {item.title}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              {item.children?.length ? (
                <DropdownMenuContent
                  align="start"
                  className="app-sidebar-layout-menu__collapsed-content"
                  onPointerEnter={() => openMenu(path)}
                  onPointerLeave={scheduleClose}
                  side="right"
                >
                  <AppSidebarLayoutMenuCollapsedItems
                    activeDirectoryPaths={activeDirectoryPaths}
                    activePath={activePath}
                    items={item.children}
                    navigate={navigate}
                    onNavigate={closeMenu}
                    parentPath={path}
                  />
                </DropdownMenuContent>
              ) : null}
            </DropdownMenu>
          </li>
        )
      })}
    </ul>
  )
}
