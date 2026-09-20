import { ProConfigProvider, useIntl } from "@ant-design/pro-components";
import { QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import clsx from "clsx";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useToken } from "@lri/hooks/useAntdExt";
import { useScreenMode } from "@lri/hooks/useScreenMode";
import { AppHolder } from "@lri/lib";

import "./BasicLayout.css";
import type { BasicLayoutProps, LayoutContextValue, LayoutTheme } from "./BasicLayoutTypes";

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

function Main({ children, className }: Pick<BasicLayoutProps, "children" | "className">) {
  const app = App.useApp();
  const intl = useIntl();
  const { token } = useToken();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unmount = AppHolder.mount({
      message: app.message,
      notification: app.notification,
      modal: app.modal,
      intl,
    });
    setMounted(true);
    return () => {
      unmount();
      setMounted(false);
    };
  }, [app, intl]);

  return (
    <div
      className={clsx("basic-layout", className)}
      style={{ background: token.colorBgLayout, color: token.colorText }}
    >
      {mounted ? children : null}
    </div>
  );
}

export function BasicLayout({
  children,
  className,
  defaultTheme,
  smallScreenBreakpoint,
}: BasicLayoutProps) {
  const [theme, setTheme] = useState<LayoutTheme>(() => ({
    antd: defaultTheme?.antd ?? {},
    pro: defaultTheme?.pro ?? {},
  }));
  const screenMode = useScreenMode(smallScreenBreakpoint);
  const contextValue = useMemo<LayoutContextValue>(
    () => ({ screenMode, setTheme, theme }),
    [screenMode, theme],
  );

  return (
    <QueryClientProvider client={AppHolder.query}>
      <LayoutContext.Provider value={contextValue}>
        <ConfigProvider theme={theme.antd}>
          <ProConfigProvider {...theme.pro}>
            <App className={"basic-layout-app"}>
              <Main className={className}>{children}</Main>
            </App>
          </ProConfigProvider>
        </ConfigProvider>
      </LayoutContext.Provider>
    </QueryClientProvider>
  );
}

export function useLayout() {
  const value = useContext(LayoutContext);
  if (!value) throw new Error("useLayout 必须在 BasicLayout 内使用");
  return value;
}
