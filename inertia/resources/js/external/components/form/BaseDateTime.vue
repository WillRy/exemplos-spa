<template>
  <div
    class="form-group"
    :class="{
      error: error,
      md: size === 'md',
      lg: size === 'lg',
      disabled: disabled,
    }"
  >
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>
    <div class="label-container" v-if="label">
      <label>{{ label }}</label>
    </div>

    <div style="display: flex; align-items: center">
      <div
        class="form-group-container"
        :class="{ borda: borda, btn: $slots.btn }"
      >
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>

        <DatePicker
          is24hr
          v-model="data"
          v-bind="attrs"
          mode="dateTime"
          is-required
          :first-day-of-week="1"
          :popover="{ visibility: visibility }"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <input
              v-if="!disabled"
              v-on="inputEvents"
              :value="inputValue"
              :placeholder="placeholder"
            />
            <input
              v-else
              :value="inputValue"
              :placeholder="placeholder"
              disabled
            />
          </template>
        </DatePicker>
      </div>
      <div v-if="$slots.btn" class="form-group-btn">
        <slot name="btn"></slot>
      </div>
    </div>

    <div v-if="$slots.legenda || legenda" class="legenda">
      <InfoInputIcon size="14px" class="icone-footer" />
      <slot name="legenda" v-if="$slots.legenda"></slot>
      <template v-else>{{ legenda }}</template>
    </div>
    <div v-if="$slots.success || success" class="successMessage">
      <InfoSuccessIcon size="14px" class="icone-footer" />
      <slot name="success" v-if="$slots.success"></slot>
      <template v-else>{{ success }}</template>
    </div>
    <div v-if="$slots.error || error" class="errorMessage">
      <InfoErrorIcon size="14px" class="icone-footer" />
      <slot name="error" v-if="$slots.error"></slot>
      <template v-else>{{ error }}</template>
    </div>
  </div>
</template>

<script lang="ts">
import { DatePicker } from "v-calendar";
import { format } from "date-fns";
import InfoInputIcon from "../icons/InfoInputIcon.vue";
import InfoSuccessIcon from "../icons/InfoSuccessIcon.vue";
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";
import type { PropType } from 'vue'

export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

export default {
  name: "BaseDateTime",
  inheritAttrs: false,
  components: {
    DatePicker,
    InfoInputIcon,
    InfoSuccessIcon,
    InfoErrorIcon,
  },
  emits: ["update:modelValue", "update:formatado", "change", "changeFormatado"],
  props: {
    size: {
      type: String,
      default: "md",
      validator(value: string) {
        return ["md", "lg"].includes(value);
      },
    },
    borda: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      default: null,
      type: String,
    },
    error: {
      type: String,
    },
    success: {
      type: String,
    },
    legenda: {
      type: String,
    },
    modelValue: [String, Date],
    disabled: {
      type: Boolean,
      default: false,
    },
    formatado: {
      type: [String, Date],
    },
    timezone: {
      default: "America/Sao_Paulo",
    },
    visibility: {
      default: "click",
      type: String as PropType<PopoverVisibility>,
      validator(value: string) {
        return ["click", "hover"].includes(value);
      },
    },
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
      };
    },
    data: {
      set(valor) {
        if (!valor) {
          this.$emit("update:modelValue", null);
          this.$emit("update:formatado", null);
          return null;
        }

        let valorNormalizado = valor;

        if (typeof valor !== "object") {
          let normalizarDataUtc = new Date(valor);
          valorNormalizado = new Date(
            normalizarDataUtc.getFullYear(),
            normalizarDataUtc.getMonth(),
            normalizarDataUtc.getDate(),
            normalizarDataUtc.getHours(),
            normalizarDataUtc.getMinutes(),
            normalizarDataUtc.getSeconds()
          );
        }

        let string = format(valorNormalizado, "yyyy-MM-dd");
        this.$emit("update:modelValue", valorNormalizado);
        this.$emit("update:formatado", string);

        return null;
      },
      get() {
        if (!this.modelValue) {
          return null;
        }

        if (typeof this.modelValue === "object") {
          return this.modelValue;
        }

        let normalizarDataUtc = new Date(this.modelValue);

        const valor = new Date(
          normalizarDataUtc.getFullYear(),
          normalizarDataUtc.getMonth(),
          normalizarDataUtc.getDate(),
          normalizarDataUtc.getHours(),
          normalizarDataUtc.getMinutes(),
          normalizarDataUtc.getSeconds()
        );

        return valor;
      },
    },
  },
  methods: {},
  created() {},
};
</script>
<style scoped>
* {
  box-sizing: border-box;

  /* tamanho da borda */
  --border: 1px;

  /* tamanho medio do container */
  --md-min-height: 36px;

  /* tamanho grande do container */
  --lg-min-height: 42px;

  /* tamanho do input dentro do container */
  --md-min-height-input: calc(36px - var(--border) - var(--border));
  --lg-min-height-input: calc(42px - var(--border) - var(--border));

  /* tamanho do botão */
  --md-min-height-btn: calc(36px);
  --lg-min-height-btn: calc(42px);

  --label-color: var(--gray-color-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--primary-color-principal-focus);

  /* espaçamento do texto/label */
  --padding-text: 16px;
}

:deep(label) {
  line-height: 24px;
  font-weight: 400;
  font-size: 0.75rem;

  color: var(--label-color);
  margin-bottom: var(--label-margin-bottom);
  display: block;
  padding-left: var(--padding-text);
}

.form-group-container {
  position: relative;
  flex: 1;
}

.form-group-icon {
  flex-shrink: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group-icon > :deep(img) {
  height: 18px;
  width: 18px;
}

.form-group-icon > :deep(svg) {
  height: 18px;
  width: 18px;
}

.form-group-container:focus-within .form-group-icon > :deep(svg path) {
  fill: var(--focus-color);
}

.form-group-prefix {
  flex-shrink: 0;
}

.form-group-container {
  box-sizing: border-box;
  border: var(--border) solid transparent;
  display: flex;
  align-items: center;
}

.form-group-container.btn {
  padding-right: 0;
  border-right: 0;
}

.form-group-container.borda {
  background: #ffffff;
  border: var(--border) solid var(--gray-color-400);
  border-radius: 8px;
}

.form-group-container:not(.borda) {
  background: var(--gray-color-100);
  border-bottom: var(--border) solid var(--gray-color-800);
  border-radius: 8px 8px 0 0;
}

.md .form-group-container {
  min-height: var(--md-min-height);
}

.md .form-group-container input {
  min-height: var(--md-min-height-input);
}

.lg .form-group-container {
  min-height: var(--lg-min-height);
}

.lg .form-group-container input {
  min-height: var(--lg-min-height-input);
}

.form-group-container.borda:hover {
  border-top: var(--border) solid var(--primary-color-principal-hover);
  border-bottom: var(--border) solid var(--primary-color-principal-hover);
  border-left: var(--border) solid var(--primary-color-principal-hover);
  border-right: var(--border) solid var(--primary-color-principal-hover);
}

.form-group-container.borda:focus-within {
  box-shadow: var(--focus-color) 0px 0px 0px 1px inset;
  border: 1px solid var(--focus-color);
}

.form-group-container:not(.borda):hover {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--primary-color-principal-hover);
  border-left: var(--border) solid transparent;
  border-right: var(--border) solid transparent;
}

.form-group-container:not(.borda):focus-within {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--focus-color);
  border-left: var(--border) solid transparent;
  border-right: var(--border) solid transparent;
}

.disabled .form-group-container,
.disabled .form-group-container:hover,
.disabled .form-group-container:focus {
  background: var(--gray-color-100) !important;
  cursor: not-allowed;
}

.form-group-container.btn {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.form-group-btn {
  flex-shrink: 0;
}

.form-group-btn > :deep(button) {
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/*.error .form-group-container {*/
/*    border: 1px solid var(--error-color-500) !important;*/
/*}*/

input {
  cursor: inherit;
  font-size: 0.875rem;
  color: #444444;
  border: 0;
  width: 100%;
  background: transparent;
  border-radius: var(--radius-principal);
  padding: 0 var(--padding-text);
}

.icon input {
  padding: 0 calc(var(--padding-text) / 2);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
  -webkit-transition-delay: 9999s;
}

.lg input {
  font-size: 1rem;
}

input:focus {
  outline: 0;
}

input::placeholder {
  font-size: 0.875rem;
  color: var(--gray-color-400);
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.legenda {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--gray-color-400);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.legenda > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.errorMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--error-color-600);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.errorMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.successMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--success-color-600);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.successMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.md .form-group-btn {
  height: var(--md-min-height-btn);
}

.lg .form-group-btn {
  height: var(--lg-min-height-btn);
}

.form-group-btn :deep(button) {
  padding: 13px 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  outline: 0;
  gap: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  position: relative;
  background: var(--primary-color-principal);
  color: #fff;

  border-radius: 0 8px 8px 0;
}

.form-group-btn :deep(button) {
  background: var(--primary-color-principal);
  color: #fff;
  border: 1px solid transparent;
}

.form-group-btn :deep(button:hover) {
  background: var(--primary-color-principal-hover);
  color: #fff;
}

.form-group-btn :deep(button:focus) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-color-principal-focus);
  background: var(--primary-color-principal-focus);
  color: #fff;
}

.form-group-btn :deep(button:active) {
  background: var(--primary-color-principal-active);
  color: #fff;
}

.form-group-btn :deep(button:disabled) {
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
  border: none;
}

.form-group-btn :disabled :deep(path) {
  fill: var(--gray-color-300);
}

.form-group-btn :deep(path) {
  fill: #fff;
}

.form-group-btn :hover :deep(path) {
  fill: #fff;
}

.form-group-btn :focus :deep(path) {
  fill: #fff;
}

.form-group-btn :active :deep(path) {
  fill: #fff;
}

.form-group-container.borda:focus-within
  ~ .form-group-btn
  :deep(button:not(:active)) {
  box-shadow: var(--primary-color-principal) 0px 0px 0px var(--border);
}

.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:hover) {
  box-shadow: var(--primary-color-principal-hover) 0px 0px 0px var(--border);
}

.md .form-group-container > div:not(.form-group-icon):not(.form-group-prefix) {
  min-height: 34px;
  width: 100%;
}

.lg .form-group-container > div:not(.form-group-icon):not(.form-group-prefix) {
  min-height: 54px;
  width: 100%;
}
</style>
