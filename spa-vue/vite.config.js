import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
        output: {
            manualChunks: {
              vendor: ['vue-i18n','vue-the-mask','vue-toast-notification','@vueuse/head','nprogress'],
            },
        },
    },
},
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000"
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    extensions: [".js", ".json", ".vue",".ts"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
  },

});
