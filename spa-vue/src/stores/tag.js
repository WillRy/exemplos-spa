import {defineStore} from "pinia";

export const modalCriarTagStore = defineStore('modalCriarTag', {
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

export const modalEditarTagStore = defineStore('modalEditarTag', {
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

export const modalExcluirTagStore = defineStore('modalExcluirTagStore', {
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

export const modalDetalhesTagStore = defineStore('modalDetalhesTagTag', {
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
