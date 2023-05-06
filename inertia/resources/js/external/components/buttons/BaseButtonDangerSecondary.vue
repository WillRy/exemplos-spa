<template>
  <BaseButton class="btn-danger-secondary" :size="size" :min="min" :loading="loading" :outline="outline" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonDanger",
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
    },
    outline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn-danger-secondary {
  background: var(--danger-secondary-button-background);
  color: var(--danger-secondary-button-color);
  border: 1px solid var(--danger-secondary-button-border);
}

.btn-danger-secondary:hover {
  background: var(--danger-secondary-button-hover-background);
  color: var(--danger-secondary-button-hover-color);
  border: 1px solid var(--danger-secondary-button-hover-border);
}

.btn-danger-secondary:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--danger-secondary-button-focus-shadow);
  background: var(--danger-secondary-button-focus-background);
  color: var(--danger-secondary-button-focus-color);
}

.btn-danger-secondary:active {
  background: var(--danger-secondary-button-active-background);
  color: var(--danger-secondary-button-active-color);
  border: 1px solid var(--danger-secondary-button-active-border);
}

.btn-danger-secondary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-secondary:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-danger-secondary :deep(path) {
  fill: var(--danger-secondary-button-color);
}

.btn-danger-secondary:hover :deep(path) {
  fill: var(--danger-secondary-button-hover-color);
}

.btn-danger-secondary:focus :deep(path) {
  fill: var(--danger-secondary-button-focus-color);
}

.btn-danger-secondary:active :deep(path) {
  fill: var(--danger-secondary-button-active-color);
}
</style>
