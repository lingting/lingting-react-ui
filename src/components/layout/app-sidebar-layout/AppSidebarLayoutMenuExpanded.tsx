import { ChevronDownIcon } from "lucide-react"

import { AppSidebarLayoutMenuIcon } from "./AppSidebarLayoutMenuIcon"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"
import { isMenuDirectory, normalizeMenuPath } from "@/lib/menu-utils"
import type { MenuItem } from "@/types/menu"

interface AppSidebarLayoutMenuExpandedProps {
  activeDirectoryPaths: ReadonlySet<string>
  activePath: string
  expandedPaths: ReadonlySet<string>
  items: readonly MenuItem[]
  navigate: (path: string) => void
  onToggle: (path: string, parentPath?: string) => void
  parentPath?: string
}

export function AppSidebarLayoutMenuExpanded({
  activeDirectoryPaths,
  activePath,
  expandedPaths,
  items,
  navigate,
  onToggle,
  parentPath,
}: AppSidebarLayoutMenuExpandedProps) {
  return (
    <ul className="app-sidebar-layout-menu__list">
      {items.map((item) => {
        const path = normalizeMenuPath(`${parentPath ?? ""}/${item.path}`)
        const isDirectory = isMenuDirectory(item)
        const isExpanded = expandedPaths.has(path)
        const isActive = !isDirectory && path === activePath
        const isActiveDirectory =
          isDirectory &&
          (path === activePath || activeDirectoryPaths.has(path))
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
            data-active-directory={isActiveDirectory || undefined}
            data-directory={isDirectory || undefined}
            onClick={handleClick}
            type="button"
          >
            {item.icon && (
              <span className="app-sidebar-layout-menu__icon">
                <AppSidebarLayoutMenuIcon icon={item.icon} />
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
            {item.tooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">{item.tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              button
            )}
            {isDirectory && isExpanded && item.children?.length ? (
              <AppSidebarLayoutMenuExpanded
                activeDirectoryPaths={activeDirectoryPaths}
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
