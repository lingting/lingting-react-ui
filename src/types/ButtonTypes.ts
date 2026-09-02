import type { ButtonProps, PopconfirmProps, TooltipProps } from "antd";
import type { ReactNode } from "react";

export type ExButtonConfirm = false | null | ReactNode | Omit<PopconfirmProps, "onConfirm">;
export type ExButtonTooltip = false | null | ReactNode | TooltipProps;

export type ExButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  children?: ReactNode;
  text?: ReactNode;
  onClick?: ButtonProps["onClick"];
  confirm?: ExButtonConfirm;
  onConfirm?: PopconfirmProps["onConfirm"];
  tooltip?: ExButtonTooltip;
};

export type TextButtonProps = Omit<ExButtonProps, "type" | "variant" | "color" | "styles"> & {
  type?: ButtonProps["type"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
};

export type LinkButtonProps = TextButtonProps;
