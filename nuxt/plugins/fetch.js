import { parseCookies } from "h3";

export default defineNuxtPlugin(() => {
  const CSRF_COOKIE = "CSRF-TOKEN";
  const token = useCookie("token");
  const headers = useRequestHeaders(["cookie"]);
  const baseurl = useRuntimeConfig().public.apiUrl;
  const nuxtApp = useNuxtApp();

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

  async function initCsrf() {
    const event = typeof useEvent === "function" ? useEvent() : null;
    let existingToken = event
      ? parseCookies(event)[CSRF_COOKIE]
      : nuxtApp.runWithContext(() => useCookie(CSRF_COOKIE).value);

    if (existingToken) return existingToken;

    await $fetch("/csrf", {
      baseURL: baseurl,
      credentials: "include",
    });

    return await nuxtApp.runWithContext(() => useCookie(CSRF_COOKIE).value);
  }

  const $fetchApi = $fetch.create({
    credentials: "include",
    baseURL: baseurl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    async onRequest({ request, options, error }) {
      const csrfToken = await initCsrf();

      options.headers["CSRF-TOKEN"] = csrfToken;

      if (token.value) {
        options.headers["Authorization"] = `Bearer ${token.value}`;
      }
    },
    async onResponse(ctx) {
      const refreshToken = await nuxtApp.runWithContext(
        () => useCookie("refresh_token").value
      );

      const shouldRefresh = !ctx.response.url.includes("/refresh") && !ctx.response.url.includes("/login");
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
                  useCookie("token").value = token;
                  useCookie("refresh_token").value = refresh_token;
                });

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestsQueue = [];

                // resolve(this)
              })
              .catch(async (ctx2) => {
                failedRequestsQueue.forEach((request) => {
                  const newData = {
                    ...ctx2.response.data,
                    message: "Sessão expirou",
                  }
                  request.onFailure(newData)
                });
                failedRequestsQueue = [];
                // reject(this)
                return await nuxtApp.runWithContext(() => navigateTo("/?logout=2"));
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
