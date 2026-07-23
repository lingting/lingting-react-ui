import { useCallback, useMemo, useRef, useState } from "react"

import type { SidebarLayoutActionContext } from "./SidebarLayout.types"

interface SidebarLayoutStateOptions {
  collapsed?: boolean
  defaultCollapsed: boolean
  navigate?: (to: string) => void
  onCollapsedChange?: (collapsed: boolean) => void
}

export function useSidebarLayoutState({
  collapsed,
  defaultCollapsed,
  navigate,
  onCollapsedChange,
}: SidebarLayoutStateOptions) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsed ?? internalCollapsed
  const collapsedRef = useRef(isCollapsed)
  const updateCollapsed = useCallback(
    (nextCollapsed: boolean) => {
      if (collapsedRef.current === nextCollapsed) return

      collapsedRef.current = nextCollapsed
      if (collapsed === undefined) setInternalCollapsed(nextCollapsed)
      onCollapsedChange?.(nextCollapsed)
    },
    [collapsed, onCollapsedChange]
  )
  const collapse = useCallback(() => updateCollapsed(true), [updateCollapsed])
  const expand = useCallback(() => updateCollapsed(false), [updateCollapsed])
  const toggle = useCallback(
    () => updateCollapsed(!collapsedRef.current),
    [updateCollapsed]
  )
  const handleNavigate = useCallback(
    (path: string) => {
      if (navigate) {
        navigate(path)
        return
      }

      if (typeof window !== "undefined") window.location.assign(path)
    },
    [navigate]
  )
  const actions = useMemo<SidebarLayoutActionContext>(
    () => ({
      collapse,
      collapsed: isCollapsed,
      expand,
      navigate: handleNavigate,
      toggle,
    }),
    [collapse, expand, handleNavigate, isCollapsed, toggle]
  )

  return { actions, collapsedRef, isCollapsed, updateCollapsed }
}
