<template>
  <div
    class="painel-agrupamento"
    :class="[
      `mb-${marginBottom}`,
      { 'ocupar-altura-maxima': ocuparAlturaMaxima, encolher: encolherAutomatico },
      alturaMaximaComScroll
    ]"
  >
    <div class="painel-agrupamento-header">
      <OverlineText v-if="titulo" class="titulo" size="sm">
        {{ titulo }}
      </OverlineText>
      <slot name="header"></slot>
    </div>
    <div
      class="painel-agrupamento-borda"
      ref="conteudoDiv"
      :class="[classeFundoCinza, classePadding, classeBorda, alturaMaximaComScroll]"
      :style="{
        minHeight: alturaMinima,
        maxHeight: alturaMaxima,
        overflow: ocuparAlturaMaxima && alturaMaximaComScroll ? 'auto' : ''
      }"
      v-on:scroll="onScroll"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import OverlineText from '../text/OverlineText.vue'
import { PropType, ref } from 'vue'

type MarginBottomType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'padrao'
type PaddingType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'padrao'

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
      type: String as PropType<PaddingType>,
      default: 'padrao'
    },
    marginBottom: {
      type: String as PropType<MarginBottomType>,
      default: '3'
    },
    ocuparAlturaMaxima: {
      type: Boolean,
      default: false
    },
    encolherAutomatico: {
      type: Boolean,
      default: false
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
    },
    temBorda: {
      type: Boolean,
      default: true
    },
    alturaMaximaComScroll: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { expose }) {
    const conteudoDiv = ref(null)
    const scrollBottom = () => {
      if (!conteudoDiv.value) {
        return
      }

      const conteudo = conteudoDiv.value as HTMLElement
      conteudo.scrollTo({ top: conteudo.scrollHeight, behavior: 'smooth' })
    }

    expose({ scrollBottom })

    return {
      scrollBottom,
      conteudoDiv
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
    },
    classeBorda() {
      if (this.temBorda) {
        return 'borda'
      }

      return ''
    },
    classeAlturaMaximaComScroll() {
      return this.alturaMaximaComScroll ? 'altura-maxima-scroll' : ''
    }
  },
  components: { OverlineText },
  methods: {
    onScroll(event: Event) {
      this.$emit('scroll', event)
    }
  }
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
}

.painel-agrupamento.encolher {
  overflow: hidden;
}

.painel-agrupamento.ocupar-altura-maxima {
  height: 100%;
}

.painel-agrupamento-borda {
  border-radius: 8px;
  flex: 1;
}

.encolher .painel-agrupamento-borda {
  flex-shrink: 1;
  flex-grow: 1;
  overflow: auto;
}

.borda {
  border: 1px solid #eff0f2;
}

.painel-agrupamento-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.painel-agrupamento-cinza {
  background: #e7e7e7;
}

.altura-maxima-scroll .acesso-bloqueado-container {
  overflow: hidden;
  height: 100%;
}

.altura-maxima-scroll {
  overflow: hidden;
  height: 100%;
}

.alturaMaxima {
  overflow: auto;
}
</style>
