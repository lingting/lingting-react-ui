import type { AuthRule } from "./UserStore";
import type { NotFoundRouteComponent, RouteComponent } from "@tanstack/react-router";
import type { ComponentType, LazyExoticComponent, ReactNode } from "react";

/**
 * 布局级路由类型。
 * - `browser`（默认）：浏览器 history 路由
 * - `hash`：hash 路由（地址形如 `/#/path`）
 */
export type ProRouteType = "browser" | "hash";

export type ProRouteMenuMetadata = {
  icon?: ReactNode;
  title: string;
};

export type ProRouteStaticData = {
  menu?: ProRouteMenuMetadata;
  standalone?: {
    component: RoutePageComponent;
    mode: "basic" | "none";
  };
};

export type BaseRouteDefinition = {
  auth?: AuthRule;
  icon?: ReactNode;
  path: string;
  title: string;
};

/** 动态导入的页面模块：`{ default: 组件 }` 或直接返回组件 */
export type RoutePageModule = ComponentType | { default: ComponentType };

/** 页面加载器：返回动态导入的页面模块 */
export type RoutePageLoader = () => Promise<RoutePageModule>;

/** 页面加载方式：`compose` 直接组件、`lazy` 为 React.lazy 组件、`loader` 为加载器 */
export type RoutePageKind = "compose" | "lazy" | "loader";

export type RoutePageComponent =
  | ComponentType
  | LazyExoticComponent<ComponentType>
  | RouteComponent;

type MenuRouteDirectoryDefinition = BaseRouteDefinition & {
  children: readonly MenuRouteDefinition[];
  component?: never;
  loader?: never;
};

/** 页面来源：`component`（直接组件 / lazy 组件 / loaderPage 包装）与 `loader` 二选一 */
type MenuRoutePageSource =
  | { component: RoutePageComponent; loader?: never }
  | { component?: never; loader: RoutePageLoader };

export type MenuRoutePageDefinition = BaseRouteDefinition &
  MenuRoutePageSource & {
    children?: never;
  };

export type MenuRouteDefinition = MenuRouteDirectoryDefinition | MenuRoutePageDefinition;

export type StandaloneRouteDefinition = MenuRoutePageDefinition & {
  mode?: "basic" | "none";
};

export type ProRouteNotFoundComponent = NotFoundRouteComponent;

export type UseRouteOptions = {
  menuRoutes: readonly MenuRouteDefinition[];
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};

export type UseRouteResult = {
  loading: boolean;
  menuRoutes: readonly MenuRouteDefinition[];
  refresh: () => Promise<void>;
  standaloneRoutes: readonly StandaloneRouteDefinition[];
};
