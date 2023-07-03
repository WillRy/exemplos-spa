import { defineStore } from "pinia";
import api, { endpoint } from "../services/api";

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
      // const response = await api.get("/usuarioo");
      // this.usuario = response.data.data;
      // return this.usuario;
      try {

        const response = await endpoint.get("/usuario");
        this.usuario = response.data.data;

        return true;

      } catch(error) {
        await this.logout();
        return false;
      }


    },
    async logout() {
      return endpoint.post("/logout");
    },
  },
});
