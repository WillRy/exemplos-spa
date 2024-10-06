export default defineNuxtPlugin(() => {
  const baseurl = useRuntimeConfig().public.apiUrl;
  const frontUrl = useRuntimeConfig().public.frontUrl;
  const nuxtApp = useNuxtApp();
  const headersCookie = useRequestHeaders(["cookie"]);

  let refreshingToken = false;
  let failedRequestsQueue = [];

  const buildHeader = async (headers, name, value) => {
    
    if(!value) return;

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
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: frontUrl,
      ...headersCookie,
    },
    async onRequest({ request, options, error }) {
      try {
        const headers = (options.headers ||= {});

        const token = await nuxtApp.$getCookie("token");

        const csrf = await nuxtApp.$getCsrf();

        if(token) {
          buildHeader(headers, "Authorization", `Bearer ${token}`);
        }
        
        buildHeader(headers, nuxtApp.$CSRF_HEADER, csrf);

      } catch (e) {
        console.log(e);
      }
    },
    async onResponse(ctx) {
      const refreshToken = await nuxtApp.$getCookie("refresh_token");

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

                await nuxtApp.$setCookie("token", newToken);
                await nuxtApp.$setCookie("refresh_token", newRefreshToken);

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
    },
  };
});
