<template>
  <div :class="{ 'form-group-has-icon': $slots.icon }" class="form-group">
    <label class="checkbox-container" :class="{ disabled: disabled }">
      <input
        type="checkbox"
        class="checkbox"
        :disabled="disabled"
        v-model="localValue"
        v-bind="attrs"
      />
      <span class="checkmark"></span>
      <template v-if="label">{{ label }}</template>
    </label>
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
  name: 'BaseCheckbox',
  inheritAttrs: false,
  props: {
    disabled: {
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      required: false
    },
    error: {
      type: String
    },
    success: {
      type: String
    },
    legenda: {
      type: String
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs
      }
    },
    localValue: {
      set(valor) {
        this.$emit('update:modelValue', valor)
      },
      get() {
        return this.modelValue
      }
    }
  },
  methods: {},
  components: { InfoInputIcon, InfoSuccessIcon, InfoErrorIcon }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.checkbox-container {
  display: flex;
  gap: 7px;
  position: relative;
  cursor: pointer;
  align-items: center;
}

/* Esconder o checkbox padrão */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Criar o checkbox customizado */
.checkmark {
  position: relative;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid var(--gray-color-300);
}

.checkmark:hover:not(.disabled) {
  border: 1px solid var(--primary-color-principal);
}

.checkmark:focus-within:not(.disabled) {
  border: 1px solid var(--primary-color-principal);
}

.checkbox-container input:focus ~ .checkmark {
  border: 1px solid var(--primary-color-principal);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary-color-principal);
}

/* Criar o ícone de check, escondido quando não estiver selecionado */
.checkbox-container .checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* Exibir o ícone quando selecionado */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

label.disabled {
  cursor: not-allowed !important;
  opacity: 0.6;
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
</style>
