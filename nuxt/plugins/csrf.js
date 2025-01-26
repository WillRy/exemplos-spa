import { appendResponseHeader } from "h3";

export default defineNuxtPlugin((nuxtApp) => {
  const CSRF_COOKIE = "XSRF-TOKEN";
  const CSRF_HEADER = "X-XSRF-TOKEN";

  const newCookies = ref({});

  const headersCookie = useRequestHeaders(["cookie"]);

  const csrf = useCookie(CSRF_COOKIE, {
    sameSite: 'Lax',
  });
  
  const session = useCookie('laravel_session', {
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

  function parseCookieHeader(cookieName, cookieHeader) {
    // Split the cookie header by commas to handle multiple cookies correctly
    const cookies = cookieHeader.split(/,\s*/);
    
    for (let cookie of cookies) {
      // Each cookie may have attributes (e.g., expires, path, etc.)
      // We only care about the name=value part
      let [nameValue] = cookie.split(';'); // Get the first part (name=value)
      
      let [name, value] = nameValue.trim().split('=');
      
      // If the cookie name matches the one we're looking for, return its value
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    
    // Return null if the cookie was not found
    return null;
  }
  async function getCsrf() {
    let existingToken = csrf.value

    if (existingToken) return existingToken;

    const frontUrl = await nuxtApp.runWithContext(
      () => useRuntimeConfig().public.frontUrl
    );
    const apiUrl = await nuxtApp.runWithContext(
      () => useRuntimeConfig().public.webUrl
    );

    const response = await $fetch("/sanctum/csrf-cookie", {
      baseURL: apiUrl,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: frontUrl,
        ...headersCookie,
      },
      async onResponse({ response }) {
        if (import.meta.server) {
          const combinedCookie = response.headers.get("set-cookie") ?? "";


          //recupera o csrf/sessão retornado pelo backend e armazena
          csrf.value = parseCookieHeader(CSRF_COOKIE, combinedCookie);
          session.value = parseCookieHeader('laravel_session', combinedCookie);

          // const cookies = combinedCookie.split(/, (?=\s*[a-zA-Z0-9_\-]+=)/);
          // //recupera todos os cookies retornados pelo backend(incluindo session)
          // await nuxtApp.runWithContext(() => {
          //   const event = useRequestEvent();

          //   cookies.forEach((c) => {
          //     appendResponseHeader(event, "set-cookie", c);
          //   });
          // });
        }

      },
    });
    

    if(response?.csrf) {
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
      session: toRef(session),
      CSRF_COOKIE: CSRF_COOKIE,
      CSRF_HEADER: CSRF_HEADER,
      cleanCsrf: cleanCsrf,
      deleteCookie: deleteCookie,
      getCookie: getCookie,
      setCookie: setCookie,
      getCsrf: getCsrf,
      parseCookieHeader
    },
  };
});
