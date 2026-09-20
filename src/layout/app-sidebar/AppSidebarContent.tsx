import clsx from "clsx";

import { useScreenMode } from "@lri/hooks/useScreenMode";
import { BasicLayout, resolveSidebarDisplay } from "@lri/layout";
import { SidebarShell, useSidebarShell } from "../sidebar-common";
import { useAppSidebarLayout } from "./AppSidebarLayoutContext";

export function AppSidebarContent() {
  const { menuRoutes, props } = useAppSidebarLayout();
  const {
    baseItems,
    bottomItems,
    className,
    classNames,
    collapsedWidth,
    defaultTheme,
    headerLeftItems: sourceHeaderLeftItems,
    headerProps,
    headerRightItems,
    layout = "left",
    loadingComponent,
    logoutPosition,
    showSidebarToggle,
    sidebarDisplay = "auto",
    smallScreenBreakpoint,
    title,
    userPosition,
    width,
  } = props;
  const screenMode = useScreenMode(smallScreenBreakpoint);
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
    <BasicLayout className={clsx("app-sidebar-layout", className)} defaultTheme={defaultTheme}>
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
    </BasicLayout>
  );
}
