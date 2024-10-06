import { appendResponseHeader } from "h3";

export default defineNuxtPlugin((nuxtApp) => {
  const CSRF_COOKIE = "CSRF-TOKEN";
  const CSRF_HEADER = "CSRF-TOKEN";

  const newCookies = ref({});

  const headersCookie = useRequestHeaders(["cookie"]);

  const csrf = useCookie(CSRF_COOKIE, {
    sameSite: 'Lax',
  });

  const token = useCookie('token', {
    sameSite: 'Lax',
    httpOnly: true,
  });
  
  const refresh_token = useCookie('refresh_token', {
    sameSite: 'Lax',
    httpOnly: true,
  });

  function setToken(tk) {
    token.value = tk;
  }

  function setRefreshToken(tk) {
    refresh_token.value = tk;
  }

  async function cleanCsrf() {
    newCookies.value = {};
    csrf.value = null;
  }

  async function deleteCookie(name) {
    newCookies.value[name] = null;
    await nuxtApp.runWithContext(() => {
      const cookie = useCookie(name);
      cookie.value = null;

      return true;
    });
  }

  async function getCookie(nome) {
    let existingToken = nuxtApp.runWithContext(() => useCookie(nome).value) ?? newCookies.value[nome];

    return existingToken;
  }

  async function setCookie(nome, valor) {
    newCookies.value[nome] = valor;
    await nuxtApp.runWithContext(() => {
      const cookie = useCookie(nome);
      cookie.value = valor;
      refreshCookie(nome);
    });
  }

  async function getCsrf() {
    let existingToken = csrf.value

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
        // if (process.server) {
        //   const combinedCookie = response.headers.get("set-cookie") ?? "";
        //   const cookies = combinedCookie.split(/,(?=\s*[a-zA-Z0-9_\-]+=)/);

        //   await nuxtApp.runWithContext(() => {
        //     const event = useRequestEvent();

        //     cookies.forEach((c) => {
        //       appendResponseHeader(event, "set-cookie", c);
        //     });
        //   });
        // }
      },
    });
    

    if(response.csrf) {
      csrf.value = response.csrf;
    }


    return csrf.value
  }
  

  return {
    provide: {
      setToken,
      setRefreshToken,
      token: toRef(token),
      refresh_token: toRef(refresh_token),
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
