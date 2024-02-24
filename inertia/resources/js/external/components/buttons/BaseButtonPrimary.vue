<template>
  <BaseButton class="btn-primary" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import BaseButton from "./BaseButton.vue";

export default {
  name: "BaseButtonPrimary",
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
    }
  }
}
</script>

<style scoped>
.btn-primary {
  background: var(--primary-color-principal);
  color: #fff;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: var(--primary-color-principal-hover);
  color: #fff;
}

.btn-primary:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-color-principal-focus);
  background: var(--primary-color-principal-focus);
  color: #fff;
}

.btn-primary:active {
  background: var(--primary-color-principal-active);
  color: #fff;
}

.btn-primary:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}


.btn-primary:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.btn-primary :deep(path) {
  fill: #fff;
}

.btn-primary:hover :deep(path) {
  fill: #fff;
}

.btn-primary:focus :deep(path) {
  fill: #fff;
}

.btn-primary:active :deep(path) {
  fill: #fff;
}

</style>
