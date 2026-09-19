import { Layout } from "antd";
import clsx from "clsx";
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { BasicLayout, type BasicLayoutProps } from "./BasicLayout";
import "./SidebarLayout.css";

export enum SidebarCollapsed {
  Collapsed = "collapsed",
  Expanded = "expanded",
  Hidden = "hidden",
}

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
  sidebarHeader?: string;
};

export type SidebarLayoutProps = Omit<BasicLayoutProps, "children" | "className"> & {
  baseItems?: readonly ReactNode[];
  bottomItems?: readonly ReactNode[];
  children: ReactNode;
  className?: string;
  classNames?: SidebarLayoutClassNames;
  collapsedWidth?: number | string;
  headerLeftItems?: readonly ReactNode[];
  headerRightItems?: readonly ReactNode[];
  sidebarHeader?: ReactNode;
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
  headerRightItems = [],
  sidebarHeader,
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

  return (
    <SidebarLayoutContext.Provider value={state}>
      <Layout
        className={clsx("sidebar-layout", `sidebar-layout-${display}`, classNames?.root)}
        hasSider={sidebarVisible}
      >
        {sidebarVisible && (
          <Layout.Sider
            className={clsx("sidebar-layout__sidebar", classNames?.sidebar)}
            theme="light"
            trigger={null}
            width={collapsed ? collapsedWidth : width}
          >
            {sidebarHeader && (
              <div className={clsx("sidebar-layout__sidebar-header", classNames?.sidebarHeader)}>
                {sidebarHeader}
              </div>
            )}
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
        )}

        <Layout className={clsx("sidebar-layout__main", classNames?.main)}>
          <Layout.Header className={clsx("sidebar-layout__header", classNames?.header)}>
            <div className="sidebar-layout__header-left">{Children.toArray(headerLeftItems)}</div>
            <div className="sidebar-layout__header-right">{Children.toArray(headerRightItems)}</div>
          </Layout.Header>
          <Layout.Content className={clsx("sidebar-layout__content", classNames?.content)}>
            {children}
          </Layout.Content>
        </Layout>
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
