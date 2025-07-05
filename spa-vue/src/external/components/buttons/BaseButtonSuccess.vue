<template>
  <BaseButton class="btn-success" :size="size" :min="min" :loading="loading" :is="is" :full="full">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from 'vue'
import BaseButton from './BaseButton.vue'

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: 'BaseButtonSuccess',
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
.btn-success {
  background: var(--color-success-600);
  color: #fff;
}

.btn-success:hover {
  background: var(--color-success-400);
  color: #fff;
}

.btn-success:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-success-400);
  background: var(--color-success-400);
}

.btn-success:active {
  background: var(--color-success-700);
}

.btn-success:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}
</style>
