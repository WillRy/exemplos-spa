<template>
  <BaseButton class="btn-danger-tertiary" :size="size" :min="min" :loading="loading" :outline="outline">
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
.btn-danger-tertiary {
  background: transparent;
  color: var(--error-color-600);
}

.btn-danger-tertiary:hover {
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger-tertiary:focus-visible {
  border: 1px solid var(--error-color-600);
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger-tertiary:active {
  background: var(--error-color-500);
  color: #fff;
}

.btn-danger-tertiary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-tertiary:deep(.fill path) {
  fill: var(--error-color-600);
}

.btn-danger-tertiary.outline:hover :deep(.fill path) {
  fill: #fff;
}

.btn-danger-tertiary:deep(.stroke path) {
  stroke: #fff;
}

.btn-danger-tertiary.outline:hover :deep(.stroke path) {
  stroke: #fff;
}
</style>
