// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    defaults: {
      prefetch: false
    }
  },
  runtimeConfig: {
    public: {
      apiUrl: '',
      frontUrl: '',
      webUrl: '',
    }
  },
  css: [
    "~/assets/style.scss",
  ],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // routeRules: {
  //   "/backend/**": {
  //     proxy: "http://localhost:8080/api/**",
  //   },
  // },

  // vite: {
  //   server: {
  //     proxy: {
  //       "/backend/": {
  //         target: "http://localhost:8000/api/",
  //         rewrite: (path) => path.replace(/^\/backend/, ""),
  //       },
  //       "/sanctum/csrf-cookie": {
  //         target: "http://localhost:8000/sanctum/csrf-cookie",
  //         changeOrigin: true,
  //       },
  //     },
  //   },
  // },

  modules: ["@pinia/nuxt", "floating-vue/nuxt"],
});