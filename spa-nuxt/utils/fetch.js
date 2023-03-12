

export const fetchApiProtected = (params = {}) => {
  const router = useRouter();

  const onResponse = async ({ response }) => {
    if (params.onResponse) {
      await params.onResponse({ response });
    }

    if (response.status == 401) {
      
      await router.push({
        path: "/logout",
      }).then(() => {
        useCustomToast({
          message: "Sua sessão expirou!",
          type: "error",
        });
      });
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

  // Doing something with nuxtApp
  const config = useRuntimeConfig();
  return $fetch.create({
    baseURL: config.API_URL,
    ...params,
    onResponse,
    onResponseError,
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
