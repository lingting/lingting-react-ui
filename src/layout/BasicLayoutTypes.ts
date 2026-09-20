import type { ProConfigProvider } from "@ant-design/pro-components";
import type { ThemeConfig } from "antd";
import type { ComponentProps, Dispatch, ReactNode, SetStateAction } from "react";

import type { LayoutScreenMode } from "@lri/types";

export type ProThemeConfig = Omit<ComponentProps<typeof ProConfigProvider>, "children">;

export type LayoutTheme = {
  antd: ThemeConfig;
  pro: ProThemeConfig;
};

export type BasicLayoutProps = {
  children: ReactNode;
  className?: string;
  defaultTheme?: Partial<LayoutTheme>;
  /** 判定为小屏幕的宽度阈值（CSS 像素），默认 768 */
  smallScreenBreakpoint?: number;
};

export type LayoutContextValue = {
  screenMode: LayoutScreenMode;
  setTheme: Dispatch<SetStateAction<LayoutTheme>>;
  theme: LayoutTheme;
};
