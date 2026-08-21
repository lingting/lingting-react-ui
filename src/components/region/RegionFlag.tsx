import { memo } from "react";

import { findRegionItem } from "@lri/lib";
import type { RegionFlagProps } from "@lri/types";

import "./RegionFlag.css";

const flagSources = import.meta.glob<string>("./flags/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function RegionFlagComponent({ className, value }: RegionFlagProps) {
  const item = findRegionItem(value);
  const source = item ? flagSources[`./flags/${item.flag}.svg`] : undefined;

  if (!source) return null;

  return <img alt="" className={`region-flag ${className ?? ""}`} src={source} />;
}

export const RegionFlag = memo(RegionFlagComponent);
