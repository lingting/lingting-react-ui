import { Layout } from "antd";
import clsx from "clsx";
import { Children, type ComponentProps, type ReactNode } from "react";

type SidebarLayoutHeaderProps = {
  className?: string;
  headerProps?: Omit<ComponentProps<typeof Layout.Header>, "children" | "className">;
  leftItems: readonly ReactNode[];
  rightItems: readonly ReactNode[];
};

/** 平铺与抽屉两种展示方式共用的头部 */
export function SidebarLayoutHeader({
  className,
  headerProps,
  leftItems,
  rightItems,
}: SidebarLayoutHeaderProps) {
  return (
    <Layout.Header {...headerProps} className={clsx("sidebar-layout__header", className)}>
      <div className="sidebar-layout__header-left">{Children.toArray(leftItems)}</div>
      <div className="sidebar-layout__header-right">{Children.toArray(rightItems)}</div>
    </Layout.Header>
  );
}
