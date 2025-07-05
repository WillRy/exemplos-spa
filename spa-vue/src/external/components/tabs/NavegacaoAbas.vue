<template>
  <div class="navegacao-abas-container">
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'NavegacaoAbas',
  emits: ['update:valor', 'navegar'],
  props: {
    valor: {
      type: String,
      required: true,
      default: ''
    },
    manual: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      valorAtivo: computed(() => this.valor),
      mudarAba: (aba) => this.mudarAba(aba)
    }
  },
  methods: {
    mudarAba(valor) {
      if (this.manual) {
        this.$emit('navegar', valor)
      } else {
        this.$emit('update:valor', valor)
      }
    }
  }
}
</script>

<style scoped>
.navegacao-abas-container {
  gap: 4px;
  background: var(--color-primary-principal);
  box-shadow: inset 0px 2px 4px #00000029;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  padding: 4px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
}
</style>
