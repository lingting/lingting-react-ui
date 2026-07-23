import { memo } from "react"

import { AppSidebarLayoutMenuIcon } from "./AppSidebarLayoutMenuIcon"
import type { AppSidebarLayoutMenuNode } from "./AppSidebarLayoutMenuModel"
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/shadcn/ui/dropdown-menu"

interface AppSidebarLayoutMenuPopupProps {
  activeDirectoryPaths: ReadonlySet<string>
  activePath: string
  items: readonly AppSidebarLayoutMenuNode[]
  navigate: (path: string) => void
  onNavigate: () => void
}

export const AppSidebarLayoutMenuPopup = memo(function AppSidebarLayoutMenuPopup({
  activeDirectoryPaths,
  activePath,
  items,
  navigate,
  onNavigate,
}: AppSidebarLayoutMenuPopupProps) {
  return items.map((node) => {
    const isActive = !node.isDirectory && node.path === activePath
    const isActiveDirectory =
      node.isDirectory && activeDirectoryPaths.has(node.path)

    if (node.isDirectory) {
      return (
        <DropdownMenuSub key={node.path}>
          <DropdownMenuSubTrigger
            className="app-sidebar-layout-menu-popup__sub-trigger"
            data-active-directory={isActiveDirectory || undefined}
          >
            {node.item.icon && (
              <AppSidebarLayoutMenuIcon icon={node.item.icon} />
            )}
            <span>{node.item.title}</span>
          </DropdownMenuSubTrigger>
          {node.children.length > 0 && (
            <DropdownMenuSubContent className="app-sidebar-layout-menu-popup__content">
              <AppSidebarLayoutMenuPopup
                activeDirectoryPaths={activeDirectoryPaths}
                activePath={activePath}
                items={node.children}
                navigate={navigate}
                onNavigate={onNavigate}
              />
            </DropdownMenuSubContent>
          )}
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem
        className="app-sidebar-layout-menu-popup__item"
        data-active={isActive || undefined}
        key={node.path}
        onSelect={() => {
          navigate(node.path)
          onNavigate()
        }}
      >
        {node.item.icon && <AppSidebarLayoutMenuIcon icon={node.item.icon} />}
        <span>{node.item.title}</span>
      </DropdownMenuItem>
    )
  })
})
