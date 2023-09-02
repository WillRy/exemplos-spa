import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { createPinia } from "pinia";

import VueToast from "vue-toast-notification";
import VueTheMask from "vue-the-mask";

import { filters, EventBus, LaravelError, LaravelAlert, VerificaPermissao, toasts } from "./plugins";

import "./styles/app.scss";
import Loader from "./external/components/Loader";

import { directive } from "./external/directives/click-away";

import "nprogress/nprogress.css";

import { i18n } from "./lang";

import drag from "v-drag";
import { Link } from '@inertiajs/vue3'

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.vue");
        return pages[`./pages/${name}.vue`]();
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(createPinia())
            .use(plugin)
            .use(VueToast)
            .use(VueTheMask)
            .use(i18n)
            .use(drag)
            .directive("click-away", directive)
            .component("Loader", Loader)
            .component("Link", Link)
            .use(VerificaPermissao)
            .use(LaravelError)
            .use(LaravelAlert)
            .use(toasts)
            .use(filters)
            .use(EventBus)
            .mount(el);
    },
});
