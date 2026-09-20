import { useCallback, useEffect, useMemo, useState } from "react";

import { useLayout } from "../BasicLayout";
import {
  SidebarCollapsed,
  type ResolvedSidebarDisplay,
  type SidebarDisplay,
  type SidebarLayoutState,
} from "./SidebarLayoutTypes";
import { resolveSidebarDisplay } from "./resolveSidebarDisplay";

/** 抽屉展示方式下侧栏默认隐藏，平铺展示方式下侧栏默认展开 */
function getDefaultCollapsed(sidebarDisplay: ResolvedSidebarDisplay) {
  return sidebarDisplay === "drawer" ? SidebarCollapsed.Hidden : SidebarCollapsed.Expanded;
}

/**
 * 侧栏状态：把屏幕模式与展示方式归一为最终展示方式，并维护该方式下的展开状态。
 *
 * 抽屉展示方式只有隐藏与展示两种状态，折叠语义归一到隐藏。
 */
export function useSidebarLayoutState(sidebarDisplay: SidebarDisplay = "auto"): SidebarLayoutState {
  const { screenMode } = useLayout();
  const resolvedDisplay = resolveSidebarDisplay(sidebarDisplay, screenMode);
  const isDrawer = resolvedDisplay === "drawer";
  const [collapsed, setCollapsedState] = useState(() => getDefaultCollapsed(resolvedDisplay));

  useEffect(() => {
    setCollapsedState(getDefaultCollapsed(resolvedDisplay));
  }, [resolvedDisplay]);

  const setCollapsed = useCallback(
    (next: SidebarCollapsed) => {
      setCollapsedState(
        isDrawer && next === SidebarCollapsed.Collapsed ? SidebarCollapsed.Hidden : next,
      );
    },
    [isDrawer],
  );

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((current) => {
      if (isDrawer) {
        return current === SidebarCollapsed.Expanded
          ? SidebarCollapsed.Hidden
          : SidebarCollapsed.Expanded;
      }

      return current === SidebarCollapsed.Collapsed
        ? SidebarCollapsed.Expanded
        : SidebarCollapsed.Collapsed;
    });
  }, [isDrawer]);

  return useMemo(
    () => ({
      collapsed,
      screenMode,
      setCollapsed,
      sidebarDisplay: resolvedDisplay,
      toggleCollapsed,
    }),
    [collapsed, resolvedDisplay, screenMode, setCollapsed, toggleCollapsed],
  );
}
