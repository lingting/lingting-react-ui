import { Component, Fragment, type ReactNode } from "react";

import { clearDynamicLoadRetry, isDynamicLoadError, takeDynamicLoadRetry } from "@lri/lib";
import type { DynamicLoadErrorBoundaryProps } from "@lri/types";

import { DynamicLoadErrorPage } from "./DynamicLoadErrorPage";

type DynamicLoadErrorBoundaryState = {
  error?: Error;
  /** 自增后强制重挂载子树，页内重试才会重新渲染并重新加载页面组件 */
  epoch: number;
};

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

/**
 * 动态加载异常边界。
 *
 * 捕获子树加载异常，动态加载失败时按额度自动重试：页内重试（`onRetry`，compose/loader 页面为路由替换）
 * 最多 3 次，仍失败则整页刷新最多 3 次；额度跨刷新记录在 sessionStorage，超出时间窗口视为新一轮。
 * 额度用尽后渲染异常组件；非动态加载异常不自动重试，直接渲染异常组件。
 */
export class DynamicLoadErrorBoundary extends Component<
  DynamicLoadErrorBoundaryProps,
  DynamicLoadErrorBoundaryState
> {
  state: DynamicLoadErrorBoundaryState = { epoch: 0 };

  static getDerivedStateFromError(error: unknown): Partial<DynamicLoadErrorBoundaryState> {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown) {
    if (!isDynamicLoadError(error)) return;

    const { onRetry } = this.props;
    const kind = takeDynamicLoadRetry(onRetry !== undefined);

    if (kind === "route") {
      this.setState(({ epoch }) => ({ epoch: epoch + 1, error: undefined }));

      try {
        onRetry?.();
      } catch {
        // 页内重试自身失败时忽略：重挂载后的异常会再次进入本方法，按剩余额度继续处理
      }
      return;
    }

    if (kind === "reload") window.location.reload();
  }

  private handleReload = () => {
    clearDynamicLoadRetry();
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      const ErrorComponent = this.props.errorComponent ?? DynamicLoadErrorPage;

      return (
        <ErrorComponent
          message={error.message}
          onReload={this.handleReload}
          target={this.props.target}
        />
      );
    }

    return <Fragment key={this.state.epoch}>{this.props.children}</Fragment>;
  }
}
