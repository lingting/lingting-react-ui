import { Typography } from "antd";
import type { TypographyProps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { memo, useMemo, type ReactNode } from "react";

import {
  hasConfirm,
  renderConfirm,
  renderTooltip,
  resolveButtonContent,
  resolveButtonDisabled,
} from "@lri/lib";
import type { TextButtonProps } from "@lri/types";

function TextButtonComponent({
  children,
  text,
  danger,
  disabled,
  loading,
  icon,
  iconPlacement,
  confirm,
  onConfirm,
  tooltip,
  onClick,
  type: _type,
  variant: _variant,
  color: _color,
  shape: _shape,
  size: _size,
  htmlType: _htmlType,
  autoInsertSpace: _autoInsertSpace,
  ghost: _ghost,
  block: _block,
  href: _href,
  ...props
}: TextButtonProps): ReactNode {
  const content = useMemo(() => text ?? children, [children, text]);
  const isDisabled = useMemo(() => resolveButtonDisabled(disabled, loading), [disabled, loading]);
  const buttonContent = useMemo(
    () => resolveButtonContent(content, icon, loading, iconPlacement, <LoadingOutlined />),
    [content, icon, iconPlacement, loading],
  );
  const target = useMemo(
    () => (
      <Typography.Text
        {...(props as TypographyProps<"span">)}
        className={`ex-button cursor-pointer ${props.className || ""}`}
        type={danger ? "danger" : undefined}
        disabled={isDisabled}
        onClick={isDisabled || hasConfirm(confirm) ? undefined : onClick}
      >
        {buttonContent}
      </Typography.Text>
    ),
    [buttonContent, confirm, danger, isDisabled, onClick, props],
  );
  const confirmed = useMemo(
    () => renderConfirm(confirm, onConfirm, isDisabled, target),
    [confirm, isDisabled, onConfirm, target],
  );

  return useMemo(() => renderTooltip(tooltip, confirmed), [confirmed, tooltip]);
}

export const TextButton = memo(TextButtonComponent);
