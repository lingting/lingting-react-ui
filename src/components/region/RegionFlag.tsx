import type { SVGProps } from "react";
import { memo, useMemo } from "react";
import Icon from "@ant-design/icons";

import { findRegionItem } from "@lri/lib";
import type { RegionFlagProps } from "@lri/types";

import "./RegionFlag.css";

const flagSvgs = import.meta.glob<string>("./flags/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
});

function createSvgComponent(source: string) {
  const [, viewBox = "0 0 640 480", content = ""] =
    source.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/) ?? [];

  return function RegionFlagSvg(props: SVGProps<SVGSVGElement>) {
    return <svg {...props} dangerouslySetInnerHTML={{ __html: content }} viewBox={viewBox} />;
  };
}

function RegionFlagComponent({ className, type = "svg", value }: RegionFlagProps) {
  const item = findRegionItem(value);
  const path = item ? `./flags/${item.flag}.svg` : undefined;
  const svgSource = path ? flagSvgs[path] : undefined;
  const flagClassName = `region-flag ${className ?? ""}`;
  const FlagSvg = useMemo(() => (svgSource ? createSvgComponent(svgSource) : null), [svgSource]);

  if (!FlagSvg) return null;

  if (type === "icon") {
    return <Icon className={flagClassName} component={FlagSvg} />;
  }

  return <FlagSvg aria-hidden="true" className={flagClassName} />;
}

export const RegionFlag = memo(RegionFlagComponent);
