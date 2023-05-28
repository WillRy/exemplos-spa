<template>
  <BaseButton class="btn-secondary" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script>
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
  background: var(--secondary-button-background);
  color: var(--secondary-button-color);
  border: 1px solid var(--secondary-button-border);
}

.btn-secondary:hover {
  border: 1px solid var(--secondary-button-hover-border);
  color: var(--secondary-button-hover-color);
  background: var(--secondary-button-hover-background);
}

.btn-secondary:focus:not(:active) {
  border: 1px solid var(--secondary-button-focus-border);
  background: var(--secondary-button-focus-background);
  box-shadow: 0 0 0 1px var(--secondary-button-focus-shadow);
}

.btn-secondary:active {
  background: var(--secondary-button-active-background);
  color: var(--secondary-button-active-color);
  border: 1px solid var(--secondary-button-active-border);
}

.btn-secondary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-secondary:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-secondary :deep(path) {
  fill: var(--secondary-button-color);
}

.btn-secondary:hover :deep(path) {
  fill: var(--secondary-button-hover-color);
}

.btn-secondary:focus :deep(path) {
  fill: var(--secondary-button-color);
}

.btn-secondary:active :deep(path) {
  fill: var(--secondary-button-active-color);
}
</style>
