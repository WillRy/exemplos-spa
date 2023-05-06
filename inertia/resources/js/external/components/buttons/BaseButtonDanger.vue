<template>
  <BaseButton class="btn-danger" :size="size" :min="min" :loading="loading" :outline="outline" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonDanger",
  components: {BaseButton},
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
    },
    outline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>



.btn-danger {
  background: var(--danger-button-background);
  color: var(--danger-button-color);
  border: 1px solid var(--danger-button-border);
}

.btn-danger:hover {
  background: var(--danger-button-hover-background);
  color: var(--danger-button-hover-color);
}

.btn-danger:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--danger-button-focus-shadow);
  background: var(--danger-button-focus-background);
}

.btn-danger:active {
  background: var(--danger-button-active-background);
}

.btn-danger:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}


.btn-danger:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-danger :deep(path) {
  fill: var(--danger-button-color);
}

.btn-danger:hover :deep(path) {
  fill: var(--danger-button-hover-color);
}

.btn-danger:focus :deep(path) {
  fill: var(--danger-button-focus-color);
}

.btn-danger:active :deep(path) {
  fill: var(--danger-button-active-color);
}
</style>
