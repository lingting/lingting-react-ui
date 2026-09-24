import { Layout } from "antd";
import clsx from "clsx";

import { BasicLayout } from "@lri/layout/index";
import { SidebarLayoutContext } from "@lri/layout/index";
import { SidebarLayoutDrawer } from "./sidebar-layout/SidebarLayoutDrawer";
import { SidebarLayoutHeader } from "./sidebar-layout/SidebarLayoutHeader";
import { SidebarLayoutInline } from "./sidebar-layout/SidebarLayoutInline";
import { SidebarLayoutItems } from "./sidebar-layout/SidebarLayoutItems";
import type { SidebarLayoutContentProps, SidebarLayoutProps } from "@lri/layout/index";
import { useSidebarLayoutState } from "./sidebar-layout/useSidebarLayoutState";

import "./SidebarLayout.css";

export * from "./sidebar-layout/SidebarLayoutContext";
export * from "./sidebar-layout/SidebarLayoutTypes";
export { resolveSidebarDisplay } from "./sidebar-layout/resolveSidebarDisplay";

const DEFAULT_WIDTH = "240px";
const DEFAULT_COLLAPSED_WIDTH = "64px";

/**
 * 侧边栏布局主体，不含 BasicLayout 主题容器，供需要自定义外层容器的布局复用。
 *
 * 展示方式由屏幕模式与 `sidebarDisplay` 共同决定，具体排布交给对应场景的实现文件。
 */
export function SidebarLayoutContent({
  baseItems = [],
  bottomItems = [],
  children,
  classNames,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  headerLeftItems = [],
  headerProps,
  headerRightItems = [],
  headerShow = true,
  layout = "left",
  sidebarDisplay = "auto",
  width = DEFAULT_WIDTH,
}: SidebarLayoutContentProps) {
  const state = useSidebarLayoutState(sidebarDisplay);
  const isDrawer = state.sidebarDisplay === "drawer";
  const rootClassName = clsx(
    "sidebar-layout",
    `sidebar-layout--${layout}`,
    `sidebar-layout-${state.collapsed}`,
    isDrawer && "sidebar-layout--drawer",
    classNames?.root,
  );
  const items = (
    <SidebarLayoutItems baseItems={baseItems} bottomItems={bottomItems} classNames={classNames} />
  );
  const header = headerShow ? (
    <SidebarLayoutHeader
      className={classNames?.header}
      headerProps={headerProps}
      leftItems={headerLeftItems}
      rightItems={headerRightItems}
    />
  ) : null;
  const content = (
    <Layout.Content className={clsx("sidebar-layout__content", classNames?.content)}>
      {children}
    </Layout.Content>
  );
  const scenarioProps = {
    classNames,
    content,
    display: state.collapsed,
    header,
    items,
    rootClassName,
    width,
  };

  return (
    <SidebarLayoutContext.Provider value={state}>
      {isDrawer ? (
        <SidebarLayoutDrawer {...scenarioProps} />
      ) : (
        <SidebarLayoutInline {...scenarioProps} collapsedWidth={collapsedWidth} layout={layout} />
      )}
    </SidebarLayoutContext.Provider>
  );
}

export function SidebarLayout({
  className,
  defaultTheme,
  smallScreenBreakpoint,
  ...props
}: SidebarLayoutProps) {
  return (
    <BasicLayout
      className={className}
      defaultTheme={defaultTheme}
      smallScreenBreakpoint={smallScreenBreakpoint}
    >
      <SidebarLayoutContent {...props} />
    </BasicLayout>
  );
}
