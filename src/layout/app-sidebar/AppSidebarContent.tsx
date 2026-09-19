import clsx from "clsx";

import { BasicLayout } from "../BasicLayout";
import { SidebarShell, useSidebarShell } from "../sidebar-common";
import { useAppSidebarLayout } from "./AppSidebarLayoutContext";

export function AppSidebarContent() {
  const { menuRoutes, props } = useAppSidebarLayout();
  const {
    baseItems,
    bottomItems,
    className,
    classNames,
    collapsedWidth,
    defaultTheme,
    headerLeftItems: sourceHeaderLeftItems,
    headerRightItems,
    loadingComponent,
    logoutPosition,
    title,
    userPosition,
    width,
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
    title,
    userPosition,
  });

  return (
    <BasicLayout className={clsx("app-sidebar-layout", className)} defaultTheme={defaultTheme}>
      <SidebarShell
        baseItems={shellBaseItems}
        bottomItems={shellBottomItems}
        classNames={classNames}
        collapsedWidth={collapsedWidth}
        headerLeftItems={headerLeftItems}
        headerRightItems={headerRightItems}
        loadingComponent={loadingComponent}
        width={width}
      />
    </BasicLayout>
  );
}
