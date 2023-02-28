import {createApp} from 'vue'
import {createPinia} from 'pinia'

import VueToast from 'vue-toast-notification';
import VueTheMask from 'vue-the-mask'


import {filters, EventBus, LaravelError, ckeditorupload} from './plugins';

import App from './App.vue'
import router from './router'

import './styles/app.css';
import {DatePicker} from "v-calendar";
import Loader from "./external/components/Loader";

import {directive} from './directives/click-away'

export const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueToast)
app.use(LaravelError)
app.use(filters)
app.use(EventBus)
app.use(ckeditorupload)
app.use(VueTheMask)
app.directive('click-away', directive)
app.component('DatePicker', DatePicker)
app.component('Loader', Loader)

app.mount('#app')
