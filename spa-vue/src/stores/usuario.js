import { defineStore } from "pinia";
import api, { apiWithoutLogoutRedirect } from "../services/api";

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

        const response = await apiWithoutLogoutRedirect.get("/usuario");
        this.usuario = response.data.data;


        return true;

      } catch(error) {
        this.usuario = null;
        return false;
      }


    },
    async logout() {
      try {

        apiWithoutLogoutRedirect.post("/logout");
        this.usuario = null;

        return true;

      } catch(error) {
        return true;
      }
    },
  },
});
