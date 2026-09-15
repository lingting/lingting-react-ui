import type { ProFormFieldProps } from "@ant-design/pro-components";
import type { RegionFilter, RegionRender } from "./RegionTypes";
import type { DictProps, DictValue } from "./DictTypes";

type OmitProFormFieldProps = Omit<ProFormFieldProps, "children" | "valueType">;

type ExFormDictFieldProps<T extends DictValue = DictValue> = OmitProFormFieldProps & DictProps<T>;

export type ExFormDictSelectProps<T extends DictValue = DictValue> = ExFormDictFieldProps<T>;
export type ExFormDictCheckboxProps<T extends DictValue = DictValue> = ExFormDictFieldProps<T>;
export type ExFormDictBadgeProps<T extends DictValue = DictValue> = ExFormDictFieldProps<T>;
export type ExFormDictTagProps<T extends DictValue = DictValue> = ExFormDictFieldProps<T>;
export type ExFormDictTextProps<T extends DictValue = DictValue> = ExFormDictFieldProps<T>;

type ExFormRegionBaseProps = OmitProFormFieldProps & {
  className?: string;
  filter?: RegionFilter;
  renderItem?: RegionRender;
};

export type ExFormRegionProps =
  | (ExFormRegionBaseProps & { multiple?: false })
  | (ExFormRegionBaseProps & { multiple: true });
