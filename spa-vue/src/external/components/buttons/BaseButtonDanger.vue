<template>
  <BaseButton class="btn-danger" :size="size" :min="min" :loading="loading">
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
    }
  }
}
</script>

<style scoped>
.btn-danger {
  background: var(--error-color-600);
  color: #fff;
}

.btn-danger:hover {
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger:focus-visible {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--error-color-400);
  background: var(--error-color-400);
}

.btn-danger:active {
  background: var(--error-color-700);
}

.btn-danger:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}


.btn-danger :deep(.fill path) {
  fill: #fff;
}

.btn-danger:hover :deep(.fill path) {
  fill: #fff;
}

.btn-danger :deep(.stroke path) {
  stroke: #fff;
}

.btn-danger:hover :deep(.stroke path) {
  stroke: #fff;
}
</style>
