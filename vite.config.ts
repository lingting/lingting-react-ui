import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite-plus";

import { peerDependencies } from "./package.json";

// peerDependencies 是宿主去重列表的唯一来源，构建时也以它为准做外部化，
// 否则第三方包（含 antd 深层子路径）会被打进产物，生成 dist/node_modules。
const externalPackages = Object.keys(peerDependencies);

function isExternal(id: string) {
  return externalPackages.some((name) => id === name || id.startsWith(`${name}/`));
}

// 每个含 index.ts 的目录都是一个 package entry：顶层目录产出 dist/<name>.js，
// 嵌套目录产出 dist/<name>/<child>.js，与 exports 中的目录子路径一一对应。
function collectEntries(src: string, directory: string, entries: Record<string, string>) {
  for (const name of readdirSync(directory)) {
    const child = resolve(directory, name);

    if (!statSync(child).isDirectory()) {
      continue;
    }

    const entry = join(child, "index.ts");

    try {
      statSync(entry);
      entries[relative(src, child).replaceAll("\\", "/")] = entry;
    } catch {
      // 没有 index.ts 的目录不是 package entry
    }

    collectEntries(src, child, entries);
  }
}

function getLibraryEntries() {
  const src = resolve(import.meta.dirname, "src");
  const entries: Record<string, string> = { index: resolve(src, "index.ts") };

  collectEntries(src, src, entries);

  return entries;
}

// rolldown 的 [name] 占位符会同时去掉扩展名与 query，导致同名的 .tsx 与 .css 模块争抢同一个文件名，
// 组件会被改名成 xxx2.js。这里自行计算：去掉 query；仅 .css 保留扩展名（该 chunk 随后会被 Vite 删除），
// 其余模块保持去扩展名的行为。
function resolveChunkFileName(name: string) {
  const withoutQuery = name.split("?")[0];

  return `${withoutQuery.endsWith(".css") ? withoutQuery : withoutQuery.replace(/\.[^./]+$/, "")}.js`;
}

// 全局样式（src/index.css 的 Tailwind preflight 与基础布局）会被每个 package entry 引用，
// 维持「导入任一入口即可用」的既有行为。
const GLOBAL_CSS_FILE_NAME = "index.css";

function toRelativeImport(fromFileName: string, toFileName: string) {
  const relativePath = relative(dirname(fromFileName), toFileName).replaceAll("\\", "/");

  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

const libraryEntries = getLibraryEntries();
const entryFileNames = new Set(Object.keys(libraryEntries).map((name) => `${name}.js`));
// lib 模式不会把样式产物的引用写回 JS，样式会整包丢失（宿主按包名导入后 .basic-layout 等类名全无）。
// 这里统一回填：每个模块引用自身样式，每个 package entry 再额外引用全局样式。
function injectCssImports(): Plugin {
  return {
    name: "lingting-react-ui:inject-css-imports",
    apply: "build",
    // 必须晚于 vite:css-post，否则样式产物与 chunk 的样式元数据尚未就绪
    enforce: "post",
    generateBundle(_options, bundle) {
      const fileNames = new Set(Object.keys(bundle));

      if (!fileNames.has(GLOBAL_CSS_FILE_NAME)) {
        this.error(`未找到全局样式产物 dist/${GLOBAL_CSS_FILE_NAME}，无法为入口注入样式引用`);
      }

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") {
          continue;
        }

        const cssFileNames = new Set(
          entryFileNames.has(output.fileName) ? [GLOBAL_CSS_FILE_NAME] : [],
        );

        for (const cssFileName of output.viteMetadata?.importedCss ?? []) {
          cssFileNames.add(cssFileName);
        }

        if (cssFileNames.size === 0) {
          continue;
        }

        const imports = [...cssFileNames]
          .map(
            (cssFileName) =>
              `import ${JSON.stringify(toRelativeImport(output.fileName, cssFileName))};`,
          )
          .join("\n");

        output.code = `${imports}\n${output.code}`;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectCssImports()],
  resolve: {
    alias: {
      "@lri": resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: libraryEntries,
      formats: ["es"],
    },
    // lib 模式默认关闭 CSS 拆分，这里必须显式打开，否则样式仍会合并成单个文件
    cssCodeSplit: true,
    rollupOptions: {
      external: isExternal,
      output: {
        // 保留 src 目录结构，使每个模块产出独立文件，宿主可按组件粒度导入
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: (info) => resolveChunkFileName(info.name),
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
