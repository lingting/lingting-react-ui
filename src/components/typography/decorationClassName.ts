import {cn} from "@/lib/utils"
import type {TypographyDecorationProps} from "./types"

export function typographyDecorationClassName({
                                                  code,
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
        strong && "font-semibold",
        italic && "italic",
        underline && "underline underline-offset-4",
        deleted && "line-through",
        mark && "typography-mark px-1",
        code && "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]",
        keyboard && "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] shadow-xs",
    )
}
