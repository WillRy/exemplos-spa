import { defineStore } from "pinia";


export const modalCriarOrganizacaoStore = defineStore("modalCriarOrganizacao", {
  state: () => {
    return {
      open: false,
      payload: {},
      reload: {},
    };
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
      this.reload = payload;
    },
  },
});

export const modalEditarOrganizacaoStore = defineStore(
  "modalEditarOrganizacao",
  {
    state: () => {
      return {
        open: false,
        payload: {},
        reload: {},
      };
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
        this.reload = payload;
      },
    },
  }
);

export const modalExcluirOrganizacaoStore = defineStore(
  "modalExcluirOrganizacaoStore",
  {
    state: () => {
      return {
        open: false,
        payload: {},
        reload: {},
      };
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
        this.reload = payload;
      },
    },
  }
);

export const modalDetalhesOrganizacaoStore = defineStore(
  "modalDetalhesOrganizacaoOrganizacao",
  {
    state: () => {
      return {
        open: false,
        payload: {},
        reload: {},
      };
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
        this.reload = payload;
      },
    },
  }
);
