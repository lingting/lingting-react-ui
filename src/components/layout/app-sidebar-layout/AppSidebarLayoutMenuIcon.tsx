import type { ReactNode } from "react"

import { TextIcon } from "@/components/icon/TextIcon"

interface AppSidebarLayoutMenuIconProps {
  fallbackTitle?: ReactNode
  icon?: ReactNode
}

export function AppSidebarLayoutMenuIcon({
  fallbackTitle,
  icon,
}: AppSidebarLayoutMenuIconProps) {
  if (typeof icon === "string") return <TextIcon text={icon} />
  if (icon) return icon
  if (typeof fallbackTitle === "string") {
    return <TextIcon text={fallbackTitle} />
  }

  return null
}
