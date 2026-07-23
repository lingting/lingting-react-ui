import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "lingting-react-ui/shadcn"
import { InfoIcon } from "lucide-react"
import { DemoSection } from "../components/DemoSection"

export function ShadcnOverlayPage() {
  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn / 弹层与命令</p>
        <h1>按需出现的内容</h1>
        <p>覆盖确认、对话框、菜单、抽屉与提示等 9 个公开模块。</p>
      </header>
      <div className="components-demo-grid">
        <DemoSection title="AlertDialog">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">确认操作</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认发布？</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作将立即更新示例状态。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel size="default" variant="outline">
                  取消
                </AlertDialogCancel>
                <AlertDialogAction size="default" variant="default">
                  确认
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DemoSection>
        <DemoSection title="ContextMenu">
          <ContextMenu>
            <ContextMenuTrigger className="components-context-target">
              在此区域右键
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>复制</ContextMenuItem>
              <ContextMenuItem>重命名</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </DemoSection>
        <DemoSection title="Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">打开对话框</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>组件详情</DialogTitle>
                <DialogDescription>
                  对话框用于承载需要用户聚焦的任务。
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DemoSection>
        <DemoSection title="Drawer">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">打开抽屉</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>移动端操作</DrawerTitle>
                <DrawerDescription>抽屉从屏幕边缘进入。</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </DemoSection>
        <DemoSection title="DropdownMenu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">更多操作</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>编辑</DropdownMenuItem>
              <DropdownMenuItem>归档</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoSection>
        <DemoSection title="HoverCard">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">悬停查看</Button>
            </HoverCardTrigger>
            <HoverCardContent>用于补充简短的上下文信息。</HoverCardContent>
          </HoverCard>
        </DemoSection>
        <DemoSection title="Popover">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">打开浮层</Button>
            </PopoverTrigger>
            <PopoverContent>浮层适合承载局部设置。</PopoverContent>
          </Popover>
        </DemoSection>
        <DemoSection title="Sheet">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">打开侧表单</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>编辑设置</SheetTitle>
                <SheetDescription>
                  Sheet 从一侧显示较完整的操作内容。
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </DemoSection>
        <DemoSection title="Tooltip">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="查看提示" size="icon-sm" variant="outline">
                <InfoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>简短操作说明</TooltipContent>
          </Tooltip>
        </DemoSection>
      </div>
    </div>
  )
}
