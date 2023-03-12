
export const modalCriarContatoStore = defineStore('modalCriarContato', {
    state: () => {
        return {
            open: false,
            payload: {},
            reload: {}
        }
    },
    actions: {
        abrir(dados = {}) {
            this.open = true;
            this.payload = dados;
        },
        fechar() {
            this.open = false;
        },
        onReload(payload = {}) {
            this.reload = payload
        }
    },
})

export const modalEditarContatoStore = defineStore('modalEditarContato', {
    state: () => {
        return {
            open: false,
            payload: {},
            reload: {}
        }
    },
    actions: {
        abrir(dados = {}) {
            this.open = true;
            this.payload = dados;
        },
        fechar() {
            this.open = false;
        },
        onReload(payload = {}) {
            this.reload = payload
        }
    },
})

export const modalExcluirContatoStore = defineStore('modalExcluirContatoStore', {
    state: () => {
        return {
            open: false,
            payload: {},
            reload: {}
        }
    },
    actions: {
        abrir(dados = {}) {
            this.open = true;
            this.payload = dados;
        },
        fechar() {
            this.open = false;
        },
        onReload(payload = {}) {
            this.reload = payload
        }
    },
})

export const modalDetalhesContatoStore = defineStore('modalDetalhesContatoContato', {
    state: () => {
        return {
            open: false,
            payload: {},
            reload: {}
        }
    },
    actions: {
        abrir(dados = {}) {
            this.open = true;
            this.payload = dados;
        },
        fechar() {
            this.open = false;
        },
        onReload(payload = {}) {
            this.reload = payload
        }
    },
})
