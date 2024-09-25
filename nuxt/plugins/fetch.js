import { parseCookies } from "h3";

export default defineNuxtPlugin(() => {
  const CSRF_COOKIE = "CSRF-TOKEN";
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();
  const headersCookie = useRequestHeaders(['cookie']);

  const randomInt = Math.floor(Math.random() * 1000);
  const newCookies = ref({
    teste: randomInt
  });



  let refreshingToken = false;
  let failedRequestsQueue = [];

  async function getCookie(nome) {
    await nuxtApp.runWithContext(() => refreshCookie(nome));
    // const event = typeof useEvent === "function" ? useEvent() : null;

    let existingToken = newCookies.value[nome] ?? await nuxtApp.runWithContext(() => useCookie(nome).value);
    
    return existingToken;
  }

  async function setCookie(nome, valor) {
    await nuxtApp.runWithContext(() => {
      newCookies.value[nome] = valor;
      return useCookie(nome).value = valor;
    });
  }

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

  async function initCsrf() {
    let existingToken = await getCookie(CSRF_COOKIE);

    if (existingToken) return existingToken;

    const response = await $fetch("/csrf", {
      baseURL: baseurl,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: frontUrl,
      },
    })

    await nuxtApp.runWithContext(() => {
      setCookie(CSRF_COOKIE, response.csrf);
    })

    return response.csrf;
  }


  const $fetchApi = $fetch.create({
    credentials: "include",
    baseURL: baseurl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: frontUrl,
      ...headersCookie
    },
    async onRequest({ request, options, error }) {

      try {
        const csrf = await initCsrf();
        
        const token = await getCookie('token');

        options.headers["CSRF-TOKEN"] = csrf;

        if(token) {
          options.headers["Authorization"] = `Bearer ${token}`;
        }


      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      const refreshToken = await getCookie("refresh_token");

      const shouldRefresh =
        !ctx.response.url.includes("/refresh") &&
        !ctx.response.url.includes("/login");
      if (ctx.response.status === 401 && shouldRefresh) {
        if (ctx.response.url.includes("/refresh")) {
          await nuxtApp.runWithContext(() => navigateTo("/?logout=1"));
        }

        if (!refreshingToken) {
          refreshingToken = true;
          new Promise((resolve, reject) => {
            nuxtApp
              .$fetchApi("/refresh", {
                onResponse(ctx) {},
                // ...buildContextRetry(ctx.options),
                method: "POST",
                credentials: "include",
                body: {
                  refresh_token: refreshToken,
                },
              })
              .then(async (ctx2) => {
                const token = ctx2.data.token;
                const refresh_token = ctx2.data.refresh_token;

                await nuxtApp.runWithContext(() => {
                  setCookie("token", token);
                  setCookie("refresh_token", refresh_token);
                });

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestsQueue = [];

                // resolve(this)
              })
              .catch(async () => {
                failedRequestsQueue.forEach((request) => {
                  request.onFailure(ctx);
                });
                failedRequestsQueue = [];
                // reject(this)
                return await nuxtApp.runWithContext(() =>
                  navigateTo("/?logout=2")
                );
              })
              .finally(() => {
                refreshingToken = false;
              });
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token) => {
              const originalConfig = buildContextRetry(ctx.options);

              const newConfig = {
                ...originalConfig,
                headers: {
                  ...(originalConfig.headers || {}),
                  Authorization: `Bearer ${token}`,
                },
              };

              resolve(
                $fetch(ctx.response.url, {
                  ...newConfig,
                  onResponse: (ctx3) => {
                    Object.assign(ctx, ctx3);
                  },
                })
              );
            },
            onFailure: (err) => {
              reject(err);
            },
          });
        });
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
