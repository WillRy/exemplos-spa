import {defineStore} from 'pinia'
import api from "../services/api";

export const usuarioStore = defineStore('usuarioStore', {
    state: () => {
        return {
            usuario: null
        }
    },
    actions: {
        carregarUsuarioLogado() {
            return api.get('/usuario').then((r) => {
                this.usuario = r.data.data;
            });
        }
    },
})
