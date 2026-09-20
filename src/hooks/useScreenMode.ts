import { useCallback, useSyncExternalStore } from "react";

import type { LayoutScreenMode } from "@lri/types";

const MOBILE_BREAKPOINT = 768;

function subscribeToBreakpoint(breakpoint: number, onChange: () => void) {
  const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

/**
 * 识别当前屏幕模式，宽度小于阈值时为 `small`，并随窗口尺寸变化同步更新。
 */
export function useScreenMode(breakpoint: number = MOBILE_BREAKPOINT): LayoutScreenMode {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToBreakpoint(breakpoint, onChange),
    [breakpoint],
  );
  const isSmall = useSyncExternalStore(
    subscribe,
    () => window.innerWidth < breakpoint,
    () => false,
  );

  return isSmall ? "small" : "default";
}
