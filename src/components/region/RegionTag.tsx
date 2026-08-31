import { memo } from "react";

import { findRegionItem } from "@lri/lib";
import type { RegionItem, RegionTagProps } from "@lri/types";

import { RegionFlag } from "./RegionFlag";
import { Typography } from "antd";
import './RegionTag.css'

function renderDefaultRegion(item: RegionItem) {
  return (
    <>
      <RegionFlag value={item.iso} />
      <Typography.Text>{item.names.zh}</Typography.Text>
    </>
  );
}

function RegionTagComponent({ className, render = renderDefaultRegion, value }: RegionTagProps) {
  const item = findRegionItem(value);

  if (!item) return null;

  return <div className={`region-tag ${className||""}`}>{render(item)}</div>;
}

export const RegionTag = memo(RegionTagComponent);
