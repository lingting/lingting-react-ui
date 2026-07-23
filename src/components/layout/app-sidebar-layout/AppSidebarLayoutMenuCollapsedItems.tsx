import { AppSidebarLayoutMenuIcon } from "./AppSidebarLayoutMenuIcon"
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { isMenuDirectory, normalizeMenuPath } from "@/lib/menu-utils"
import type { MenuItem } from "@/types/menu"

interface AppSidebarLayoutMenuCollapsedItemsProps {
  activeDirectoryPaths: ReadonlySet<string>
  activePath: string
  items: readonly MenuItem[]
  navigate: (path: string) => void
  onNavigate: () => void
  parentPath: string
}

export function AppSidebarLayoutMenuCollapsedItems({
  activeDirectoryPaths,
  activePath,
  items,
  navigate,
  onNavigate,
  parentPath,
}: AppSidebarLayoutMenuCollapsedItemsProps) {
  return items.map((item) => {
    const path = normalizeMenuPath(`${parentPath}/${item.path}`)
    const isDirectory = isMenuDirectory(item)
    const isActive = !isDirectory && path === activePath
    const isActiveDirectory =
      isDirectory && (path === activePath || activeDirectoryPaths.has(path))

    if (isDirectory) {
      return (
        <DropdownMenuSub key={path}>
          <DropdownMenuSubTrigger
            className="app-sidebar-layout-menu__collapsed-submenu-trigger"
            data-active-directory={isActiveDirectory || undefined}
          >
            {item.icon && <AppSidebarLayoutMenuIcon icon={item.icon} />}
            <span>{item.title}</span>
          </DropdownMenuSubTrigger>
          {item.children?.length ? (
            <DropdownMenuSubContent className="app-sidebar-layout-menu__collapsed-submenu-content">
              <AppSidebarLayoutMenuCollapsedItems
                activeDirectoryPaths={activeDirectoryPaths}
                activePath={activePath}
                items={item.children}
                navigate={navigate}
                onNavigate={onNavigate}
                parentPath={path}
              />
            </DropdownMenuSubContent>
          ) : null}
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem
        className="app-sidebar-layout-menu__collapsed-item"
        data-active={isActive || undefined}
        key={path}
        onSelect={() => {
          navigate(path)
          onNavigate()
        }}
      >
        {item.icon && <AppSidebarLayoutMenuIcon icon={item.icon} />}
        <span>{item.title}</span>
      </DropdownMenuItem>
    )
  })
}
