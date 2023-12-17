import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000"
      },
    },
  },
  plugins: [
    vue(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".vue",".ts"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      parse: {
        html5_comments: false,
      },
      compress: {
        drop_console: true,
        keep_fargs: false,
        keep_fnames: true,
      },
      format: {
        comments: false,
      },
    },
  },
});
