import type { MenuItem } from "lingting-react-ui"
import {
  BlocksIcon,
  BoxIcon,
  FormInputIcon,
  LayoutPanelTopIcon,
  Layers3Icon,
  MessageSquareMoreIcon,
  PaintbrushIcon,
  PanelsTopLeftIcon,
  TypeIcon,
} from "lucide-react"

export const DEFAULT_ROUTE = "/basic/overview"

export const basicItems = [
  { path: "overview", title: "概览" },
  { path: "text-icon", title: "TextIcon" },
  { path: "test-button", title: "TestButton" },
  { path: "basic-layout", title: "BasicLayout" },
  { path: "sidebar-layout", title: "SidebarLayout" },
  { path: "app-sidebar-layout", title: "AppSidebarLayout" },
  { path: "theme-provider", title: "ThemeProvider" },
] as const

export const shadcnGroups = [
  { path: "form", title: "表单与输入", icon: <FormInputIcon /> },
  { path: "navigation", title: "导航与组织", icon: <PanelsTopLeftIcon /> },
  { path: "overlay", title: "弹层与命令", icon: <Layers3Icon /> },
  { path: "display", title: "展示与布局", icon: <LayoutPanelTopIcon /> },
  { path: "feedback", title: "反馈与状态", icon: <MessageSquareMoreIcon /> },
] as const

export const typographyItems = [
  { path: "overview", title: "概览" },
  { path: "text", title: "Text" },
  { path: "link", title: "Link" },
  { path: "paragraph", title: "Paragraph" },
  { path: "title", title: "Title" },
  { path: "code", title: "Code" },
  { path: "typography", title: "Typography" },
  { path: "provider", title: "TypographyProvider" },
] as const

export const componentMenu: readonly MenuItem[] = [
  {
    path: "basic",
    title: "基础组件",
    icon: <BoxIcon />,
    children: basicItems.map((item) => ({ ...item })),
  },
  {
    path: "shadcn",
    title: "shadcn",
    icon: <BlocksIcon />,
    children: [
      { path: "overview", title: "概览" },
      ...shadcnGroups.map((item) => ({ ...item })),
    ],
  },
  {
    path: "typography",
    title: "排版",
    icon: <TypeIcon />,
    children: typographyItems.map((item) => ({ ...item })),
  },
]

export const componentRoutes: ReadonlySet<string> = new Set([
  ...basicItems.map((item) => `/basic/${item.path}`),
  "/shadcn/overview",
  ...shadcnGroups.map((item) => `/shadcn/${item.path}`),
  ...typographyItems.map((item) => `/typography/${item.path}`),
])

export function normalizeRoute(value: string) {
  const route = value.replace(/^#/, "").replace(/\/+$/, "") || DEFAULT_ROUTE
  return route.startsWith("/") ? route : `/${route}`
}

export function isComponentRoute(route: string) {
  return componentRoutes.has(route)
}

export const sectionIcons = {
  basic: <BoxIcon />,
  shadcn: <BlocksIcon />,
  typography: <PaintbrushIcon />,
}
