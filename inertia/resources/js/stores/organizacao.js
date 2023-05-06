import { defineStore } from "pinia";
import api from "../services/api";

export const organizacaoStore = defineStore("organizacao", {
  state: () => {
    return {
      organizacoes: null,
      pesquisa: null,
      tag_id: null,
      sortOrder: 'desc',
      sortName: 'id',
      page: 1,
      qtdOrganizacoes: 0,
      loading: false
    };
  },
  actions: {
    carregarOrganizacoes() {

      this.loading = true;

      const id_tags = this.tag_id
        ? this.tag_id.map((tag) => tag.id)
        : [];

      api
        .get("/organizacao", {
          params: {
            ...(this.pesquisa ? { pesquisa: this.pesquisa } : {}),
            ...(id_tags.length ? { id_tags: id_tags } : {}),
            ...(this.page ? { page: this.page } : {}),
            sortOrder: this.sortOrder,
            sortName: this.sortName,
          },
        })
        .then((r) => {
          this.organizacoes = r.data.data;
        }).finally(() => {
          this.loading = false;
        });
    },
    buscarQuantidadeOrganizacoes() {
      api.get('/organizacao').then((r) => {
        this.qtdOrganizacoes = r.data.data.total;
      })
    }
  },
});

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
