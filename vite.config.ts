import { readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite-plus";

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "antd",
  "@ant-design/icons",
  "@ant-design/pro-components",
  "@tanstack/react-query",
  "@tanstack/react-router",
  "@tanstack/react-store",
  "clsx",
  "dayjs",
];

function getLibraryEntries() {
  const src = resolve(import.meta.dirname, "src");

  const entries: Record<string, string> = {
    index: resolve(src, "index.ts"),
  };

  for (const name of readdirSync(src)) {
    const directory = resolve(src, name);

    if (!statSync(directory).isDirectory()) {
      continue;
    }

    const entry = resolve(directory, "index.ts");

    try {
      statSync(entry);
      entries[name] = entry;
    } catch {
      // 没有 index.ts 的目录不是 package entry
    }
  }

  return entries;
}

// Vite 的 lib 模式会把样式单独抽出为 lingting-react-ui.css，入口 JS 不会引用它，宿主按包名导入时
// 全部库内样式（.basic-layout、.sidebar-layout 等）都会丢失，而 package.json 的 exports 又未暴露该 CSS 子路径。
// 因此构建时给每个入口 chunk 前置静态 import，使宿主无需单独引入样式。
function injectLibCss(): Plugin {
  return {
    name: "lingting-react-ui:inject-lib-css",
    apply: "build",
    // 必须晚于 vite:css-post，否则样式产物尚未进入 bundle
    enforce: "post",
    generateBundle(_options, bundle) {
      const cssFileName = Object.keys(bundle).find((fileName) => fileName.endsWith(".css"));

      if (!cssFileName) {
        this.error("未找到样式产物，无法为入口注入 CSS 引用");
      }

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk" || !output.isEntry) {
          continue;
        }

        // @ts-ignore
        let relativePath = relative(dirname(output.fileName), cssFileName);
        const cssPath = relativePath.replaceAll("\\", "/");
        const importPath = cssPath.startsWith(".") ? cssPath : `./${cssPath}`;

        output.code = `import ${JSON.stringify(importPath)};\n${output.code}`;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectLibCss()],
  resolve: {
    alias: {
      "@lri": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: getLibraryEntries(),
      formats: ["es"],
    },
    rollupOptions: {
      external,
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  fmt: {
    ignorePatterns: [
      ".agents",
      "node_modules",
      "dist",
      "*.yaml",
      "src/components/region/*.json",
      "*.svg",
    ],
  },
});
