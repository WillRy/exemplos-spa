<template>
  <div
    class="form-group"
    :class="{
      error: error,
      md: size === 'md',
      lg: size === 'lg',
      disabled: disabled
    }"
  >
    <BaseLabel :label="label" :padding="true" v-if="props.label" />
    <BaseLabel :padding="true" v-if="$slots.label">
      <slot name="label" />
    </BaseLabel>

    <div style="display: flex; align-items: center">
      <div class="form-group-container" :class="{ borda: borda, btn: $slots.btn }">
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>

        <VueDatePicker
          v-model="data"
          v-bind="$attrs"
          :first-day-of-week="1"
          :is24="is24hrConfig"
          :teleport="true"
          :timezone="timezoneConfig"
          :locale="localeConfig"
          :enable-time-picker="false"
          :cancelText="config.txtCancelar"
          :selectText="config.txtSelecionar"
          :format="config.formatoData"
          :disabled="disabled"
          :auto-apply="true"
          text-input
        >
        <template #dp-input="{ value, onInput, onEnter, onBlur, onKeypress }">
            <input
              :value="value"
              :placeholder="placeholder"
              @input="onInput"
              @keydown.enter="onEnter"
              @blur="onBlur"
              @keypress="onKeypress"
              ref="input"
              :disabled="disabled"
              :name="name"
              autocomplete="no"
              v-maska="mascara"
            />
          </template>
          <template #action-preview></template>
        </VueDatePicker>
        <div class="form-group-default-icon" @click="focusInput">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
            <path
              d="M368.005 272h-96v96h96v-96zm-32-208v32h-160V64h-48v32h-24.01c-22.002 0-40 17.998-40 40v272c0 22.002 17.998 40 40 40h304.01c22.002 0 40-17.998 40-40V136c0-22.002-17.998-40-40-40h-24V64h-48zm72 344h-304.01V196h304.01v212z"
            ></path>
          </svg>
        </div>
      </div>
      <div v-if="$slots.btn" class="form-group-btn">
        <slot name="btn"></slot>
      </div>
    </div>

    <div v-if="$slots.legenda || legenda">
      <InfoLegenda :input-mode="true">
        <slot name="legenda" v-if="$slots.legenda"></slot>
        <template v-else>{{ legenda }}</template>
      </InfoLegenda>
    </div>
    <div v-if="$slots.success || success">
      <InfoSuccess :input-mode="true">
        <slot name="success" v-if="$slots.success"></slot>
        <template v-else>{{ success }}</template>
      </InfoSuccess>
    </div>
    <div v-if="$slots.error || error">
      <InfoError :input-mode="true">
        <slot name="error" v-if="$slots.error"></slot>
        <template v-else>{{ error }}</template>
      </InfoError>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'

import { computed, ref, defineEmits } from 'vue'
import { useConfigStore } from '../../store/config.ts'
import BaseLabel from './BaseLabel.vue'
import InfoLegenda from '../info/InfoLegenda.vue'
import InfoSuccess from '../info/InfoSuccess.vue'
import InfoError from '../info/InfoError.vue'
import { vMaska } from "maska/vue"

export type SizeInput = 'md' | 'lg'

defineOptions({
  inheritAttrs: false
})

defineExpose({
  focusInput,
  clickInput
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'update:formatado', value: string | null): void
}>()

const input = ref(null)
const config = useConfigStore()

const props = withDefaults(
  defineProps<{
    size?: SizeInput
    borda?: boolean
    label?: string
    placeholder?: string
    error?: string
    success?: string
    legenda?: string
    modelValue?: string | Date
    disabled?: boolean
    timezone?: string
    is24hr?: boolean
    locale?: string
    name?: string
  }>(),
  {
    size: 'md',
    borda: true,
    label: '',
    placeholder: '',
    error: '',
    success: '',
    legenda: '',
    disabled: false,
    timezone: 'America/Sao_Paulo',
    is24hr: true,
    locale: 'pt-BR',
    name: ''
  }
)

const timezoneConfig = computed(() => props.timezone ?? config.config.current_timezone)
const is24hrConfig = computed(() => props.is24hr ?? config.config.is24hr)
const localeConfig = computed(() => props.locale ?? config.config.locale)
const mascara = computed(() => config.config.mascaraData ?? '##/##/####')

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
      normalizarDataUtc.getUTCFullYear(),
      normalizarDataUtc.getUTCMonth(),
      normalizarDataUtc.getUTCDate(),
      0,
      0,
      0
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
        normalizarDataUtc.getUTCFullYear(),
        normalizarDataUtc.getUTCMonth(),
        normalizarDataUtc.getUTCDate(),
        0,
        0,
        0
      )
    }

    let string = format(valorNormalizado, 'yyyy-MM-dd')
    emit('update:modelValue', valorNormalizado)
    emit('update:formatado', string)

    return null
  }
})

function focusInput() {
  if (!input.value) return
  ;(input.value as HTMLInputElement).focus()
}

function clickInput() {
  if (!input.value) return
  ;(input.value as HTMLInputElement).click()
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

  --label-color: var(--color-gray-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--color-primary-principal-focus);

  /* espaçamento do texto/label */
  --padding-text: 16px;
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

.form-group-default-icon {
  flex-shrink: 0;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group-default-icon > :deep(img) {
  height: 18px;
  width: 18px;
}

.form-group-default-icon > :deep(svg) {
  height: 18px;
  width: 18px;
  fill: var(--color-primary-principal);
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
  border: var(--border) solid var(--color-gray-400);
  border-radius: 8px;
}

.form-group-container:not(.borda) {
  background: var(--color-gray-100);
  border-bottom: var(--border) solid var(--color-gray-800);
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
  border-top: var(--border) solid var(--color-primary-principal-hover);
  border-bottom: var(--border) solid var(--color-primary-principal-hover);
  border-left: var(--border) solid var(--color-primary-principal-hover);
  border-right: var(--border) solid var(--color-primary-principal-hover);
}

.form-group-container.borda:focus-within {
  box-shadow: var(--focus-color) 0px 0px 0px 1px inset;
  border: 1px solid var(--focus-color);
}

.form-group-container:not(.borda):hover {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--color-primary-principal-hover);
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
  background: var(--color-gray-100) !important;
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
/*    border: 1px solid var(--color-error-500) !important;*/
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
  color: var(--color-gray-400);
}

.icone-footer {
  flex-shrink: 0;
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
  background: var(--color-primary-principal);
  color: #fff;

  border-radius: 0 8px 8px 0;
}

.form-group-btn :deep(button) {
  background: var(--color-primary-principal);
  color: #fff;
  border: 1px solid transparent;
}

.form-group-btn :deep(button:hover) {
  background: var(--color-primary-principal-hover);
  color: #fff;
}

.form-group-btn :deep(button:focus) {
  box-shadow:
    0 0 0 1px #fff,
    0 0 0 2px var(--color-primary-principal-focus);
  background: var(--color-primary-principal-focus);
  color: #fff;
}

.form-group-btn :deep(button:active) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

.form-group-btn :deep(button:disabled) {
  background: var(--color-gray-200);
  color: var(--color-gray-300);
  cursor: not-allowed;
  border: none;
}

.form-group-btn :disabled :deep(path) {
  fill: var(--color-gray-300);
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
  box-shadow: var(--color-primary-principal) 0px 0px 0px var(--border);
}

.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:hover) {
  box-shadow: var(--color-primary-principal-hover) 0px 0px 0px var(--border);
}

.md
  .form-group-container
  > div:not(.form-group-icon):not(.form-group-prefix):not(.form-group-default-icon) {
  width: 100%;
}

.lg
  .form-group-container
  > div:not(.form-group-icon):not(.form-group-prefix):not(.form-group-default-icon) {
  min-height: 54px;
  width: 100%;
}
</style>
