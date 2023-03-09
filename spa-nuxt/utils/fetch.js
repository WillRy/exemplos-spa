export const fetchApiProtected = (params = {}) => {
  const onResponse = async ({ response }) => {
    if (params.onResponseError) {
      params.onResponseError({ response });
    }

    if (response.status === 401) {
      
      // const authCookie = useCookie('token')
      // authCookie.value = null

      console.log("401=================================================")

      setTimeout(async () => {
        await navigateTo("/login");
      }, 300)
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

  // Doing something with nuxtApp
  const config = useRuntimeConfig();
  return $fetch.create({
    baseURL: config.API_URL,
    onResponse,
    onRequestError,
    onRequest,
    headers: {
      Accept: "application/json",
    },
  });
};

export const fetchApiPublic = (params = {}) => {
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

    
  };

  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.API_URL,
    onResponseError,
    onRequestError,
    onRequest,
    headers: {
      Accept: "application/json",
    },
  });
};

export const fetchInternal = () => {
  const config = useRuntimeConfig();
  return $fetch.create({});
};
