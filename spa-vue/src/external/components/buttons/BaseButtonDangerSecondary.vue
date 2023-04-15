<template>
  <BaseButton class="btn-danger-secondary" :size="size" :min="min" :loading="loading" :outline="outline">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonDanger",
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
    },
    outline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn-danger-secondary {
  background: transparent;
  color: var(--error-color-600);
  border: 1px solid var(--error-color-600);
}

.btn-danger-secondary:hover {
  background: var(--error-color-400);
  color: #fff;
  border: 1px solid var(--error-color-600);
}

.btn-danger-secondary:focus-visible {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--error-color-400);
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger-secondary:active {
  background: var(--error-color-500);
  color: #fff;
  border: 1px solid var(--error-color-700);
}

.btn-danger-secondary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-secondary:deep(.fill path) {
  fill: var(--error-color-600);
}

.btn-danger-secondary.outline:hover :deep(.fill path) {
  fill: #fff;
}

.btn-danger-secondary:deep(.stroke path) {
  stroke: #fff;
}

.btn-danger-secondary.outline:hover :deep(.stroke path) {
  stroke: #fff;
}
</style>
