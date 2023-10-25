<template>
  <div class="contatos">
    <HeaderPage :titulo="$t('palavras.contatos')">
      <BaseButtonPrimary @click="abrirCriar"> {{ $t('palavras.criar') }}</BaseButtonPrimary>
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
            <div class="col-md-4">
              <BaseSelectAjax
                  :label="$t('palavras.empresa')"
                  :placeholder="$t('textos.pesquise_as_empresas')"
                  v-model="form.empresa_id"
                  track-by="id"
                  text-by="nome"
                  :options="resultadoPesquisaEmpresa"
                  @search-change="pesquisarEmpresa"
                  :noOptions="$t('textos.pesquise_as_empresas')"
                  :empty="true"
                  :remover="true"
              >
              </BaseSelectAjax>
            </div>
            <div class="col-auto">
              <BaseButtonPrimary :loading="loading" type="submit">
                <font-awesome-icon :icon="faMagnifyingGlass"></font-awesome-icon>
                {{ $t('palavras.pesquisar') }}
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
              nome: 'organizacao',
              texto: $t('palavras.empresa'),
              disabled: true,
            },
          ]"
            :dados="contatos && contatos.data"
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
              <ColunaTabela>{{ dado.organizacao }}</ColunaTabela>
              <ColunaTabela width="50px" justify="flex-end">
                <DropdownAcoes :fundoClaro="true">
                  <button @click="abrirEdicao(dado)">{{ $t('palavras.editar') }}</button>
                  <button @click="abrirExclusao(dado)">{{ $t('palavras.excluir') }}</button>
                  <button @click="abrirDetalhes(dado)">{{ $t('palavras.detalhes') }}</button>
                </DropdownAcoes>
              </ColunaTabela>
            </tr>
          </template>
        </Tabela>
        <PaginacaoSemRouter
            class="mt-3"
            :exibir-total="true"
            v-if="contatos"
            :pagina-atual="contatos.current_page"
            :total="contatos.total"
            :porPagina="contatos.per_page"
            @onChange="updatePagina($event)"
            :textoTotal="$t('palavras.total')"
            :textoResultados="$tc('palavras.resultados', contatos.total)"
            :tituloPrimeiraPagina="$t('palavras.primeira')"
            :tituloUltimaPagina="$t('palavras.ultima')"
        />
      </Box>
    </div>
    <ModalCriarContato/>
    <ModalEditarContato/>
    <ModalExcluirContato/>
    <ModalDetalhesContato/>
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
  modalCriarContatoStore,
  modalEditarContatoStore,
  modalDetalhesContatoStore,
  modalExcluirContatoStore,
} from "../stores/contato";
import ModalCriarContato from "../components/contatos/ModalCriarContato";
import useVuelidate from "@vuelidate/core";
import ModalEditarContato from "../components/contatos/ModalEditarContato";
import ModalExcluirContato from "../components/contatos/ModalExcluirContato";
import ModalDetalhesContato from "../components/contatos/ModalDetalhesContato";
import {useHead} from "@unhead/vue";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: "Contatos",
  components: {
    ModalDetalhesContato,
    ModalExcluirContato,
    ModalEditarContato,
    ModalCriarContato,
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
    Box,
    FontAwesomeIcon
  },
  setup() {
    useHead({
      title: "CRM - Contatos",
    });

    const modalCriarContatoState = modalCriarContatoStore();
    const modalEditarContatoState = modalEditarContatoStore();
    const modalExcluirContatoState = modalExcluirContatoStore();
    const modalDetalhesContatoState = modalDetalhesContatoStore();

    return {
      modalDetalhesContatoState,
      modalCriarContatoState,
      modalEditarContatoState,
      modalExcluirContatoState,
    };
  },
  watch: {
    "modalCriarContatoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
    "modalEditarContatoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
    "modalExcluirContatoState.reload": {
      handler() {
        this.buscarDados();
      },
    },
  },
  data() {
    return {
      faMagnifyingGlass: faMagnifyingGlass,
      form: {
        pesquisa: "",
        empresa_id: null,
      },
      loading: false,
      sortName: "id",
      sortOrder: "desc",
      page: 1,
      contatos: null,
      resultadoPesquisaEmpresa: [],
    };
  },
  methods: {
    pesquisarEmpresa(pesquisa) {
      api
          .get(`/organizacao`, {params: {pesquisa: pesquisa}})
          .then((response) => {
            this.resultadoPesquisaEmpresa = response.data.data.data;
          });
    },
    abrirCriar() {
      this.modalCriarContatoState.abrir();
    },
    abrirEdicao(usuario) {
      this.modalEditarContatoState.abrir(usuario);
    },
    abrirExclusao(usuario) {
      this.modalExcluirContatoState.abrir(usuario);
    },
    abrirDetalhes(usuario) {
      this.modalDetalhesContatoState.abrir(usuario);
    },
    sortBy({sortName, sortOrder}) {
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
      return api
          .get("/contato", {
            params: {
              ...(this.form.pesquisa ? {pesquisa: this.form.pesquisa} : {}),
              ...(this.form.empresa_id
                  ? {empresa_id: this.form.empresa_id.id}
                  : {}),
              ...(this.page ? {page: this.page} : {}),
              sortOrder: this.sortOrder,
              sortName: this.sortName,
            },
          })
          .then((r) => {
            this.contatos = r.data.data;
          })
          .catch((e) => {
            this.$laravelError(e, this.$t('texto.erro_listar_dados'));
          })
          .finally(() => {
            this.loading = false;
          });
    },
  },
  //pré carrega os dados
  async beforeRouteEnter(to, from, next) {
    try {
      const r = await api.get("/contato");
      next((vm) => vm.contatos = r.data.data)

    } catch (error) {
      next((vm) => {
        vm.$laravelError(error, vm.$t('texto.erro_listar_dados'));
      })
    }
  },
  beforeUnmount() {
  },
  created() {
    // this.buscarDados();
  },
};
</script>

<style scoped></style>
