<template>
  <Box padding="0">
    <form @submit.prevent="pesquisar" class="mb-3 p-2">
      <div class="row align-items-end gy-1">
        <div class="col-md-4">
          <BaseInput :label="$t('palavras.pesquisar')" name="pesquisa" v-model="form.pesquisa" />
        </div>
        <div class="col-md-4">
          <BaseSelectAjax
            :label="$t('palavras.tags')"
            :placeholder="$t('textos.pesquise_as_tags')"
            v-model="form.tag_id"
            track-by="id"
            text-by="nome"
            :options="resultadoPesquisaTag.dados"
            @search-change="pesquisarEmpresa"
            :noOptions="$t('textos.pesquise_as_tags')"
            :empty="true"
            :remover="true"
            :multiple="true"
          >
            <template v-slot:option="{ option }">
              <div
                class="custom-tag"
                :style="{
                  background: option['cor_fundo'],
                  color: option['cor_texto']
                }"
              >
                {{ option['nome'] }}
              </div>
            </template>
            <template v-slot:tag="{ option }">
              <div
                class="custom-tag"
                :style="{
                  background: option['cor_fundo'],
                  color: option['cor_texto']
                }"
              >
                {{ option['nome'] }}
              </div>
            </template>
          </BaseSelectAjax>
        </div>
        <div class="col-auto">
          <BaseButtonPrimary :loading="loading" type="submit">
            {{ $t('palavras.pesquisar') }}
          </BaseButtonPrimary>
        </div>
        <div class="col">
          <div class="row justify-end">
            <div class="col-auto">
              <BaseButtonPrimary @click="abrirCriar"> {{ $t('palavras.criar') }}</BaseButtonPrimary>
            </div>
            <div class="col-auto">
              <BaseDropdownPrimary>
                <template #botao> {{ $t('palavras.colunas') }} </template>
                <template #conteudo>
                  <div class="py-3 px-3">

                    <BaseCheckbox
                      v-for="(coluna, index) in visibleColumns"
                      :key="index"
                      :label="columns.find(c => c.nome === index).texto"
                      v-model="visibleColumns[index]"
                      :name="`coluna-${index}`"
                      :disabled="false"
                    />
                  </div>
                </template>
              </BaseDropdownPrimary>
            </div>
          </div>
        </div>
      </div>
    </form>
    <Tabela
      :loading="loading"
      :colunas="columns"
      :dados="organizacoes.dados && organizacoes.dados.data"
      :sort-name="sortName"
      :sort-order="sortOrder"
      :total="organizacoes.dados && organizacoes.dados.total"
      :per-page="organizacoes.dados && organizacoes.dados.per_page"
      :current-page="organizacoes.dados && organizacoes.dados.current_page"
      :exibirPaginacao="true"
      @onSort="sortBy"
      @onPage="updatePagina"
      texto-empty="Não há dados"
    >
      <template v-slot:colunas="{ dados, isColVisible }">
        <tr v-for="(dado, index) in dados" :key="index">
          <ColunaTabela v-if="isColVisible('id')">
            <span style="font-weight: bold; color: var(--primary-color-principal)">
              {{ dado.id }}
            </span>
          </ColunaTabela>
          <ColunaTabela v-if="isColVisible('nome')">{{ dado.nome }}</ColunaTabela>
          <ColunaTabela v-if="isColVisible('email')">{{ dado.email }}</ColunaTabela>
          <ColunaTabela v-if="isColVisible('telefone')">{{ dado.telefone }}</ColunaTabela>
          <ColunaTabela v-if="isColVisible('qtd_contatos')">{{ dado.qtd_contatos }}</ColunaTabela>
          <ColunaTabela v-if="isColVisible('tags')">
            <span
              class="custom-tag"
              v-for="tag in dado.tags"
              :key="tag.id"
              :style="{
                background: tag['cor_fundo'],
                color: tag['cor_texto']
              }"
            >
              {{ tag.nome }}
            </span>
          </ColunaTabela>
          <ColunaTabela justify="flex-end" class="coluna-acoes">
            <BaseDropdownAction :fundoClaro="true">
              <button @click="abrirEdicao(dado)">
                {{ $t('palavras.editar') }}
              </button>
              <button @click="abrirExclusao(dado)">
                {{ $t('palavras.excluir') }}
              </button>
              <button @click="abrirDetalhes(dado)">
                {{ $t('palavras.detalhes') }}
              </button>
            </BaseDropdownAction>
          </ColunaTabela>
        </tr>
      </template>
    </Tabela>

    <ModalCriarOrganizacao
      :aberta="criarOrganizacaoAberto"
      @onClose="criarOrganizacaoAberto = null"
      @onReload="buscarDados"
    />
    <ModalEditarOrganizacao
      :organizacao="organizacaoSendoEditado"
      @onClose="organizacaoSendoEditado = null"
      @onReload="buscarDados"
    />
    <ModalExcluirOrganizacao
      :organizacao="organizacaoSendoExcluido"
      @onClose="organizacaoSendoExcluido = null"
      @onReload="buscarDados"
    />
    <ModalDetalhesOrganizacao
      :organizacao="detalhesOrganizacao"
      @onClose="detalhesOrganizacao = null"
    />
  </Box>
</template>
<script setup>
import BaseButtonPrimary from '../../external/components/buttons/BaseButtonPrimary'
import BaseInput from '../../external/components/form/BaseInput'
import BaseSelectAjax from '../../external/components/form/BaseSelectAjax'
import Tabela from '../../external/components/tabela/Tabela'
import ColunaTabela from '../../external/components/tabela/ColunaTabela'
import BaseDropdownPrimary from '../../external/components/dropdown/BaseDropdownPrimary.vue'
import Box from '../../external/components/estrutura/Box'
import api from '@/services/api'
import ModalCriarOrganizacao from './ModalCriarOrganizacao'
import ModalEditarOrganizacao from './ModalEditarOrganizacao'
import ModalExcluirOrganizacao from './ModalExcluirOrganizacao'
import ModalDetalhesOrganizacao from './ModalDetalhesOrganizacao'

import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackendToast } from '../../external/composables/useBackendToast'
import BaseDropdownAction from '@/external/components/dropdown/BaseDropdownAction.vue'
import BaseCheckbox from '@/external/components/form/BaseCheckbox.vue'

const { t: $t } = useI18n()
const { backendToastError } = useBackendToast()

const form = reactive({
  pesquisa: '',
  tag_id: []
})
const loading = ref(false)
const sortName = ref('id')
const sortOrder = ref('desc')
const page = ref(1)
const organizacoes = reactive({
  dados: []
})
const resultadoPesquisaTag = reactive({
  dados: []
})

const visibleColumns = ref({
  id: true,
  nome: true,
  email: true,
  telefone: true,
  qtd_contatos: false,
  tags: true,
  acoes: true
})
const columns = computed(() => {
  return [
    { nome: 'id', texto: $t('palavras.id'), show: visibleColumns.value.id },
    { nome: 'nome', texto: $t('palavras.nome'), show: visibleColumns.value.nome },
    { nome: 'email', texto: $t('palavras.email'), show: visibleColumns.value.email },
    { nome: 'telefone', texto: $t('palavras.telefone'), show: visibleColumns.value.telefone },
    { nome: 'qtd_contatos', texto: $t('palavras.qtd_contatos'), show: visibleColumns.value.qtd_contatos },
    { nome: 'tags', texto: $t('palavras.tags'), disabled: true, show: visibleColumns.value.tags },
    { nome: 'acoes', texto: '', disabled: true, width: '50px', show: visibleColumns.value.acoes }
  ]
})

const detalhesOrganizacao = ref(false)
const criarOrganizacaoAberto = ref(false)
const organizacaoSendoEditado = ref(null)
const organizacaoSendoExcluido = ref(null)

const pesquisarEmpresa = function (pesquisa) {
  api.get(`/tag`, { params: { pesquisa: pesquisa } }).then((response) => {
    resultadoPesquisaTag.dados = response.data.data.data
  })
}

const abrirCriar = function () {
  criarOrganizacaoAberto.value = true
}

const abrirEdicao = function (usuario) {
  organizacaoSendoEditado.value = usuario
}

const abrirExclusao = function (usuario) {
  organizacaoSendoExcluido.value = usuario
}

const abrirDetalhes = function (usuario) {
  detalhesOrganizacao.value = usuario
}

const sortBy = function (ordem) {
  page.value = 1
  sortName.value = ordem.sortName
  sortOrder.value = ordem.sortOrder
  buscarDados()
}

const updatePagina = function (pagina) {
  page.value = pagina
  buscarDados()
}

const pesquisar = function () {
  page.value = 1
  buscarDados()
}

const buscarDados = function () {
  loading.value = true

  const id_tags = form.tag_id ? form.tag_id.map((tag) => tag.id) : []
  api
    .get('/organizacao', {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(id_tags ? { id_tags: id_tags } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sortOrder.value,
        sortName: sortName.value
      }
    })
    .then((r) => {
      organizacoes.dados = r.data.data
    })
    .catch((e) => {
      backendToastError(e, $t('textos.erro_listar_dados'))
    })
    .finally(() => {
      loading.value = false
    })
}

buscarDados()
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
