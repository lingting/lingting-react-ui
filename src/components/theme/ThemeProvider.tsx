import {createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState,} from "react"

export type BuiltInTheme =
    | "light"
    | "dark"
    | "desktop-light"
    | "desktop-dark"
export type CustomTheme = string & {}
export type ResolvedTheme = BuiltInTheme | CustomTheme
export type Theme = ResolvedTheme | "system"

export interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    persist?: boolean
    storageKey?: string
    persistenceKey?: string
}

export interface ThemeContextValue {
    persist: boolean
    theme: Theme
    resolvedTheme: ResolvedTheme
    setPersist: (persist: boolean) => void
    setTheme: (theme: Theme) => void
}

const DEFAULT_STORAGE_KEY = "lingting-react-ui/theme-use"
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
    return value === "system" || isThemeName(value)
}

function isThemeName(value: string | null): value is ResolvedTheme {
    return Boolean(value && value.trim() === value && !/\s/.test(value))
}

function themeClassName(theme: ResolvedTheme) {
    return `theme-${theme}`
}

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") {
        return "light"
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

function readPersistState(defaultPersist: boolean, persistenceKey: string) {
    if (typeof window === "undefined") {
        return defaultPersist
    }

    const storedState = window.localStorage.getItem(persistenceKey)
    if (storedState === "true") {
        return true
    }

    if (storedState === "false") {
        return false
    }

    return defaultPersist
}

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  persist = true,
                                  storageKey = DEFAULT_STORAGE_KEY,
                                  persistenceKey = `${storageKey}-persist`,
                              }: ThemeProviderProps) {
    const fallbackTheme = isTheme(defaultTheme) ? defaultTheme : "system"
    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
        getSystemTheme
    )
    const [persistEnabled, setPersistEnabled] = useState(() =>
        readPersistState(persist, persistenceKey)
    )
    const [theme, setTheme] = useState<Theme>(() => {
        if (!persistEnabled || typeof window === "undefined") {
            return fallbackTheme
        }

        const storedTheme = window.localStorage.getItem(storageKey)
        return isTheme(storedTheme) ? storedTheme : fallbackTheme
    })
    const resolvedTheme = theme === "system" ? systemTheme : theme

    const updateTheme = useCallback((nextTheme: Theme) => {
        if (isTheme(nextTheme)) {
            setTheme(nextTheme)
        }
    }, [])

    const setPersist = useCallback((enabled: boolean) => {
        setPersistEnabled(enabled)
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = () => setSystemTheme(getSystemTheme())

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    useEffect(() => {
        const root = document.documentElement
        const className = themeClassName(resolvedTheme)
        root.classList.add(className)

        window.localStorage.setItem(persistenceKey, String(persistEnabled))

        if (persistEnabled) {
            window.localStorage.setItem(storageKey, theme)
        } else {
            window.localStorage.removeItem(storageKey)
        }

        return () => {
            root.classList.remove(className)
        }
    }, [persistenceKey, persistEnabled, resolvedTheme, storageKey, theme])

    const contextValue = useMemo(
        () => ({
            persist: persistEnabled,
            resolvedTheme,
            setPersist,
            setTheme: updateTheme,
            theme,
        }),
        [persistEnabled, resolvedTheme, setPersist, theme, updateTheme]
    )

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme 必须在 ThemeProvider 内使用")
    }

    return context
}
