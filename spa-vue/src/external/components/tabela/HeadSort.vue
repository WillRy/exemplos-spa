<template>
  <th :style="allStyles">
    <button @click="sortBy(nome)" v-if="!disabled" type="button" class="head-container">
      <slot></slot>

      <template v-if="!$slots.default">
        <span v-if="info" v-tooltip="{ content: info }">
          {{ texto }}
          <svg class="info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
        </span>
        <span v-else>
          {{ texto }}
        </span>
      </template>

      <SortAscIcon
        v-if="(ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'asc'"
      />
      <SortDescIcon
        v-else-if="
          (ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'desc'
        "
      />

      <SortIcon v-else />
    </button>
    <span v-else-if="!$slots.default" class="head-container">
      <span v-if="info" v-tooltip="{ content: info }">
        {{ texto }}
        <svg class="info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      </span>
      <span v-else>
        {{ texto }}
      </span>
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </th>
</template>

<script lang="ts">
import { VTooltip } from 'floating-vue'

import SortAscIcon from '../icons/SortAscIcon.vue'
import SortDescIcon from '../icons/SortDescIcon.vue'
import SortIcon from '../icons/SortIcon.vue'
import { inject } from 'vue'

type SortFunction = (sort: {sortName: string, sortOrder: string}) => void

export default {
  name: 'HeadSort',
  components: { SortIcon, SortDescIcon, SortAscIcon },
  props: {
    nome: {
      type: String,
      required: true,
      default: ''
    },
    texto: {
      type: String,
      required: false
    },
    width: {
      type: String,
      default: ''
    },
    minWidth: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    permiteRemoverOrdenacao: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allStyles() {
      const styles = {}
      if (this.maxWidth) {
        styles['max-width'] = this.maxWidth
      }

      if (this.minWidth) {
        styles['min-width'] = this.minWidth
      }

      if (this.width) {
        styles['width'] = this.width
        styles['max-width'] = this.width
      }

      return styles
    },
    orderMinuscula() {
      if (!this.order) return 'sort'
      return this.order.toLowerCase()
    },
    estaOrdenando() {
      return (this.ordenando === this.nome || this.ordenando === this.order) && this.ordenando
    }
  },
  directives: {
    tooltip: VTooltip
  },
  setup() {
    return {
      sortByTabela: inject('sortByTabela') as SortFunction,
      ordenando: inject('ordenando') as string,
      order: inject('order') as string
    }
  },
  methods: {
    sortBy(campo) {
      let sortName = campo
      let sortOrder = this.order

      sortName = campo

      if (this.permiteRemoverOrdenacao) {
        if (sortOrder === 'asc') {
          sortOrder = 'desc'
        } else if (sortOrder === 'desc' && this.estaOrdenando) {
          sortOrder = ''
          sortName = ''
        } else {
          sortOrder = 'asc'
        }
      } else {
        if (sortName !== campo) {
          sortOrder = 'asc'
        } else {
          sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        }
      }

      this.sortByTabela({
        sortName: sortName,
        sortOrder: sortOrder
      })
    }
  }
}
</script>

<style scoped>
th button,
th :deep(button) {
  color: var(--gray-color-700);
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.head-container > span,
.head-container > :deep(span),
.head-container > button > span {
  color: var(--gray-color-700);
  font-weight: 700;
  padding: 0.5rem;
  white-space: nowrap;
  background: none;
  border: none;
  font-size: 1rem;
  display: block;
  text-align: left;
}


.info {
  width: 20px;
  height: 20px;
  margin-left: 6px;
  color: var(--primary-color-principal);
}

.info path {
  fill: var(--primary-color-principal);
}
</style>
