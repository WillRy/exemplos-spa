<template>
  <BaseButton class="btn-tertiary" :size="size" :min="min" :loading="loading">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonTertiary",
  components: {BaseButton},
  props: {
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
  background: none;
  color: var(--primary-color-400);
  border: 1px solid transparent;
}

.btn-tertiary:hover {
  background: var(--primary-color-50);
  color: var(--primary-color-300);
  border: 1px solid transparent;
}

.btn-tertiary:focus-visible {
  color: var(--primary-color-300);
  border: 1px solid var(--primary-color-300);
  background: var(--primary-color-50);
}

.btn-tertiary:active {
  background: var(--primary-color-200);
  color: #fff;
  border: 1px solid transparent;
}

.btn-tertiary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-tertiary :deep(path) {
  fill: var(--primary-color-400);
}

.btn-tertiary:hover :deep(path) {
  fill: var(--primary-color-400);
}

.btn-tertiary.active :deep(path) {
  fill: #fff;
}

</style>
