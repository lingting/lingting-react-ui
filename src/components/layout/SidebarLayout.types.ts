import type {
  CSSProperties,
  ReactNode,
} from "react"

import type { BasicLayoutProps } from "./BasicLayout"

export type SidebarLayoutSize = number | string

export type SidebarLayoutCollapseMode = "hidden" | "icon"

export type SidebarLayoutHeightMode = "stretch" | "fixed"

export interface SidebarLayoutRef {
  collapse: () => void
  expand: () => void
  toggle: () => void
}

export interface SidebarLayoutActionContext extends SidebarLayoutRef {
  collapsed: boolean
  navigate: (to: string) => void
}

export interface SidebarLayoutItem {
  icon?: string | ReactNode
  content: ReactNode
  onClick?: (state: SidebarLayoutActionContext) => void
}

export interface SidebarLayoutSidebarOptions {
  collapseMode?: SidebarLayoutCollapseMode
  collapsedIconWidth?: SidebarLayoutSize
  defaultWidth?: SidebarLayoutSize
  footerMaxHeight?: CSSProperties["maxHeight"]
  heightMode?: SidebarLayoutHeightMode
  maxWidth?: SidebarLayoutSize
  minWidth?: SidebarLayoutSize
  normalMinHeight?: CSSProperties["minHeight"]
}

export interface SidebarLayoutHeaderOptions {
  fixed?: boolean
  height?: CSSProperties["height"]
  left?: ReactNode
  right?: ReactNode
}

export interface SidebarLayoutProps
  extends Omit<BasicLayoutProps, "children"> {
  children: ReactNode
  collapsed?: boolean
  defaultCollapsed?: boolean
  footerItems?: readonly SidebarLayoutItem[]
  header?: false | SidebarLayoutHeaderOptions
  items?: readonly SidebarLayoutItem[]
  navigate?: (to: string) => void
  onCollapsedChange?: (collapsed: boolean) => void
  sidebar?: SidebarLayoutSidebarOptions
}
