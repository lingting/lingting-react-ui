import { ProFormCheckbox, ProFormSelect } from "@ant-design/pro-components";

import { useDictOptions } from "@lri/hooks";
import type { ExFormDictCheckboxProps, ExFormDictSelectProps } from "@lri/types";

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
