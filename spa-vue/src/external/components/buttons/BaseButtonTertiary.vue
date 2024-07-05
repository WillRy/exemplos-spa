<template>
  <BaseButton class="btn-tertiary" :size="size" :min="min" :loading="loading" :is="is" :full="full">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from 'vue'
import BaseButton from './BaseButton.vue'

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: 'BaseButtonTertiary',
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
.btn-tertiary {
  background: none;
  color: var(--primary-color-principal);
  border: 1px solid transparent;
}

.btn-tertiary:hover {
  background: none;
  color: var(--primary-color-500);
  border: 1px solid var(--primary-color-500);
}

.btn-tertiary:focus:not(:active) {
  background: none;
  color: var(--primary-color-500);
  border: 1px solid var(--primary-color-500);
}

.btn-tertiary:active {
  background: var(--primary-color-400);
  color: #fff;
  border: 1px solid var(transparent);
}

.btn-tertiary:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}

.btn-tertiary:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.btn-tertiary :deep(path) {
  fill: var(--primary-color-principal);
}

.btn-tertiary:hover :deep(path) {
  fill: var(--primary-color-500);
}

.btn-tertiary:focus :deep(path) {
  fill: var(--primary-color-500);
}

.btn-tertiary:active :deep(path) {
  fill: #fff;
}
</style>
