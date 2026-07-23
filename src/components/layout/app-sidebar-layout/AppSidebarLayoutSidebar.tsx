import type { SidebarLayoutItem } from "../sidebar-layout/SidebarLayout.types"
import { SidebarLayoutItems } from "../sidebar-layout/SidebarLayoutItems"
import type { SidebarLayoutActionContext } from "../sidebar-layout/SidebarLayout.types"
import { AppSidebarLayoutMenu } from "./AppSidebarLayoutMenu"
import type { MenuExpandMode, MenuItem } from "@/types/menu"
import type { AppSidebarLayoutUser as AppSidebarLayoutUserValue } from "./AppSidebarLayoutTypes"
import { AppSidebarLayoutUser as AppSidebarLayoutUserView } from "./AppSidebarLayoutUser"

interface AppSidebarLayoutSidebarProps {
  collapsed: boolean
  collapseMode: "hidden" | "icon"
  currentRoute: string
  expandMode: MenuExpandMode
  footerItems: readonly SidebarLayoutItem[]
  items: readonly MenuItem[]
  navigate: (path: string) => void
  state: SidebarLayoutActionContext
  user?: AppSidebarLayoutUserValue
}

export function AppSidebarLayoutSidebar({
  collapsed,
  collapseMode,
  currentRoute,
  expandMode,
  footerItems,
  items,
  navigate,
  state,
  user,
}: AppSidebarLayoutSidebarProps) {
  const isBottomUser = user?.position === "bottom"
  const bottomLogout =
    user?.logout?.position === "bottom" ? user.logout : undefined
  const collapseClass = collapsed
    ? collapseMode === "icon"
      ? "sidebar-layout-sidebar--collapsed-icon"
      : "sidebar-layout-sidebar--collapsed-hidden"
    : "sidebar-layout-sidebar--expanded"

  return (
    <aside
      className={`app-sidebar-layout-sidebar sidebar-layout-sidebar ${collapseClass}`}
      data-slot="app-sidebar-layout-sidebar"
    >
      {user && !isBottomUser && <AppSidebarLayoutUserView user={user} />}
      <AppSidebarLayoutMenu
        collapsed={collapsed}
        currentRoute={currentRoute}
        expandMode={expandMode}
        items={items}
        navigate={navigate}
      />
      <SidebarLayoutItems
        className="app-sidebar-layout-sidebar__footer-items"
        items={footerItems}
        state={{ ...state, navigate }}
      />
      {user && isBottomUser && <AppSidebarLayoutUserView user={user} />}
      {bottomLogout && (
        <button
          className="app-sidebar-layout-sidebar__logout"
          onClick={bottomLogout.onClick}
          type="button"
        >
          {bottomLogout.icon && (
            <span className="app-sidebar-layout-sidebar__logout-icon">
              {bottomLogout.icon}
            </span>
          )}
          <span>{bottomLogout.text}</span>
        </button>
      )}
    </aside>
  )
}
