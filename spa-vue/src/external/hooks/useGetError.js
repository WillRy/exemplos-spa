export function useGetError() {
  function getError(e) {
    let response = e.response;
    if (response && response.status === 422 && response.data.errors) {
      let erro = Object.keys(response.data.errors)[0];
      return response.data.errors[erro][0];
    } else if (response && response.status === 422 && response.data.message) {
      return response.data.message;
    } else if (response && response.status === 401 && response.data.message) {
      return response.data.message;
    } else if (response && response.data.message) {
      return response.data.message;
    } else if (!response && e.message) {
      return e.message;
    } else {
      return message;
    }
  }

  return {
    getError,
  };
}
