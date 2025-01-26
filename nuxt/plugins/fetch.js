export default defineNuxtPlugin(() => {
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();


  const buildHeader = async (headers, name, value) => {
    if (!value) return;

    if (Array.isArray(headers)) {
      headers.push([name, value]);
    } else if (headers instanceof Headers) {
      headers.append(name, value);
    } else {
      headers[name] = value;
    }

    return headers;
  };

  const buildContextRetry = (options) => {
    return {
      baseURL: options.baseURL,
      body: options.body,
      headers: options.headers,
      method: options.method,
      params: options.params,
      query: options.query,
      responseType: options.responseType,
      ignoreResponseError: options.ignoreResponseError,
      parseResponse: options.parseResponse,
      duplex: options.duplex,
      timeout: options.timeout,
    };
  };

  const $fetchApi = $fetch.create({
    credentials: "include",
    baseURL: baseurl,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Referer": frontUrl,
    },
    async onRequest({ request, options, error }) {
      try {
        const headers = (options.headers ||= {});

        //CSRF: valor para enviar via HEADER
        const csrf = await nuxtApp.$getCsrf();
        buildHeader(headers, nuxtApp.$CSRF_HEADER, csrf);

        if (import.meta.server) {
          //CSRF (SSR): valor para enviar via cookie, pois se for obtido dentro da mesma request não é possível ler o cookie atualizado
          let cookieString = await nuxtApp.runWithContext(() => useRequestHeaders(["cookie"]).cookie ?? '');
          if (!cookieString.includes(nuxtApp.$CSRF_COOKIE)) {
            cookieString = cookieString + `; ${nuxtApp.$CSRF_COOKIE}=${csrf}`;
          }

          if(!cookieString.includes('laravel_session')){
            cookieString = cookieString + `; laravel_session=${nuxtApp.$session.value}`;
          }

          buildHeader(headers, "Cookie", cookieString);


          // válido somente na camada SSR onde cookie é legível por ser HTTPOnly
          const token = nuxtApp.$token.value;
          if (token) {
            buildHeader(headers, "Authorization", `Bearer ${token}`);
          }
        }


      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      if (ctx.response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/?logout=1"));
      }
    },
  });

  // Expose to useNuxtApp().$fetchApi
  return {
    provide: {
      fetchApi: $fetchApi,
    },
  };
});
