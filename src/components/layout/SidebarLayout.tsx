import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcn/ui/resizable"
import { cn } from "@/lib/utils"

import { BasicLayout } from "./BasicLayout"
import { SidebarLayoutContent } from "./sidebar-layout/SidebarLayoutContent"
import { SidebarLayoutSidebar } from "./sidebar-layout/SidebarLayoutSidebar"
import { useSidebarLayoutState } from "./sidebar-layout/useSidebarLayoutState"
import type {
  SidebarLayoutProps,
  SidebarLayoutRef,
} from "./sidebar-layout/SidebarLayout.types"

import "./sidebar-layout/SidebarLayout.css"

const DEFAULT_WIDTH = 256
const DEFAULT_MIN_WIDTH = 192
const DEFAULT_MAX_WIDTH = 400
const DEFAULT_COLLAPSED_ICON_WIDTH = 56

export const SidebarLayout = forwardRef<SidebarLayoutRef, SidebarLayoutProps>(
  function SidebarLayout(
    {
      children,
      className,
      collapsed,
      defaultCollapsed = false,
      footerItems = [],
      header = false,
      items = [],
      navigate,
      onCollapsedChange,
      renderContent,
      renderSidebar,
      sidebar = {},
      ...props
    },
    ref
  ) {
    const panelRef = useRef<PanelImperativeHandle>(null)
    const { actions, collapsedRef, isCollapsed, updateCollapsed } =
      useSidebarLayoutState({
        collapsed,
        defaultCollapsed,
        navigate,
        onCollapsedChange,
      })
    const collapseMode = sidebar.collapseMode ?? "hidden"
    const heightMode = sidebar.heightMode ?? "stretch"
    const collapsedSize =
      collapseMode === "icon"
        ? (sidebar.collapsedIconWidth ?? DEFAULT_COLLAPSED_ICON_WIDTH)
        : 0
    const handlePanelResize = useCallback(() => {
      const panelCollapsed = panelRef.current?.isCollapsed()
      if (panelCollapsed === undefined) return

      updateCollapsed(panelCollapsed)
    }, [updateCollapsed])

    useImperativeHandle(
      ref,
      () => ({
        collapse: actions.collapse,
        expand: actions.expand,
        toggle: actions.toggle,
      }),
      [actions.collapse, actions.expand, actions.toggle]
    )
    useLayoutEffect(() => {
      collapsedRef.current = isCollapsed
      if (isCollapsed) {
        panelRef.current?.collapse()
        return
      }

      panelRef.current?.expand()
    }, [collapsedRef, isCollapsed])

    return (
      <BasicLayout
        className={cn(
          "sidebar-layout-root",
          heightMode === "fixed"
            ? "sidebar-layout-root--fixed"
            : "sidebar-layout-root--stretch",
          className
        )}
        data-slot="sidebar-layout-root"
        {...props}
      >
        <ResizablePanelGroup
          className={cn(
            "sidebar-layout",
            heightMode === "fixed"
              ? "sidebar-layout--fixed"
              : "sidebar-layout--stretch"
          )}
          data-slot="sidebar-layout"
          orientation="horizontal"
        >
          <ResizablePanel
            className="sidebar-layout__panel"
            collapsedSize={collapsedSize}
            collapsible
            defaultSize={sidebar.defaultWidth ?? DEFAULT_WIDTH}
            maxSize={sidebar.maxWidth ?? DEFAULT_MAX_WIDTH}
            minSize={sidebar.minWidth ?? DEFAULT_MIN_WIDTH}
            onResize={handlePanelResize}
            panelRef={panelRef}
          >
            {renderSidebar?.(actions) ?? (
              <SidebarLayoutSidebar
                collapsed={actions.collapsed}
                footerItems={footerItems}
                items={items}
                options={sidebar}
                state={actions}
              />
            )}
          </ResizablePanel>
          <ResizableHandle className="sidebar-layout__resize-handle" />
          <ResizablePanel className="sidebar-layout__panel" minSize={0}>
            {renderContent?.(actions) ?? (
              <SidebarLayoutContent header={header}>
                {children}
              </SidebarLayoutContent>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </BasicLayout>
    )
  }
)

export type {
  SidebarLayoutActionContext,
  SidebarLayoutCollapseMode,
  SidebarLayoutHeaderOptions,
  SidebarLayoutHeightMode,
  SidebarLayoutItem,
  SidebarLayoutProps,
  SidebarLayoutRef,
  SidebarLayoutSidebarOptions,
  SidebarLayoutSize,
} from "./sidebar-layout/SidebarLayout.types"
