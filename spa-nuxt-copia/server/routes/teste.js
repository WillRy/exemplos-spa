export default defineEventHandler(async (event) => {
    setCookie(event, "token", "aaa");
    return sendRedirect(event, '/painel/dashboard', 302)  
})
