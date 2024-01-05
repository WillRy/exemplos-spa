import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "vue-i18n",
            "vue-the-mask",
            "vue-toast-notification",
            "@vueuse/head",
            "nprogress",
          ],
        },
      },
    },
  },
  plugins: [vue()],
  resolve: {
    extensions: [".js", ".json", ".vue", ".ts"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
