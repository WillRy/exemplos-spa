<template>
  <div :class="{ 'form-group-has-icon': $slots.icon }" class="form-group">
    <label class="checkbox-container" :class="{ disabled: disabled }">
      <div type="checkbox" class="checkbox" :class="{ checked: checked }"></div>
      <span class="checkmark"></span>
      <span>
        <template v-if="label && !$slots.label">{{ label }}</template>
        <template v-if="$slots.label">
          <slot name="label" />
        </template>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BaseCheckboxSemAcao',
  inheritAttrs: false,
  props: {
    disabled: {
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
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
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  flex-shrink: 0;
}

.checkmark:hover:not(.disabled) {
  /* border: 1px solid var(--color-primary-principal); */
}

.checkmark:focus-within:not(.disabled) {
  border: 1px solid var(--color-primary-principal);
}

.checkbox-container input:focus ~ .checkmark {
  border: 1px solid var(--color-primary-principal);
}

.checkbox-container div.checked ~ .checkmark {
  background-color: var(--color-primary-principal);
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
.checkbox-container div.checked ~ .checkmark:after {
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
  color: var(--color-gray-400);
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
  color: var(--color-error-600);
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
  color: var(--color-success-600);
  padding-left: var(--padding-text);
  margin-top: var(--spacing-1);
}

.successMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}
</style>
