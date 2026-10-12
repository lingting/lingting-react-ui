import { Outlet } from "@tanstack/react-router";
import { Suspense, type ComponentType } from "react";

import { DynamicLoadErrorBoundary, LoadingPage } from "@lri/blocks";
import { useRouter } from "@lri/hooks";
import { SidebarLayoutContent, type SidebarLayoutProps } from "@lri/layout";
import type { DynamicLoadErrorProps } from "@lri/types";

export type SidebarShellProps = Omit<
  SidebarLayoutProps,
  "children" | "className" | "defaultTheme" | "smallScreenBreakpoint"
> & {
  dynamicLoadErrorComponent?: ComponentType<DynamicLoadErrorProps>;
  loadingComponent?: ComponentType;
};

/**
 * 侧边栏布局的通用内容壳：只负责侧边栏主体与路由 Outlet，不含 BasicLayout 主题容器。
 *
 * 路由内容懒加载异常由动态加载异常边界兜底：先做路由内轻量重试，再整页重载，重试耗尽后渲染异常组件。
 */
export function SidebarShell({
  dynamicLoadErrorComponent,
  loadingComponent: LoadingComponent = LoadingPage,
  ...props
}: SidebarShellProps) {
  const { current } = useRouter();

  return (
    <SidebarLayoutContent {...props}>
      <DynamicLoadErrorBoundary
        errorComponent={dynamicLoadErrorComponent}
        key={current.path}
        onRetry={current.retry}
        target={current.title ?? current.path}
      >
        <Suspense fallback={<LoadingComponent />}>
          <Outlet />
        </Suspense>
      </DynamicLoadErrorBoundary>
    </SidebarLayoutContent>
  );
}
