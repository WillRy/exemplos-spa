import { createApp } from "vue";
import { createPinia } from "pinia";

import VueToast from "vue-toast-notification";
import VueTheMask from "vue-the-mask";

import { filters, EventBus, LaravelError, ajaxFormError } from "./plugins";

import App from "./App.vue";
import router from "./router";

import "./styles/app.scss";
import Loader from "./external/components/Loader";

import { directive } from "./external/directives/click-away";

import "nprogress/nprogress.css";

import { createHead } from "@vueuse/head";

import { i18n } from "./lang";




import drag from "v-drag"


export const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueToast);
app.use(LaravelError);
app.use(filters);
app.use(EventBus);
app.use(VueTheMask);
app.use(ajaxFormError);
app.use(i18n);
app.use(drag);
app.use(createHead());
app.directive("click-away", directive);
app.component("Loader", Loader);

app.mount("#app");
