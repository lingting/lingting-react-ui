import { AppSidebarLayout } from "lingting-react-ui"
import { Toaster } from "lingting-react-ui/shadcn"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { ComponentsAppSettings } from "./components/ComponentsAppSettings"
import {
  componentMenu,
  DEFAULT_ROUTE,
  isComponentRoute,
} from "./config/ComponentRoutes"
import { useComponentRoute } from "./hooks/useComponentRoute"
import { BasicPage } from "./pages/BasicPage"
import { ShadcnPage } from "./pages/ShadcnPage"
import { TypographyPage } from "./pages/TypographyPage"

export function ComponentsApp() {
  const { navigate, route } = useComponentRoute()
  const currentRoute = isComponentRoute(route) ? route : DEFAULT_ROUTE
  const [section, page = "overview"] = currentRoute.slice(1).split("/")

  return (
    <AppSidebarLayout
      defaultTheme="desktop-light"
      getCurrentRoute={() => currentRoute}
      header={{
        title: "Components",
        right: <ComponentsAppSettings />,
      }}
      menu={componentMenu}
      navigate={navigate}
      storageKey="lingting-react-ui/components-theme"
      typography={{ storageKey: "lingting-react-ui/components-typography" }}
      user={{
        description: "组件库维护者",
        logout: {
          icon: <LogOutIcon />,
          onClick: () => toast.info("已点击底部退出：测试用户退出操作"),
          position: "bottom",
          text: "退出登录",
        },
        nickname: "Lingting",
        position: "top",
      }}
    >
      {section === "basic" && (
        <BasicPage navigate={navigate} page={page as never} />
      )}
      {section === "shadcn" && <ShadcnPage navigate={navigate} page={page} />}
      {section === "typography" && <TypographyPage page={page} />}
      <Toaster />
    </AppSidebarLayout>
  )
}
