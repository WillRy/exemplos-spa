export default defineEventHandler(async (event) => {
    console.log("logout")
    deleteCookie(event, 'token')

    return sendRedirect(event, '/login', 302)  
})