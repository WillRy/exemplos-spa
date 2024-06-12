<template>
  <BaseButton class="btn-danger" :size="size" :min="min" :loading="loading" :is="is" :full="full">
    <slot></slot>
  </BaseButton>
</template>

<script lang="ts">
import { PropType } from "vue";
import BaseButton from "./BaseButton.vue";

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: "BaseButtonDanger",
  components: {BaseButton},
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



.btn-danger {
  background: var(--error-color-600);
  color: #fff;
  border: 1px solid transparent;
}

.btn-danger:hover {
  background: var(--error-color-400);
  color: #fff;
}

.btn-danger:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--error-color-400);
  background: var(--error-color-400);
}

.btn-danger:active {
  background: var(--error-color-700);
}

.btn-danger:disabled {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}


.btn-danger:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.btn-danger :deep(path) {
  fill: #fff;
}

.btn-danger:hover :deep(path) {
  fill: #fff;
}

.btn-danger:focus :deep(path) {
  fill: #fff;
}

.btn-danger:active :deep(path) {
  fill: #fff;
}
</style>
