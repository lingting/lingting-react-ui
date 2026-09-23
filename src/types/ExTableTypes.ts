import type { ProColumns, ProTableProps } from "@ant-design/pro-components";

import type { DictData, DictProps } from "./DictTypes";
import type { PaginationParams, PaginationResult } from "./globals";

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
