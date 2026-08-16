import { type ProColumns, ProTable } from "@ant-design/pro-components";
import { useMemo } from "react";

import { AppHolder, formatTimestamp } from "@/lib";
import type {
  ExDictProps,
  ExTableColumn,
  ExTableProps,
  ExTableRequestParams,
  PaginationParams,
  PaginationResult,
} from "@/types";

import { Dict } from "../dict";

const defaultPagination = {
  defaultPageSize: 10,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: [10, 20, 50, 100, 200, 500, 1000],
};

const defaultOptions = {
  density: true,
  fullScreen: true,
  reload: true,
  setting: true,
};

function readValue<T extends Record<string, unknown>>(
  record: T,
  dataIndex: ExTableColumn<T>["dataIndex"],
) {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[String(key)]
          : undefined,
      record,
    );
  }
  return typeof dataIndex === "string" || typeof dataIndex === "number"
    ? record[String(dataIndex)]
    : undefined;
}

function prepareColumn<T extends Record<string, unknown>>(column: ExTableColumn<T>): ProColumns<T> {
  const { dict, title, valueType, ...rest } = column;
  const timestampUnit =
    valueType === "timestamp"
      ? "seconds"
      : valueType === "timestampMillis"
        ? "milliseconds"
        : undefined;
  const next = {
    ...rest,
    valueType: timestampUnit ? "text" : valueType,
    title: typeof title === "string" ? AppHolder.intl.format(title) : title,
    sorter: column.defaultSortOrder && column.sorter === undefined ? true : column.sorter,
  } as ProColumns<T>;

  if (timestampUnit && !column.renderText) {
    next.renderText = (text) => formatTimestamp(text, timestampUnit);
  }

  if (dict) {
    const {
      search: dictSearch = "select",
      table: dictTable = "tag",
      ...dictProps
    } = ("dict" in dict ? dict : { dict }) as ExDictProps;
    if (!column.renderText) {
      next.renderText = (text) => {
        const value = text as string | number | boolean | null | undefined;
        return <Dict.Text {...dictProps} value={value} />;
      };
    }
    if (!column.render) {
      next.render = (_text, record) => {
        const value = readValue(record, column.dataIndex) as
          | string
          | number
          | boolean
          | null
          | undefined;
        switch (dictTable) {
          case "badge":
            return <Dict.Badge {...dictProps} value={value} />;
          case "text":
            return <Dict.Text {...dictProps} value={value} />;
          default:
            return <Dict.Tag {...dictProps} value={value} />;
        }
      };
    }
    if (!column.formItemRender) {
      next.formItemRender = () =>
        dictSearch === "checkbox" ? (
          <Dict.CheckBox {...dictProps} />
        ) : (
          <Dict.Select {...dictProps} />
        );
    }
  }

  return next;
}

function toRequestData<T>(response: PaginationResult<T> | T[]) {
  if (Array.isArray(response)) {
    return { data: response, success: true, total: response.length };
  }
  if (response && typeof response === "object" && Array.isArray(response.records)) {
    return { data: response.records, success: true, total: Number(response.total || 0) };
  }
  throw new TypeError("ExTable request must resolve to PaginationResult<T> with records or T[].");
}

export function ExTable<
  T extends Record<string, unknown> = any,
  Q extends Record<string, any> = any,
>({
  columns,
  options,
  pagination,
  request,
  rowKey = "id",
  scroll,
  tableAlertRender = false,
  ...props
}: ExTableProps<T, Q>) {
  const preparedColumns = useMemo(() => columns.map(prepareColumn), [columns]);
  const preparedRequest = useMemo(() => {
    if (!request) {
      return undefined;
    }
    return async (
      params: ExTableRequestParams & { pageSize?: number },
      sort: Record<string, "ascend" | "descend" | null>,
    ) => {
      const { current, pageSize, size: paramSize, sorts: _sorts, ...query } = params;
      const paginationParams: PaginationParams = {
        current: current ?? 1,
        size: pageSize ?? paramSize ?? 10,
        sorts: Object.entries(sort)
          .filter(([, order]) => order === "ascend" || order === "descend")
          .map(([field, order]) => ({ desc: order === "descend", field })),
      };
      const response = await request(paginationParams, query as Q);
      return toRequestData(response);
    };
  }, [request]);

  return (
    <ProTable<T, ExTableRequestParams>
      {...props}
      columns={preparedColumns}
      options={options === false ? false : { ...defaultOptions, ...options }}
      pagination={
        pagination === false
          ? false
          : {
              ...defaultPagination,
              ...pagination,
            }
      }
      request={preparedRequest}
      rowKey={rowKey}
      scroll={scroll === false ? undefined : (scroll ?? { x: "max-content" })}
      tableAlertRender={tableAlertRender === true ? undefined : tableAlertRender || false}
    />
  );
}
