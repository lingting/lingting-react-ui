import type { ProFormCheckboxGroupProps, ProFormSelectProps } from "@ant-design/pro-components";

import type { DictProps, DictValue } from "./DictTypes";

export type ExFormDictSelectProps<T extends DictValue = DictValue> = Omit<
  ProFormSelectProps<T>,
  "options"
> &
  DictProps<T>;

export type ExFormDictCheckboxProps<T extends DictValue = DictValue> = Omit<
  ProFormCheckboxGroupProps,
  "options"
> &
  DictProps<T>;
