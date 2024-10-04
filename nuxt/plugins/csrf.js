export default defineNuxtPlugin((nuxtApp) => {
    const newCookies = ref({});
    
    const csrf = useCookie("CSRF-TOKEN");

    async function getCookie(nome) {
        let existingToken = newCookies.value[nome] ?? nuxtApp.runWithContext(() => useCookie(nome).value);
    
        return existingToken;
      }
    
      async function setCookie(nome, valor) {
        newCookies.value[nome] = valor;
        await nuxtApp.runWithContext(() => useCookie(nome, valor));
      }

      async function getCsrf(refetch = false) {
        let existingToken = await getCookie("CSRF-TOKEN");

        if(existingToken && !refetch) return existingToken;


        const baseurl = await nuxtApp.runWithContext(() => useRuntimeConfig().public.apiUrl);

        const response = await $fetch("/csrf", {
            baseURL: baseurl
        })

        csrf.value = response.csrf;
    
        return  csrf.value;
      }


    return {
        provide: {
          getCookie: getCookie,
          setCookie: setCookie,
          getCsrf: getCsrf,
        },
      };
  });
  