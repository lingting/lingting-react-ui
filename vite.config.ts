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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lri": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      fileName: "lingting-react-ui",
      formats: ["es"],
      name: "LingtingReactUi",
    },
    rollupOptions: { external },
  },
  fmt: {
    ignorePatterns: [".agents", "node_modules", "dist", "*.yaml", "src/components/region/*.json", "*.svg"],
  },
});
