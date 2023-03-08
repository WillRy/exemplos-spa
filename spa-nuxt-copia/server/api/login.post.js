import useFetchPublic from "~/hooks/useFetchPublic";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const url = `${process.env.API_URL}/login`;
    const response = await $fetch(url, {
      method: "post",
      body: body,
      parseResponse: false,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.success) {
      setResponseStatus(event, error.statusCode);
      return {
        ...response,
      };
    }

    // Increase counter cookie by 1
    setCookie(event, "token", response.data.token);

    return {
      ...response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.data ? error.data.message : error.message,
      errors: null,
      error_code: null,
      data: {},
    };
  }
});
