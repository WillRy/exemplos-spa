<template>
  <BaseButton class="btn-tertiary" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonTertiary",
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
.btn-tertiary {
  background: var(--tertiary-button-background);
  color: var(--tertiary-button-color);
  border: 1px solid var(--tertiary-button-border);
}

.btn-tertiary:hover {
  background: var(--tertiary-button-hover-background);
  color: var(--tertiary-button-hover-color);
  border: 1px solid var(--tertiary-button-hover-border);
}

.btn-tertiary:focus:not(:active) {
  color: var(--tertiary-button-focus-color);
  border: 1px solid var(--tertiary-button-focus-border);
  background: var(--tertiary-button-focus-background);
}

.btn-tertiary:active {
  background: var(--tertiary-button-active-background);
  color: var(--tertiary-button-active-color);
  border: 1px solid var(--tertiary-button-active-border);
}

.btn-tertiary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-tertiary:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-tertiary :deep(path) {
  fill: var(--tertiary-button-color);
}

.btn-tertiary:hover :deep(path) {
  fill: var(--tertiary-button-hover-color);
}

.btn-tertiary:focus :deep(path) {
  fill: var(--tertiary-button-focus-color);
}

.btn-tertiary:active :deep(path) {
  fill: var(--tertiary-button-active-color);
}

</style>
