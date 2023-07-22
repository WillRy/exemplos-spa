<template>
  <BaseButton class="btn-primary" :size="size" :min="min" :loading="loading" :is="is">
    <slot></slot>
  </BaseButton>
</template>

<script>
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
  background: var(--primary-button-background);
  color:  var(--primary-button-color);
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: var(--primary-button-hover-background);
  color: var(--primary-button-hover-color);
}

.btn-primary:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-button-focus-shadow);
  background: var(--primary-button-focus-background);
  color: var(--primary-button-focus-color);
}

.btn-primary:active {
  background: var(--primary-button-active-background);
  color: var(--primary-button-active-color);
}

.btn-primary:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}


.btn-primary:disabled :deep(path) {
  fill: var(--gray-300);
}

.btn-primary :deep(path) {
  fill: var(--primary-button-color);
}

.btn-primary:hover :deep(path) {
  fill: var(--primary-button-hover-color);
}

.btn-primary:focus :deep(path) {
  fill: var(--primary-button-focus-color);
}

.btn-primary:active :deep(path) {
  fill: var(--primary-button-active-color);
}

</style>
