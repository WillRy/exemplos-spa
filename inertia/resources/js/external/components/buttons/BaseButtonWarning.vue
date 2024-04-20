<template>
  <BaseButton class="btn-warning" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import BaseButton from './BaseButton.vue'

export default {
  name: 'BaseButtonWarning',
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
    }
  }
}
</script>

<style scoped>
.btn-warning {
  background: var(--warning-color-600);
  color: #000;
}

.btn-warning:hover {
  background: var(--warning-color-300);
  color: #000;
}

.btn-warning:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--warning-color-300);
  background: var(--warning-color-300);
}

.btn-warning:active {
  color: #000;
  background: var(--warning-color-700);
}

.btn-warning:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}
</style>
