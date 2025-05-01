import { appendResponseHeader } from "h3";

export default defineNuxtPlugin(() => {
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();

  const CSRF_COOKIE = "CSRF-TOKEN";
  const CSRF_HEADER = "CSRF-TOKEN";

  let refreshingToken = false;
  let failedRequestsQueue = [];

  let token = ref(null);
  let refresh_token = ref(null);
  let csrfCookie = useCookie(CSRF_COOKIE);
  let csrf = ref(null);

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

  async function cleanAllCookies() {
    await nuxtApp.runWithContext(() => {
      const cookie = useCookie(CSRF_COOKIE);
      cookie.value = null;

      const tokenCookie = useCookie("token");
      tokenCookie.value = null;

      const refreshTokenCookie = useCookie("refresh_token");
      refreshTokenCookie.value = null;
    });
  }

  async function getCsrf() {
    let existingToken = csrfCookie.value;

    if (existingToken) return existingToken;

    await $fetch("/csrf", {
      baseURL: baseurl,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: frontUrl,
        // ...useRequestHeaders(["cookie"]),
      },
      async onResponse({ response }) {
        if (import.meta.server) {
          const combinedCookie = response.headers.get("set-cookie") ?? "";

          const cookies = combinedCookie.split(/, (?=\s*[a-zA-Z0-9_\-]+=)/);
          await nuxtApp.runWithContext(() => {
            const event = useRequestEvent();

            cookies.forEach((c) => {
              try {
                appendResponseHeader(event, "set-cookie", c);

                const cookieName = c.split("=")[0];
                const cookieValue = c.split("=")[1]?.split(";")[0];
                const cookieExpires = c.split("expires=")[1]?.split(";")[0];

                //tratar cookies que importam
                if (cookieName === CSRF_COOKIE) {
                  csrfCookie = useCookie(CSRF_COOKIE, {
                    expires: new Date(cookieExpires),
                  });
                  csrfCookie.value = cookieValue;

                  csrf.value = cookieValue;
                }
              } catch (error) {
                console.log("error", error);
              }
            });
          });
        }
      },
    });

    return csrfCookie.value;
  }

  const $fetchApi = $fetch.create({
    credentials: "include",
    baseURL: baseurl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: frontUrl,
    },
    async onRequest({ request, options, error }) {
      try {
        const headers = (options.headers ||= {});

        //CSRF: valor para enviar via HEADER
        const csrf = await nuxtApp.$getCsrf();

        //CSRF: valor para enviar via cookie (somente para SSR), pois dentro da mesma request não é possível ler o cookie atualizado
        if (import.meta.server) {
          let appendCookie = headersCookie["cookie"] ?? "";
          if (!appendCookie.includes(CSRF_COOKIE)) {
            appendCookie = appendCookie + `; ${CSRF_COOKIE}=${csrf}`;
          }

          // if(!appendCookie.includes('laravel_session')){
          //   appendCookie = appendCookie + `; ${'laravel_session'}=${nuxtApp.$session.value}`;
          // }

          buildHeader(headers, "Cookie", appendCookie);
        }
        // válido somente na camada SSR onde cookie é legível por ser HTTPOnly
        if (token.value) {
          buildHeader(headers, "Authorization", `Bearer ${token.value}`);
        }

        buildHeader(headers, CSRF_HEADER, csrf);
      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      const refreshToken = refresh_token.value;

      const shouldRefresh =
        !ctx.response.url.includes("/refresh") &&
        !ctx.response.url.includes("/login");
      !ctx.response.url.includes("/csrf");
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
                const newToken = ctx2.data.token;
                const newRefreshToken = ctx2.data.refresh_token;

                if (import.meta.server) {
                  nuxtApp.$setToken(newToken);
                  nuxtApp.$setRefreshToken(newRefreshToken);
                }

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(newToken)
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
                  // Authorization: `Bearer ${token}`,
                },
              };

              resolve(
                $fetchApi(ctx.response.url, {
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
      getCsrf: getCsrf,
      cleanAllCookies: cleanAllCookies,
    },
  };
});
