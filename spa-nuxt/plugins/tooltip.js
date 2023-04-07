import pkg from 'floating-vue';
const { VTooltip } = pkg;


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tooltip', VTooltip);
});
