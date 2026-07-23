import { forwardRef } from "react"

import { TooltipProvider } from "@/components/shadcn/ui/tooltip"

import { SidebarLayout } from "./SidebarLayout"
import { AppSidebarLayoutHeader } from "./app-sidebar-layout/AppSidebarLayoutHeader"
import { AppSidebarLayoutSidebar } from "./app-sidebar-layout/AppSidebarLayoutSidebar"
import type {
  AppSidebarLayoutHeader as AppSidebarLayoutHeaderOptions,
  AppSidebarLayoutLogout,
  AppSidebarLayoutLogoutPosition,
  AppSidebarLayoutProps,
  AppSidebarLayoutRef,
  AppSidebarLayoutUser,
  AppSidebarLayoutUserPosition,
} from "./app-sidebar-layout/AppSidebarLayoutTypes"

import "./sidebar-layout/SidebarLayout.css"
import "./sidebar-layout/SidebarLayoutSidebar.css"
import "./app-sidebar-layout/AppSidebarLayout.css"

export const AppSidebarLayout = forwardRef<
  AppSidebarLayoutRef,
  AppSidebarLayoutProps
>(function AppSidebarLayout(
  {
    children,
    collapsed,
    defaultCollapsed,
    footerItems = [],
    getCurrentRoute,
    header,
    menu,
    menuExpandMode = "single",
    navigate,
    onCollapsedChange,
    user,
    ...props
  },
  ref
) {
  const currentRoute = getCurrentRoute()
  const collapseMode = header.collapseMode ?? "icon"

  return (
    <TooltipProvider>
      <SidebarLayout
        collapsed={collapsed}
        defaultCollapsed={defaultCollapsed}
        onCollapsedChange={onCollapsedChange}
        ref={ref}
        renderSidebar={(state) => (
          <AppSidebarLayoutSidebar
            collapsed={state.collapsed}
            collapseMode={collapseMode}
            currentRoute={currentRoute}
            expandMode={menuExpandMode}
            footerItems={footerItems}
            items={menu}
            navigate={navigate}
            state={state}
            user={user}
          />
        )}
        renderContent={(state) => (
          <section className="app-sidebar-layout-content">
            <AppSidebarLayoutHeader header={header} state={state} />
            <main className="app-sidebar-layout-content__body">{children}</main>
          </section>
        )}
        sidebar={{ collapseMode, heightMode: "fixed" }}
        {...props}
      >
        {null}
      </SidebarLayout>
    </TooltipProvider>
  )
})

export type {
  AppSidebarLayoutHeaderOptions as AppSidebarLayoutHeader,
  AppSidebarLayoutLogout,
  AppSidebarLayoutLogoutPosition,
  AppSidebarLayoutProps,
  AppSidebarLayoutRef,
  AppSidebarLayoutUser,
  AppSidebarLayoutUserPosition,
}
