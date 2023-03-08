<template>
  <BaseButton class="btn-secondary" :size="size" :min="min" :loading="loading">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
  name: "BaseButtonSecondary",
  components: {BaseButton},
  props: {
    size: {
      type: String,
      default: 'md'
    },
    min: {
      type: Boolean,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn-secondary {
  background: none;
  color: var(--primary-color-400);
  border: 1px solid var(--primary-color-400);
}

.btn-secondary:hover {
  border: 1px solid var(--primary-color-300);
  color: var(--primary-color-300);
  background: var(--primary-color-50);
}

.btn-secondary:focus-visible {
  border: 1px solid #fff;
  background: var(--primary-color-50);
  box-shadow: 0 0 0 1px var(--primary-color-300);
}

.btn-secondary:active {
  background: var(--primary-color-200);
  color: #fff;
  border: 1px solid var(--primary-color-400);
}

.btn-secondary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}
</style>
