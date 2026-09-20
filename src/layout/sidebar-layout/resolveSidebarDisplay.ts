import type { LayoutScreenMode } from "@lri/types";

import type { ResolvedSidebarDisplay, SidebarDisplay } from "./SidebarLayoutTypes";

/**
 * 将展示方式与屏幕模式归一为最终展示方式。
 *
 * `auto` 在小屏幕下使用抽屉，其余情况保持平铺。
 */
export function resolveSidebarDisplay(
  sidebarDisplay: SidebarDisplay,
  screenMode: LayoutScreenMode,
): ResolvedSidebarDisplay {
  if (sidebarDisplay !== "auto") return sidebarDisplay;

  return screenMode === "small" ? "drawer" : "inline";
}
