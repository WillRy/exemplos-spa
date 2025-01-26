export default defineNuxtPlugin(() => {
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();

  let refreshingToken = false;
  let failedRequestsQueue = [];

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

        if (import.meta.server) {
          //CSRF (SSR): valor para enviar via cookie, pois se for obtido dentro da mesma request não é possível ler o cookie atualizado
          let cookieString = await nuxtApp.runWithContext(() => useRequestHeaders(["cookie"]).cookie ?? '');
          if (!cookieString.includes(nuxtApp.$CSRF_COOKIE)) {
            cookieString = cookieString + `; ${nuxtApp.$CSRF_COOKIE}=${csrf}`;
          }


          // if(!appendCookie.includes('laravel_session')){
          //   appendCookie = appendCookie + `; ${'laravel_session'}=${nuxtApp.$session.value}`;
          // }

          buildHeader(headers, "Cookie", cookieString);


          // válido somente na camada SSR onde cookie é legível por ser HTTPOnly
          const token = nuxtApp.$token.value;
          if (token) {
            buildHeader(headers, "Authorization", `Bearer ${token}`);
          }
        }

        buildHeader(headers, nuxtApp.$CSRF_HEADER, csrf);
      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      const refreshToken = nuxtApp.$refresh_token.value;

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
              console.log('token', token);
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
    },
  };
});
