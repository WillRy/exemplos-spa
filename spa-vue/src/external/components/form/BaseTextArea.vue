<template>
  <div
    class="form-group"
    :class="{
      error: error,
      md: size === 'md',
      lg: size === 'lg',
      disabled: disabled,
      autoresize: autoResize
    }"
  >
    <BaseLabel :label="label" :padding="true" v-if="label" />
    <BaseLabel :padding="true" v-if="$slots.label">
      <slot name="label" />
    </BaseLabel>

    <div style="display: flex; align-items: center" class="form-all-container">
      <div
        class="form-group-container"
        :class="{ borda: borda, btn: $slots.btn, icon: $slots.icon }"
      >
        <textarea
          v-bind="$attrs"
          :value="modelValue"
          @input="updateValue"
          :disabled="disabled"
          ref="input"
        ></textarea>
        <div v-if="$slots.btnFlutuante" class="form-group-btn-flutuante">
          <slot name="btnFlutuante"></slot>
        </div>
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

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import InfoError from '../info/InfoError.vue'
import InfoLegenda from '../info/InfoLegenda.vue'
import InfoSuccess from '../info/InfoSuccess.vue'
import BaseLabel from './BaseLabel.vue'

const props = defineProps({
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
  autoResize: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'md',
    validator(value: string) {
      return ['md', 'lg'].includes(value)
    }
  }
})

const emit = defineEmits(['update:modelValue'])

const input = ref<HTMLTextAreaElement | null>(null)

const autoResetSize = () => {
  if (!props.autoResize) return

  if (input.value) {
    if (props.modelValue === '') {
      input.value.style.height = 'initial'
    } else {
      input.value.style.height = 'auto'
      input.value.style.height = input.value.scrollHeight + 'px'
    }
  }
}

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

watch(() => props.modelValue, autoResetSize)

onMounted(() => {
  autoResetSize()
})
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

.form-group-container {
  box-sizing: border-box;
  border: var(--border) solid transparent;
  display: flex;
  align-items: flex-start;
  min-height: var(--md-min-height);
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

.form-group-btn > :deep(button) {
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/*.error .form-group-container {*/
/*    border: 1px solid var(--color-error-500) !important;*/
/*}*/

textarea {
  cursor: inherit;
  font-size: 0.875rem;
  color: #444444;
  border: 0;
  width: 100%;
  background: transparent;
  border-radius: var(--radius-principal);
  outline: none;
  resize: vertical;
  padding: 8px;
  min-height: var(--md-min-height-input);
}

textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
textarea:-webkit-autofill:active {
  -webkit-transition: 'color 9999s ease-out, background-color 9999s ease-out';
  -webkit-transition-delay: 9999s;
}

textarea:focus {
  outline: 0;
}

textarea::placeholder {
  font-size: 1rem;
  color: var(--color-gray-400);
}

.form-group-btn-flutuante {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.form-group-btn-flutuante :deep(button svg path),
.form-group-btn-flutuante :deep(button i) {
  fill: var(--color-primary-principal);
  color: var(--color-primary-principal);
}

.form-group-container:focus-within .form-group-btn-flutuante :deep(button path),
.form-group-container:focus-within .form-group-btn-flutuante :deep(button i) {
  fill: var(--focus-color);
  color: var(--focus-color);
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.autoresize textarea {
  resize: none;
}
</style>
