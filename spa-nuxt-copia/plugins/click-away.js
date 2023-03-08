import {directive} from '~/external/directives/click-away';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('click-away', directive)
  })