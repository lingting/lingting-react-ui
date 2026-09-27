import type { Layout } from "antd";
import type { ComponentProps, ReactNode } from "react";

import type { LayoutScreenMode } from "@lri/types";

import type { BasicLayoutProps } from "../BasicLayoutTypes";

export enum SidebarCollapsed {
  Collapsed = "collapsed",
  /** 使用展示方式的内置默认值：抽屉隐藏、平铺展开 */
  Default = "default",
  Expanded = "expanded",
  Hidden = "hidden",
}

export type SidebarLayoutMode = "left" | "bottom";

/** 侧栏展示方式：`auto` 由屏幕模式决定，`inline` 平铺，`drawer` 抽屉 */
export type SidebarDisplay = "auto" | "drawer" | "inline";

/** 解析后的侧栏展示方式 */
export type ResolvedSidebarDisplay = Exclude<SidebarDisplay, "auto">;

export type SidebarLayoutState = {
  /** 当前折叠状态，恒不为 `Default`；侧栏不渲染时恒为 `Hidden` */
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
  /**
   * 侧栏初始折叠状态，默认为 `SidebarCollapsed.Default`（抽屉隐藏、平铺展开）；
   * 传入其他值时抽屉与平铺均以其为初始状态，此后不再随该值变化
   */
  sidebarCollapsedDefault?: SidebarCollapsed;
  sidebarDisplay?: SidebarDisplay;
  /** 是否渲染侧栏，默认为 `true`；设为 `false` 时不渲染侧栏，折叠状态恒为 `SidebarCollapsed.Hidden` */
  sidebarShow?: boolean;
  width?: number | string;
};

/** 侧边栏布局主体参数，不含 `BasicLayout` 自行消费的属性 */
export type SidebarLayoutContentProps = Omit<
  SidebarLayoutProps,
  "className" | "defaultTheme" | "smallScreenBreakpoint"
>;
