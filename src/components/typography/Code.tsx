import * as React from "react"
import { cn } from "@/lib/utils"
import { TypographyContent } from "./TypographyContent"
import type { TypographyDecorationProps } from "./types"

export type CodeProps = React.HTMLAttributes<HTMLElement> &
  TypographyDecorationProps

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <TypographyContent
      component="code"
      componentProps={props}
      className={cn("typography-code", className)}
    >
      {children}
    </TypographyContent>
  )
}
