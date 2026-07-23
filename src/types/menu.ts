import type { ReactNode } from "react"

export type MenuExpandMode = "single" | "multiple"

export interface MenuItem {
  children?: readonly MenuItem[]
  dir?: boolean
  icon?: ReactNode
  path: string
  title: ReactNode
  tooltop?: ReactNode
  tooltip?: ReactNode
}
