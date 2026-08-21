import { memo } from "react";

import { findRegionItem } from "@lri/lib";
import type { RegionItem, RegionTagProps } from "@lri/types";

import { RegionFlag } from "./RegionFlag";

function renderDefaultRegion(item: RegionItem) {
  return (
    <>
      <RegionFlag value={item.iso} /> {item.names.zh}
    </>
  );
}

function RegionTagComponent({ className, render = renderDefaultRegion, value }: RegionTagProps) {
  const item = findRegionItem(value);

  if (!item) return null;

  return <span className={className}>{render(item)}</span>;
}

export const RegionTag = memo(RegionTagComponent);
