<template>
  <div
    class="form-group"
    :class="{ error: error, md: size === 'md', lg: size === 'lg', disabled: disabled }"
  >
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>
    <div class="label-container" v-if="label">
      <label>{{ label }}</label>
    </div>

    <div style="display: flex; align-items: center" class="form-all-container">
      <div
        class="form-group-container"
        :class="{ borda: borda, btn: $slots.btn, icon: $slots.icon }"
      >
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>
        <input v-bind="attrs" :value="modelValue" @input="updateValue" :disabled="disabled" />
        <div v-if="$slots.btnFlutuante" class="form-group-btn-flutuante">
          <slot name="btnFlutuante"></slot>
        </div>
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
import InfoErrorIcon from '../icons/InfoErrorIcon.vue'
import InfoInputIcon from '../icons/InfoInputIcon.vue'
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue'

export default {
  name: 'BaseInput',
  inheritAttrs: false,
  components: { InfoInputIcon, InfoSuccessIcon, InfoErrorIcon },
  props: {
    disabled: {
      default: false
    },
    borda: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: [String, Number],
    error: {
      type: String
    },
    success: {
      type: String
    },
    legenda: {
      type: String
    },
    size: {
      type: String,
      default: 'md',
      validator(value: string) {
        return ['md', 'lg'].includes(value)
      }
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        input: this.updateValue
      }
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
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
  -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
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

.form-group-btn-flutuante {
  display: flex;
  align-items: center;
  position: absolute;
  right: 8px;
  gap: 12px;
}

.form-group-btn-flutuante :deep(button) {
  border: none;
  background: none;
  cursor: pointer;
}

.form-group-btn-flutuante :deep(button:hover) {
  opacity: 0.6;
}

.form-group-btn-flutuante :deep(button svg path) {
  fill: var(--primary-color-principal);
}

.form-group-container:focus-within .form-group-btn-flutuante :deep(button path) {
  fill: var(--focus-color);
}
</style>
