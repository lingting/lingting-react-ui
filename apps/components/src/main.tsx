import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BasicLayout } from "lingting-react-ui"
import { ComponentsApp } from "./ComponentsApp"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BasicLayout
      defaultTheme="desktop-light"
      storageKey="lingting-react-ui/components-theme"
    >
      <ComponentsApp />
    </BasicLayout>
  </StrictMode>
)
