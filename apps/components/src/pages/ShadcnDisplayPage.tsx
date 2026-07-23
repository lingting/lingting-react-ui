import {
  AspectRatio,
  Avatar,
  AvatarFallback,
  Badge,
  Bubble,
  BubbleContent,
  BubbleGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  DirectionProvider,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Kbd,
  KbdGroup,
  Marker,
  MarkerContent,
  MarkerIcon,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "lingting-react-ui/shadcn"
import { Bar, BarChart, XAxis } from "recharts"
import { CircleIcon, FileTextIcon } from "lucide-react"
import { DemoSection } from "../components/DemoSection"

const chartData = [
  { name: "周一", value: 42 },
  { name: "周二", value: 68 },
  { name: "周三", value: 53 },
]

export function ShadcnDisplayPage() {
  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn / 展示与布局</p>
        <h1>内容容器与信息展示</h1>
        <p>覆盖尺寸、媒体、图表、滚动和表格等 16 个公开模块。</p>
      </header>
      <div className="components-demo-grid">
        <DemoSection title="AspectRatio">
          <AspectRatio className="components-aspect-preview" ratio={16 / 9}>
            16 : 9
          </AspectRatio>
        </DemoSection>
        <DemoSection title="Avatar">
          <Avatar>
            <AvatarFallback>LT</AvatarFallback>
          </Avatar>
        </DemoSection>
        <DemoSection title="Badge">
          <div className="components-demo-row">
            <Badge>默认</Badge>
            <Badge variant="secondary">次级</Badge>
            <Badge variant="outline">轮廓</Badge>
          </div>
        </DemoSection>
        <DemoSection title="Bubble">
          <BubbleGroup>
            <Bubble>
              <BubbleContent>这是一次简短的对话内容。</BubbleContent>
            </Bubble>
            <Bubble align="end">
              <BubbleContent>右侧回复。</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </DemoSection>
        <DemoSection title="Card">
          <Card>
            <CardHeader>
              <CardTitle>组件卡片</CardTitle>
              <CardDescription>用于组合标题与内容。</CardDescription>
            </CardHeader>
            <CardContent>内容区域</CardContent>
          </Card>
        </DemoSection>
        <DemoSection title="Carousel">
          <Carousel className="components-carousel">
            <CarouselContent>
              <CarouselItem>
                <div className="components-carousel__slide">01</div>
              </CarouselItem>
              <CarouselItem>
                <div className="components-carousel__slide">02</div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DemoSection>
        <DemoSection title="Chart">
          <ChartContainer
            className="components-chart"
            config={{ value: { label: "访问量", color: "var(--primary)" } }}
          >
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        </DemoSection>
        <DemoSection title="DirectionProvider">
          <DirectionProvider dir="rtl">
            <div className="components-direction-preview">
              从右向左的内容方向
            </div>
          </DirectionProvider>
        </DemoSection>
        <DemoSection title="Item">
          <Item variant="outline">
            <FileTextIcon />
            <ItemContent>
              <ItemTitle>README.md</ItemTitle>
              <ItemDescription>8 KB · 刚刚更新</ItemDescription>
            </ItemContent>
          </Item>
        </DemoSection>
        <DemoSection title="Kbd">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </DemoSection>
        <DemoSection title="Marker">
          <Marker>
            <MarkerIcon>
              <CircleIcon />
            </MarkerIcon>
            <MarkerContent>需要关注的更新</MarkerContent>
          </Marker>
        </DemoSection>
        <DemoSection title="Resizable">
          <ResizablePanelGroup
            className="components-resizable-preview"
            orientation="horizontal"
          >
            <ResizablePanel defaultSize={50}>左侧</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>右侧</ResizablePanel>
          </ResizablePanelGroup>
        </DemoSection>
        <DemoSection title="ScrollArea">
          <ScrollArea className="components-scroll-preview">
            <div>
              第一行内容
              <br />
              第二行内容
              <br />
              第三行内容
              <br />
              第四行内容
              <br />
              第五行内容
            </div>
          </ScrollArea>
        </DemoSection>
        <DemoSection title="Separator">
          <div>
            上方内容
            <Separator className="components-separator" />
            下方内容
          </div>
        </DemoSection>
        <DemoSection title="Skeleton">
          <div className="components-skeleton-preview">
            <Skeleton className="components-skeleton-preview__avatar" />
            <Skeleton className="components-skeleton-preview__line" />
            <Skeleton className="components-skeleton-preview__line components-skeleton-preview__line--short" />
          </div>
        </DemoSection>
        <DemoSection title="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>组件</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Button</TableCell>
                <TableCell>稳定</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DemoSection>
      </div>
    </div>
  )
}
