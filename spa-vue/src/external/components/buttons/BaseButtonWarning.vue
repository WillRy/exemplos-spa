<template>
  <BaseButton class="btn-warning" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from 'vue'
import BaseButton from './BaseButton.vue'

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: 'BaseButtonWarning',
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
.btn-warning {
  background: var(--color-warning-600);
  color: #000;
}

.btn-warning:hover {
  background: var(--color-warning-300);
  color: #000;
}

.btn-warning:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-warning-300);
  background: var(--color-warning-300);
}

.btn-warning:active {
  color: #000;
  background: var(--color-warning-700);
}

.btn-warning:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}
</style>
