import { cn } from "@/lib/utils"
import type { TypographyDecorationProps } from "./types"

export function typographyDecorationClassName({
  delete: deleted,
  disabled,
  italic,
  keyboard,
  mark,
  strong,
  type,
  underline,
}: TypographyDecorationProps) {
  return cn(
    type === "secondary" && "typography-secondary",
    type === "success" && "typography-success",
    type === "warning" && "typography-warning",
    type === "danger" && "typography-danger",
    disabled && "typography-disabled",
    strong && "typography-strong",
    italic && "typography-italic",
    underline && "typography-underline",
    deleted && "typography-delete",
    mark && "typography-mark",
    keyboard && "typography-keyboard"
  )
}
