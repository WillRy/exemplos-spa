import * as pkg from "vue-toast-notification";
const {useToast} = pkg

const useMessageApi = (response, message = null) => {
  const $toast = useToast();


  if ($toast && !process.server) {
    if (response && response?.statusCode === 422 && response?.data?.errors) {
      let erro = Object.keys(response.data.errors)[0];
      $toast.open({
        message: response.data.errors[erro][0],
        type: "error",
      });
    } else if (response && response?.status === 401 && response?.data?.message) {
      $toast.open({
        message: response.data.message,
        type: "error",
      });
    } else if (response && response?.data?.message) {
      $toast.open({
        message: response.data.message,
        type: "error",
      });
    } else if(response?.message) {
      $toast.open({
        message: response.message,
        type: "error",
      });
    } else {
      $toast.open({
        message: message,
        type: "error",
      });
    }
  }
};

export default useMessageApi;