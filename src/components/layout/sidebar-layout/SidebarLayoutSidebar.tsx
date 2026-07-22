import type { CSSProperties } from "react"

import type {
  SidebarLayoutActionContext,
  SidebarLayoutHeightMode,
  SidebarLayoutItem,
  SidebarLayoutSidebarOptions,
} from "../SidebarLayout.types"
import { toSidebarLayoutCssSize } from "../SidebarLayoutStyle"
import { SidebarLayoutItems } from "./SidebarLayoutItems"

import "./SidebarLayoutSidebar.css"

interface SidebarLayoutSidebarProps {
  collapsed: boolean
  footerItems: readonly SidebarLayoutItem[]
  items: readonly SidebarLayoutItem[]
  options: SidebarLayoutSidebarOptions
  state: SidebarLayoutActionContext
}

const sidebarStyle = (
  footerMaxHeight: CSSProperties["maxHeight"],
  normalMinHeight: CSSProperties["minHeight"]
) =>
  ({
    "--sidebar-layout-footer-max-height": toSidebarLayoutCssSize(
      footerMaxHeight,
      "40%"
    ),
    "--sidebar-layout-normal-min-height": toSidebarLayoutCssSize(
      normalMinHeight,
      "0px"
    ),
  }) as CSSProperties

export function SidebarLayoutSidebar({
  collapsed,
  footerItems,
  items,
  options,
  state,
}: SidebarLayoutSidebarProps) {
  const heightMode: SidebarLayoutHeightMode = options.heightMode ?? "stretch"
  const collapseClass = collapsed
    ? options.collapseMode === "icon"
      ? "sidebar-layout-sidebar--collapsed-icon"
      : "sidebar-layout-sidebar--collapsed-hidden"
    : "sidebar-layout-sidebar--expanded"

  return (
    <aside
      className={`sidebar-layout-sidebar sidebar-layout-sidebar--${heightMode} ${collapseClass}`}
      data-slot="sidebar-layout-sidebar"
      style={sidebarStyle(options.footerMaxHeight, options.normalMinHeight)}
    >
      <SidebarLayoutItems
        className="sidebar-layout-sidebar__items"
        items={items}
        state={state}
      />
      <SidebarLayoutItems
        className="sidebar-layout-sidebar__footer-items"
        items={footerItems}
        state={state}
      />
    </aside>
  )
}
