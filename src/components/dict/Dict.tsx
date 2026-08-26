import { Badge, Checkbox, Select, type SelectProps, Tag, theme, Typography } from "antd";

import { useDictOptions, useDictValue } from "@lri/hooks";
import { resolveDictColor } from "@lri/lib";
import type {
  DictBadgeProps,
  DictCheckBoxProps,
  DictSelectProps,
  DictTagProps,
  DictTextProps,
  DictValue,
} from "@lri/types";

export function DictBadge<T extends DictValue>({
  dict,
  fallback,
  value,
  ...props
}: DictBadgeProps<T>) {
  const { token } = theme.useToken();
  const { item } = useDictValue(dict, value);

  if (!item) {
    return fallback;
  }

  return (
    <Badge
      {...props}
      color={resolveDictColor(item.badgeColor, item.color, token)}
      status={item.badgeStatus}
      text={item.label}
    />
  );
}

export function DictTag<T extends DictValue>({ dict, fallback, value, ...props }: DictTagProps<T>) {
  const { token } = theme.useToken();
  const { item } = useDictValue(dict, value);

  if (!item) {
    return fallback;
  }

  return (
    <Tag {...props} color={resolveDictColor(item.tagColor, item.color, token)}>
      {item.label}
    </Tag>
  );
}

export function DictText<T extends DictValue>({
  dict,
  fallback,
  value,
  ...props
}: DictTextProps<T>) {
  const { token } = theme.useToken();
  const { item } = useDictValue(dict, value);

  if (!item) {
    return fallback;
  }

  const color = resolveDictColor(item.textColor, item.color, token);

  return (
    <Typography.Text {...props} style={{ ...props.style, color }}>
      {item.label}
    </Typography.Text>
  );
}

export function DictCheckBox<T extends DictValue>({ dict, value, ...props }: DictCheckBoxProps<T>) {
  const options = useDictOptions(dict);
  return <Checkbox.Group {...props} options={options} value={value ?? undefined} />;
}

export function DictSelect<T extends DictValue>({ dict, ...props }: DictSelectProps<T>) {
  const options = useDictOptions(dict);
  return (
    <Select
      allowClear={true}
      {...(props as SelectProps<T | T[]>)}
      options={options as SelectProps["options"]}
    />
  );
}

export const Dict = {
  Badge: DictBadge,
  CheckBox: DictCheckBox,
  Select: DictSelect,
  Tag: DictTag,
  Text: DictText,
};
