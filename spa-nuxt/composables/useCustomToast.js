import * as pkg from "vue-toast-notification";
const {useToast} = pkg

const useCustomToast = (params) => {
  const $toast = useToast();

  if ($toast && !process.server) {
    $toast.open(params);
  }
};

export default useCustomToast;
