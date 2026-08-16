import { ProConfigProvider, useIntl } from "@ant-design/pro-components";
import { App, ConfigProvider, type ThemeConfig } from "antd";
import clsx from "clsx";
import {
  type ComponentProps,
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppHolder } from "@lri/lib";

import "./BasicLayout.css";
import { useToken } from "@lri/hooks/useAntdExt";

type ProThemeConfig = Omit<ComponentProps<typeof ProConfigProvider>, "children">;

export type LayoutTheme = {
  antd: ThemeConfig;
  pro: ProThemeConfig;
};

export type BasicLayoutProps = {
  children: ReactNode;
  className?: string;
  defaultTheme?: Partial<LayoutTheme>;
};

export type LayoutContextValue = {
  setTheme: Dispatch<SetStateAction<LayoutTheme>>;
  theme: LayoutTheme;
};

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

export function BasicLayout({ children, className, defaultTheme }: BasicLayoutProps) {
  const [theme, setTheme] = useState<LayoutTheme>(() => ({
    antd: defaultTheme?.antd ?? {},
    pro: defaultTheme?.pro ?? {},
  }));

  return (
    <>
      <QueryClientProvider client={AppHolder.query}>
        <LayoutContext.Provider value={{ setTheme, theme }}>
          <ConfigProvider theme={theme.antd}>
            <ProConfigProvider {...theme.pro}>
              <App className={"basic-layout-app"}>
                <Main className={className}>{children}</Main>
              </App>
            </ProConfigProvider>
          </ConfigProvider>
        </LayoutContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export function useLayout() {
  const value = useContext(LayoutContext);
  if (!value) throw new Error("useLayout 必须在 BasicLayout 内使用");
  return value;
}
