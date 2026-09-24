import type { Layout } from "antd";
import type { ComponentProps, ReactNode } from "react";

import type { LayoutScreenMode } from "@lri/types";

import type { BasicLayoutProps } from "../BasicLayoutTypes";

export enum SidebarCollapsed {
  Collapsed = "collapsed",
  Expanded = "expanded",
  Hidden = "hidden",
}

export type SidebarLayoutMode = "left" | "bottom";

/** 侧栏展示方式：`auto` 由屏幕模式决定，`inline` 平铺，`drawer` 抽屉 */
export type SidebarDisplay = "auto" | "drawer" | "inline";

/** 解析后的侧栏展示方式 */
export type ResolvedSidebarDisplay = Exclude<SidebarDisplay, "auto">;

export type SidebarLayoutState = {
  collapsed: SidebarCollapsed;
  screenMode: LayoutScreenMode;
  sidebarDisplay: ResolvedSidebarDisplay;
  setCollapsed: (display: SidebarCollapsed) => void;
  toggleCollapsed: () => void;
};

export type SidebarLayoutClassNames = {
  baseItems?: string;
  bottomItems?: string;
  content?: string;
  header?: string;
  main?: string;
  root?: string;
  sidebar?: string;
};

export type SidebarLayoutProps = Omit<BasicLayoutProps, "children" | "className"> & {
  baseItems?: readonly ReactNode[];
  bottomItems?: readonly ReactNode[];
  children: ReactNode;
  className?: string;
  classNames?: SidebarLayoutClassNames;
  collapsedWidth?: number | string;
  headerLeftItems?: readonly ReactNode[];
  headerProps?: Omit<ComponentProps<typeof Layout.Header>, "children" | "className">;
  headerRightItems?: readonly ReactNode[];
  /** 是否渲染头部，默认为 `true`；设为 `false` 时不渲染头部，仍保留侧栏与内容区 */
  headerShow?: boolean;
  layout?: SidebarLayoutMode;
  sidebarDisplay?: SidebarDisplay;
  width?: number | string;
};

/** 侧边栏布局主体参数，不含 `BasicLayout` 自行消费的属性 */
export type SidebarLayoutContentProps = Omit<
  SidebarLayoutProps,
  "className" | "defaultTheme" | "smallScreenBreakpoint"
>;
