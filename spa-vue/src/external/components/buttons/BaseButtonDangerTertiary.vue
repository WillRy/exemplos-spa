<template>
  <BaseButton class="btn-danger-tertiary" :size="size" :min="min" :loading="loading" :outline="outline" :is="is">
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

.btn-danger-tertiary {
  background: var(--danger-tertiary-button-background);
  color: var(--danger-tertiary-button-color);
  border: 1px solid transparent;
}

.btn-danger-tertiary:hover {
  background: var(--danger-tertiary-button-hover-background);
  color: var(--danger-tertiary-button-hover-color);
}

.btn-danger-tertiary:focus:not(:active) {
  border: 1px solid var(--danger-tertiary-button-focus-border);
  background: var(--danger-tertiary-button-focus-background);
  color: var(--danger-tertiary-button-focus-color);
}

.btn-danger-tertiary:active {
  background: var(--danger-tertiary-button-active-background);
  color: var(--danger-tertiary-button-active-color);
}

.btn-danger-tertiary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-tertiary:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-danger-tertiary :deep(path) {
  fill: var(--danger-tertiary-button-color);
}

.btn-danger-tertiary:hover :deep(path) {
  fill: var(--danger-tertiary-button-hover-color);
}

.btn-danger-tertiary:focus :deep(path) {
  fill: var(--danger-tertiary-button-focus-color);
}

.btn-danger-tertiary:active :deep(path) {
  fill: var(--danger-tertiary-button-active-color);
}
</style>
