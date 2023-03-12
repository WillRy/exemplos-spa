export default defineNuxtRouteMiddleware(async (to, from) => {
    const {value: token} = useCookie('token');

    if (token) {
        console.log("redirect /painel/dashboard")
        return navigateTo('/painel/dashboard')
    }

});