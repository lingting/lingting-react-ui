import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import {
  ThemeProvider,
  type ThemeProviderProps,
} from "@/components/theme/ThemeProvider"
import {
  TypographyProvider,
  type TypographyProviderProps,
} from "@/components/typography/TypographyProvider"

export interface BasicLayoutProps
  extends Omit<ThemeProviderProps, "children">, HTMLAttributes<HTMLDivElement> {
  typography?: Omit<TypographyProviderProps, "children">
}

export function BasicLayout({
  children,
  className,
  defaultTheme,
  persist,
  persistenceKey,
  storageKey,
  typography,
  ...props
}: BasicLayoutProps) {
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      persist={persist}
      persistenceKey={persistenceKey}
      storageKey={storageKey}
    >
      <TypographyProvider {...typography}>
        <div
          className={cn(
            "h-full min-h-full w-full bg-page text-foreground antialiased",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TypographyProvider>
    </ThemeProvider>
  )
}
