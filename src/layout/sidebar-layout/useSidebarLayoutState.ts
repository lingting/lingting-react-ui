import { useCallback, useEffect, useMemo, useState } from "react";

import { useLayout } from "../BasicLayout";
import {
  SidebarCollapsed,
  type ResolvedSidebarDisplay,
  type SidebarDisplay,
  type SidebarLayoutState,
} from "./SidebarLayoutTypes";
import { resolveSidebarDisplay } from "./resolveSidebarDisplay";

export type UseSidebarLayoutStateOptions = {
  /** 侧栏初始折叠状态，`Default` 表示取展示方式的内置默认值 */
  sidebarCollapsedDefault?: SidebarCollapsed;
  sidebarDisplay?: SidebarDisplay;
  /** 侧栏不渲染时折叠状态恒为 `Hidden`，设置与切换均为空操作 */
  sidebarShow?: boolean;
};

/** 抽屉展示方式下侧栏默认隐藏，平铺展示方式下侧栏默认展开 */
function getDisplayDefaultCollapsed(sidebarDisplay: ResolvedSidebarDisplay) {
  return sidebarDisplay === "drawer" ? SidebarCollapsed.Hidden : SidebarCollapsed.Expanded;
}

/**
 * 把折叠状态归一为当前展示方式下可用的状态。
 *
 * `Default` 取展示方式的内置默认值，抽屉展示方式下折叠语义进一步归一到隐藏。
 */
function resolveCollapsed(
  collapsed: SidebarCollapsed,
  sidebarDisplay: ResolvedSidebarDisplay,
): SidebarCollapsed {
  const value =
    collapsed === SidebarCollapsed.Default ? getDisplayDefaultCollapsed(sidebarDisplay) : collapsed;

  if (sidebarDisplay !== "drawer") return value;

  return value === SidebarCollapsed.Collapsed ? SidebarCollapsed.Hidden : value;
}

/**
 * 侧栏状态：把屏幕模式与展示方式归一为最终展示方式，并维护该方式下的展开状态。
 *
 * 抽屉展示方式只有隐藏与展示两种状态，折叠语义归一到隐藏。
 */
export function useSidebarLayoutState({
  sidebarCollapsedDefault = SidebarCollapsed.Default,
  sidebarDisplay = "auto",
  sidebarShow = true,
}: UseSidebarLayoutStateOptions = {}): SidebarLayoutState {
  const { screenMode } = useLayout();
  const resolvedDisplay = resolveSidebarDisplay(sidebarDisplay, screenMode);
  const isDrawer = resolvedDisplay === "drawer";
  const [collapsed, setCollapsedState] = useState(() =>
    resolveCollapsed(sidebarCollapsedDefault, resolvedDisplay),
  );

  // 展示方式变化时回到初始折叠状态；`sidebarCollapsedDefault` 仅作初始值，故不参与依赖
  useEffect(() => {
    setCollapsedState(resolveCollapsed(sidebarCollapsedDefault, resolvedDisplay));
  }, [resolvedDisplay]);

  const setCollapsed = useCallback(
    (next: SidebarCollapsed) => {
      if (!sidebarShow) return;

      setCollapsedState(resolveCollapsed(next, resolvedDisplay));
    },
    [resolvedDisplay, sidebarShow],
  );

  const toggleCollapsed = useCallback(() => {
    if (!sidebarShow) return;

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
  }, [isDrawer, sidebarShow]);

  return useMemo(
    () => ({
      collapsed: sidebarShow ? collapsed : SidebarCollapsed.Hidden,
      screenMode,
      setCollapsed,
      sidebarDisplay: resolvedDisplay,
      toggleCollapsed,
    }),
    [collapsed, resolvedDisplay, screenMode, setCollapsed, sidebarShow, toggleCollapsed],
  );
}
