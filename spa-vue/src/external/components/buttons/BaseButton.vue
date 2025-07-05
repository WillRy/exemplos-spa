<template>
  <component
    :is="is"
    class="btn"
    :class="[
      {
        'btn-min-width': min,
        'btn-sm': size === 'sm',
        'btn-md': size === 'md',
        'btn-lg': size === 'lg',
        'btn-full': full,
        outline: outline,
        invertido: invertido
      },
      variantClass
    ]"
    :disabled="disabled || loading"
    :data-loading="loading"
    :type="type"
  >
    <Loader v-if="loading" :height="loadingSize" :width="loadingSize" :cor-principal="true" />
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { PropType } from 'vue'
import Loader from '../Loader.vue'

type TypeButton = 'submit' | 'button'
type SizeButton = 'sm' | 'md' | 'lg'
type Variant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'danger-secondary'
  | 'danger-tertiary'

export default {
  name: 'BaseButton',
  components: { Loader },
  props: {
    variant: {
      type: String as PropType<Variant>,
      default: 'primary'
    },
    is: {
      type: String,
      default: 'button'
    },
    disabled: {
      default: false
    },
    size: {
      type: String as PropType<SizeButton>,
      default: 'md'
    },
    type: {
      type: String as PropType<TypeButton>,
      default: 'button'
    },
    min: {
      type: Boolean,
      default: false
    },
    full: {
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
    },
    invertido: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loadingSize() {
      switch (this.size) {
        case 'sm':
          return '14px'
        case 'md':
          return '16px'
        case 'lg':
          return '20px'
        default:
          return '16px'
      }
    },
    variantClass() {
      switch (this.variant) {
        case 'primary':
          return 'btn-primary'
        case 'secondary':
          return 'btn-secondary'
        case 'tertiary':
          return 'btn-tertiary'
        case 'danger':
          return 'btn-danger'
        case 'danger-secondary':
          return 'btn-danger-secondary'
        case 'danger-tertiary':
          return 'btn-danger-tertiary'
        default:
          return 'btn-primary'
      }
    }
  }
}
</script>

<style scoped>
:deep(*),
* {
  --border: 1px;
}

.btn {
  all: 'unset';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  outline: 0;
  gap: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  position: relative;
  text-decoration: none;
}

.btn *,
.btn :deep(*) {
  line-height: 1;
}

.btn:hover :deep(.loader path) {
  fill: currentColor !important;
}

.btn[data-loading='true'] {
  cursor: progress !important;
}

.btn-sm {
  font-size: 0.875rem;
  padding: 6px;
}

.btn-md {
  font-size: 0.875rem;
  padding: 8px 20px;
  min-height: 36px;
}

.btn-lg {
  font-size: 1rem;
  padding: 10px 20px;
  min-height: 42px;
}

.btn-min-width {
  min-width: 100px;
}

.btn-full {
  display: flex;
  width: 100%;
}

.btn > span {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  outline: 0;
  gap: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  font-size: 0.875rem;
}

.btn:disabled :deep(svg path) {
  fill: var(--color-gray-300) !important;
}
.btn:hover:disabled :deep(svg path) {
  fill: var(--color-gray-300) !important;
}

.btn-primary {
  background: var(--color-primary-principal);
  color: #fff;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: var(--color-primary-principal-hover);
  color: #fff;
}

.btn-primary:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-primary-principal-focus);
  background: var(--color-primary-principal-focus);
  color: #fff;
}

.btn-primary:active {
  background: var(--color-primary-principal-active);
  color: #fff;
}

.btn-primary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-primary:disabled :deep(path) {
  fill: var(--color-gray-300);
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

.btn-primary.invertido {
  background: #fff;
  color: var(--color-primary-principal);
  border: 1px solid transparent;
}

.btn-primary.invertido :deep(path) {
  fill: var(--color-primary-principal);
}

.btn-primary.invertido:hover {
  background: #fff;
  color: var(--color-primary-principal-hover);
}

.btn-primary.invertido:hover :deep(path) {
  fill: var(--color-primary-principal-hover);
}

.btn-primary.invertido:focus:not(:active) {
  background: #fff;
  color: var(--color-primary-principal-focus);
}

.btn-primary.invertido:hover :deep(path) {
  fill: var(--color-primary-principal-focus);
}

.btn-primary.invertido:active {
  background: #fff;
  color: var(--color-primary-700);
  border: 1px solid transparent;
}

.btn-primary.invertido:active :deep(path) {
  fill: var(--color-primary-700);
}

.btn-secondary {
  background: none;
  color: var(--color-primary-principal);
  border: 1px solid var(--color-primary-principal);
}

.btn-secondary:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
}

.btn-secondary:focus:not(:active) {
  background: var(--color-primary-50);
  color: var(--color-primary-500);
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px var(--color-primary-500);
}

.btn-secondary:active {
  background: var(--color-primary-400);
  color: #fff;
  border: 1px solid var(--color-primary-400);
}

.btn-secondary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-secondary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-secondary :deep(path) {
  fill: var(--color-primary-principal);
}

.btn-secondary:hover :deep(path) {
  fill: var(--color-primary-500);
}

.btn-secondary:focus :deep(path) {
  fill: var(--color-primary-principal);
}

.btn-secondary:active :deep(path) {
  fill: #fff;
}

.btn-secondary.invertido {
  background: var(--color-primary-principal);
  color: #fff;
  border: 1px solid #fff;
}

.btn-secondary.invertido :deep(path) {
  fill: #fff;
}

.btn-secondary.invertido:hover {
  background: var(--color-primary-500);
  color: var(--color-primary-50);
  border: 1px solid transparent;
  box-shadow: none;
}

.btn-secondary.invertido:hover :deep(path) {
  fill: var(--color-primary-600);
}

.btn-secondary.invertido:focus:not(:active) {
  background: var(--color-primary-500);
  color: var(--color-primary-50);
  border: 1px solid #fff;
  box-shadow: none;
}

.btn-secondary.invertido:focus :deep(path) {
  fill: var(--color-primary-50);
}

.btn-secondary.invertido:active {
  background: #fff;
  color: var(--color-primary-500);
  border: 1px solid transparent;
}

.btn-secondary.invertido:active :deep(path) {
  fill: #fff;
}

.btn-tertiary {
  background: none;
  color: var(--color-primary-principal);
  border: 1px solid transparent;
}

.btn-tertiary:hover {
  background: none;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}

.btn-tertiary:focus:not(:active) {
  background: none;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}

.btn-tertiary:active {
  background: var(--color-primary-400);
  color: #fff;
  border: 1px solid var(transparent);
}

.btn-tertiary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-tertiary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-tertiary :deep(path) {
  fill: var(--color-primary-principal);
}

.btn-tertiary:hover :deep(path) {
  fill: var(--color-primary-500);
}

.btn-tertiary:focus :deep(path) {
  fill: var(--color-primary-500);
}

.btn-tertiary:active :deep(path) {
  fill: #fff;
}

.btn-tertiary.invertido {
  background: none;
  color: #fff;
  border: 1px solid transparent;
}

.btn-tertiary.invertido :deep(path) {
  fill: #fff;
}

.btn-tertiary.invertido:hover {
  background: var(--color-primary-500);
  color: var(--color-primary-50);
  border: 1px solid transparent;
  box-shadow: none;
}

.btn-tertiary.invertido:hover :deep(path) {
  fill: var(--color-primary-50);
}

.btn-tertiary.invertido:focus:not(:active) {
  background: var(--color-primary-500);
  color: var(--color-primary-50);
  border: 1px solid #fff;
  box-shadow: none;
}

.btn-tertiary.invertido:focus:not(:active) :deep(path) {
  fill: var(--color-primary-50);
}

.btn-tertiary.invertido:active {
  background: #fff;
  color: var(--color-primary-500);
  border: 1px solid transparent;
}

.btn-tertiary.invertido:active :deep(path) {
  fill: var(--color-primary-500);
}

.btn-danger {
  background: var(--color-error-600);
  color: #fff;
  border: 1px solid transparent;
}

.btn-danger:hover {
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-error-400);
  background: var(--color-error-400);
}

.btn-danger:active {
  background: var(--color-error-700);
}

.btn-danger:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger:disabled :deep(path) {
  fill: var(--color-gray-300);
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

.btn-danger-secondary {
  background: transparent;
  color: var(--color-error-600);
  border: 1px solid var(--color-error-600);
}

.btn-danger-secondary:hover {
  background: var(--color-error-400);
  color: #fff;
  border: 1px solid var(--color-error-600);
}

.btn-danger-secondary:focus:not(:active) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-error-400);
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-secondary:active {
  background: var(--color-error-500);
  color: #fff;
  border: 1px solid var(--color-error-700);
}

.btn-danger-secondary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-secondary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-danger-secondary :deep(path) {
  fill: var(--color-error-600);
}

.btn-danger-secondary:hover :deep(path) {
  fill: #fff;
}

.btn-danger-secondary:focus :deep(path) {
  fill: #fff;
}

.btn-danger-secondary:active :deep(path) {
  fill: #fff;
}

.btn-danger-tertiary {
  background: transparent;
  color: var(--color-error-600);
  border: 1px solid transparent;
}

.btn-danger-tertiary:hover {
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-tertiary:focus:not(:active) {
  border: 1px solid var(--color-error-600);
  background: var(--color-error-400);
  color: #fff;
}

.btn-danger-tertiary:active {
  background: var(--color-error-500);
  color: #fff;
}

.btn-danger-tertiary:disabled {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.btn-danger-tertiary:disabled :deep(path) {
  fill: var(--color-gray-300);
}

.btn-danger-tertiary :deep(path) {
  fill: var(--color-error-600);
}

.btn-danger-tertiary:hover :deep(path) {
  fill: #fff;
}

.btn-danger-tertiary:focus :deep(path) {
  fill: #fff;
}

.btn-danger-tertiary:active :deep(path) {
  fill: #fff;
}
</style>
