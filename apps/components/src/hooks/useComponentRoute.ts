import { useCallback, useEffect, useState } from "react"
import { DEFAULT_ROUTE, normalizeRoute } from "../config/ComponentRoutes"

function readRoute() {
  if (typeof window === "undefined") return DEFAULT_ROUTE
  return normalizeRoute(window.location.hash)
}

export function useComponentRoute() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigate = useCallback((path: string) => {
    const nextRoute = normalizeRoute(path)

    if (window.location.hash === `#${nextRoute}`) {
      setRoute(nextRoute)
      return
    }

    window.location.hash = nextRoute
  }, [])

  return { navigate, route }
}
