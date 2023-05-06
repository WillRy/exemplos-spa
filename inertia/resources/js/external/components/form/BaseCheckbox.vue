<template>
  <div :class="{ 'form-group-has-icon': $slots.icon }" class="form-group">
    <label class="checkbox-container" :class="{disabled: disabled}">
      <input type="checkbox" class="checkbox" :checked="modelValue" @input="updateValue"
             v-bind="attrs" :disabled="disabled">
      <span class="checkmark"></span>
      <template v-if="label">{{ label }}</template>
    </label>
    <div v-if="$slots.legenda || legenda" class="legenda">
      <InfoInputIcon size="14px"/>
      <slot name="legenda" v-if="$slots.legenda"></slot>
      <template v-else>{{ legenda }}</template>
    </div>
    <div v-if="$slots.success || success" class="successMessage">
      <InfoSuccessIcon size="14px"/>
      <slot name="success" v-if="$slots.success"></slot>
      <template v-else>{{ success }}</template>
    </div>
    <div v-if="$slots.error || error" class="errorMessage">
      <InfoErrorIcon size="14px"/>
      <slot name="error" v-if="$slots.error"></slot>
      <template v-else>{{ error }}</template>
    </div>
  </div>
</template>

<script>
import InfoErrorIcon from '../icons/InfoErrorIcon.vue';
import InfoInputIcon from '../icons/InfoInputIcon.vue';
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue';

export default {
  name: "BaseCheckbox",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    modelValue: {
      default: null
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
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        input: this.updateValue
      };
    }
  },
  methods: {
    updateValue(event) {
      let boolean = event.target.checked;
      this.$emit("update:modelValue", boolean);
    }
  },
  components: {InfoInputIcon, InfoSuccessIcon, InfoErrorIcon}
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
  border: 1px solid var(--gray-300);
}

.checkmark:hover:not(.disabled){
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
  content: "";
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
  align-items: center;

  padding-left: var(--padding-text);
  font-size: 12px;
  color: var(--gray-400);
  line-height: 24px;
  margin: 0;
}

.legenda:deep(*){
  margin: 0;
}

.legenda > svg {
  display: block;
  width: 14px;
  margin-right: 2px;
}


.errorMessage {
  display: flex;
  align-items: center;

  padding-left: var(--padding-text);
  font-size: 12px;
  color: var(--error-color-600);
  line-height: 24px;
  margin: 0;
}

.errorMessage:deep(*){
  margin: 0;
}

.errorMessage > svg {
  display: block;
  width: 14px;
  margin-right: 2px;
}

.successMessage {
  display: flex;
  align-items: center;

  padding-left: var(--padding-text);
  font-size: 12px;
  color: var(--success-color-600);
  line-height: 24px;
  margin: 0;
}

.successMessage:deep(*){
  margin: 0;
}

.successMessage > svg {
  display: block;
  width: 14px;
  margin-right: 2px;
}


</style>
