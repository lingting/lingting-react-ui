import { ProCard } from "@ant-design/pro-components";
import { memo } from "react";

import type { ListCardProps } from "@lri/types";

import { FixedVirtualList } from "../ex-list";

import "./ListCard.css";

function ListCardComponent<T>({
  data,
  filter,
  header,
  itemHeight,
  itemRender,
  itemSize,
  loading,
  props,
  contentProps,
}: ListCardProps<T>) {
  return (
    <ProCard
      {...props}
      className={["list-card", props?.className].filter(Boolean).join(" ")}
      loading={loading}
      title={header}
    >
      <FixedVirtualList
        {...contentProps}
        className={["list-card-content", contentProps?.className].filter(Boolean).join(" ")}
        data={data}
        filter={filter}
        itemHeight={itemHeight}
        itemRender={itemRender}
        itemSize={itemSize}
      />
    </ProCard>
  );
}

export const ListCard = memo(ListCardComponent) as typeof ListCardComponent;
