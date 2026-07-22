import {resolve} from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

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
            formats: ["es", "cjs"],
            fileName: (format, entryName) =>
                `${entryName}.${format === "es" ? "js" : "cjs"}`,
        },
        rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
            output: {
                assetFileNames: (assetInfo) =>
                    assetInfo.name?.endsWith(".css")
                        ? "styles/all.css"
                        : "assets/[name]-[hash][extname]",
            },
        },
    },
})
