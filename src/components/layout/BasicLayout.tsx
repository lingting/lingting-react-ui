import type {HTMLAttributes} from "react"
import {cn} from "@/lib/utils"
import {ThemeProvider, type ThemeProviderProps,} from "@/components/theme/ThemeProvider"

export interface BasicLayoutProps
    extends Omit<ThemeProviderProps, "children">,
        HTMLAttributes<HTMLDivElement> {
}

export function BasicLayout({
                                children,
                                className,
                                defaultTheme,
                                persist,
                                persistenceKey,
                                storageKey,
                                ...props
                            }: BasicLayoutProps) {
    return (
        <ThemeProvider
            defaultTheme={defaultTheme}
            persist={persist}
            persistenceKey={persistenceKey}
            storageKey={storageKey}
        >
            <div
                className={cn(
                    "h-full min-h-full w-full bg-background text-foreground antialiased",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </ThemeProvider>
    )
}
