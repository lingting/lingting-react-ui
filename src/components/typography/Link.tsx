import * as React from "react"
import { cn } from "@/lib/utils"
import { typographyDecorationClassName } from "./decorationClassName"
import type { TypographyDecorationProps } from "./types"

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "type"
> &
  TypographyDecorationProps

export function Link({
  children,
  className,
  delete: deleted,
  disabled,
  italic,
  keyboard,
  mark,
  strong,
  type,
  underline,
  ...props
}: LinkProps) {
  return (
    <a
      {...props}
      aria-disabled={disabled || undefined}
      className={cn(
        "typography-link underline-offset-4 hover:underline",
        typographyDecorationClassName({
          delete: deleted,
          disabled,
          italic,
          keyboard,
          mark,
          strong,
          type,
          underline,
        }),
        className
      )}
    >
      {children}
    </a>
  )
}
