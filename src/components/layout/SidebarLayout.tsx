import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcn/ui/resizable"
import { cn } from "@/lib/utils"

import { BasicLayout } from "./BasicLayout"
import { SidebarLayoutContent } from "./SidebarLayoutContent"
import type {
  SidebarLayoutActionContext,
  SidebarLayoutProps,
  SidebarLayoutRef,
} from "./SidebarLayout.types"
import { SidebarLayoutSidebar } from "./sidebar-layout/SidebarLayoutSidebar"

import "./SidebarLayout.css"

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
      sidebar = {},
      ...props
    },
    ref
  ) {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
    const panelRef = useRef<PanelImperativeHandle>(null)
    const isCollapsed = collapsed ?? internalCollapsed
    const collapsedRef = useRef(isCollapsed)
    const collapseMode = sidebar.collapseMode ?? "hidden"
    const heightMode = sidebar.heightMode ?? "stretch"
    const collapsedSize =
      collapseMode === "icon"
        ? sidebar.collapsedIconWidth ?? DEFAULT_COLLAPSED_ICON_WIDTH
        : 0

    const setCollapsed = useCallback(
      (nextCollapsed: boolean) => {
        if (collapsedRef.current === nextCollapsed) {
          return
        }

        collapsedRef.current = nextCollapsed

        if (collapsed === undefined) {
          setInternalCollapsed(nextCollapsed)
        }

        onCollapsedChange?.(nextCollapsed)
      },
      [collapsed, onCollapsedChange]
    )

    const expand = useCallback(() => {
      setCollapsed(false)
    }, [setCollapsed])

    const collapse = useCallback(() => {
      setCollapsed(true)
    }, [setCollapsed])

    const toggle = useCallback(() => {
      setCollapsed(!collapsedRef.current)
    }, [setCollapsed])

    const handleNavigate = useCallback(
      (to: string) => {
        if (navigate) {
          navigate(to)
          return
        }

        if (typeof window !== "undefined") {
          window.location.assign(to)
        }
      },
      [navigate]
    )

    const actionContext: SidebarLayoutActionContext = {
      collapse,
      collapsed: isCollapsed,
      expand,
      navigate: handleNavigate,
      toggle,
    }

    useImperativeHandle(ref, () => ({ collapse, expand, toggle }), [
      collapse,
      expand,
      toggle,
    ])

    useLayoutEffect(() => {
      collapsedRef.current = isCollapsed

      if (isCollapsed) {
        panelRef.current?.collapse()
        return
      }

      panelRef.current?.expand()
    }, [isCollapsed])

    const handlePanelResize = useCallback(() => {
      const nextCollapsed = panelRef.current?.isCollapsed()

      if (nextCollapsed !== undefined) {
        setCollapsed(nextCollapsed)
      }
    }, [setCollapsed])

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
            <SidebarLayoutSidebar
              collapsed={isCollapsed}
              footerItems={footerItems}
              items={items}
              options={sidebar}
              state={actionContext}
            />
          </ResizablePanel>
          <ResizableHandle className="sidebar-layout__resize-handle" />
          <ResizablePanel className="sidebar-layout__panel" minSize={0}>
            <SidebarLayoutContent header={header}>
              {children}
            </SidebarLayoutContent>
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
} from "./SidebarLayout.types"
