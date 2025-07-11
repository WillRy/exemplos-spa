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
    <BaseLabel :label="label" :padding="true" v-if="label" />
    <BaseLabel :padding="true" v-if="$slots.label">
      <slot name="label" />
    </BaseLabel>

    <div style="display: flex">
      <div class="form-group-container" :class="{ borda: borda, btn: $slots.btn }">
        <div v-if="$slots.icon" class="form-group-icon">
          <slot name="icon"></slot>
        </div>
        <div v-if="$slots.prefix" class="form-group-prefix">
          <slot name="prefix"></slot>
        </div>

        <VueMultiselect
          v-bind="attrs"
          :allow-empty="empty"
          :deselectLabel="remover ? 'Remover' : ''"
          :label="textBy"
          :model-value="modelValue"
          :options="options"
          :searchable="search"
          :track-by="trackBy"
          deselectGroupLabel=""
          selectGroupLabel=""
          selectLabel=""
          selectedLabel=""
          @update:model-value="updateValue"
          :placeholder="placeholder"
          :limitText="(count) => `e mais ${count}`"
          :disabled="disabled"
          :loading="loading"
        >
          <template v-slot:option="{ option }">
            <div
              class="option-select"
              v-tooltip="{ content: option.tooltip ?? null }"
              v-if="!$slots.option"
            >
              <span>{{ option[textBy] }}</span>
            </div>
            <slot name="option" :option="option"></slot>
          </template>
          <template v-slot:tag="{ option, remove }">
            <div class="custom-tag" v-if="!$slots.tag">
              <span>{{ option[textBy] }}</span>
              <button class="custom-tag-excluir" @click="remove(option)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  />
                </svg>
              </button>
            </div>
            <slot name="tag" :option="option" :remove="remove"></slot>
          </template>
          <template v-if="noOptions" #noOptions>
            {{ noOptions }}
          </template>
          <template v-if="noResult" #noResult>
            {{ noResult }}
          </template>
          <template v-if="maxElements" #maxElements>
            {{ maxElements }}
          </template>
          <template v-slot:clear="" v-if="remover && !estaComoVazio">
            <button class="btn-remover-select" @click="updateValue(null)">x</button>
          </template>
        </VueMultiselect>
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

<script lang="ts">
import VueMultiselect from 'vue-multiselect'
import { vTooltip } from 'floating-vue'
import { PropType } from 'vue'
import BaseLabel from './BaseLabel.vue'
import InfoLegenda from '../info/InfoLegenda.vue'
import InfoSuccess from '../info/InfoSuccess.vue'
import InfoError from '../info/InfoError.vue'

export type SizeInput = 'md' | 'lg'

export default {
  name: 'BaseSelect',
  inheritAttrs: false,
  components: {
    VueMultiselect,
    BaseLabel,
    InfoLegenda,
    InfoSuccess,
    InfoError
  },
  directives: {
    tooltip: vTooltip
  },
  props: {
    disabled: {
      default: false
    },
    borda: {
      type: Boolean,
      default: true
    },
    size: {
      type: String as PropType<SizeInput>,
      default: 'md'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      default: 'Selecione um valor'
    },
    noResult: {
      type: String,
      default: 'Não foram encontrados itens com esta pesquisa'
    },
    noOptions: {
      type: String,
      default: 'Digite sua pesquisa'
    },
    maxElements: {
      type: String,
      default: null
    },
    modelValue: {
      type: Object
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    textBy: {
      type: String,
      default: 'text'
    },
    options: {
      type: Array<object>
    },
    search: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: true
    },
    error: {
      type: String
    },
    success: {
      type: String
    },
    legenda: {
      type: String
    },
    remover: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        input: this.updateValue
      }
    },
    estaComoVazio() {
      return !this.modelValue || (Array.isArray(this.modelValue) && this.modelValue.length === 0)
    }
  },
  methods: {
    remove() {
      this.$emit('update:modelValue', null)
      this.$emit('change', null)
    },
    updateValue(event) {
      this.$emit('update:modelValue', event)
      this.$emit('change', event)
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

  --label-color: var(--color-gray-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--color-primary-principal-focus);

  /* espaçamento do texto/label */
  --padding-text: 16px;
}

.form-group-container {
  position: relative;
  width: 100%;
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

.btn-remover-select {
  all: unset;
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 3;
  background: var(--color-error-600);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  line-height: 0;
}

.custom-tag-excluir {
  color: #fff;
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  width: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-tag-excluir svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.custom-tag-excluir svg path {
  fill: #fff;
}

/**
Ellipsis das options
*/
.option-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

:deep(.multiselect__content) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

:deep(.multiselect__single) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.custom-tag {
  box-sizing: border-box;
  padding: 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 4px 4px 0px;
  background: var(--color-primary-principal);
  color: #fff;
  gap: 6px;
  max-width: 100%;
}

.custom-tag span {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1 !important;
  font-size: 0.875rem;
}

/**
* Personaliza o CSS da lib VueMultiselect
**/

:deep(.multiselect) {
  width: 0;
  min-width: 100%;
}

.md :deep(.multiselect) {
  min-height: var(--md-min-height-input);
  box-sizing: content-box;
}

.lg :deep(.multiselect) {
  min-height: var(--lg-min-height-input);
  box-sizing: content-box;
}

.md :deep(.multiselect__tags) {
  min-height: var(--md-min-height-input);
  border-radius: 8px;
  border: 0px solid transparent;
  padding: 4px 40px 0 14px;
}

.lg :deep(.multiselect__tags) {
  min-height: var(--lg-min-height-input);
  border-radius: 8px;
  border: 0px solid transparent;
  padding: 7px 40px 0 14px;
}

.md :deep(.multiselect__single) {
  padding-top: 4px;
  margin-bottom: 6px;
  font-size: 0.875rem !important;
}

.lg :deep(.multiselect__single) {
  padding-top: 6px;
  margin-bottom: 6px;
  font-size: 0.875rem !important;
}

:deep(.multiselect__input, .multiselect__single) {
  margin-bottom: 6px;
  padding: 0px;
}

.md :deep(.multiselect__placeholder) {
  padding-top: 6px;
  line-height: 0.875rem;
  font-size: 0.875rem;
}

.lg :deep(.multiselect__placeholder) {
  padding-top: 6px;
  line-height: 0.875rem;
  font-size: 0.875rem;
}

.md :deep(.multiselect__input:focus) {
  padding-top: 3px;
}

.lg :deep(.multiselect__input:focus) {
  padding-top: 3px;
}

:deep(.multiselect__input) {
  font-size: 0.875rem !important;
}

:deep(.multiselect__select) {
  height: 100%;
}

.md :deep(.multiselect) {
  min-height: var(--md-min-height-input);
  box-sizing: content-box;
}

.lg :deep(.multiselect) {
  min-height: var(--lg-min-height-input);
  box-sizing: content-box;
}

.md :deep(.multiselect__tags) {
  min-height: var(--md-min-height-input);
  border-radius: 8px;
  border: 0px solid transparent;
  padding: 4px 40px 0 14px;
}

.lg :deep(.multiselect__tags) {
  min-height: var(--lg-min-height-input);
  border-radius: 8px;
  border: 0px solid transparent;
  padding: 7px 40px 0 14px;
}

.md :deep(.multiselect__single) {
  padding-top: 4px;
  margin-bottom: 6px;
  font-size: 0.875rem !important;
}

.lg :deep(.multiselect__single) {
  padding-top: 6px;
  margin-bottom: 6px;
  font-size: 0.875rem !important;
}

:deep(.multiselect__input, .multiselect__single) {
  margin-bottom: 6px;
  padding: 0px;
}

.md :deep(.multiselect__placeholder) {
  padding-top: 6px;
}

.lg :deep(.multiselect__placeholder) {
  padding-top: 6px;
}

.md :deep(.multiselect__input:focus) {
  padding-top: 3px;
}

.lg :deep(.multiselect__input:focus) {
  padding-top: 3px;
}

:deep(.multiselect__input) {
  font-size: 0.875rem !important;
}

:deep(.multiselect__select) {
  height: 100%;
}

:deep(.multiselect__spinner) {
  top: 0px;
  height: 100%;
}

:deep(.multiselect__spinner:after),
:deep(.multiselect__spinner:before) {
  border-color: var(--color-primary-principal-active) transparent transparent;
}

:deep(.multiselect__tag) {
  background: var(--color-primary-principal-active);
}

:deep(.multiselect__placeholder) {
  color: var(--color-gray-700);
}

:deep(.multiselect__option--highlight) {
  background: var(--color-primary-principal-active);
  outline: none;
  color: #fff;
}

:deep(.multiselect__option--highlight:after) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

:deep(.multiselect__option--selected.multiselect__option--highlight:after) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

:deep(.multiselect__option--group-selected.multiselect__option--highlight) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

:deep(.multiselect__option--group-selected.multiselect__option--highlight:after) {
  background: var(--color-primary-principal-active);
  color: #fff;
}

:deep(.multiselect__option--disabled) {
  pointer-events: initial;
}
</style>
