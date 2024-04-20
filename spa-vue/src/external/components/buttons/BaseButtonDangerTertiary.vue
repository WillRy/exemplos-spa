<template>
  <BaseButton
    class="btn-danger-tertiary"
    :size="size"
    :min="min"
    :loading="loading"
    :outline="outline"
    :is="is"
  >
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import BaseButton from './BaseButton.vue'

export default {
  name: 'BaseButtonDanger',
  components: { BaseButton },
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
  background: transparent;
  color: var(--error-color-600);
  border: 1px solid transparent;
}

.btn-danger-tertiary:hover {
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger-tertiary:focus:not(:active) {
  border: 1px solid var(--error-color-600);
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger-tertiary:active {
  background: var(--error-color-500);
  color: #fff;
}

.btn-danger-tertiary:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-tertiary:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.btn-danger-tertiary :deep(path) {
  fill: var(--error-color-600);
}

.btn-danger-tertiary:hover :deep(path) {
  fill: #fff;
}

.btn-danger-tertiary:focus :deep(path) {
  fill: #fff;
}

.btn-danger-tertiary:active :deep(path) {
  fill: #fff;
}
</style>
