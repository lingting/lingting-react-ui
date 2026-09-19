import { Flex } from "antd";
import clsx from "clsx";
import { Children, useMemo } from "react";

import "../DesktopSidebarLayout.css";
import { WindowResizeBorder } from "@lri/desktop";

import { BasicLayout, type LayoutTheme } from "../BasicLayout";
import { SidebarShell, useSidebarShell } from "../sidebar-common";
import { DesktopSidebarBrand } from "./DesktopSidebarBrand";
import { useDesktopSidebarLayout } from "./DesktopSidebarLayoutContext";
import { DesktopWindowActions } from "./DesktopWindowActions";

// 窗口本身透明且无边框，由根容器负责圆角卡片外观
const DESKTOP_LAYOUT_BG_TOKEN = { colorBgLayout: "transparent" } as const;

export function DesktopSidebarContent() {
  const { maximized, props } = useDesktopSidebarLayout();
  const {
    baseItems,
    bottomItems,
    className,
    classNames,
    collapsedWidth,
    defaultTheme,
    headerLeftItems: sourceHeaderLeftItems,
    headerRightItems,
    icon,
    loadingComponent,
    logoutPosition,
    menuRoutes,
    onClose,
    onMinimize,
    onStartDrag,
    onStartResize,
    onToggleMaximize,
    title,
    userPosition,
    width,
  } = props;
  const {
    baseItems: shellBaseItems,
    bottomItems: shellBottomItems,
    headerLeftItems,
    title: shellTitle,
  } = useSidebarShell({
    baseItems,
    bottomItems,
    headerLeftItems: sourceHeaderLeftItems,
    logoutPosition,
    menuRoutes,
    title,
    userPosition,
  });
  const theme = useMemo<Partial<LayoutTheme>>(
    () => ({
      ...defaultTheme,
      antd: {
        ...defaultTheme?.antd,
        token: { ...DESKTOP_LAYOUT_BG_TOKEN, ...defaultTheme?.antd?.token },
      },
    }),
    [defaultTheme],
  );

  return (
    <BasicLayout className={clsx("desktop-sidebar-layout", className)} defaultTheme={theme}>
      <Flex
        className={clsx(
          "desktop-sidebar-layout__root",
          maximized && "desktop-sidebar-layout__root--maximized",
        )}
        vertical
      >
        <SidebarShell
          baseItems={shellBaseItems}
          bottomItems={shellBottomItems}
          classNames={classNames}
          collapsedWidth={collapsedWidth}
          headerLeftItems={headerLeftItems}
          headerRightItems={Children.toArray([
            headerRightItems,
            <DesktopWindowActions
              key="__desktop-window-actions"
              isMaximized={maximized}
              onClose={onClose}
              onMinimize={onMinimize}
              onToggleMaximize={onToggleMaximize}
            />,
          ])}
          loadingComponent={loadingComponent}
          sidebarHeader={
            <DesktopSidebarBrand
              icon={icon}
              onStartDrag={onStartDrag}
              onToggleMaximize={onToggleMaximize}
              title={shellTitle}
            />
          }
          width={width}
        />
        {!maximized && <WindowResizeBorder onStartResize={onStartResize} />}
      </Flex>
    </BasicLayout>
  );
}
