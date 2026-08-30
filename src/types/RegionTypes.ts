import type { CSSProperties, ReactNode } from "react";

export type RegionName = {
  en: string;
  zh: string;
};

export type RegionM49 = {
  region?: string;
  subregion?: string;
  intermediateRegion?: string;
};

export type RegionItem = {
  iso: string;
  iso3: string;
  flag: string;
  callingCodes: string[];
  phonePrefixes: string[];
  names: RegionName;
  numeric: string;
  m49: RegionM49;
};

export type RegionPhone = {
  prefix: number;
  calling: number;
  region: string;
};

export type RegionM49Data = {
  code: string;
  name: RegionName;
  children?: RegionM49Data[];
  regions?: string[];
};

export type RegionFilter = (input: string, items: RegionItem[]) => RegionItem[];
export type RegionRender = (item: RegionItem) => ReactNode;

export type RegionSelectProps = {
  className?: string;
  style?: CSSProperties;
  filter?: RegionFilter;
  multiple?: false;
  onChange?: (value: string | undefined) => void;
  renderItem?: RegionRender;
  value?: string;
};

export type RegionSelectMultipleProps = {
  className?: string;
  style?: CSSProperties;
  filter?: RegionFilter;
  multiple: true;
  onChange?: (value: string[]) => void;
  renderItem?: RegionRender;
  value?: string[];
};

export type RegionFlagType = "svg" | "icon";

export type RegionFlagProps = {
  className?: string;
  type?: RegionFlagType;
  value?: string | null;
};

export type RegionTagProps = {
  className?: string;
  render?: RegionRender;
  value?: string | null;
};
