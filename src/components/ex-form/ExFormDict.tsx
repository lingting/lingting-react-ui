import { ProFormField } from "@ant-design/pro-components";

import { DictBadge, DictCheckBox, DictSelect, DictTag, DictText } from "../dict";
import type {
  DictCheckBoxProps,
  DictSelectProps,
  DictValue,
  ExFormDictBadgeProps,
  ExFormDictCheckboxProps,
  ExFormDictSelectProps,
  ExFormDictTagProps,
  ExFormDictTextProps,
} from "@lri/types";

import "./ExForm.css";

/**
 * dict 之外的控件属性统一通过 fieldProps 传入；
 * ProFormField 顶层自带并会平铺给控件的 placeholder/allowClear/disabled 在此合并进 fieldProps，重复时以 fieldProps 为准。
 */
export function ExFormDictSelect<T extends DictValue>({
  dict,
  fieldProps,
  allowClear,
  disabled,
  placeholder,
  ...props
}: ExFormDictSelectProps<T>) {
  const controlProps = {
    allowClear,
    disabled,
    placeholder,
    ...fieldProps,
  } as DictSelectProps<T>;

  return (
    <ProFormField {...props}>
      <DictSelect className="ex-form-control" {...controlProps} dict={dict} />
    </ProFormField>
  );
}

export function ExFormDictCheckbox<T extends DictValue>({
  dict,
  fieldProps,
  disabled,
  ...props
}: ExFormDictCheckboxProps<T>) {
  const controlProps = { disabled, ...fieldProps } as DictCheckBoxProps<T>;

  return (
    <ProFormField {...props}>
      <DictCheckBox className="ex-form-control" {...controlProps} dict={dict} />
    </ProFormField>
  );
}

export function ExFormDictBadge<T extends DictValue>({
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

export function ExFormDictTag<T extends DictValue>({
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

export function ExFormDictText<T extends DictValue>({
  dict,
  fallback,
  ...props
}: ExFormDictTextProps<T>) {
  return (
    <ProFormField {...props}>
      <DictText dict={dict} fallback={fallback} className="ex-form-control" />
    </ProFormField>
  );
}
