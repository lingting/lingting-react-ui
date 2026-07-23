import type { ReactNode } from "react"

import type { BasicLayoutProps } from "../BasicLayout"
import type { MenuExpandMode, MenuItem } from "@/types/menu"
import type {
  SidebarLayoutCollapseMode,
  SidebarLayoutItem,
  SidebarLayoutRef,
} from "../sidebar-layout/SidebarLayout.types"

export type AppSidebarLayoutUserPosition = "top" | "bottom"

export type AppSidebarLayoutLogoutPosition = "inline" | "bottom"

export interface AppSidebarLayoutLogout {
  icon?: ReactNode
  onClick: () => void
  position?: AppSidebarLayoutLogoutPosition
  text: ReactNode
}

export interface AppSidebarLayoutUser {
  avatar?: string
  description?: ReactNode
  logout?: AppSidebarLayoutLogout
  nickname: ReactNode
  position?: AppSidebarLayoutUserPosition
}

export interface AppSidebarLayoutHeader {
  collapseIcons?: Partial<
    Record<SidebarLayoutCollapseMode | "expand", ReactNode>
  >
  collapseMode?: SidebarLayoutCollapseMode
  left?: ReactNode
  right?: ReactNode
  title: ReactNode
}

export interface AppSidebarLayoutProps extends Omit<
  BasicLayoutProps,
  "children"
> {
  children: ReactNode
  collapsed?: boolean
  defaultCollapsed?: boolean
  footerItems?: readonly SidebarLayoutItem[]
  getCurrentRoute: () => string
  header: AppSidebarLayoutHeader
  menu: readonly MenuItem[]
  menuExpandMode?: MenuExpandMode
  navigate: (path: string) => void
  onCollapsedChange?: (collapsed: boolean) => void
  user?: AppSidebarLayoutUser
}

export type { SidebarLayoutRef as AppSidebarLayoutRef }
export type { MenuExpandMode, MenuItem }
