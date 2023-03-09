import useFetchApi from "~~/hooks/useFetchApi";


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
            const ajax = fetchInternal();
            console.log("fetch", fetch)
            return ajax('/api/login', {
                body: payload,
                method: 'post'
            })
        },
        async carregarUsuarioLogado() { 
            return useNuxtApp().$useFetchApi("/usuario").then(({data}) => {
                this.usuario = data;
                return r;
            })

        }
    }
})