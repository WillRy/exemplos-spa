import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import { visualizer } from "rollup-plugin-visualizer";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        visualizer({
            emitFile: true,
            filename: "stats.html",
        }),
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    build: {
        minify: 'terser',
        terserOptions: {
            parse: {
                html5_comments: false,
            },
            compress: {
              drop_console: true,
              keep_fargs: false,
              keep_fnames: true
            },
            format: {
                comments: false
            }
          },
    }
})
