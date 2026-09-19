import { Outlet } from "@tanstack/react-router";
import { Suspense, type ComponentType, type ReactNode } from "react";

import { LoadingPage } from "@lri/blocks";

import { SidebarLayoutContent, type SidebarLayoutProps } from "../SidebarLayout";

export type SidebarShellProps = Omit<
  SidebarLayoutProps,
  "children" | "className" | "defaultTheme"
> & {
  loadingComponent?: ComponentType;
  sidebarHeader?: ReactNode;
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
