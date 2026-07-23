import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PanelLeftOpenIcon,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/ui/tooltip"
import { Button } from "@/components/shadcn/ui/button"

import type { SidebarLayoutActionContext } from "../sidebar-layout/SidebarLayout.types"
import type { AppSidebarLayoutHeader } from "./AppSidebarLayoutTypes"

interface AppSidebarLayoutHeaderProps {
  header: AppSidebarLayoutHeader
  state: SidebarLayoutActionContext
}

function collapseIcon(header: AppSidebarLayoutHeader, collapsed: boolean) {
  if (collapsed) {
    return (
      header.collapseIcons?.expand ?? <PanelLeftOpenIcon aria-hidden="true" />
    )
  }

  if (header.collapseMode === "hidden") {
    return header.collapseIcons?.hidden ?? <PanelLeftIcon aria-hidden="true" />
  }

  return header.collapseIcons?.icon ?? <PanelLeftCloseIcon aria-hidden="true" />
}

export function AppSidebarLayoutHeader({
  header,
  state,
}: AppSidebarLayoutHeaderProps) {
  const tooltip = state.collapsed ? "展开侧栏" : "收起侧栏"

  return (
    <header className="app-sidebar-layout-header">
      <div className="app-sidebar-layout-header__start">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={tooltip}
              className="app-sidebar-layout-header__toggle"
              onClick={state.toggle}
              size="icon-lg"
              type="button"
            >
              {collapseIcon(header, state.collapsed)}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
        <div className="app-sidebar-layout-header__title">{header.title}</div>
        {header.left && (
          <div className="app-sidebar-layout-header__left">{header.left}</div>
        )}
      </div>
      {header.right && (
        <div className="app-sidebar-layout-header__right">{header.right}</div>
      )}
    </header>
  )
}
