import { appendResponseHeader } from "h3";

export default defineNuxtPlugin((nuxtApp) => {
  const CSRF_COOKIE = "CSRF-TOKEN";
  const CSRF_HEADER = "CSRF-TOKEN";

  const newCookies = ref({});

  const headersCookie = useRequestHeaders(["cookie"]);

  const csrf = useCookie(CSRF_COOKIE);

  async function cleanCsrf() {
    newCookies.value = {};
    csrf.value = null;
  }

  async function deleteCookie(name) {
    // newCookies.value[name] = null;
    await nuxtApp.runWithContext(() => {
      const cookie = useCookie(name);
      cookie.value = null;

      return true;
    });
  }

  async function getCookie(nome) {
    let existingToken = newCookies.value[nome] ?? nuxtApp.runWithContext(() => useCookie(nome).value);

    return existingToken;
  }

  async function setCookie(nome, valor) {
    newCookies.value[nome] = valor;
    await nuxtApp.runWithContext(() => {
      const cookie = useCookie(nome);
      cookie.value = valor;
    });
  }

  async function getCsrf() {
    let existingToken = await getCookie(CSRF_COOKIE);

    if (existingToken) return existingToken;

    const frontUrl = await nuxtApp.runWithContext(
      () => useRuntimeConfig().public.frontUrl
    );
    const apiUrl = await nuxtApp.runWithContext(
      () => useRuntimeConfig().public.apiUrl
    );

    const response = await $fetch("/csrf", {
      baseURL: apiUrl,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: frontUrl,
        ...headersCookie,
      },
      async onResponse({ response }) {
        if (process.server) {
          const combinedCookie = response.headers.get("set-cookie") ?? "";
          const cookies = combinedCookie.split(/,(?=\s*[a-zA-Z0-9_\-]+=)/);

          await nuxtApp.runWithContext(() => {
            const event = useRequestEvent();

            cookies.forEach((c) => {
              appendResponseHeader(event, "set-cookie", c);
            });
          });
        }
      },
    });
    

    csrf.value = response.csrf;

    return csrf.value
  }

  return {
    provide: {
      CSRF_COOKIE: CSRF_COOKIE,
      CSRF_HEADER: CSRF_HEADER,
      cleanCsrf: cleanCsrf,
      deleteCookie: deleteCookie,
      getCookie: getCookie,
      setCookie: setCookie,
      getCsrf: getCsrf,
    },
  };
});
