<template>
  <div class="tags">
    <HeaderPage :titulo="$t('palavras.tags')">
      <BaseButtonPrimary @click="abrirCriar">
        {{ $t("palavras.criar") }}</BaseButtonPrimary
      >
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
              <BaseButtonPrimary :loading="loading" type="submit">
                {{ $t("palavras.pesquisar") }}
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
              nome: 'cor_fundo',
              texto: $t('palavras.cor_fundo'),
            },
            {
              nome: 'cor_texto',
              texto: $t('palavras.cor_texto'),
            },
            {
              nome: 'acoes',
              texto: '',
              disabled: true,
              width: '50px',
            },
          ]"
          :dados="tags.dados && tags.dados.data"
          :sort-name="sortName"
          :sort-order="sortOrder"
          @onSort="sortBy"
          texto-empty="Não há dados"
        >
          <template #table-row="{ coluna, dado, row }">
            <span v-if="coluna.nome === 'id'">
              <span
                style="font-weight: bold; color: var(--primary-color-principal)"
                >{{ row.id }}</span
              >
            </span>

            <div
              v-else-if="coluna.nome === 'cor_fundo'"
              class="tag-col"
              :style="{ background: row.cor_fundo, color: row.cor_texto }"
            >
              {{ row.cor_fundo }}
            </div>

            <div
              v-else-if="coluna.nome === 'cor_texto'"
              class="tag-col"
              :style="{ background: row.cor_fundo, color: row.cor_texto }"
            >
              {{ row.cor_texto }}
            </div>

            <DropdownAcoes
              :fundoClaro="true"
              v-else-if="coluna.nome === 'acoes'"
            >
              <button @click="abrirEdicao(row)">
                {{ $t("palavras.editar") }}
              </button>
              <button @click="abrirExclusao(row)">
                {{ $t("palavras.excluir") }}
              </button>
            </DropdownAcoes>
            <span v-else>
              {{ coluna.dado }}
            </span>
          </template>
        </Tabela>
        <PaginacaoSemRouter
          class="mt-3"
          :exibir-total="true"
          v-if="tags.dados"
          :pagina-atual="tags.dados.current_page"
          :total="tags.dados.total"
          :porPagina="tags.dados.per_page"
          @onChange="updatePagina($event)"
          :textoTotal="$t('palavras.total')"
          :textoResultados="$t('palavras.resultados', tags.dados.total)"
          :tituloPrimeiraPagina="$t('palavras.primeira')"
          :tituloUltimaPagina="$t('palavras.ultima')"
        />
      </Box>
    </div>

    <ModalCriarTag />
    <ModalEditarTag />
    <ModalExcluirTag />
  </div>
</template>

<script setup>
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
import { useHead } from "@unhead/vue";
import ModalCriarTag from "../components/tags/ModalCriarTag";
import {
  modalCriarTagStore,
  modalDetalhesTagStore,
  modalEditarTagStore,
  modalExcluirTagStore,
} from "../stores/tag";
import ModalEditarTag from "../components/tags/ModalEditarTag";
import ModalExcluirTag from "../components/tags/ModalExcluirTag";

import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../external/hooks/useBackendToast";

const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const modalCriarTagState = modalCriarTagStore();
const modalEditarTagState = modalEditarTagStore();
const ModalExcluirTagState = modalExcluirTagStore();

// Data
const form = reactive({
  pesquisa: "",
});
const loading = ref(false);
const sortName = ref("id");
const sortOrder = ref("desc");
const page = ref(1);
const tags = reactive({
  dados: []
});

// Methods
const abrirCriar = function () {
  modalCriarTagState.abrir();
};

const abrirEdicao = function (tag) {
  modalEditarTagState.abrir(tag);
};

const abrirExclusao = function (tag) {
  ModalExcluirTagState.abrir(tag);
};

const sortBy = function (ordem) {
  sortName.value = ordem.sortName;
  sortOrder.value = ordem.sortOrder;
  buscarDados();
};

const updatePagina = function (pagina) {
  page.value = pagina;
  buscarDados();
};

const pesquisar = function () {
  page.value = 1;
  buscarDados();
};

const buscarDados = function () {
  loading.value = true;
  api
    .get("/tag", {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sortOrder.value,
        sortName: sortName.value,
      },
    })
    .then((r) => {
      tags.dados = r.data.data;
    })
    .catch((e) => {
      backendToastError(e, this.$t("texto.erro_listar_dados"));
    })
    .finally(() => {
      loading.value = false;
    });
};

// Watch
watch(
  () => modalCriarTagState.reload,
  function () {
    buscarDados();
  }
);

watch(
  () => modalEditarTagState.reload,
  function () {
    buscarDados();
  }
);

watch(
  () => modalExcluirTagStore.reload,
  function () {
    buscarDados();
  }
);

// Created
buscarDados();
</script>

<style scoped>
.tag-col {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--gray-400);
}
</style>
