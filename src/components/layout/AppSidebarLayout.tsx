import { forwardRef, useCallback } from "react"

import { TooltipProvider } from "@/components/shadcn/ui/tooltip"

import { SidebarLayout } from "./SidebarLayout"
import { AppSidebarLayoutHeader } from "./app-sidebar-layout/AppSidebarLayoutHeader"
import { AppSidebarLayoutSidebar } from "./app-sidebar-layout/AppSidebarLayoutSidebar"
import type { SidebarLayoutActionContext } from "./sidebar-layout/SidebarLayout.types"
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
import "./app-sidebar-layout/AppSidebarLayoutHeader.css"
import "./app-sidebar-layout/AppSidebarLayoutMenu.css"
import "./app-sidebar-layout/AppSidebarLayoutUser.css"

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
  const renderSidebar = useCallback(
    (state: SidebarLayoutActionContext) => (
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
    ),
    [collapseMode, currentRoute, footerItems, menu, menuExpandMode, navigate, user]
  )
  const renderContent = useCallback(
    (state: SidebarLayoutActionContext) => (
      <section className="app-sidebar-layout-content">
        <AppSidebarLayoutHeader header={header} state={state} />
        <main className="app-sidebar-layout-content__body">{children}</main>
      </section>
    ),
    [children, header]
  )

  return (
    <TooltipProvider>
      <SidebarLayout
        collapsed={collapsed}
        defaultCollapsed={defaultCollapsed}
        onCollapsedChange={onCollapsedChange}
        ref={ref}
        renderContent={renderContent}
        renderSidebar={renderSidebar}
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
