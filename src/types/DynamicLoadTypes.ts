import type { ComponentType, ReactNode } from "react";

/** 动态加载异常页参数 */
export type DynamicLoadErrorProps = {
  /** 加载目标，通常是路由标题或地址 */
  target?: ReactNode;
  /** 失败信息，通常是动态加载失败的具体原因 */
  message?: string;
  /** 点击「重新加载」时执行，默认为整页刷新 */
  onReload?: () => void;
  /** 「重新加载」按钮文案 */
  reloadText?: ReactNode;
};

/** 动态加载异常边界参数 */
export type DynamicLoadErrorBoundaryProps = {
  children: ReactNode;
  /** 自定义异常组件，默认为 `DynamicLoadErrorPage` */
  errorComponent?: ComponentType<DynamicLoadErrorProps>;
  /** 页内重试动作（compose/loader 页面为路由替换）；不提供时只做整页刷新 */
  onRetry?: () => void;
  /** 加载目标，透传给异常组件 */
  target?: ReactNode;
};
