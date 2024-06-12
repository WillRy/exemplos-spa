<template>
  <button
    :class="{ active: active, disabled: disabled }"
    class="navegacao-abas-item"
    @click="navegar"
  >
    <slot name="antes"></slot>
    <span class="conteudo">
      <slot></slot>
    </span>

    <div class="contador" :class="{ active: active }" v-if="deveExibirContador">
      {{ contador }}
    </div>
    <slot name="depois"></slot>
  </button>
</template>

<script>
export default {
  name: "NavegacaoAbasItem",
  props: {
    active: {
      default: false,
    },
    disabled: {
      default: false,
    },
    contador: {
      default: null
    },
    exibirContador: {
      default: false
    },
    exibeContadorComZero: {
      default: true
    }
  },
  computed: {
    deveExibirContador() {
      if(!this.exibirContador) return false;

      if(this.exibeContadorComZero && this.contador >= 0) return true;

      return this.contador > 0;
    }
  },
  methods: {
    navegar() {
      if (this.disabled) return;
      this.$emit("navegar");
    },
  },
};
</script>

<style scoped>
.navegacao-abas-item {
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 0;
  outline: 0;
  background: none;
  max-height: 36px;
  font-size: 0.875rem;
  gap: 6px;
}

.navegacao-abas-item {
  color: #fff;
}

.navegacao-abas-item :deep(svg path) {
  fill: #fff;
}

.navegacao-abas-item.active {
  background: #fff;
  color: var(--primary-color-principal);
}

.navegacao-abas-item:focus:not(.active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-color-principal-hover);
  background: var(--primary-color-principal-hover);
  color: #fff;
}

.navegacao-abas-item:focus:not(.active) :deep(svg path) {
  fill: #fff !important;
}

/* 
.navegacao-abas-item:focus {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--second-color-400);
    background: var(--second-color-400);
    color: #fff;
} */

/* .navegacao-abas-item:focus :deep(svg path) {
    fill: #fff;
} */

.navegacao-abas-item:not(.active):hover {
  background: var(--primary-color-principal-hover);
  color: #fff;
}

.navegacao-abas-item:not(.active):hover :deep(svg path) {
  fill: #fff;
}

.navegacao-abas-item.active :deep(svg path) {
  fill: var(--primary-color-principal);
}

.navegacao-abas-item .conteudo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

.navegacao-abas-item::v-deep(.conteudo img) {
  margin-right: 8px;
}

.navegacao-abas-item:last-of-type {
  border-bottom-right-radius: 8px;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contador {
    background: #fff;
    color: var(--primary-color-principal);
    padding: 4px;
    border-radius: 5px;
    font-weight: 700;
    font-size: 14px;
}

.contador.active {
  background: var(--primary-color-principal);
  color: #fff;
}
</style>
