import { lazy, useMemo, type ReactNode } from "react";

import type {
  MenuRoutePageDefinition,
  RoutePageComponent,
  RoutePageKind,
  RoutePageLoader,
  RoutePageModule,
} from "@lri/types";

const LAZY_COMPONENT_TYPE = Symbol.for("react.lazy");

/** loaderPage 创建的组件 → loader */
const loaderPageMap = new WeakMap<object, RoutePageLoader>();
/** loader 字段的定义 → 已包装的页面组件，保证同一份定义解析出的组件身份稳定 */
const loaderDefinitionMap = new WeakMap<object, RoutePageComponent>();

function toLazyModule(loader: RoutePageLoader) {
  return loader().then((module: RoutePageModule) => ({
    default: typeof module === "function" ? module : module.default,
  }));
}

/**
 * loader 页面渲染器：每次挂载都新建 lazy，重挂载即重新发起动态导入，
 * 因此页内重试（路由替换 + 重挂载）能真正重新加载模块。
 */
function LoaderPageView({ loader }: { loader: RoutePageLoader }): ReactNode {
  const Page = useMemo(() => lazy(() => toLazyModule(loader)), [loader]);

  return <Page />;
}

/**
 * 把 loader 包装为可直接用于 `component` 的页面组件，与 `loader` 字段等价。
 */
export function loaderPage(loader: RoutePageLoader): RoutePageComponent {
  function LoaderPage() {
    return <LoaderPageView loader={loader} />;
  }

  loaderPageMap.set(LoaderPage, loader);

  return LoaderPage;
}

/** 取路由定义的可渲染页面组件，loader 会被包装为可重载组件 */
export function resolveRoutePageComponent(definition: MenuRoutePageDefinition): RoutePageComponent {
  if (definition.component) return definition.component;

  const cached = loaderDefinitionMap.get(definition);
  if (cached) return cached;

  const component = loaderPage(definition.loader);
  loaderDefinitionMap.set(definition, component);

  return component;
}

/** 取路由定义的页面加载方式 */
export function resolveRoutePageKind(definition: MenuRoutePageDefinition): RoutePageKind {
  const { component } = definition;

  if (definition.loader || (component && loaderPageMap.has(component))) return "loader";

  return (component as { $$typeof?: symbol } | undefined)?.$$typeof === LAZY_COMPONENT_TYPE
    ? "lazy"
    : "compose";
}
