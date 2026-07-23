import { memo, useCallback } from "react"
import { ChevronDownIcon } from "lucide-react"

import { AppSidebarLayoutMenuIcon } from "./AppSidebarLayoutMenuIcon"
import type { AppSidebarLayoutMenuNode } from "./AppSidebarLayoutMenuModel"
import { AppSidebarLayoutMenuPopup } from "./AppSidebarLayoutMenuPopup"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar"
import { Button } from "@/components/shadcn/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"

interface AppSidebarLayoutMenuItemProps {
  activeDirectoryPaths: ReadonlySet<string>
  activePath: string
  collapsed: boolean
  expandedPaths: ReadonlySet<string>
  navigate: (path: string) => void
  node: AppSidebarLayoutMenuNode
  onPopupClose: () => void
  onPopupOpen: (path: string) => void
  onPopupScheduleClose: () => void
  onToggle: (path: string, parentPath?: string) => void
  openPath: string | null
}

export const AppSidebarLayoutMenuItem = memo(function AppSidebarLayoutMenuItem({
  activeDirectoryPaths,
  activePath,
  collapsed,
  expandedPaths,
  navigate,
  node,
  onPopupClose,
  onPopupOpen,
  onPopupScheduleClose,
  onToggle,
  openPath,
}: AppSidebarLayoutMenuItemProps) {
  const isActive = !node.isDirectory && node.path === activePath
  const isActiveDirectory =
    node.isDirectory && activeDirectoryPaths.has(node.path)
  const isExpanded = expandedPaths.has(node.path)
  const tooltip = node.item.tooltip ?? node.item.title
  const handleClick = useCallback(() => {
    if (node.isDirectory) {
      onToggle(node.path, node.parentPath)
      return
    }

    navigate(node.path)
  }, [navigate, node.isDirectory, node.parentPath, node.path, onToggle])
  const icon = <AppSidebarLayoutMenuIcon icon={node.item.icon} />

  if (collapsed && node.isDirectory) {
    return (
      <SidebarMenuItem>
        <DropdownMenu
          modal={false}
          onOpenChange={(open) => {
            if (open) onPopupOpen(node.path)
            else onPopupClose()
          }}
          open={openPath === node.path}
        >
          <DropdownMenuTrigger asChild>
            <Button
              aria-expanded={openPath === node.path}
              aria-label={typeof node.item.title === "string" ? node.item.title : undefined}
              className="app-sidebar-layout-menu__trigger"
              data-active-directory={isActiveDirectory || undefined}
              onPointerEnter={() => onPopupOpen(node.path)}
              onPointerLeave={onPopupScheduleClose}
              size="icon-lg"
              type="button"
            >
              {icon}
            </Button>
          </DropdownMenuTrigger>
          {node.children.length > 0 && (
            <DropdownMenuContent
              align="start"
              className="app-sidebar-layout-menu-popup"
              onPointerEnter={() => onPopupOpen(node.path)}
              onPointerLeave={onPopupScheduleClose}
              side="right"
            >
              <AppSidebarLayoutMenuPopup
                activeDirectoryPaths={activeDirectoryPaths}
                activePath={activePath}
                items={node.children}
                navigate={navigate}
                onNavigate={onPopupClose}
              />
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  if (collapsed) {
    return (
      <SidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-current={isActive ? "page" : undefined}
              aria-label={typeof tooltip === "string" ? tooltip : undefined}
              className="app-sidebar-layout-menu__trigger"
              data-active={isActive || undefined}
              onClick={handleClick}
              size="icon-lg"
              type="button"
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{tooltip}</TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Button
        aria-current={isActive ? "page" : undefined}
        aria-expanded={node.isDirectory ? isExpanded : undefined}
        className="app-sidebar-layout-menu__trigger"
        data-active={isActive || undefined}
        data-active-directory={isActiveDirectory || undefined}
        onClick={handleClick}
        size="lg"
        type="button"
      >
        {icon}
        <span className="app-sidebar-layout-menu__title">{node.item.title}</span>
        {node.isDirectory && (
          <ChevronDownIcon
            aria-hidden="true"
            className="app-sidebar-layout-menu__chevron"
            data-expanded={isExpanded || undefined}
          />
        )}
      </Button>
      {node.isDirectory && isExpanded && node.children.length > 0 && (
        <SidebarMenu className="app-sidebar-layout-menu__sub-menu">
          {node.children.map((child) => (
            <AppSidebarLayoutMenuItem
              activeDirectoryPaths={activeDirectoryPaths}
              activePath={activePath}
              collapsed={collapsed}
              expandedPaths={expandedPaths}
              key={child.path}
              navigate={navigate}
              node={child}
              onPopupClose={onPopupClose}
              onPopupOpen={onPopupOpen}
              onPopupScheduleClose={onPopupScheduleClose}
              onToggle={onToggle}
              openPath={openPath}
            />
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  )
})
