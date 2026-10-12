import type { ProColumns, ProTableProps } from "@ant-design/pro-components";
import type { ComponentType } from "react";

import type { DictData, DictProps } from "./DictTypes";
import type { PaginationParams, PaginationResult } from "./globals";
import type { RegionSelectMultipleProps, RegionSelectProps, RegionTagProps } from "./RegionTypes";

export type ExTableValueType = ProColumns["valueType"] | "timestamp" | "timestampMillis";

export type ExDictProps = DictProps & {
  search?: "select" | "checkbox";
  table?: "tag" | "badge" | "text";
};

export type ExTableDict = DictData | ExDictProps;

export type ExTableColumn<T extends Record<string, unknown> = Record<string, unknown>> = Omit<
  ProColumns<T>,
  "valueType"
> & {
  valueType?: ExTableValueType;
  dict?: ExTableDict;
  region?: false | "multiple" | "single";
};
export type ExTableRegionComponents = {
  /** region 列在表格中的渲染组件；未注册时按文本渲染 */
  table?: ComponentType<RegionTagProps>;
  /** region 列的查询表单组件；未注册时使用 antd Input */
  form?: ComponentType<RegionSelectProps | RegionSelectMultipleProps>;
};

export type ExTableRegionTableParams = {
  /** `column.region` 是否为多选 */
  multiple: boolean;
  /** 单元格原始值 */
  value: unknown;
};

export type ExTableRegionFormParams = {
  /** `column.region` 是否为多选 */
  multiple: boolean;
};
export type ExTableRequestParams = PaginationParams & {
  [key: string]: unknown;
};

export type ExTableProps<
  T extends Record<string, unknown> = Record<string, any>,
  Q extends Record<string, any> = any,
> = Omit<
  ProTableProps<T, ExTableRequestParams>,
  "columns" | "request" | "rowKey" | "scroll" | "tableAlertRender"
> & {
  columns: ExTableColumn<T>[];
  request?: (p: PaginationParams, qo: Q) => Promise<PaginationResult<T> | T[]>;
  rowKey?: string;
  scroll?: ProTableProps<T, ExTableRequestParams>["scroll"] | false;
  tableAlertRender?: ProTableProps<T, ExTableRequestParams>["tableAlertRender"] | boolean;
};
