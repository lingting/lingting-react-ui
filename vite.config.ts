import { resolve } from "node:path"
import packageJson from "./package.json"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const externalPackages = [
  "react",
  "react-dom",
  ...Object.keys(packageJson.dependencies),
]

const assetFileNames = (assetInfo: { name?: string }) =>
  assetInfo.name?.endsWith(".css")
    ? "styles/all.css"
    : "assets/[name]-[hash][extname]"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        shadcn: resolve(import.meta.dirname, "src/shadcn.ts"),
      },
    },
    rollupOptions: {
      external: (id) =>
        externalPackages.some(
          (packageName) =>
            id === packageName || id.startsWith(`${packageName}/`)
        ),
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: resolve(import.meta.dirname, "src"),
          entryFileNames: "[name].js",
          assetFileNames,
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: resolve(import.meta.dirname, "src"),
          entryFileNames: "[name].cjs",
          assetFileNames,
          exports: "named",
        },
      ],
    },
  },
})
