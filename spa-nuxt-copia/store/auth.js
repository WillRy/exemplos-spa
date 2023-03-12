

export const authStore = defineStore('authStore', {
    store: () => ({
        usuario: null
    }),
    getters: {
        auth() {
            return window.localStorage.getItem('token');
        }
    },
    actions: {
        async login(payload) {
            const fetch = fetchInternal();
            console.log("fetch", fetch)
            return fetch('/api/login', {
                body: payload,
                method: 'post'
            })
        },
        async carregarUsuarioLogado() {
            const fetch = fetchApiProtected();
            return fetch('/usuario', {
                method: 'get'
            })
            
        }
    }
})