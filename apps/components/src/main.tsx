import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ComponentsApp } from "./ComponentsApp"
import "./styles/ComponentsApp.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ComponentsApp />
  </StrictMode>
)
