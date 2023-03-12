const useFetchApi = async (url, params = {}) => {
  const onResponseError = async ({ response }) => {
    if (params.onResponseError) {
      params.onResponseError({ response });
    }
    if (response.status === 401) {
      useCookie("token", {
        expires: new Date().setDate(new Date().getDate() - 1),
      });
      await navigateTo("/login");
    }
  };

  const onRequestError = async ({ error }) => {
    if (params.onRequestError) {
      params.onRequestError({ error });
    }
  };

  const onRequest = async ({ options }) => {
    if (params.onRequest) {
      params.onRequest({ options });
    }

    options.headers = options.headers || {};

    if (cookie && cookie.value) {
      options.headers["Authorization"] = `Bearer ${cookie.value}`;
    }
  };

  const cookie = useCookie("token");

  const config = useRuntimeConfig();

  console.log(config);

  const opts = {
    key: url,
    baseURL: config.public.apiUrl,
    headers: {
      Accept: "application/json",
    },
    ...params,
    onResponseError,
    onRequestError,
    onRequest,
  };

  const { data, pending, error, execute } = await useFetch(url, opts);

  return {
    data,
    pending,
    error,
    execute,
  };
};

export default useFetchApi;
