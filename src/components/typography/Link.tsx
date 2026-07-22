import * as React from "react"
import {cn} from "@/lib/utils"
import type {TypographyDecorationProps} from "./types"

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & TypographyDecorationProps

export function Link({
                         children,
                         className,
                         code,
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
                "text-primary underline-offset-4 hover:underline",
                disabled && "pointer-events-none cursor-not-allowed text-muted-foreground opacity-60",
                type === "secondary" && "text-muted-foreground",
                type === "success" && "text-emerald-600 dark:text-emerald-400",
                type === "warning" && "text-amber-600 dark:text-amber-400",
                type === "danger" && "text-destructive",
                strong && "font-semibold",
                italic && "italic",
                underline && "underline",
                deleted && "line-through",
                mark && "bg-yellow-200 px-1 text-inherit dark:bg-yellow-500/30",
                code && "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]",
                keyboard && "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] shadow-xs",
                className
            )}
        >
            {children}
        </a>
    )
}
