import { Layout } from "antd";
import clsx from "clsx";
import type { ReactNode } from "react";

import {
  SidebarCollapsed,
  type SidebarLayoutClassNames,
  type SidebarLayoutMode,
} from "./SidebarLayoutTypes";

type SidebarLayoutInlineProps = {
  classNames?: SidebarLayoutClassNames;
  collapsedWidth: number | string;
  content: ReactNode;
  display: SidebarCollapsed;
  header: ReactNode;
  items: ReactNode;
  layout: SidebarLayoutMode;
  rootClassName: string;
  sidebarShow: boolean;
  width: number | string;
};

/**
 * 平铺展示方式：侧栏与内容同层排布。
 *
 * `left` 时头部位于内容之上，`bottom` 时头部独占一行、侧栏与内容并排。
 *
 * `sidebarShow` 为 `false` 时不渲染侧栏，仅保留头部与内容区。
 */
export function SidebarLayoutInline({
  classNames,
  collapsedWidth,
  content,
  display,
  header,
  items,
  layout,
  rootClassName,
  sidebarShow,
  width,
}: SidebarLayoutInlineProps) {
  const isBottom = layout === "bottom";
  const sidebar = sidebarShow ? (
    <Layout.Sider
      className={clsx(
        "sidebar-layout__sidebar",
        display === SidebarCollapsed.Hidden && "sidebar-layout__sidebar--hidden",
        classNames?.sidebar,
      )}
      theme="light"
      trigger={null}
      width={display === SidebarCollapsed.Collapsed ? collapsedWidth : width}
    >
      {items}
    </Layout.Sider>
  ) : null;

  return (
    <Layout className={rootClassName} hasSider={sidebarShow && !isBottom}>
      {isBottom ? header : sidebar}
      <Layout className={clsx("sidebar-layout__main", classNames?.main)}>
        {isBottom ? sidebar : header}
        {content}
      </Layout>
    </Layout>
  );
}
