import { Flex } from "antd";
import clsx from "clsx";
import { Children, useCallback, useMemo, type MouseEvent } from "react";

import "../DesktopSidebarLayout.css";
import { WindowResizeBorder } from "@lri/desktop";

import { BasicLayout } from "@lri/layout";
import { SidebarShell, useSidebarShell } from "../sidebar-common";
import { useDesktopSidebarLayout } from "./DesktopSidebarLayoutContext";
import { DesktopWindowActions } from "./DesktopWindowActions";

const DEFAULT_WIDTH = "180px";
const INTERACTIVE_SELECTOR = "button, a, input, textarea, select, [role='button']";

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest(INTERACTIVE_SELECTOR) !== null;
}

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
    headerProps,
    headerRightItems,
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
    width = DEFAULT_WIDTH,
  } = props;
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
    showSidebarToggle: false,
    title,
    userPosition,
  });

  const handleHeaderMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0 || event.detail >= 2 || isInteractiveTarget(event.target)) {
        return;
      }

      onStartDrag();
    },
    [onStartDrag],
  );
  const handleHeaderDoubleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      onToggleMaximize();
    },
    [onToggleMaximize],
  );
  const mergedHeaderProps = useMemo(
    () => ({
      ...headerProps,
      onDoubleClick: handleHeaderDoubleClick,
      onMouseDown: handleHeaderMouseDown,
    }),
    [handleHeaderDoubleClick, handleHeaderMouseDown, headerProps],
  );

  return (
    <BasicLayout className={clsx("desktop-sidebar-layout", className)} defaultTheme={defaultTheme}>
      <Flex className="desktop-sidebar-layout__root" vertical>
        <SidebarShell
          baseItems={shellBaseItems}
          bottomItems={shellBottomItems}
          classNames={classNames}
          collapsedWidth={collapsedWidth}
          headerLeftItems={headerLeftItems}
          headerProps={mergedHeaderProps}
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
          layout="bottom"
          sidebarDisplay="inline"
          loadingComponent={loadingComponent}
          width={width}
        />
        {!maximized && <WindowResizeBorder onStartResize={onStartResize} />}
      </Flex>
    </BasicLayout>
  );
}
