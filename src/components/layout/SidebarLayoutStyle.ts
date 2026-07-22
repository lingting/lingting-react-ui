import type { CSSProperties } from "react"

export function toSidebarLayoutCssSize(
  value: CSSProperties["height"] | undefined,
  fallback: string
) {
  if (value === undefined) {
    return fallback
  }

  return typeof value === "number" ? `${value}px` : value
}
