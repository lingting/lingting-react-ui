import clsx from "clsx";

import { BasicLayout, resolveSidebarDisplay, useLayout } from "@lri/layout";
import { SidebarShell, useSidebarShell } from "../sidebar-common";
import { useAppSidebarLayout } from "./AppSidebarLayoutContext";

/**
 * BasicLayout 内部的内容。
 *
 * 屏幕模式只能从布局上下文读取：useScreenMode 的阈值由调用方传入，与 BasicLayout 的判定可能不一致。
 */
function AppSidebarContentBody() {
  const { menuRoutes, props } = useAppSidebarLayout();
  const { screenMode } = useLayout();
  const {
    baseItems,
    bottomItems,
    classNames,
    collapsedWidth,
    headerLeftItems: sourceHeaderLeftItems,
    headerProps,
    headerRightItems,
    layout = "left",
    loadingComponent,
    logoutPosition,
    showSidebarToggle,
    sidebarDisplay = "auto",
    title,
    userPosition,
    width,
  } = props;
  // 抽屉展示方式下没有侧栏本体，切换按钮必须渲染
  const toggleVisible =
    resolveSidebarDisplay(sidebarDisplay, screenMode) === "drawer" ||
    (showSidebarToggle ?? layout === "left");
  const {
    baseItems: shellBaseItems,
    bottomItems: shellBottomItems,
    headerLeftItems,
  } = useSidebarShell({
    baseItems,
    bottomItems,
    headerLeftItems: sourceHeaderLeftItems,
    logoutPosition,
    menuRoutes,
    showSidebarToggle: toggleVisible,
    title,
    userPosition,
  });

  return (
    <SidebarShell
      baseItems={shellBaseItems}
      bottomItems={shellBottomItems}
      classNames={classNames}
      collapsedWidth={collapsedWidth}
      headerLeftItems={headerLeftItems}
      headerProps={headerProps}
      headerRightItems={headerRightItems}
      layout={layout}
      sidebarDisplay={sidebarDisplay}
      loadingComponent={loadingComponent}
      width={width}
    />
  );
}

/** 只负责组装 BasicLayout 参数，内容由 BasicLayout 渲染后从布局上下文读取屏幕模式 */
export function AppSidebarContent() {
  const { props } = useAppSidebarLayout();
  const { className, defaultTheme, smallScreenBreakpoint } = props;

  return (
    <BasicLayout
      className={clsx("app-sidebar-layout", className)}
      defaultTheme={defaultTheme}
      smallScreenBreakpoint={smallScreenBreakpoint}
    >
      <AppSidebarContentBody />
    </BasicLayout>
  );
}
