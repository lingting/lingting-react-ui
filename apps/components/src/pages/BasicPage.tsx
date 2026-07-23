import {
  AppSidebarLayout,
  BasicLayout,
  SidebarLayout,
  TestButton,
  TextIcon,
  useTheme,
} from "lingting-react-ui"
import { Button } from "lingting-react-ui/shadcn"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"
import { DemoSection } from "../components/DemoSection"
import { basicItems } from "../config/ComponentRoutes"

interface BasicPageProps {
  page: (typeof basicItems)[number]["path"]
  navigate: (path: string) => void
}

export function BasicPage({ page, navigate }: BasicPageProps) {
  if (page === "overview") {
    return (
      <div className="components-page">
        <header className="components-page__header">
          <p className="components-page__eyebrow">基础组件</p>
          <h1>组件库的应用骨架</h1>
          <p>从图标、按钮到可组合的页面布局，选择一个示例继续查看。</p>
        </header>
        <div className="components-overview-grid">
          {basicItems.slice(1).map((item) => (
            <Button
              className="components-overview-card"
              key={item.path}
              onClick={() => navigate(`/basic/${item.path}`)}
              type="button"
            >
              <strong>{item.title}</strong>
              <span>{basicPreview(item.path)}</span>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  if (page === "text-icon") {
    return (
      <PageShell title="TextIcon">
        <DemoSection
          description="用文本生成菜单或导航中的固定尺寸图标。"
          title="基础使用"
        >
          <div className="components-demo-row">
            <TextIcon text="基" />
            <TextIcon text="UI" />
            <TextIcon text="A" />
          </div>
        </DemoSection>
      </PageShell>
    )
  }

  if (page === "test-button") {
    return (
      <PageShell title="TestButton">
        <DemoSection
          description="继承 shadcn Button 的属性并提供默认内容。"
          title="基础使用"
        >
          <div className="components-demo-row">
            <TestButton />
            <TestButton variant="outline">自定义内容</TestButton>
          </div>
        </DemoSection>
      </PageShell>
    )
  }

  if (page === "basic-layout") {
    return (
      <PageShell title="BasicLayout">
        <DemoSection
          description="BasicLayout 为主题与排版上下文提供容器。"
          title="BasicLayout"
        >
          <BasicLayout className="components-layout-preview">
            <strong>受主题保护的内容区域</strong>
          </BasicLayout>
        </DemoSection>
      </PageShell>
    )
  }

  if (page === "sidebar-layout") {
    return (
      <PageShell title="SidebarLayout">
        <DemoSection
          description="SidebarLayout 提供可调整宽度的侧栏与内容区。"
          title="SidebarLayout"
        >
          <SidebarLayout
            className="components-layout-preview components-layout-preview--tall"
            items={[{ content: "目录" }, { content: "设置" }]}
          >
            <div className="components-layout-preview__content">内容区域</div>
          </SidebarLayout>
        </DemoSection>
      </PageShell>
    )
  }

  if (page === "app-sidebar-layout") {
    return (
      <PageShell title="AppSidebarLayout">
        <DemoSection
          description="AppSidebarLayout 在 SidebarLayout 上提供菜单和应用顶栏。"
          title="AppSidebarLayout"
        >
          <AppSidebarLayout
            className="components-layout-preview components-layout-preview--tall"
            getCurrentRoute={() => "/overview"}
            header={{ title: "示例应用" }}
            menu={[{ path: "overview", title: "概览" }]}
            navigate={() => undefined}
            user={{
              description: "用户参数展示",
              logout: {
                icon: <LogOutIcon />,
                onClick: () => toast.info("已点击示例中的底部退出"),
                position: "bottom",
                text: "退出登录",
              },
              nickname: "示例用户",
              position: "top",
            }}
          >
            <div className="components-layout-preview__content">应用内容</div>
          </AppSidebarLayout>
        </DemoSection>
      </PageShell>
    )
  }

  return <ThemeProviderPage />
}

function ThemeProviderPage() {
  const { resolvedTheme, theme } = useTheme()

  return (
    <PageShell title="ThemeProvider">
      <DemoSection
        description="当前应用已由 ThemeProvider 包裹，顶栏可直接切换主题。"
        title="上下文状态"
      >
        <div className="components-state-preview">
          <span>当前选择：{theme}</span>
          <span>实际主题：{resolvedTheme}</span>
          <Button asChild variant="outline">
            <a href="#/basic/overview">返回概览</a>
          </Button>
        </div>
      </DemoSection>
    </PageShell>
  )
}

function PageShell({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">基础组件</p>
        <h1>{title}</h1>
      </header>
      {children}
    </div>
  )
}

function basicPreview(path: (typeof basicItems)[number]["path"]) {
  const previews: Record<Exclude<typeof path, "overview">, string> = {
    "text-icon": "文本缩写图标",
    "test-button": "默认按钮封装",
    "basic-layout": "主题与排版容器",
    "sidebar-layout": "可调节的侧栏布局",
    "app-sidebar-layout": "带菜单的应用布局",
    "theme-provider": "主题上下文状态",
  }

  return previews[path as Exclude<typeof path, "overview">]
}
