import { directive } from "~/directives/click-away.js";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("click-away", directive);
});
