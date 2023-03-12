import {useToast as useToastLib} from 'vue-toast-notification';

const useToast = (params) => {

    const $toast = useToastLib();


    if ($toast && !process.server) {
        $toast.open(params)
    }

}

export default useToast;