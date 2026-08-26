import { ProFormCheckbox, ProFormField, ProFormSelect } from "@ant-design/pro-components";

import { DictBadge, DictTag, DictText } from "../dict";
import { useDictOptions } from "@lri/hooks";
import type {
  ExFormDictBadgeProps,
  ExFormDictCheckboxProps,
  ExFormDictSelectProps,
  ExFormDictTagProps,
  ExFormDictTextProps,
} from "@lri/types";

export function ExFormDictSelect<T extends string | number | boolean>({
  dict,
  ...props
}: ExFormDictSelectProps<T>) {
  const options = useDictOptions(dict);

  return <ProFormSelect {...props} options={options as never} />;
}

export function ExFormDictCheckbox<T extends string | number | boolean>({
  dict,
  ...props
}: ExFormDictCheckboxProps<T>) {
  const options = useDictOptions(dict);

  return <ProFormCheckbox.Group {...props} options={options as never} />;
}

export function ExFormDictBadge<T extends string | number | boolean>({
  dict,
  fallback,
  ...props
}: ExFormDictBadgeProps<T>) {
  return (
    <ProFormField {...props}>
      <DictBadge dict={dict} fallback={fallback} />
    </ProFormField>
  );
}

export function ExFormDictTag<T extends string | number | boolean>({
  dict,
  fallback,
  ...props
}: ExFormDictTagProps<T>) {
  return (
    <ProFormField {...props}>
      <DictTag dict={dict} fallback={fallback} />
    </ProFormField>
  );
}

export function ExFormDictText<T extends string | number | boolean>({
  dict,
  fallback,
  ...props
}: ExFormDictTextProps<T>) {
  return (
    <ProFormField {...props}>
      <DictText dict={dict} fallback={fallback} />
    </ProFormField>
  );
}
