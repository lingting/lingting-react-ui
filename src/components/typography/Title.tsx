import * as React from "react"
import { TypographyContent } from "./TypographyContent"
import type { TypographyDecorationProps } from "./types"

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>, TypographyDecorationProps {
  level?: 1 | 2 | 3 | 4 | 5
}

export function Title({ children, level = 1, ...props }: TitleProps) {
  const { className, ...componentProps } = props

  return (
    <TypographyContent
      component={`h${level}`}
      componentProps={componentProps}
      className={className}
    >
      {children}
    </TypographyContent>
  )
}
