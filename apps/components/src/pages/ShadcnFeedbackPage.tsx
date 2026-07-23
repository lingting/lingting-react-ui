import { toast } from "sonner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  Progress,
  Spinner,
} from "lingting-react-ui/shadcn"
import { InboxIcon, InfoIcon } from "lucide-react"
import { DemoSection } from "../components/DemoSection"

export function ShadcnFeedbackPage() {
  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn / 反馈与状态</p>
        <h1>状态表达与消息流</h1>
        <p>覆盖提示、空状态、进度与通知等 7 个公开模块。</p>
      </header>
      <div className="components-demo-grid">
        <DemoSection title="Alert">
          <Alert>
            <InfoIcon />
            <AlertTitle>有新的组件版本</AlertTitle>
            <AlertDescription>更新后可使用最新的示例样式。</AlertDescription>
          </Alert>
        </DemoSection>
        <DemoSection title="Empty">
          <Empty className="components-empty-preview">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>暂无内容</EmptyTitle>
              <EmptyDescription>新建一个项目后会出现在这里。</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </DemoSection>
        <DemoSection title="Message">
          <MessageGroup>
            <Message>
              <MessageAvatar>LT</MessageAvatar>
              <MessageContent>
                <MessageHeader>Lingting</MessageHeader>
                <div className="components-message-bubble">组件已更新。</div>
              </MessageContent>
            </Message>
          </MessageGroup>
        </DemoSection>
        <DemoSection title="MessageScroller">
          <MessageScrollerProvider>
            <MessageScroller className="components-message-scroller">
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  <MessageScrollerItem>第一条消息</MessageScrollerItem>
                  <MessageScrollerItem>第二条消息</MessageScrollerItem>
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        </DemoSection>
        <DemoSection title="Progress">
          <Progress value={65} />
        </DemoSection>
        <DemoSection title="Sonner">
          <Button onClick={() => toast.success("设置已保存")}>显示通知</Button>
        </DemoSection>
        <DemoSection title="Spinner">
          <Spinner />
        </DemoSection>
      </div>
    </div>
  )
}
