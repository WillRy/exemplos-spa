<template>
  <div class="radio-button-group" :class="{disabled: disabled}">
    <label class='label' v-if="label">{{ label }}</label>
    <div class="option-container" :class="{horizontal: horizontal}">
      <label
        :for="option[identificadorResposta]"
        v-for="option in options"
        :key="option[identificadorResposta]"
        class="control control--radio"
      >
        <input
          type="radio"
          :value="option[identificadorResposta]"
          class="radio"
          :checked="
            modelValue &&
            option[identificadorResposta] === modelValue[identificadorResposta]
          "
          :id="option[identificadorResposta]"
          @change="() => atualizar(option)"
          :disabled="disabled || (option && option['disabled'])"
        />
        <div class="control__indicator"></div>
        <ActionText size="sm" is="span">{{ option[identificadorTexto] }}</ActionText>
        <InfoInputIcon size="14px" class="icone-footer" v-if="option['tooltip']" v-tooltip="{content: option['tooltip']}"/>
      </label>
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
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";
import InfoInputIcon from "../icons/InfoInputIcon.vue";
import InfoSuccessIcon from "../icons/InfoSuccessIcon.vue";
import ActionText from "../text/ActionText.vue";
import {
  VTooltip,
} from 'floating-vue'

export default {
  name: "BaseRadioHorizontal",
  props: {
    disabled: {
        required: false,
        type: Boolean
    },
    label: {
        required: false,
        type: String
    },
    options: {
      required: true,
      type: Array<object>,
    },
    identificadorResposta: {
      required: true,
      type: String,
    },
    identificadorTexto: {
      required: true,
      type: String,
    },
    modelValue: {
      required: false,
      type: Object,
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
    horizontal: {
      type: Boolean,
      default: true
    }
  },
  components: { InfoInputIcon, InfoSuccessIcon, InfoErrorIcon, ActionText },
  setup() {},
  computed: {},
  methods: {
    atualizar(option) {
      this.$emit('update:modelValue', option)
    }
  },
  directives: {
    tooltip: VTooltip
  }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
    --label-color: var(--gray-color-400);
    --label-margin-bottom: 2px;
}

.radio-button-group.disabled {
    cursor: not-allowed !important;
}

.label {
    line-height: 24px;
    font-weight: 400;
    font-size: 0.75rem;

    color: var(--label-color);
    margin-bottom: var(--label-margin-bottom);
    display: block;
    padding-left: var(--padding-text);
}

.option-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.option-container.horizontal {
  flex-direction: row;
}

.control {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  gap: 12px;
}

.disabled .control {
    cursor: not-allowed;
}

.control .radio {
  z-index: -1;
  opacity: 0;
  position: absolute;
}

.control__indicator {
    height: 16px;
    width: 16px;
    flex-shrink: 0;
    position: relative;
    border: 1px solid #70707066;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control--radio .control__indicator {
  border-radius: 50%;
}

.control:hover :not([disabled]) ~ .control__indicator,
.control input:focus ~ .control__indicator {
  border: 1px solid var(--primary-color-principal);
}

.control input:checked ~ .control__indicator {
  background: var(--primary-color-principal);
}

.control:hover input:not([disabled]):checked ~ .control__indicator,
.control input:checked:focus ~ .control__indicator {
  background: var(--primary-color-principal);
}

.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}

.control__indicator:after {
    content: "";
    position: relative;
  display: none;
}

.control input:checked ~ .control__indicator:after {
  display: block;
}

.control--checkbox .control__indicator:after {
  left: 8px;
  top: 4px;
  width: 3px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.control--checkbox input:disabled ~ .control__indicator:after {
  border-color: #7b7b7b;
}

.control--radio .control__indicator:after {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: #fff;
    line-height: 0;
}

.control--radio input:disabled ~ .control__indicator:after {
  background: #7b7b7b;
}

.input-outros {
  border: none;
  outline: none;
  color: #707070;
  font-size: 18px;
  width: 100%;

  border-bottom: 1px solid #bbbfc4;
}

.input-outros:focus-within {
  border-bottom: 1px solid var(--primary-color-principal);
}

.error .input-outros {
  border-bottom: 1px solid #e03025;
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
}


.successMessage > svg {
    flex-shrink: 0;
    width: 14px;
    margin-right: 8px;
}
</style>
