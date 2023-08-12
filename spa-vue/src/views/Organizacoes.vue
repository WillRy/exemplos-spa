<template>
  <div class="organizacoes">
    <HeaderPage :titulo="$t('palavras.organizacoes')">
      <BaseButtonPrimary @click="abrirCriar"> {{ $t("palavras.criar") }}</BaseButtonPrimary>
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
                :label="$t('palavras.tags')"
                :placeholder="$t('textos.pesquise_as_tags')"
                v-model="form.tag_id"
                track-by="id"
                text-by="nome"
                :options="resultadoPesquisaTag"
                @search-change="pesquisarEmpresa"
                :noOptions="$t('textos.pesquise_as_tags')"
                :empty="true"
                :remover="true"
                :multiple="true"
              >
                <template v-slot:option="{option}">
                  <div class="custom-tag" :style="{background: option['cor_fundo'], color: option['cor_texto']}">
                    {{ option['nome'] }}
                  </div>
                </template>
                <template v-slot:tag="{option}">
                  <div class="custom-tag" :style="{background: option['cor_fundo'], color: option['cor_texto']}">
                    {{ option['nome'] }}
                  </div>
                </template>
              </BaseSelectAjax>
            </div>
            <div class="col-auto">
              <BaseButtonPrimary :loading="loading">
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
              nome: 'qtd_contatos',
              texto: $t('palavras.qtd_contatos'),
            },
            {
              nome: 'tags',
              texto: $t('palavras.tags'),
              disabled: true
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
              <ColunaTabela>
                <span
                  class="custom-tag"
                  v-for="tag in dado.tags"
                  :key="tag.id"
                  :style="{background: tag['cor_fundo'], color: tag['cor_texto']}"
                >
                  {{ tag.nome }}
                </span>
              </ColunaTabela>
              <th class="coluna-acoes">
                <DropdownAcoes :fundoClaro="true">
                  <button @click="abrirEdicao(dado)">{{ $t('palavras.editar') }}</button>
                  <button @click="abrirExclusao(dado)">{{ $t('palavras.excluir') }}</button>
                  <button @click="abrirDetalhes(dado)">{{ $t('palavras.detalhes') }}</button>
                </DropdownAcoes>
              </th>
            </tr>
          </template>
        </Tabela>
        <PaginacaoSemRouter
          class="mt-3"
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
    <ModalCriarOrganizacao @onReload="buscarDados"/>
    <ModalEditarOrganizacao/>
    <ModalExcluirOrganizacao/>
    <ModalDetalhesOrganizacao/>
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
import {useHead} from "@unhead/vue";

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
        tag_id: [],
      },
      loading: false,
      sortName: "id",
      sortOrder: "desc",
      page: 1,
      organizacoes: null,
      resultadoPesquisaTag: [],
    };
  },
  methods: {
    pesquisarEmpresa(pesquisa) {
      api
        .get(`/tag`, {params: {pesquisa: pesquisa}})
        .then((response) => {
          this.resultadoPesquisaTag = response.data.data.data;
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

      const id_tags = this.form.tag_id ? this.form.tag_id.map((tag) => tag.id) : [];
      api
        .get("/organizacao", {
          params: {
            ...(this.form.pesquisa ? {pesquisa: this.form.pesquisa} : {}),
            ...(id_tags
              ? {id_tags: id_tags}
              : {}),
            ...(this.page ? {page: this.page} : {}),
            sortOrder: this.sortOrder,
            sortName: this.sortName,
          },
        })
        .then((r) => {
          if (!r.data.success) return;

          this.organizacoes = r.data.data;
        })
        .catch((e) => {
          this.$laravelError(e, this.$t('texto.erro_listar_dados'));
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  beforeUnmount() {
  },
  created() {
    this.buscarDados();
  },
};
</script>

<style scoped>
.custom-tag {
  box-sizing: border-box;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid var(--gray-400);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 4px;

}
</style>
