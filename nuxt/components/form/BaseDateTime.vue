<template>
  <div class="form-group" :class="{
    error: error,
    md: size === 'md',
    lg: size === 'lg',
    disabled: disabled
  }">
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>
    <div class="label-container" v-if="label">
      <label>{{ label }}</label>
    </div>


    <div style="display: flex; align-items: center">
      <div class="form-group-container" :class="{ borda: borda, btn: $slots.btn }">
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>

        <VueDatePicker v-model="data" v-bind="$attrs" :first-day-of-week="1" :is24="is24hrConfig"
          :timezone="timezoneConfig" :locale="localeConfig" :cancelText="config.txtCancelar" :selectText="config.txtSelecionar" :format="config.formatoDataHora">
          <template #dp-input="{ value }">
            <input 
              :value="value" 
              :placeholder="placeholder" 
              @input.prevent=""
              ref="input"
              :disabled="disabled"
             />
          </template>
          <template #action-preview></template>
        </VueDatePicker>
        <div class="form-group-default-icon" @click="focusInput">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
            <path
              d="M368.005 272h-96v96h96v-96zm-32-208v32h-160V64h-48v32h-24.01c-22.002 0-40 17.998-40 40v272c0 22.002 17.998 40 40 40h304.01c22.002 0 40-17.998 40-40V136c0-22.002-17.998-40-40-40h-24V64h-48zm72 344h-304.01V196h304.01v212z">
            </path>
          </svg>
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

<script lang="ts" setup>
import { format } from 'date-fns'
import InfoInputIcon from '../icons/InfoInputIcon.vue'
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue'
import InfoErrorIcon from '../icons/InfoErrorIcon.vue'
import VueDatePicker from '@vuepic/vue-datepicker';

import { computed, ref, defineEmits } from 'vue'
import { useConfigStore } from '../../store/config.ts'

export type SizeInput = 'md' | 'lg'

defineOptions({
  inheritAttrs: false,

})

defineExpose({
  focusInput,
  clickInput,
})



const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'update:formatado', value: string | null): void
}>()


const input = ref(null);
const config = useConfigStore()

const props = withDefaults(defineProps<{
  size: SizeInput
  borda: boolean
  label: string
  placeholder: string
  error: string
  success: string
  legenda: string
  modelValue: string | Date
  disabled: boolean
  timezone: string
  is24hr: boolean
  locale: string
}>(), {
  size: 'md',
  borda: true,
  label: "",
  placeholder: "",
  error: "",
  success: "",
  legenda: "",
  disabled: false,
  timezone: "America/Sao_Paulo",
  is24hr: true,
  locale: "pt-BR",
});

const timezoneConfig = computed(() => props.timezone ?? config.config.current_timezone)
const is24hrConfig = computed(() => props.is24hr ?? config.config.is24hr)
const localeConfig = computed(() => props.locale ?? config.config.locale)


const data = computed({
  get() {
    if (!props.modelValue) {
      return null
    }

    if (typeof props.modelValue === 'object') {
      return props.modelValue
    }

    let normalizarDataUtc = new Date(props.modelValue)

    return new Date(
      normalizarDataUtc.getFullYear(),
      normalizarDataUtc.getMonth(),
      normalizarDataUtc.getDate(),
      normalizarDataUtc.getHours(),
      normalizarDataUtc.getMinutes(),
      normalizarDataUtc.getSeconds()
    )
  },
  set(valor) {
    if (!valor) {
      emit('update:modelValue', null)
      emit('update:formatado', null)
      return null
    }

    let valorNormalizado = valor

    if (typeof valor !== 'object') {
      let normalizarDataUtc = new Date(valor)
      valorNormalizado = new Date(
        normalizarDataUtc.getFullYear(),
        normalizarDataUtc.getMonth(),
        normalizarDataUtc.getDate(),
        normalizarDataUtc.getHours(),
        normalizarDataUtc.getMinutes(),
        normalizarDataUtc.getSeconds()
      )
    }

    let string = format(valorNormalizado, 'yyyy-MM-dd')
    emit('update:modelValue', valorNormalizado)
    emit('update:formatado', string)

    return null
  }
})

function focusInput() {
  if (!input.value) return;
  (input.value as HTMLInputElement).focus()
}

function clickInput() {
  if (!input.value) return;
  (input.value as HTMLInputElement).click()
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

.form-group-container:focus-within .form-group-icon> :deep(svg path) {
  fill: var(--focus-color);
}


.form-group-default-icon {
  flex-shrink: 0;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group-default-icon> :deep(img) {
  height: 18px;
  width: 18px;
}

.form-group-default-icon> :deep(svg) {
  height: 18px;
  width: 18px;
  fill: var(--primary-color-principal);
}

.form-group-container:focus-within .form-group-icon> :deep(svg path) {
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
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--primary-color-principal-focus);
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

.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:not(:active)) {
  box-shadow: var(--primary-color-principal) 0px 0px 0px var(--border);
}

.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:hover) {
  box-shadow: var(--primary-color-principal-hover) 0px 0px 0px var(--border);
}

.md .form-group-container > div:not(.form-group-icon):not(.form-group-prefix):not(.form-group-default-icon) {
  width: 100%;
}

.lg .form-group-container > div:not(.form-group-icon):not(.form-group-prefix):not(.form-group-default-icon) {
  min-height: 54px;
  width: 100%;
}

</style>
