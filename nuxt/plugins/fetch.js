export default defineNuxtPlugin(() => {
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();
  const headersCookie = useRequestHeaders(["cookie"]);

  const token = useCookie("token");
  const refresh_token = useCookie("refresh_token");


  let refreshingToken = false;
  let failedRequestsQueue = [];

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
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: frontUrl,
      ...headersCookie,
    },
    async onRequest({ request, options, error }) {
      try {

        const token = await nuxtApp.$getCookie("token");

        options.headers[nuxtApp.$CSRF_HEADER] = await nuxtApp.$getCsrf();

        if (token) {
          options.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      const refreshToken = await nuxtApp.$getCookie("refresh_token");

      const shouldRefresh =
        !ctx.response.url.includes("/refresh") &&
        !ctx.response.url.includes("/login")
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

                token.value = newToken;
                refresh_token.value = newRefreshToken;

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
