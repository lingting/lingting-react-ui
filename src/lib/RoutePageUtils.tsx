import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";

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

/** loader → 已创建的页面组件，同一 loader 只发起一次动态导入 */
const loaderPageModuleMap = new WeakMap<RoutePageLoader, LazyExoticComponent<ComponentType>>();

function toLazyModule(loader: RoutePageLoader) {
  return loader().then((module: RoutePageModule) => ({
    default: typeof module === "function" ? module : module.default,
  }));
}

/**
 * 取 loader 对应的页面组件。
 *
 * 按 loader 缓存：重复进入同一路由直接复用已加载的模块（与 React.lazy 行为一致，仅首次加载会整页 loading）；
 * 导入失败时丢弃缓存，页内重试重挂载后才会重新发起动态导入。
 */
function getLoaderPageModule(loader: RoutePageLoader) {
  const cached = loaderPageModuleMap.get(loader);
  if (cached) return cached;

  const Page = lazy(() =>
    toLazyModule(loader).catch((error: unknown) => {
      loaderPageModuleMap.delete(loader);
      throw error;
    }),
  );

  loaderPageModuleMap.set(loader, Page);

  return Page;
}

/** loader 页面渲染器 */
function LoaderPageView({ loader }: { loader: RoutePageLoader }): ReactNode {
  const Page = getLoaderPageModule(loader);

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
