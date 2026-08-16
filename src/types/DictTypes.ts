import { Checkbox, type BadgeProps, type GetProps, type SelectProps, type TagProps } from "antd";
import type { ReactNode } from "react";

export type Primitive = string | number | boolean;
export type DictValue = Primitive;
export type DictValues = DictValue | DictValue[];
export type DictItem<T extends DictValue = DictValue> = {
  value: T;
  label?: ReactNode;
  disabled?: boolean;
  color?: string;
  badgeColor?: string;
  tagColor?: string;
  textColor?: string;
  badgeStatus?: BadgeProps["status"];
};
export type DictData<T extends DictValue = DictValue> =
  | T[]
  | DictItem<T>[]
  | Record<string, DictItem<T> | ReactNode | Primitive | Record<string, unknown>>;

export type DictProps<T extends DictValue = DictValue> = {
  dict: DictData<T>;
  fallback?: ReactNode;
};
export type DictScalarProps<T extends DictValue = DictValue> = DictProps<T> & { value?: T | null };
export type DictTextProps<T extends DictValue = DictValue> = DictScalarProps<T> &
  Omit<React.HTMLAttributes<HTMLSpanElement>, "color">;
export type DictTagProps<T extends DictValue = DictValue> = DictScalarProps<T> &
  Omit<TagProps, "color" | "children">;
export type DictBadgeProps<T extends DictValue = DictValue> = DictScalarProps<T> &
  Omit<BadgeProps, "color" | "text" | "status">;
export type DictCheckBoxProps<T extends DictValue = DictValue> = Omit<
  GetProps<typeof Checkbox.Group>,
  "options" | "value"
> &
  DictProps<T> & { value?: T[] | null };
type DictSelectBaseProps<T extends DictValue, TValue> = Omit<
  SelectProps<TValue>,
  "options" | "mode"
> &
  DictProps<T>;
export type DictSelectScalarProps<T extends DictValue = DictValue> = DictSelectBaseProps<T, T> & {
  mode?: undefined;
};
export type DictSelectMultipleProps<T extends DictValue = DictValue> = DictSelectBaseProps<
  T,
  T[]
> & { mode: "multiple" | "tags" };
export type DictSelectProps<T extends DictValue = DictValue> =
  | DictSelectScalarProps<T>
  | DictSelectMultipleProps<T>;
