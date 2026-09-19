import { useEffect, useState } from "react";

/**
 * 同步桌面窗口的最大化状态。
 *
 * 通过 window resize 事件重新读取状态，避免依赖宿主注入的窗口事件接口。
 */
export function useWindowMaximized(isMaximized: () => Promise<boolean>) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    let active = true;

    const syncMaximized = async () => {
      try {
        const value = await isMaximized();
        if (active) {
          setMaximized(value);
        }
      } catch (error) {
        console.error("读取窗口最大化状态失败:", error);
      }
    };

    const handleResized = () => void syncMaximized();
    void syncMaximized();
    window.addEventListener("resize", handleResized);

    return () => {
      active = false;
      window.removeEventListener("resize", handleResized);
    };
  }, [isMaximized]);

  return maximized;
}
