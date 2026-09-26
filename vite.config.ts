import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

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

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
