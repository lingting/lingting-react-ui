import type { ReactNode } from "react";

export type MenuExpandMode = "single" | "multiple";

export type MenuItem = {
  children?: readonly MenuItem[];
  dir?: boolean;
  icon?: ReactNode;
  path: string;
  title: ReactNode;
  tooltip?: ReactNode;
};
