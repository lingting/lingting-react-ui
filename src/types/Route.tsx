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

type MenuRouteDirectoryDefinition = BaseRouteDefinition & {
  children: readonly MenuRouteDefinition[];
  component?: never;
};
export type RoutePageComponent =
  | ComponentType
  | LazyExoticComponent<ComponentType>
  | RouteComponent;

type MenuRoutePageDefinition = BaseRouteDefinition & {
  children?: never;
  component: RoutePageComponent;
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
