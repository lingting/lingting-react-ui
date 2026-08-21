import type {
  ProFormCheckboxGroupProps,
  ProFormFieldProps,
  ProFormSelectProps,
} from "@ant-design/pro-components";

import type { RegionFilter, RegionRender } from "./RegionTypes";
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

type ExFormRegionBaseProps = Omit<
  ProFormFieldProps,
  "children" | "render" | "renderFormItem" | "valueType"
> & {
  className?: string;
  filter?: RegionFilter;
  renderItem?: RegionRender;
};

export type ExFormRegionProps =
  | (ExFormRegionBaseProps & { multipart?: false })
  | (ExFormRegionBaseProps & { multipart: true });
