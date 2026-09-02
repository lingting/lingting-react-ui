import type { SelectProps } from "antd";
import type { ReactNode } from "react";

import type { PaginationParams, PaginationResult } from "./globals";

type PaginationSelectorSelectProps = Omit<
  SelectProps<string[]>,
  | "allowClear"
  | "loading"
  | "maxCount"
  | "mode"
  | "notFoundContent"
  | "onChange"
  | "options"
  | "value"
  | "showSearch"
>;

export type PaginationSelectorProps<T> = {
  /** 是否允许多选，默认为 true。 */
  multiple?: boolean;
  /** 是否不在首次渲染时加载第一页，默认为 false。 */
  lazy?: boolean;
  /** 输入变更后的请求防抖时长，单位为毫秒，默认为 300。 */
  debounceDelay?: number;
  /** 原始数据的本地过滤函数，仅在 raw 请求模式下生效。 */
  filter?: (data: T[], input: string) => T[];
  onChange?: (value: string[] | string | undefined) => void;
  /** 分页数据请求函数。 */
  request: (params: PaginationParams, input: string | undefined) => Promise<PaginationResult<T>>;
  /** 输入值传递给请求函数的方式，默认为 raw。 */
  requestMode?: "raw" | "filter";
  /** Select 的其余配置；由组件管理的属性不可传入。 */
  props?: PaginationSelectorSelectProps;
  /** 将业务数据转换为下拉选项；返回 undefined 的数据将被忽略。 */
  toOption: (data: T) => { label?: ReactNode; value?: string } | undefined;
  value?: string[] | string;
};
