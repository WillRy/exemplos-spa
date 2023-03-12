// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL
        }
    },
    components: [
        {
            path: '~/external',
            pathPrefix: false,
        },
        {
            path: '~/components',
            pathPrefix: false,
        },
        {
            path: '~/components/dashboard',
            pathPrefix: false,
        },
        {
            path: '~/components/pages',
            pathPrefix: false,
        }
    ],
    css: ["~/external/styles/style.css", "~/assets/app.css"],
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            title: "My App",
            htmlAttrs: {
                lang: "pt-br",
            },
            meta: [
                // <meta name="description" content="My amazing site">
                {name: "description", content: "Minha descrição", key: "description"},
            ],
        },
    },
    modules: ["@pinia/nuxt"],
    pinia: {
        autoImports: [
            // automatically imports `defineStore`
            "defineStore", // import { defineStore } from 'pinia'
            ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
        ],
    },
});
