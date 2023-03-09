const useFetchApi = async (url, params = {}) => {
  
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


  const opts = {
    key: url,
    baseURL: config.API_URL,
    headers: {
      Accept: "application/json",
    },
    ...params,
    onResponseError,
    onRequestError,
    onRequest,
  };

  const { data, pending, error, execute } = await useFetch(url, opts);

  if(error.value.status === 401) {
    console.log("====================================================================")

    await navigateTo("/login");
  }

  return {
    data,
    pending,
    error,
    execute,
  };
};

export default useFetchApi;
