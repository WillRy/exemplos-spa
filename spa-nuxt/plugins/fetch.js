

export default defineNuxtPlugin(async (nuxtApp) => {
  return {
    provide: {
      useFetchApi: async (url, params = {}) => {
        const router = useRouter();

        const onResponse = async ({ response }) => {
          if (params.onResponse) {
            await params.onResponse({ response });
          }

          if (response.status == 401) {
            await router.push({
              path: '/logout'
          }).then(() => {
              useCustomToast({type: 'error', message: 'Sua sessão expirou'})
          })
          }
        };

        const onResponseError = async ({ response }) => {
          if (params.onResponseError) {
            params.onResponseError({ response });
          }
        };

        const onRequestError = async ({ error }) => {
          if (params.onRequestError) {
            params.onRequestError({ error });
          }
        };

        const onRequest = async ({ options }) => {
          const cookie = useCookie("token");

          if (params.onRequest) {
            params.onRequest({ options });
          }

          options.headers = options.headers || {};

          if (cookie && cookie.value) {
            options.headers["Authorization"] = `Bearer ${cookie.value}`;
          }
        };

        const config = useRuntimeConfig();

        const opts = {
          key: url,
          baseURL: config.API_URL,
          headers: {
            Accept: "application/json",
          },
          ...params,
          onResponse,
          onResponseError,
          onRequestError,
          onRequest,
        };

        const { data, pending, error, execute } = await useFetch(url, opts);

        return {
          data: data.value,
          pending: pending.value,
          error: error.value,
          execute: execute,
        };
      },
    },
  };
});
