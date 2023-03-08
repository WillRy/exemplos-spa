export default defineNuxtRouteMiddleware(async (to, from) => {

    
    if(to.path.includes('/painel')) {
        const {value: token} = useCookie('token');
    
        if (!token) {
            console.log("redirect /login")
            return navigateTo('/login')
        }
    }
    
});