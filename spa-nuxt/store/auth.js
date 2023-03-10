export const authStore = defineStore('authStore', {
    state: () => {
        return {
            usuario: null
        }
    },
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
            try {
                const ajax = fetchApiProtected();

                const {data} = await ajax("/usuario");
                this.usuario = data;
            } catch(e) {
                console.log('===========================',e)
                
            }
            

        }
    }
})