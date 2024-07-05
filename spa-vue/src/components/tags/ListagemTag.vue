<template>
  <Box padding="0">
    <form @submit.prevent="pesquisar" class="mb-3 p-2">
      <div class="row align-items-end gy-1">
        <div class="col-md-4">
          <BaseInput :label="$t('palavras.pesquisar')" name="pesquisa" v-model="form.pesquisa" />
        </div>
        <div class="col-auto">
          <BaseButtonPrimary :loading="loading" type="submit">
            {{ $t('palavras.pesquisar') }}
          </BaseButtonPrimary>
        </div>
        <div class="col-auto ms-auto">
          <BaseButtonPrimary @click="abrirCriar"> {{ $t('palavras.criar') }}</BaseButtonPrimary>
        </div>
      </div>
    </form>
    <Tabela
      :loading="loading"
      :dados="tags.dados && tags.dados.data"
      :sort-name="sortName"
      :sort-order="sortOrder"
      :total="tags.dados && tags.dados.total"
      :per-page="tags.dados && tags.dados.per_page"
      :current-page="tags.dados && tags.dados.current_page"
      @onSort="sortBy"
      @onPage="updatePagina"
      texto-empty="Não há dados"
    >
      <template #thead>
        <HeadSort
          nome="id"
          :disabled="false"
        >
          <span>{{ $t('palavras.id') }}</span>
        </HeadSort>
        <HeadSort
          nome="nome"
          :disabled="false"
        >
          <span>{{ $t('palavras.nome') }}</span>
        </HeadSort>
        <HeadSort
          nome="cor_fundo"
          :disabled="false"
        >
          <span>{{ $t('palavras.cor_fundo') }}</span>
        </HeadSort>
        <HeadSort
          nome="cor_texto"
          :disabled="false"
        >
          <span>{{ $t('palavras.cor_texto') }}</span>
        </HeadSort>
        <HeadSort @onSort="sortBy" :ordenando="sortName" :order="sortOrder" :disabled="true" />
      </template>
      <template v-slot:colunas="{ dados }">
        <tr v-for="(dado, index) in dados" :key="index">
          <ColunaTabela>
            {{ dado.id }}
          </ColunaTabela>
          <ColunaTabela>
            {{ dado.nome }}
          </ColunaTabela>
          <ColunaTabela>
            <div class="tag-col" :style="{ background: dado.cor_fundo, color: dado.cor_texto }">
              {{ dado.cor_fundo }}
            </div>
          </ColunaTabela>
          <ColunaTabela>
            <div class="tag-col" :style="{ background: dado.cor_fundo, color: dado.cor_texto }">
              {{ dado.cor_texto }}
            </div>
          </ColunaTabela>
          <ColunaTabela justify="flex-end" class="coluna-acoes">
            <DropdownAcoes :fundoClaro="true">
              <button @click="abrirEdicao(dado)">
                {{ $t('palavras.editar') }}
              </button>
              <button @click="abrirExclusao(dado)">
                {{ $t('palavras.excluir') }}
              </button>
            </DropdownAcoes>
          </ColunaTabela>
        </tr>
      </template>
    </Tabela>

    <ModalCriarTag
      :aberta="criarTagAberto"
      @onClose="criarTagAberto = null"
      @onReload="buscarDados"
    />
    <ModalEditarTag
      :tag="tagSendoEditada"
      @onClose="tagSendoEditada = null"
      @onReload="buscarDados"
    />
    <ModalExcluirTag
      :tag="tagSendoExcluida"
      @onClose="tagSendoExcluida = null"
      @onReload="buscarDados"
    />
  </Box>
</template>
<script setup>
import BaseButtonPrimary from '../../external/components/buttons/BaseButtonPrimary'
import BaseInput from '../../external/components/form/BaseInput'
import Tabela from '../../external/components/tabela/Tabela'
import ColunaTabela from '../../external/components/tabela/ColunaTabela'
import DropdownAcoes from '../../external/components/dropdown/BaseDropdownAction'
import Box from '../../external/components/estrutura/Box'
import api from '@/services/api'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackendToast } from '../../external/hooks/useBackendToast'
import ModalCriarTag from './ModalCriarTag.vue'
import ModalEditarTag from './ModalEditarTag.vue'
import ModalExcluirTag from './ModalExcluirTag.vue'
import HeadSort from '@/external/components/tabela/HeadSort.vue'


const { t: $t } = useI18n()
const { backendToastError } = useBackendToast()

const form = reactive({
  pesquisa: ''
})
const loading = ref(false)
const sortName = ref('id')
const sortOrder = ref('desc')
const page = ref(1)
const tags = reactive({
  dados: []
})

const criarTagAberto = ref(false)
const tagSendoEditada = ref(null)
const tagSendoExcluida = ref(null)

const abrirCriar = function () {
  criarTagAberto.value = true
}

const abrirEdicao = function (tag) {
  tagSendoEditada.value = tag
}

const abrirExclusao = function (tag) {
  tagSendoExcluida.value = tag
}

const sortBy = function (ordem) {
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
  api
    .get('/tag', {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sortOrder.value,
        sortName: sortName.value
      }
    })
    .then((r) => {
      tags.dados = r.data.data
    })
    .catch((e) => {
      backendToastError(e, $t('texto.erro_listar_dados'))
    })
    .finally(() => {
      loading.value = false
    })
}

buscarDados()
</script>
<style scoped>
.tag-col {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--gray-400);
}
</style>

