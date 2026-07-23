import { useCallback, useState } from "react"
import {
  Code,
  Link,
  Paragraph,
  Text,
  Title,
  Typography,
  useTypography,
} from "lingting-react-ui"
import { Button } from "lingting-react-ui/shadcn"
import { DemoSection } from "../components/DemoSection"

interface TypographyPageProps {
  page: string
}

export function TypographyPage({ page }: TypographyPageProps) {
  if (page === "overview") return <TypographyOverview />
  if (page === "text") return <TextPage />
  if (page === "link") return <LinkPage />
  if (page === "paragraph") return <ParagraphPage />
  if (page === "title") return <TitlePage />
  if (page === "code") return <CodePage />
  if (page === "typography") return <TypographyCompositePage />
  return <TypographyProviderPage />
}

function TypographyOverview() {
  return (
    <article className="components-page components-typography-document">
      <header className="components-page__header">
        <p className="components-page__eyebrow">排版</p>
        <Title level={1}>一段可阅读的组件索引</Title>
        <Paragraph type="secondary">
          所有排版组件都在同一段内容中工作，顶栏可实时切换阅读节奏。
        </Paragraph>
      </header>
      <div className="components-typography-document__body typography-content">
        <Title level={2}>文本层级</Title>
        <Paragraph>
          <Text strong>Text</Text> 用于强调、<Text italic>倾斜</Text>、
          <Text underline>下划线</Text>、<Text mark>标记</Text>和{" "}
          <Text type="success">语义颜色</Text>。
          <Link href="#/typography/text">查看 Text 示例</Link>。
        </Paragraph>
        <Paragraph>
          链接由 <Link href="#/typography/link">Link</Link> 呈现，内联代码由{" "}
          <Code>const theme = "desktop-light"</Code> 表达。
        </Paragraph>
        <Title level={2}>连续内容</Title>
        <Paragraph>
          <Link href="#/typography/paragraph">Paragraph</Link>{" "}
          负责组织连续文本，<Link href="#/typography/title">Title</Link>{" "}
          建立内容层级，<Link href="#/typography/code">Code</Link>{" "}
          表示技术术语。
        </Paragraph>
        <blockquote>
          排版并不只是字号，它是信息密度、节奏与上下文之间的平衡。
        </blockquote>
        <Title level={2}>复合入口</Title>
        <Paragraph>
          <Link href="#/typography/typography">Typography</Link> 以复合 API
          聚合这些能力；
          <Link href="#/typography/provider">TypographyProvider</Link>{" "}
          负责保存当前的排版方案。
        </Paragraph>
      </div>
    </article>
  )
}

function TextPage() {
  return (
    <TypographyShell title="Text">
      <DemoSection title="基础使用">
        <div className="components-demo-stack">
          <Text strong>强调文本</Text>
          <Text italic>斜体文本</Text>
          <Text underline>下划线文本</Text>
          <Text delete>删除线文本</Text>
          <Text mark>标记文本</Text>
          <div className="components-demo-row">
            <Text type="secondary">次级</Text>
            <Text type="success">成功</Text>
            <Text type="warning">警告</Text>
            <Text type="danger">危险</Text>
          </div>
        </div>
      </DemoSection>
    </TypographyShell>
  )
}

function LinkPage() {
  return (
    <TypographyShell title="Link">
      <DemoSection title="基础使用">
        <Link href="#/typography/overview">跳转到排版概览</Link>
      </DemoSection>
    </TypographyShell>
  )
}

function ParagraphPage() {
  const [content, setContent] = useState("点击编辑图标修改这段文本")
  const handleEnd = useCallback((value: string) => setContent(value), [])

  return (
    <TypographyShell title="Paragraph">
      <DemoSection title="基础使用">
        <div className="components-demo-stack">
          <Paragraph copyable={{ text: "已复制的排版内容" }}>
            悬停右侧图标可复制指定内容。
          </Paragraph>
          <Paragraph editable={{ maxLength: 40, onEnd: handleEnd }}>
            {content}
          </Paragraph>
          <Paragraph ellipsis={{ expandable: "collapsible", rows: 2 }}>
            排版组件支持通过省略配置控制长文本展示，在需要时允许用户展开完整内容，并在不同排版方案中保持一致的层级和节奏。排版组件支持通过省略配置控制长文本展示。
          </Paragraph>
        </div>
      </DemoSection>
    </TypographyShell>
  )
}

function TitlePage() {
  return (
    <TypographyShell title="Title">
      <DemoSection title="基础使用">
        <div className="components-demo-stack">
          <Title level={1}>一级标题</Title>
          <Title level={2}>二级标题</Title>
          <Title level={3}>三级标题</Title>
        </div>
      </DemoSection>
    </TypographyShell>
  )
}

function CodePage() {
  return (
    <TypographyShell title="Code">
      <DemoSection title="基础使用">
        <Paragraph>
          使用 <Code>Typography.Code</Code> 表达内联代码。
        </Paragraph>
      </DemoSection>
    </TypographyShell>
  )
}

function TypographyCompositePage() {
  return (
    <TypographyShell title="Typography">
      <DemoSection title="复合 API">
        <Typography.Title level={2}>复合标题</Typography.Title>
        <Typography.Paragraph type="secondary">
          同一能力也可从 Typography 对象访问。
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Code>Typography.Text</Typography.Code>{" "}
          保持统一的命名空间。
        </Typography.Paragraph>
      </DemoSection>
    </TypographyShell>
  )
}

function TypographyProviderPage() {
  const { persist, typography } = useTypography()

  return (
    <TypographyShell title="TypographyProvider">
      <DemoSection
        description="顶栏排版设置直接驱动当前 Provider。"
        title="上下文状态"
      >
        <div className="components-state-preview">
          <span>当前方案：{typography}</span>
          <span>持久化：{persist ? "开启" : "关闭"}</span>
          <Button asChild variant="outline">
            <a href="#/typography/overview">返回概览</a>
          </Button>
        </div>
      </DemoSection>
    </TypographyShell>
  )
}

function TypographyShell({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">排版</p>
        <h1>{title}</h1>
      </header>
      {children}
    </div>
  )
}
