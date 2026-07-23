import { type ComponentType } from "react"
import { shadcnGroups } from "../config/ComponentRoutes"
import { ShadcnDisplayPage } from "./ShadcnDisplayPage"
import { ShadcnFeedbackPage } from "./ShadcnFeedbackPage"
import { ShadcnFormPage } from "./ShadcnFormPage"
import { ShadcnNavigationPage } from "./ShadcnNavigationPage"
import { ShadcnOverlayPage } from "./ShadcnOverlayPage"

interface ShadcnPageProps {
  navigate: (path: string) => void
  page: string
}

const pageComponents: Record<string, ComponentType> = {
  display: ShadcnDisplayPage,
  feedback: ShadcnFeedbackPage,
  form: ShadcnFormPage,
  navigation: ShadcnNavigationPage,
  overlay: ShadcnOverlayPage,
}

export function ShadcnPage({ navigate, page }: ShadcnPageProps) {
  const Page = pageComponents[page]

  if (Page) return <Page />

  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn</p>
        <h1>原始组件索引</h1>
        <p>按交互职责组织所有公开模块，每组保留可操作的最小组合示例。</p>
      </header>
      <div className="components-overview-grid">
        {shadcnGroups.map((group) => (
          <button
            className="components-overview-card components-overview-card--icon"
            key={group.path}
            onClick={() => navigate(`/shadcn/${group.path}`)}
            type="button"
          >
            <span className="components-overview-card__icon">{group.icon}</span>
            <strong>{group.title}</strong>
            <span>{groupDescription(group.path)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function groupDescription(path: (typeof shadcnGroups)[number]["path"]) {
  const descriptions: Record<typeof path, string> = {
    display: "16 个展示、容器与布局模块",
    feedback: "7 个反馈与状态模块",
    form: "18 个表单与输入模块",
    navigation: "9 个导航与组织模块",
    overlay: "9 个弹层与命令模块",
  }

  return descriptions[path]
}
