import { dirname, relative, resolve } from "node:path"
import packageJson from "./package.json"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const externalPackages = [
  "react",
  "react-dom",
  ...Object.keys(packageJson.dependencies),
]

function cssImportPath(chunkFileName: string, cssFileName: string) {
  const path = relative(dirname(chunkFileName), cssFileName).replaceAll(
    "\\",
    "/"
  )

  return path.startsWith(".") ? path : `./${path}`
}

function injectComponentCssImports(): Plugin {
  return {
    name: "inject-component-css-imports",
    enforce: "post",
    generateBundle: {
      order: "post",
      handler(outputOptions, bundle) {
        if (outputOptions.format !== "es") {
          return
        }

        for (const output of Object.values(bundle)) {
          if (output.type !== "chunk") {
            continue
          }

          // @ts-ignore
          const cssImports = [...output.viteMetadata.importedCss]
            .map((cssFileName) => {
              return `import ${JSON.stringify(
                cssImportPath(output.fileName, cssFileName)
              )};`
            })
            .join("\n")

          if (cssImports) {
            output.code = `${cssImports}\n${output.code}`
          }
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectComponentCssImports()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    cssCodeSplit: true,
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
          assetFileNames: "assets/[name]-[hash][extname]",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: resolve(import.meta.dirname, "src"),
          entryFileNames: "[name].cjs",
          assetFileNames: "assets/[name]-[hash][extname]",
          exports: "named",
        },
      ],
    },
  },
})
