import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export interface TextIconProps extends HTMLAttributes<HTMLSpanElement> {
  text: string
}

export function TextIcon({ text, className, ...props }: TextIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("text-icon", className)}
      data-slot="text-icon"
      title={text}
      {...props}
    >
      {text}
    </span>
  )
}
