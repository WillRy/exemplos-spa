export default defineEventHandler(async (event) => {
    setCookie(event, 'token', null, {
        expires: -1
    })

    return sendRedirect(event, '/login', 302)  
})