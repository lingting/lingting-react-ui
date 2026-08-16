import type { NotFoundRouteComponent, RouteComponent } from "@tanstack/react-router";
import type { ReactNode } from "react";

export type ProRouteMenuMetadata = {
  icon?: ReactNode;
  title: string;
};

export type ProRouteStaticData = {
  menu?: ProRouteMenuMetadata;
  standalone?: {
    component: RouteComponent;
    mode: "basic" | "none";
  };
};

type BaseRouteDefinition = {
  icon?: ReactNode;
  path: string;
  title: string;
};

type MenuRouteDirectoryDefinition = BaseRouteDefinition & {
  children: readonly MenuRouteDefinition[];
  component?: never;
};

type MenuRoutePageDefinition = BaseRouteDefinition & {
  children?: never;
  component: RouteComponent;
};

export type MenuRouteDefinition = MenuRouteDirectoryDefinition | MenuRoutePageDefinition;

export type StandaloneRouteDefinition = MenuRoutePageDefinition & {
  mode?: "basic" | "none";
};

export type ProRouteNotFoundComponent = NotFoundRouteComponent;
