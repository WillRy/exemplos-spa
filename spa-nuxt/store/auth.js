export const authStore = defineStore("authStore", {
  state: () => {
    return {
      usuario: null,
    };
  },
  getters: {
    auth() {
      return window.localStorage.getItem("token");
    },
  },
  actions: {
    async login(payload) {
      const ajax = fetchInternal();
      console.log("fetch", fetch);
      return ajax("/api/login", {
        body: payload,
        method: "post",
      });
    },
    async carregarUsuarioLogado() {
        // try {
        //     const {data, error} = await useNuxtApp().$useFetchApi('/usuarioo');
           
        //     if(error) {
        //         const router = useRouter();
        //         await router.push({
        //             path: '/logout'
        //         }).then(() => {
        //             useCustomToast({type: 'error', message: 'Erro ao carregar os dados'})
        //         })
        //     }

            
            
        //     this.usuario = data;
        // } catch(e) {
        //     console.log("==========================================================================", e)
        // }

        try {
            const ajax =  fetchApiProtected();

            const {data} = await ajax("/usuario")
    
            this.usuario = data;
        } catch(e) {

            const router = useRouter();
                await router.push({
                    path: '/logout'
                }).then(() => {
                    useCustomToast({type: 'error', message: 'Erro ao carregar os dados'})
                })
        }
    },
  },
});
