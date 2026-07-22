import * as React from "react"
import { TypographyContent } from "./TypographyContent"
import type { TypographyDecorationProps } from "./types"

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>, TypographyDecorationProps {}

export function Text({ children, ...props }: TextProps) {
  const { className, ...componentProps } = props

  return (
    <TypographyContent
      component="span"
      componentProps={componentProps}
      className={className}
    >
      {children}
    </TypographyContent>
  )
}
