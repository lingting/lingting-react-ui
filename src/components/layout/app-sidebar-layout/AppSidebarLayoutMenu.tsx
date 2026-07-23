import { ChevronDownIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { TextIcon } from "@/components/icon/TextIcon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"
import {
  getMenuAncestorPaths,
  isMenuDirectory,
  normalizeMenuPath,
  resolveMenuItems,
  toggleMenuExpandedPaths,
  type ResolvedMenuItem,
} from "@/lib/menu-utils"
import type { MenuExpandMode, MenuItem } from "@/types/menu"

interface AppSidebarLayoutMenuProps {
  currentRoute: string
  expandMode: MenuExpandMode
  items: readonly MenuItem[]
  navigate: (path: string) => void
}

interface AppSidebarLayoutMenuBranchProps {
  activePath: string
  expandedPaths: ReadonlySet<string>
  items: readonly MenuItem[]
  navigate: (path: string) => void
  onToggle: (path: string, parentPath?: string) => void
  parentPath?: string
}

function AppSidebarLayoutMenuBranch({
  activePath,
  expandedPaths,
  items,
  navigate,
  onToggle,
  parentPath,
}: AppSidebarLayoutMenuBranchProps) {
  return (
    <ul className="app-sidebar-layout-menu__list">
      {items.map((item) => {
        const path = normalizeMenuPath(`${parentPath ?? ""}/${item.path}`)
        const isDirectory = isMenuDirectory(item)
        const isExpanded = expandedPaths.has(path)
        const isActive = path === activePath
        const tooltip = item.tooltip ?? item.tooltop
        const handleClick = () => {
          if (isDirectory) {
            onToggle(path, parentPath)
            return
          }
          navigate(path)
        }
        const button = (
          <button
            aria-current={isActive ? "page" : undefined}
            aria-expanded={isDirectory ? isExpanded : undefined}
            className="app-sidebar-layout-menu__button"
            data-active={isActive || undefined}
            data-directory={isDirectory || undefined}
            onClick={handleClick}
            type="button"
          >
            {item.icon && (
              <span className="app-sidebar-layout-menu__icon">
                {typeof item.icon === "string" ? (
                  <TextIcon text={item.icon} />
                ) : (
                  item.icon
                )}
              </span>
            )}
            <span className="app-sidebar-layout-menu__title">{item.title}</span>
            {isDirectory && (
              <ChevronDownIcon
                aria-hidden="true"
                className="app-sidebar-layout-menu__chevron"
                data-expanded={isExpanded || undefined}
              />
            )}
          </button>
        )

        return (
          <li className="app-sidebar-layout-menu__item" key={path}>
            {tooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">{tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              button
            )}
            {isDirectory && isExpanded && item.children?.length ? (
              <AppSidebarLayoutMenuBranch
                activePath={activePath}
                expandedPaths={expandedPaths}
                items={item.children}
                navigate={navigate}
                onToggle={onToggle}
                parentPath={path}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export function AppSidebarLayoutMenu({
  currentRoute,
  expandMode,
  items,
  navigate,
}: AppSidebarLayoutMenuProps) {
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
      <AppSidebarLayoutMenuBranch
        activePath={normalizeMenuPath(currentRoute)}
        expandedPaths={expandedPaths}
        items={items}
        navigate={navigate}
        onToggle={handleToggle}
      />
    </nav>
  )
}
