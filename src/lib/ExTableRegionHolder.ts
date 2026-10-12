import { Input, Space, Typography } from "antd";
import { createElement } from "react";

import type {
  ExTableRegionComponents,
  ExTableRegionFormParams,
  ExTableRegionTableParams,
} from "@lri/types";

/** 默认值：不注入 region 组件，表格列按文本渲染、查询表单项使用 antd Input */
const defaultValue: ExTableRegionComponents = {};

let value: ExTableRegionComponents = defaultValue;

/**
 * 注册 region 列的渲染组件，需在首次渲染 ExTable 前调用。
 * 传入的槽位覆盖当前值，未传入的槽位回落到 defaultValue。
 */
function register(components: ExTableRegionComponents = {}) {
  value = { ...defaultValue, ...components };
}

/** 归一化单元格值：多选只接受数组、单选只接受字符串 */
function toValues(cellValue: unknown, multiple: boolean) {
  if (!multiple) {
    return typeof cellValue === "string" ? [cellValue] : [];
  }

  return Array.isArray(cellValue)
    ? cellValue.filter((item): item is string => typeof item === "string")
    : [];
}

/** 渲染 region 列的表格单元格；未注册 table 时按文本渲染 */
function renderTable({ multiple, value: cellValue }: ExTableRegionTableParams) {
  const Table = value.table;
  const values = toValues(cellValue, multiple);

  if (!Table) {
    return createElement(Typography.Text, null, values.join(", "));
  }

  if (!multiple) {
    return createElement(Table, { value: values[0] });
  }

  return createElement(
    Space,
    { size: "small" },
    values.map((item) => createElement(Table, { key: item, value: item })),
  );
}

/** 渲染 region 列的查询表单项；未注册 form 时使用 antd Input */
function renderForm({ multiple }: ExTableRegionFormParams) {
  const Form = value.form;

  if (!Form) {
    return createElement(Input);
  }

  return multiple
    ? createElement(Form, { multiple: true })
    : createElement(Form, { multiple: false });
}

export const ExTableRegionHolder = {
  defaultValue,
  register,
  renderForm,
  renderTable,
  get value() {
    return value;
  },
};
