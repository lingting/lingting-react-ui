import { Layout } from "antd";
import clsx from "clsx";
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { BasicLayout, type BasicLayoutProps } from "./BasicLayout";
import "./SidebarLayout.css";

export enum SidebarCollapsed {
  Collapsed = "collapsed",
  Expanded = "expanded",
  Hidden = "hidden",
}

export type SidebarLayoutMode = "left" | "bottom";

export type SidebarLayoutState = {
  collapsed: SidebarCollapsed;
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
  layout?: SidebarLayoutMode;
  width?: number | string;
};

const DEFAULT_WIDTH = "240px";
const DEFAULT_COLLAPSED_WIDTH = "64px";

const SidebarLayoutContext = createContext<SidebarLayoutState | undefined>(undefined);

export function useSidebarLayout() {
  const value = useContext(SidebarLayoutContext);
  if (!value) throw new Error("useSidebarLayout 必须在 SidebarLayout 内使用");
  return value;
}

/**
 * 侧边栏布局主体，不含 BasicLayout 主题容器，供需要自定义外层容器的布局复用。
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
  layout = "left",
  width = DEFAULT_WIDTH,
}: Omit<SidebarLayoutProps, "className" | "defaultTheme">) {
  const [display, setDisplay] = useState(SidebarCollapsed.Expanded);
  const collapsed = display === SidebarCollapsed.Collapsed;
  const sidebarVisible = display !== SidebarCollapsed.Hidden;

  const toggleCollapsed = useCallback(() => {
    setDisplay((current) =>
      current === SidebarCollapsed.Collapsed
        ? SidebarCollapsed.Expanded
        : SidebarCollapsed.Collapsed,
    );
  }, []);
  const state = useMemo<SidebarLayoutState>(
    () => ({ collapsed: display, setCollapsed: setDisplay, toggleCollapsed }),
    [display, toggleCollapsed],
  );

  const rootClassName = clsx(
    "sidebar-layout",
    `sidebar-layout--${layout}`,
    `sidebar-layout-${display}`,
    classNames?.root,
  );
  // 侧边栏始终渲染，仅通过 display 控制可见性
  const sidebar = (
    <Layout.Sider
      className={clsx(
        "sidebar-layout__sidebar",
        !sidebarVisible && "sidebar-layout__sidebar--hidden",
        classNames?.sidebar,
      )}
      theme="light"
      trigger={null}
      width={collapsed ? collapsedWidth : width}
    >
      {baseItems.length > 0 && (
        <div className={clsx("sidebar-layout__base-items", classNames?.baseItems)}>
          {Children.toArray(baseItems)}
        </div>
      )}
      {bottomItems.length > 0 && (
        <div className={clsx("sidebar-layout__bottom-items", classNames?.bottomItems)}>
          {Children.toArray(bottomItems)}
        </div>
      )}
    </Layout.Sider>
  );
  const header = (
    <Layout.Header {...headerProps} className={clsx("sidebar-layout__header", classNames?.header)}>
      <div className="sidebar-layout__header-left">{Children.toArray(headerLeftItems)}</div>
      <div className="sidebar-layout__header-right">{Children.toArray(headerRightItems)}</div>
    </Layout.Header>
  );
  const content = (
    <Layout.Content className={clsx("sidebar-layout__content", classNames?.content)}>
      {children}
    </Layout.Content>
  );
  const main = (
    <Layout className={clsx("sidebar-layout__main", classNames?.main)}>
      {layout === "bottom" ? (
        <>
          {sidebar}
          {content}
        </>
      ) : (
        <>
          {header}
          {content}
        </>
      )}
    </Layout>
  );

  return (
    <SidebarLayoutContext.Provider value={state}>
      <Layout className={rootClassName} hasSider={layout === "left"}>
        {layout === "bottom" ? (
          <>
            {header}
            {main}
          </>
        ) : (
          <>
            {sidebar}
            {main}
          </>
        )}
      </Layout>
    </SidebarLayoutContext.Provider>
  );
}

export function SidebarLayout({ className, defaultTheme, ...props }: SidebarLayoutProps) {
  return (
    <BasicLayout className={className} defaultTheme={defaultTheme}>
      <SidebarLayoutContent {...props} />
    </BasicLayout>
  );
}
