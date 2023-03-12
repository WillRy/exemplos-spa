import { defineStore } from "pinia";
import api from "../services/api";

export const usuarioStore = defineStore("usuarioStore", {
  state: () => {
    return {
      usuario: null,
      permissoes: []
    };
  },
  getters: {
    temPermissao: (state) => {
      return (permissao) => state.permissoes.includes(permissao)
    },
  },
  actions: {
    async carregarUsuarioLogado() {
        const response = await api.get("/usuario");
        this.usuario = response.data.data;
        return this.usuario;
    },
  },
});
