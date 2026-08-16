import { Button } from "antd";
import type { ButtonProps } from "antd";
import { memo, useMemo, type ReactNode } from "react";

import { hasConfirm, renderConfirm, renderTooltip } from "@lri/lib";
import type { ExButtonProps } from "@lri/types";

function AntdButtonComponent({
  children,
  text,
  confirm,
  onConfirm,
  tooltip,
  onClick,
  ...props
}: ExButtonProps): ReactNode {
  const content = useMemo(() => text ?? children, [children, text]);
  const button = useMemo(
    () => (
      <Button {...(props as ButtonProps)} onClick={hasConfirm(confirm) ? undefined : onClick}>
        {content}
      </Button>
    ),
    [confirm, content, onClick, props],
  );
  const confirmed = useMemo(
    () => renderConfirm(confirm, onConfirm, props.disabled, button),
    [button, confirm, onConfirm, props.disabled],
  );

  return useMemo(() => renderTooltip(tooltip, confirmed), [confirmed, tooltip]);
}

export const AntdButton = memo(AntdButtonComponent);
