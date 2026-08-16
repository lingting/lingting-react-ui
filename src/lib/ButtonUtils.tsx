import { Popconfirm, Tooltip } from "antd";
import type { PopconfirmProps, TooltipProps } from "antd";
import { isValidElement, type ReactNode } from "react";

import type { ExButtonConfirm, ExButtonTooltip } from "@lri/types";

export function isConfigObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value) && !isValidElement(value)
  );
}

export function hasConfirm(confirm: ExButtonConfirm | undefined): boolean {
  return confirm !== undefined && confirm !== false && confirm !== null;
}

export function renderConfirm(
  confirm: ExButtonConfirm | undefined,
  onConfirm: PopconfirmProps["onConfirm"],
  disabled: boolean | undefined,
  content: ReactNode,
): ReactNode {
  if (!hasConfirm(confirm)) return content;

  if (isConfigObject(confirm)) {
    return (
      <Popconfirm
        {...(confirm as Omit<PopconfirmProps, "onConfirm">)}
        disabled={disabled}
        onConfirm={onConfirm}
      >
        {content}
      </Popconfirm>
    );
  }

  return (
    <Popconfirm title={confirm as ReactNode} disabled={disabled} onConfirm={onConfirm}>
      {content}
    </Popconfirm>
  );
}

export function renderTooltip(tooltip: ExButtonTooltip | undefined, content: ReactNode): ReactNode {
  if (tooltip === undefined || tooltip === false || tooltip === null) return content;

  return isConfigObject(tooltip) ? (
    <Tooltip {...(tooltip as TooltipProps)}>{content}</Tooltip>
  ) : (
    <Tooltip title={tooltip as ReactNode}>{content}</Tooltip>
  );
}

export function resolveButtonContent(
  content: ReactNode,
  icon: ReactNode,
  loading: boolean | object | undefined,
  iconPlacement: "start" | "end" = "start",
  loadingIcon: ReactNode,
): ReactNode {
  const iconContent = loading ? loadingIcon : icon;
  if (!iconContent) return content;

  return iconPlacement === "end" ? (
    <>
      {content}
      {iconContent}
    </>
  ) : (
    <>
      {iconContent}
      {content}
    </>
  );
}

export function resolveButtonDisabled(
  disabled: boolean | undefined,
  loading: boolean | object | undefined,
): boolean {
  return Boolean(disabled || loading);
}
