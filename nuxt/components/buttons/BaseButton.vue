<template>
  <component
    :is="is"
    class="btn"
    :class="{
      'btn-min-width': min,
      'btn-sm': size === 'sm',
      'btn-md': size === 'md',
      'btn-lg': size === 'lg',
      'btn-full': full,
      outline: outline,
    }"
    :disabled="disabled || loading"
    :data-loading="loading"
    :type="type"
  >
    <Loader
      v-if="loading"
      :height="loadingSize"
      :width="loadingSize"
      :cor-principal="true"
    />
    <slot></slot>
  </component>
</template>

<script>
import Loader from "../Loader.vue";

export default {
  name: "BaseButton",
  components: { Loader },
  props: {
    is: {
      type: String,
      default: "button",
    },
    disabled: {
      default: false,
    },
    size: {
      type: String,
      default: "md",
    },
    type: {
      type: String,
      default: "button",
    },
    min: {
      type: Boolean,
      default: false,
    },
    full: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    loadingSize() {
      switch (this.size) {
        case "sm":
          return "14px";
        case "md":
          return "16px";
        case "lg":
          return "20px";
        default:
          return "16px";
      }
    },
  },
};
</script>

<style scoped>
:deep(*),
* {
  --border: 1px;
}

.btn {
  all: "unset";
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

.btn *, .btn :deep(*) {
  line-height: 1;
}

.btn:hover :deep(.loader path) {
  fill: currentColor !important;
}

.btn[data-loading="true"] {
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
  fill: var(--gray-color-300) !important;
}
.btn:hover:disabled :deep(svg path) {
  fill: var(--gray-color-300) !important;
}
</style>
