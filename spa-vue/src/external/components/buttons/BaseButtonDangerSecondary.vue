<template>
  <BaseButton
    class="btn-danger-secondary"
    :size="size"
    :min="min"
    :loading="loading"
    :is="is"
    :full="full"
    variant="danger-secondary"
  >
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from 'vue'
import BaseButton from './BaseButton.vue'

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: 'BaseButtonDanger',
  components: { BaseButton },
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
    }
  }
}
</script>

<style scoped>
.btn-danger-secondary {
  background: transparent;
  color: var(--color-error-600);
  border: 1px solid var(--color-error-600);
}

.btn-danger-secondary:hover {
  background: var(--color-error-400);
  color: #fff;
  border: 1px solid var(--color-error-600);
}

.btn-danger-secondary:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-error-400);
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-secondary:active {
  background: var(--color-error-500);
  color: #fff;
  border: 1px solid var(--color-error-700);
}

.btn-danger-secondary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-secondary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-danger-secondary :deep(path) {
  fill: var(--color-error-600);
}

.btn-danger-secondary:hover :deep(path) {
  fill: #fff;
}

.btn-danger-secondary:focus :deep(path) {
  fill: #fff;
}

.btn-danger-secondary:active :deep(path) {
  fill: #fff;
}
</style>
