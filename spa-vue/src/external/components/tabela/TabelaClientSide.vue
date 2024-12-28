<template>
  <div>
    <div :class="{ 'table-responsive': responsive }">
      <table class="tabela" :class="{
        loading: loading,
        listras: listras,
        auto: tableLayout === 'auto',
        fixed: tableLayout === 'fixed'
      }">
        <thead>
          <template v-if="!$slots.thead">
            <HeadSort v-for="(coluna, index) in colunas" :info="coluna.info" :key="index" :nome="coluna.nome"
              :disabled="coluna.disabled" :texto="coluna.texto" :width="coluna.width" :maxWidth="coluna.maxWidth"
              :minWidth="coluna.minWidth" :permiteRemoverOrdenacao="permiteRemoverOrdenacao"></HeadSort>
          </template>
          <slot name="thead" :dados="dados" />
        </thead>
        <tbody v-if="dados && dados.length">
          <slot name="colunas" :dados="localRows.data" v-if="$slots.colunas"></slot>
        </tbody>
        <tbody v-if="(!localRows.data && !loading) || (localRows.data && localRows.data.length === 0 && !loading)"
          class="tabela-vazia">
          <tr v-if="!loading">
            <td colspan="99999">{{ textoEmpty }}</td>
          </tr>
        </tbody>
        <tbody v-if="loading">
          <tr class="overlay">
            <Loader width="3%" height="3%" :cor-principal="true" />
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="exibirPaginacao">
      <Separador />
      <PaginacaoSemRouter class="mt-3 p-2" :exibir-total="true" :pagina-atual="currentPage" :total="totalItems"
        :porPagina="perPage" @onChange="updatePagina($event)" />
    </template>
  </div>
</template>

<script lang="ts">
import HeadSort from './HeadSort.vue'
import Loader from '../Loader.vue'
import { PropType, computed, defineComponent } from 'vue'
import PaginacaoSemRouter from '../paginacao/PaginacaoSemRouter.vue'
import Separador from '../estrutura/Separador.vue'

interface Coluna {
  nome: string
  texto: string
  disabled?: boolean
  info?: string
  width?: string
  minWidth?: string
  maxWidth?: string
}

type TabelaLayout = 'auto' | 'fixed'
type TableSort = 'asc' | 'desc' | 'ASC' | 'DESC'

type Colunas = Array<Coluna>

type DadosOrdenacao = {
  sortName: string
  sortOrder: string
}

export default defineComponent({
  name: 'Tabela',
  components: { Loader, HeadSort, PaginacaoSemRouter, Separador },
  emits: ['onSort', 'onPage'],
  props: {
    permiteRemoverOrdenacao: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: true
    },
    listras: {
      type: Boolean,
      default: true
    },
    textoEmpty: {
      type: String,
      default: 'Não há dados'
    },
    loading: {
      type: Boolean,
      default: false
    },
    colunas: {
      type: Array as PropType<Colunas>,
      default: () => []
    },
    dados: {
      type: Array,
      default: () => []
    },
    sortName: {
      type: String,
      default: null
    },
    sortOrder: {
      type: String as PropType<TableSort>,
      default: 'asc'
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    tableLayout: {
      type: String as PropType<TabelaLayout>,
      default: 'auto'
    },
    currentPage: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    exibirPaginacao: {
      type: Boolean,
      default: true
    },
    clientSide: {
      type: Boolean,
      default: true
    },
    callbackPesquisa: {
      type: Function,
      default: null
    },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      checkedAll: false,
      // localRows: [] as Array<any>,
      totalFiltered: 0,
    }
  },
  provide() {
    return {
      sortByTabela: (dados: DadosOrdenacao) => this.sortBy(dados),
      ordenando: computed(() => this.sortName),
      order: computed(() => this.sortOrder)
    }
  },
  computed: {
    totalItems() {
      return this.clientSide ? this.localRows.totalFiltered : this.total
    },
    totalPage() {
      return Math.ceil(this.totalItems / this.perPage)
    },
    localRows() {
      const result: { data: any[], totalFiltered: number } = {
        data: [],
        totalFiltered: 0
      }

      result.totalFiltered = this.dados.length;


      if (!this.clientSide) {
        result.data = this.dados;
        return result;
      }

      let newData = [...this.dados]

      if (this.callbackPesquisa) {
        newData = this.callbackPesquisa(newData);
        result.totalFiltered = newData.length !== this.dados.length ? newData.length : this.dados.length;
      }


      newData = newData.slice().sort((a: any, b: any) => {
        if (this.sortOrder === 'asc' || this.sortOrder === 'ASC') {
          return a[this.sortName] > b[this.sortName] ? 1 : -1
        } else {
          return a[this.sortName] < b[this.sortName] ? 1 : -1
        }
      })

      if (this.exibirPaginacao) {
        newData = newData.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        )
      }

      result.data = newData;

      if (result.data.length === 0 && this.currentPage > 1) {
        this.updatePagina(this.currentPage - 1)
      }


      return result
    }
  },
  methods: {
    sortBy(dadosOrdenacao: DadosOrdenacao) {
      this.$emit('onSort', dadosOrdenacao)
    },
    updatePagina(page: number | string) {
      this.$emit('onPage', page)
    },
    search() {
      this.updatePagina(1)
    }
  }
})
</script>

<style scoped>
.tabela-container {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  background: #fff;
  border-top: 1px solid #e5e7eb;
}

.table-responsive {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-color: inherit;
  text-indent: 0;
}

.tabela.auto {
  table-layout: auto;
}

.tabela.fixed {
  table-layout: fixed;
}

.tabela {
  min-height: 36px;
}

.tabela thead tr .tabela :deep(thead tr) {
  background-color: rgb(249 250 251);
}

.tabela thead tr th,
.tabela :deep(thead tr th) {
  padding: 0;
  text-align: left;
}

.tabela thead tr th .header,
.tabela :deep(thead tr th .header) {
  color: rgb(75 85 99);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;

  padding: 0.5rem 0.5rem;

  white-space: nowrap;
}

.tabela thead tr th>button,
.tabela :deep(thead tr th > button) {
  color: rgb(75 85 99);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
}

.tabela thead tr th>*:not(button),
.tabela :deep(thead tr th > *:not(button)) {
  color: rgb(75 85 99);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
}

.tabela tbody {
  border-top: 1px solid #e5e7eb;
}

.tabela tbody tr td,
.tabela tbody :deep(tr td) {
  padding: 0.5rem 0.5rem;
  margin: 0;
}

.tabela tbody tr~tr,
.tabela tbody :deep(tr ~ tr) {
  border-top: 1px solid #e5e7eb;
}

.tabela:not(.loading) tbody tr:hover,
.tabela:not(.loading) tbody :deep(tr:hover) {
  background: var(--gray-color-200);
}

.tabela-vazia {
  text-align: center;
}

.tabela-vazia tr td {
  padding: 8px;
}

:deep(.coluna-btn) {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  max-width: 270px;
}

:deep(.coluna-acoes) {
  max-width: 50px;
  width: 50px;
}

.loading {
  position: relative;
  overflow: hidden;
}

.overlay {
  display: none;
  position: absolute;
  top: 0px;
  width: 100%;
  height: calc(100% - 0px);
  background-color: rgba(200, 200, 200, 0.4) !important;
}

.loading .overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabela-altura-limitada {
  max-height: 600px;
  overflow: auto;
}

.listras :deep(tr:nth-child(odd)) {
  background-color: #eff0f2;
}
</style>
