import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { Typography } from "./types"

import "./styles/tokens.css"
import "./styles/basic.css"
import "./styles/compact.css"
import "./styles/spacious.css"
import "./styles/content.css"

export type { Typography } from "./types"

export interface TypographyProviderProps {
  children: ReactNode
  defaultTypography?: Typography
  persist?: boolean
  persistenceKey?: string
  storageKey?: string
}

export interface TypographyContextValue {
  persist: boolean
  setPersist: (persist: boolean) => void
  setTypography: (typography: Typography) => void
  typography: Typography
}

const DEFAULT_STORAGE_KEY = "lingting-react-ui/typography-use"
const TypographyContext = createContext<TypographyContextValue | null>(null)

function isTypography(value: string | null): value is Typography {
  return Boolean(value && value.trim() === value && !/\s/.test(value))
}

function typographyClassName(typography: Typography) {
  return `typography-${typography}`
}

function readPersistState(defaultPersist: boolean, persistenceKey: string) {
  if (typeof window === "undefined") {
    return defaultPersist
  }

  const storedState = window.localStorage.getItem(persistenceKey)
  return storedState === "true" || (storedState !== "false" && defaultPersist)
}

export function TypographyProvider({
  children,
  defaultTypography = "basic",
  persist = true,
  storageKey = DEFAULT_STORAGE_KEY,
  persistenceKey = `${storageKey}-persist`,
}: TypographyProviderProps) {
  const fallbackTypography = isTypography(defaultTypography)
    ? defaultTypography
    : "basic"
  const [persistEnabled, setPersistEnabled] = useState(() =>
    readPersistState(persist, persistenceKey)
  )
  const [typography, setTypography] = useState<Typography>(() => {
    if (!persistEnabled || typeof window === "undefined") {
      return fallbackTypography
    }

    const storedTypography = window.localStorage.getItem(storageKey)
    return isTypography(storedTypography)
      ? storedTypography
      : fallbackTypography
  })
  const setPersist = useCallback(
    (enabled: boolean) => setPersistEnabled(enabled),
    []
  )
  const updateTypography = useCallback((nextTypography: Typography) => {
    if (isTypography(nextTypography)) {
      setTypography(nextTypography)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const className = typographyClassName(typography)
    root.classList.add(className)
    window.localStorage.setItem(persistenceKey, String(persistEnabled))

    if (persistEnabled) {
      window.localStorage.setItem(storageKey, typography)
    } else {
      window.localStorage.removeItem(storageKey)
    }

    return () => {
      root.classList.remove(className)
    }
  }, [persistenceKey, persistEnabled, storageKey, typography])

  const contextValue = useMemo(
    () => ({
      persist: persistEnabled,
      setPersist,
      setTypography: updateTypography,
      typography,
    }),
    [persistEnabled, setPersist, typography, updateTypography]
  )

  return (
    <TypographyContext.Provider value={contextValue}>
      {children}
    </TypographyContext.Provider>
  )
}

export function useTypography(): TypographyContextValue {
  const context = useContext(TypographyContext)

  if (!context) {
    throw new Error("useTypography 必须在 TypographyProvider 内使用")
  }

  return context
}
