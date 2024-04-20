<template>
  <div class="organizacoes">
    <HeaderPage :titulo="$t('palavras.organizacoes')">
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
          </div>
        </form>
        <Tabela
          :loading="loading"
          :colunas="[
            {
              nome: 'id',
              texto: $t('palavras.id')
            },
            {
              nome: 'nome',
              texto: $t('palavras.nome')
            },
            {
              nome: 'email',
              texto: $t('palavras.email')
            },
            {
              nome: 'telefone',
              texto: $t('palavras.telefone')
            },
            {
              nome: 'qtd_contatos',
              texto: $t('palavras.qtd_contatos')
            },
            {
              nome: 'tags',
              texto: $t('palavras.tags'),
              disabled: true
            }
          ]"
          :dados="organizacoes.dados && organizacoes.dados.data"
          :sort-name="sortName"
          :sort-order="sortOrder"
          @onSort="sortBy"
          texto-empty="Não há dados"
        >
          <template v-slot:colunas="{ dados }">
            <tr v-for="(dado, index) in dados" :key="index">
              <ColunaTabela>
                <span style="font-weight: bold; color: var(--primary-color-principal)">
                  {{ dado.id }}
                </span>
              </ColunaTabela>
              <ColunaTabela>{{ dado.nome }}</ColunaTabela>
              <ColunaTabela>{{ dado.email }}</ColunaTabela>
              <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
              <ColunaTabela>{{ dado.qtd_contatos }}</ColunaTabela>
              <ColunaTabela>
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
                <DropdownAcoes :fundoClaro="true">
                  <button @click="abrirEdicao(dado)">
                    {{ $t('palavras.editar') }}
                  </button>
                  <button @click="abrirExclusao(dado)">
                    {{ $t('palavras.excluir') }}
                  </button>
                  <button @click="abrirDetalhes(dado)">
                    {{ $t('palavras.detalhes') }}
                  </button>
                </DropdownAcoes>
              </ColunaTabela>
            </tr>
          </template>
        </Tabela>
        <PaginacaoSemRouter
          class="mt-3"
          :exibir-total="true"
          v-if="organizacoes.dados"
          :pagina-atual="organizacoes.dados.current_page"
          :total="organizacoes.dados.total"
          :porPagina="organizacoes.dados.per_page"
          @onChange="updatePagina($event)"
          :textoTotal="$t('palavras.total')"
          :textoResultados="$t('palavras.resultados', organizacoes.dados.total)"
          :tituloPrimeiraPagina="$t('palavras.primeira')"
          :tituloUltimaPagina="$t('palavras.ultima')"
        />
      </Box>
    </div>
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
  </div>
</template>

<script setup>
import Privado from '../../layouts/Privado.vue'
import HeaderPage from '../../components/pages/HeaderPage'
import BaseButtonPrimary from '../../external/components/buttons/BaseButtonPrimary'
import BaseInput from '../../external/components/form/BaseInput'
import BaseSelectAjax from '../../external/components/form/BaseSelectAjax'
import Tabela from '../../external/components/tabela/Tabela'
import ColunaTabela from '../../external/components/tabela/ColunaTabela'
import DropdownAcoes from '../../external/components/dropdown/BaseDropdownAction'
import PaginacaoSemRouter from '../../external/components/paginacao/PaginacaoSemRouter'
import Box from '../../external/components/estrutura/Box'
import axiosWeb from '../../services/axiosWeb'
import ModalCriarOrganizacao from '../../components/organizacoes/ModalCriarOrganizacao'
import ModalEditarOrganizacao from '../../components/organizacoes/ModalEditarOrganizacao'
import ModalExcluirOrganizacao from '../../components/organizacoes/ModalExcluirOrganizacao'
import ModalDetalhesOrganizacao from '../../components/organizacoes/ModalDetalhesOrganizacao'

import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackendToast } from '../../external/hooks/useBackendToast'

const { t: $t } = useI18n()
const { backendToastError } = useBackendToast()
defineOptions({ layout: Privado })

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

const detalhesOrganizacao = ref(false)
const criarOrganizacaoAberto = ref(false)
const organizacaoSendoEditado = ref(null)
const organizacaoSendoExcluido = ref(null)

const pesquisarEmpresa = function (pesquisa) {
  axiosWeb.get(`/tag`, { params: { pesquisa: pesquisa } }).then((response) => {
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
  axiosWeb
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
      backendToastError(e, $t('texto.erro_listar_dados'))
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
