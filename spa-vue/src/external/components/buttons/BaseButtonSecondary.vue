<template>
  <BaseButton class="btn-secondary" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonSecondary",
  components: {BaseButton},
  props: {
    is: {
      type: String,
      default: 'button'
    },
    size: {
      type: String,
      default: 'md'
    },
    min: {
      type: Boolean,
      default: false
    },
    loading: {
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
</style>
