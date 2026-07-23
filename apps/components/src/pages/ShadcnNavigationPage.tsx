import { useCallback, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "lingting-react-ui/shadcn"
import {
  ChevronDownIcon,
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
} from "lucide-react"
import { DemoSection } from "../components/DemoSection"

export function ShadcnNavigationPage() {
  const [open, setOpen] = useState(false)
  const handleOpenChange = useCallback((value: boolean) => setOpen(value), [])

  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn / 导航与组织</p>
        <h1>信息路径与内容切换</h1>
        <p>覆盖层级、命令、分页、侧栏与标签页等 9 个公开模块。</p>
      </header>
      <div className="components-demo-grid">
        <DemoSection title="Accordion">
          <Accordion collapsible type="single">
            <AccordionItem value="usage">
              <AccordionTrigger>基础使用</AccordionTrigger>
              <AccordionContent>使用组合 API 组织可展开内容。</AccordionContent>
            </AccordionItem>
          </Accordion>
        </DemoSection>
        <DemoSection title="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#/shadcn/overview">shadcn</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>导航</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DemoSection>
        <DemoSection title="Collapsible">
          <Collapsible onOpenChange={handleOpenChange} open={open}>
            <CollapsibleTrigger className="components-inline-trigger">
              更多选项 <ChevronDownIcon />
            </CollapsibleTrigger>
            <CollapsibleContent className="components-collapsible-content">
              展开后的说明内容。
            </CollapsibleContent>
          </Collapsible>
        </DemoSection>
        <DemoSection title="Command">
          <Command className="components-command-preview">
            <CommandInput placeholder="搜索命令" />
            <CommandList>
              <CommandEmpty>没有匹配项</CommandEmpty>
              <CommandGroup heading="页面">
                <CommandItem>组件概览</CommandItem>
                <CommandItem>主题设置</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DemoSection>
        <DemoSection title="Menubar">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>文件</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>新建</MenubarItem>
                <MenubarItem>打开</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </DemoSection>
        <DemoSection title="NavigationMenu">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="#/basic/overview">
                  基础组件
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#/typography/overview">
                  排版
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </DemoSection>
        <DemoSection title="Pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#/shadcn/navigation" size="default" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#/shadcn/navigation"
                  isActive
                  size="default"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#/shadcn/navigation" size="default" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </DemoSection>
        <DemoSection title="Sidebar">
          <SidebarProvider className="components-sidebar-preview">
            <Sidebar collapsible="none">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>工作区</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <FolderIcon /> 项目
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <SettingsIcon /> 设置
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </DemoSection>
        <DemoSection title="Tabs">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">预览</TabsTrigger>
              <TabsTrigger value="code">代码</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">组件预览区域</TabsContent>
            <TabsContent value="code">
              <FileTextIcon /> 组合 API
            </TabsContent>
          </Tabs>
        </DemoSection>
      </div>
    </div>
  )
}
