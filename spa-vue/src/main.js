import { createApp } from "vue";
import { createPinia } from "pinia";

import VueToast from "vue-toast-notification";
import VueTheMask from "vue-the-mask";

import { filters, EventBus, LaravelError, ckeditorupload } from "./plugins";

import App from "./App.vue";
import router from "./router";

import "./styles/app.css";
import Loader from "./external/components/Loader";

import { directive } from "./external/directives/click-away";

import "nprogress/nprogress.css";

import { createHead } from "@vueuse/head";

import { i18n } from "./lang";




import drag from "v-drag"

// /* import the fontawesome core */
// import { library } from '@fortawesome/fontawesome-svg-core'
//
// /* import font awesome icon component */
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//
// /* import specific icons */
// import { faMagnifyingGlass, faPlus, faCheck} from '@fortawesome/free-solid-svg-icons'
//
// /* add icons to the library */
// library.add(faMagnifyingGlass)
// library.add(faPlus)
// library.add(faCheck)


export const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueToast);
app.use(LaravelError);
app.use(filters);
app.use(EventBus);
app.use(ckeditorupload);
app.use(VueTheMask);
app.use(i18n);
app.use(drag);
app.use(createHead());
// app.component('font-awesome-icon', FontAwesomeIcon)
app.directive("click-away", directive);
app.component("Loader", Loader);

app.mount("#app");
