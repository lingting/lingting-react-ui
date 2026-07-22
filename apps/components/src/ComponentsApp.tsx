import { lazy, Suspense, useState } from "react"
import {
  type Theme,
  type TypographyVariant,
  useTheme,
  useTypography,
} from "lingting-react-ui"
import { Button } from "lingting-react-ui/shadcn"

const ExtensionPage = lazy(() =>
  import("./ExtensionPage").then((module) => ({
    default: module.ExtensionPage,
  }))
)
const ShadcnPage = lazy(() =>
  import("./ShadcnPage").then((module) => ({ default: module.ShadcnPage }))
)
const TypographyPage = lazy(() =>
  import("./TypographyPage").then((module) => ({
    default: module.TypographyPage,
  }))
)

const themes: Theme[] = ["light", "dark", "desktop-light", "desktop-dark"]

type ComponentPage = "extension" | "shadcn"

const typographies: TypographyVariant[] = ["basic", "compact", "spacious"]

export function ComponentsApp() {
  const [page, setPage] = useState<ComponentPage | "typography">("extension")
  const { persist, resolvedTheme, setPersist, setTheme, theme } = useTheme()
  const {
    persist: typographyPersist,
    setPersist: setTypographyPersist,
    setTypography,
    typography,
  } = useTypography()
  const Page =
    page === "extension"
      ? ExtensionPage
      : page === "shadcn"
        ? ShadcnPage
        : TypographyPage

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 p-4">
          <h1 className="mr-auto text-lg font-semibold">Components</h1>
          <nav className="flex gap-2" aria-label="组件分类">
            <Button
              variant={page === "extension" ? "default" : "outline"}
              onClick={() => setPage("extension")}
            >
              扩展
            </Button>
            <Button
              variant={page === "shadcn" ? "default" : "outline"}
              onClick={() => setPage("shadcn")}
            >
              shadcn
            </Button>
            <Button
              variant={page === "typography" ? "default" : "outline"}
              onClick={() => setPage("typography")}
            >
              排版
            </Button>
          </nav>
          <div className="flex flex-wrap gap-2" aria-label="主题切换">
            {themes.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={theme === item ? "secondary" : "ghost"}
                onClick={() => setTheme(item)}
              >
                {item}
              </Button>
            ))}
            <Button
              size="sm"
              variant={persist ? "secondary" : "outline"}
              onClick={() => setPersist(!persist)}
            >
              持久化：{persist ? "开启" : "关闭"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="排版切换">
            {typographies.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={typography === item ? "secondary" : "ghost"}
                onClick={() => setTypography(item)}
              >
                {item}
              </Button>
            ))}
            <Button
              size="sm"
              variant={typographyPersist ? "secondary" : "outline"}
              onClick={() => setTypographyPersist(!typographyPersist)}
            >
              排版持久化：{typographyPersist ? "开启" : "关闭"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl p-6">
        <p className="mb-6 text-sm text-muted-foreground">
          当前主题：{theme}（解析为 {resolvedTheme}）
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          当前排版：{typography}
        </p>
        <Suspense
          fallback={<p className="text-muted-foreground">加载组件中…</p>}
        >
          <Page />
        </Suspense>
      </main>
    </div>
  )
}
