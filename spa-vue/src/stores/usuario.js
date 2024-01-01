import { defineStore } from "pinia";
import api from "../services/api";

export const usuarioStore = defineStore("usuarioStore", {
  state: () => {
    return {
      usuario: null,
      permissoes: [],
    };
  },
  getters: {
    temPermissao: (state) => {
      return (permissao) => state.permissoes.includes(permissao);
    },
  },
  actions: {
    async carregarUsuarioLogado() {
      try {
        const response = await api.get("/usuario");
        this.usuario = response.data.data;

        return true;
      } catch (error) {
        this.usuario = null;
        return false;
      }
    },
    async logout() {
      try {
        api.post("/logout");
        this.usuario = null;

        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refresh_token");

        return true;
      } catch (error) {
        return true;
      }
    },
  },
});
