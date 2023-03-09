import { authStore } from "../store/auth";
import { callWithNuxt } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {value: token} = useCookie('token');
    
   
    if(to.path.includes('/painel')) {
        

        if (token) {
            // try {
            //     const config = useRuntimeConfig();
            //     await $fetch('/usuario',{
            //         baseURL: config.API_URL,
            //         headers: {
            //           Accept: "application/json",
            //           Authorization: `Bearer ${token}`
            //         },
            //       });
            // } catch(e) {
            //     debugger
            //     console.log(e, "redirect /login:dados")
            
            //     const cookie = useCookie('token');
            //     cookie.value = null;
            //     return navigateTo('/login')
                
            // }
    
        } else {
            console.log("redirect /login")
            return navigateTo('/login')
        }


    
    }
    
});