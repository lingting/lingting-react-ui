import { Outlet } from "@tanstack/react-router";
import { Suspense, type ComponentType } from "react";

import { LoadingPage } from "@lri/blocks";

import { SidebarLayoutContent, type SidebarLayoutProps } from "@lri/layout";

export type SidebarShellProps = Omit<
  SidebarLayoutProps,
  "children" | "className" | "defaultTheme" | "smallScreenBreakpoint"
> & {
  loadingComponent?: ComponentType;
};

/**
 * 侧边栏布局的通用内容壳：只负责侧边栏主体与路由 Outlet，不含 BasicLayout 主题容器。
 */
export function SidebarShell({
  loadingComponent: LoadingComponent = LoadingPage,
  ...props
}: SidebarShellProps) {
  return (
    <SidebarLayoutContent {...props}>
      <Suspense fallback={<LoadingComponent />}>
        <Outlet />
      </Suspense>
    </SidebarLayoutContent>
  );
}
