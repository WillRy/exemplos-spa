<template>
  <div class="painel-agrupamento" :class="[`mb-${marginBottom}`, { 'ocupar-altura-maxima': ocuparAlturaMaxima }]">
    <div class="painel-agrupamento-header">
      <OverlineText v-if="titulo" class="titulo" size="sm">
        {{ titulo }}
      </OverlineText>
      <slot name="header"></slot>
    </div>
    <div class="painel-agrupamento-borda" :class="[
    classeFundoCinza,
    classePadding,
    classeBorda
  ]" :style="{ minHeight: alturaMinima, maxHeight: alturaMaxima, overflow: alturaMaxima ? 'auto' : '' }"
      v-on:scroll="onScroll">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import OverlineText from "../text/OverlineText.vue";
import { PropType } from "vue";

type MarginBottomType = "0" | "1" | "2" | "3" | "4" | "5" | "6" | 'padrao';
type PaddingType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'padrao';

export default {
  name: "BoxSection",
  props: {
    titulo: {
      type: String,
    },
    fundoCinza: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String as PropType<PaddingType>,
      default: "padrao",
    },
    marginBottom: {
      type: String as PropType<MarginBottomType>,
      default: "3",
    },
    ocuparAlturaMaxima: {
      type: Boolean,
      default: false,
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
      default: true,
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
    }
  },
  components: { OverlineText },
  methods: {
    onScroll(event: Event) {
      this.$emit("scroll", event);
    },
  }
};
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

.painel-agrupamento.ocupar-altura-maxima {
  height: 100%;
}

.painel-agrupamento-borda {
  border-radius: 8px;
  flex: 1;
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

.alturaMaxima {
  overflow: auto;
}
</style>
