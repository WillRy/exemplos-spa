<template>
  <div class="painel-agrupamento" :class="`mb-${marginBottom}`">
    <div class="painel-agrupamento-header">
      <OverlineText size="lg" v-if="titulo" class="titulo">
        {{ titulo }}
      </OverlineText>
      <slot name="header"></slot>
    </div>
    <div
      class="painel-agrupamento-borda"
      :class="[classeFundoCinza, classePadding]"
      :style="{
        minHeight: alturaMinima,
        maxHeight: alturaMaxima,
        overflow: alturaMaxima ? 'auto' : ''
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import OverlineText from '../text/OverlineText.vue'
import { PropType } from 'vue'

type MarginBottomType = '0' | '1' | '2' | '3' | '4' | '5' | '6'

export default {
  name: 'BoxSection',
  props: {
    titulo: {
      type: String
    },
    fundoCinza: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: '2',
      validator(value: string) {
        return ['0', '1', '2', '3', '4', '5', '6'].includes(value)
      }
    },
    marginBottom: {
      type: String as PropType<MarginBottomType>,
      default: '3'
    },
    alturaMaxima: {
      type: String,
      default: null,
      required: false
    },
    alturaMinima: {
      type: String,
      default: null,
      required: false
    }
  },
  computed: {
    classeFundoCinza() {
      if (this.fundoCinza) {
        return 'painel-agrupamento-cinza'
      }

      return ''
    },
    classePadding() {
      if (this.padding) {
        return `p-${this.padding}`
      }

      return ''
    }
  },
  components: { OverlineText }
}
</script>
<style scoped>
.titulo {
  display: block;
  margin-bottom: var(--spacing-1) !important;
  margin-left: var(--spacing-3) !important;
}

.painel-agrupamento {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.painel-agrupamento-borda {
  border: 1px solid #eff0f2;
  border-radius: 8px;
  flex: 1;
}

.painel-agrupamento-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.painel-agrupamento-cinza {
  background: #e7e7e7;
}

.alturaMaxima {
  overflow: auto;
}

.ocuparAlturaMaxima {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
