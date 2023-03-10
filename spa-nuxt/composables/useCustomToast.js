import { useToast } from "vue-toast-notification";

const useCustomToast = (params) => {
  const $toast = useToast();

  if ($toast && !process.server) {
    $toast.open(params);
  }
};

export default useCustomToast;
