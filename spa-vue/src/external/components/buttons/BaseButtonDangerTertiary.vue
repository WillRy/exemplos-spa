<template>
  <BaseButton
    class="btn-danger-tertiary"
    :size="size"
    :min="min"
    :loading="loading"
    :is="is"
    :full="full"
    variant="danger-tertiary"
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
.btn-danger-tertiary {
  background: transparent;
  color: var(--color-error-600);
  border: 1px solid transparent;
}

.btn-danger-tertiary:hover {
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-tertiary:focus:not(:active) {
  border: 1px solid var(--color-error-600);
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-tertiary:active {
  background: var(--color-error-500);
  color: #fff;
}

.btn-danger-tertiary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-tertiary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-danger-tertiary :deep(path) {
  fill: var(--color-error-600);
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
