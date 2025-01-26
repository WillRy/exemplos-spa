<template>
  <BaseButton class="btn-secondary" :class="{'invertido': invertido}" :size="size" :min="min" :loading="loading" :is="is" :full="full">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from "vue";
import BaseButton from "./BaseButton.vue";

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: "BaseButtonSecondary",
  components: {BaseButton},
  props: {
    is: {
      type: String,
      default: 'button'
    },
    size: {
      type: String as PropType<SizeButton>,
      default: 'md'
    },
    min: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as PropType<TypeButton>,
      default: 'button'
    },
    full: {
      type: Boolean,
      default: false
    },
    invertido: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn-secondary {
  background: none;
  color: var(--primary-color-principal);
  border: 1px solid var(--primary-color-principal);
}

.btn-secondary:hover {
  background: var(--primary-color-50);
  color: var(--primary-color-600);
  border: 1px solid var(--primary-color-500);
}

.btn-secondary:focus:not(:active) {
  background: var(--primary-color-50);
  color: var(--primary-color-500);
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px var(--primary-color-500);
}

.btn-secondary:active {
  background: var(--primary-color-400);
  color: #fff;
  border: 1px solid var(--primary-color-400);
}

.btn-secondary:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}

.btn-secondary:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.btn-secondary :deep(path) {
  fill: var(--primary-color-principal);
}

.btn-secondary:hover :deep(path) {
  fill: var(--primary-color-500);
}

.btn-secondary:focus :deep(path) {
  fill: var(--primary-color-principal);
}

.btn-secondary:active :deep(path) {
  fill: #fff;
}

.btn-secondary.invertido {
  background: var(--primary-color-principal);
  color: #fff;
  border: 1px solid #fff;
}

.btn-secondary.invertido :deep(path) {
  fill: #fff;
}

.btn-secondary.invertido:hover {
  background: var(--primary-color-500);
  color: var(--primary-color-50);
  border: 1px solid transparent;
  box-shadow: none;
}

.btn-secondary.invertido:hover :deep(path) {
  fill: var(--primary-color-600);
}

.btn-secondary.invertido:focus:not(:active) {
  background: var(--primary-color-500);
  color: var(--primary-color-50);
  border: 1px solid #fff;
  box-shadow: none;
}

.btn-secondary.invertido:focus :deep(path) {
  fill: var(--primary-color-50);
}

.btn-secondary.invertido:active {
  background: #fff;
  color: var(--primary-color-500);
  border: 1px solid transparent;
}

.btn-secondary.invertido:active :deep(path) {
  fill: #fff;
}
</style>
