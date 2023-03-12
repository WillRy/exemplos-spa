export const fetchApiProtected = (params = {}) => {
  const onResponseError = async ({ response }) => {
    if (params.onResponseError) {
      params.onResponseError({ response });
    }

    if (response.status === 401) {
      
      const authCookie = useCookie('token')
      authCookie.value = null


      await navigateTo("/login");
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
    baseURL: config.public.apiUrl,
    ...params,
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
    baseURL: config.public.apiUrl,
    ...params,
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

export function fetchTeste() {
  const config = useRuntimeConfig();
  return $fetch.create({});
};
