<template>
  <div class="organizacoes">
    <HeaderPage :titulo="$t('palavras.organizacoes')">
      <BaseButtonPrimary @click="abrirCriar"> {{$t("palavras.criar")}} </BaseButtonPrimary>
    </HeaderPage>
    <div class="container-fluid">
      <Box>
        <form @submit.prevent="pesquisar" class="mb-3">
          <div class="row align-items-end gy-1">
              <div class="col-md-4">
                <BaseInput
                  :label="$t('palavras.pesquisar')"
                  name="pesquisa"
                  v-model="form.pesquisa"
                />
              </div>
              <div class="col-auto">
                <BaseButtonPrimary :loading="loading">
                  {{$t('palavras.pesquisar')}}
                </BaseButtonPrimary>
              </div>
            </div>
          </form>
        <Tabela
          :loading="loading"
          :colunas="[
            {
              nome: 'id',
              texto: $t('palavras.id'),
            },
            {
              nome: 'nome',
              texto: $t('palavras.nome'),
            },
            {
              nome: 'email',
              texto: $t('palavras.email'),
            },
            {
              nome: 'telefone',
              texto: $t('palavras.telefone'),
            },
            {
              nome: 'qtd_contatos',
              texto: $t('palavras.qtd_contatos'),
            },
          ]"
          :dados="organizacoes && organizacoes.data"
          :sort-name="sortName"
          :sort-order="sortOrder"
          @onSort="sortBy"
          texto-empty="Não há dados"
        >
          <template v-slot:colunas="{ dados }">
            <tr v-for="(dado, index) in dados" :key="index">
              <ColunaTabela>{{ dado.id }}</ColunaTabela>
              <ColunaTabela>{{ dado.nome }}</ColunaTabela>
              <ColunaTabela>{{ dado.email }}</ColunaTabela>
              <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
              <ColunaTabela>{{ dado.qtd_contatos }}</ColunaTabela>
              <th class="coluna-acoes">
                <DropdownAcoes :fundoClaro="true">
                  <button @click="abrirEdicao(dado)">{{$t('palavras.editar')}}</button>
                  <button @click="abrirExclusao(dado)">{{$t('palavras.excluir')}}</button>
                  <button @click="abrirDetalhes(dado)">{{$t('palavras.detalhes')}}</button>
                </DropdownAcoes>
              </th>
            </tr>
          </template>
        </Tabela>
        <PaginacaoSemRouter
            :exibir-total="true"
            v-if="organizacoes"
            :pagina-atual="organizacoes.current_page"
            :total="organizacoes.total"
            :porPagina="organizacoes.per_page"
            @onChange="updatePagina($event)"
            :textoTotal="$t('palavras.total')"
            :textoResultados="$tc('palavras.resultados', organizacoes.total)"
            :tituloPrimeiraPagina="$t('palavras.primeira')"
            :tituloUltimaPagina="$t('palavras.ultima')"
          />
      </Box>
    </div>
    <ModalCriarOrganizacao />
    <ModalEditarOrganizacao />
    <ModalExcluirOrganizacao />
    <ModalDetalhesOrganizacao />
  </div>
</template>

<script>
import HeaderPage from "../components/pages/HeaderPage";
import BaseButtonPrimary from "../external/components/buttons/BaseButtonPrimary";
import PageContent from "../components/pages/PageContent";
import ContentTable from "../components/pages/ContentTable";
import BaseInput from "../external/components/form/BaseInput";
import BaseSelectAjax from "../external/components/form/BaseSelectAjax";
import Tabela from "../external/components/tabela/Tabela";
import ColunaTabela from "../external/components/tabela/ColunaTabela";
import DropdownAcoes from "../external/components/dropdown/BaseDropdownAction";
import PaginacaoSemRouter from "../external/components/paginacao/PaginacaoSemRouter";
import Box from "../external/components/estrutura/Box";
import api from "../services/api";
import {
  modalCriarOrganizacaoStore,
  modalEditarOrganizacaoStore,
  modalDetalhesOrganizacaoStore,
  modalExcluirOrganizacaoStore,
} from "../stores/organizacao";
import ModalCriarOrganizacao from "../components/organizacoes/ModalCriarOrganizacao";
import useVuelidate from "@vuelidate/core";
import ModalEditarOrganizacao from "../components/organizacoes/ModalEditarOrganizacao";
import ModalExcluirOrganizacao from "../components/organizacoes/ModalExcluirOrganizacao";
import ModalDetalhesOrganizacao from "../components/organizacoes/ModalDetalhesOrganizacao";
import { Skeleton } from "vue-loading-skeleton";
import { useHead } from "@unhead/vue";

export default {
  name: "Organizacaos",
  components: {
    ModalDetalhesOrganizacao,
    ModalExcluirOrganizacao,
    ModalEditarOrganizacao,
    ModalCriarOrganizacao,
    PaginacaoSemRouter,
    DropdownAcoes,
    ColunaTabela,
    Tabela,
    BaseSelectAjax,
    BaseInput,
    ContentTable,
    PageContent,
    BaseButtonPrimary,
    HeaderPage,
    Skeleton,
    Box
  },
  setup() {
    const modalCriarOrganizacaoState = modalCriarOrganizacaoStore();
    const modalEditarOrganizacaoState = modalEditarOrganizacaoStore();
    const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();
    const modalDetalhesOrganizacaoState = modalDetalhesOrganizacaoStore();

    useHead({
      title: "CRM - Organizações",
    });

    return {
      modalDetalhesOrganizacaoState,
      modalCriarOrganizacaoState,
      modalEditarOrganizacaoState,
      modalExcluirOrganizacaoState,
    };
  },
  watch: {
    "modalCriarOrganizacaoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
    "modalEditarOrganizacaoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
    "modalExcluirOrganizacaoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
  },
  data() {
    return {
      form: {
        pesquisa: "",
        empresa_id: null,
      },
      loading: false,
      sortName: "id",
      sortOrder: "desc",
      page: 1,
      organizacoes: null,
      resultadoPesquisaEmpresa: [],
    };
  },
  methods: {
    pesquisarEmpresa(pesquisa) {
      api
        .get(`/organizacao`, { params: { pesquisa: pesquisa } })
        .then((response) => {
          this.resultadoPesquisaEmpresa = response.data.data.data;
        });
    },
    abrirCriar() {
      this.modalCriarOrganizacaoState.abrir();
    },
    abrirEdicao(usuario) {
      this.modalEditarOrganizacaoState.abrir(usuario);
    },
    abrirExclusao(usuario) {
      this.modalExcluirOrganizacaoState.abrir(usuario);
    },
    abrirDetalhes(usuario) {
      this.modalDetalhesOrganizacaoState.abrir(usuario);
    },
    sortBy({ sortName, sortOrder }) {
      console.log(sortName, sortOrder);
      this.sortName = sortName;
      this.sortOrder = sortOrder;
      this.buscarDados();
    },
    updatePagina(pagina) {
      this.page = pagina;
      this.buscarDados();
    },
    pesquisar() {
      this.page = 1;
      this.buscarDados();
    },
    buscarDados() {
      this.loading = true;
      api
        .get("/organizacao", {
          params: {
            ...(this.form.pesquisa ? { pesquisa: this.form.pesquisa } : {}),
            ...(this.form.empresa_id
              ? { empresa_id: this.form.empresa_id.id }
              : {}),
            ...(this.page ? { page: this.page } : {}),
            sortOrder: this.sortOrder,
            sortName: this.sortName,
          },
        })
        .then((r) => {
          if (!r.data.success) return;

          this.organizacoes = r.data.data;
        })
        .catch((e) => {
          this.$laravelError(e, $t('texto.erro_listar_dados'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  beforeUnmount() {},
  created() {
    this.buscarDados();
  },
};
</script>

<style scoped></style>
