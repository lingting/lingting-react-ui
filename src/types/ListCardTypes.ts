import type { ProCardProps } from "@ant-design/pro-components";
import type { ReactNode } from "react";
import { FixedVirtualListProps } from "@lri/types/FixedVirtualListTypes";

export type ListCardProps<T> = {
  header?: ReactNode;
  data: FixedVirtualListProps<T>["data"];
  itemRender: FixedVirtualListProps<T>["itemRender"];
  filter?: FixedVirtualListProps<T>["filter"];
  loading?: boolean;
  itemHeight: FixedVirtualListProps<T>["itemHeight"];
  itemSize?: FixedVirtualListProps<T>["itemSize"];
  props?: Omit<ProCardProps, "children" | "loading" | "title">;
  contentProps?: Omit<
    FixedVirtualListProps<T>,
    "data" | "itemRender" | "filter" | "itemHeight" | "itemSize"
  >;
} & Pick<ProCardProps, "className" | "classNames">;
