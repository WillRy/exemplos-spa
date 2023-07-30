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
    async carregarUsuarioLogado(makeRefreshToken = true) {
      try {

        if(makeRefreshToken) {
          const response = await endpoint.get("/usuario");
          this.usuario = response.data.data;
        } else {
          const response = await axios.get("/api/usuario");
          this.usuario = response.data.data;
        }


        return true;

      } catch(error) {
        await this.logout();
        return false;
      }


    },
    async logout() {
      try {

        endpoint.post("/logout");

        return true;

      } catch(error) {
        return true;
      }
    },
  },
});
