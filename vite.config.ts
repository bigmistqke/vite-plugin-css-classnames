import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import cssModuleClassnames from "./src"

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  plugins: [
    cssModuleClassnames(),
    dts({
      include: ["./src/index.ts", "./src/index.ts"], // Specify paths to include
      staticImport: true,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
      },
      name: "vite-plugin-css-classnames",
      fileName: (format) => `index.js`,
      formats: ["es"],
    },
    target: "node12",
    ssr: true,
  },
})
