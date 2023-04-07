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
        >
          <template v-slot:option="{ option, remove }" v-if="$slots.option">
            <slot name="option" :option="option" :remove="remove"></slot>
          </template>
          <template v-slot:tag="{ option, remove }" v-if="$slots.tag">
            <slot name="tag" :option="option" :remove="remove"></slot>
          </template>
          <template v-if="noOptions" #noOptions>
            {{ noOptions }}
          </template>
          <template v-if="noResult" #noResult>
            {{ noResult }}
          </template>
          <template v-slot:clear="" v-if="modelValue && remover">
            <button class="btn-remover-select" @click="updateValue(null)">
              x
            </button>
          </template>
        </VueMultiselect>
      </div>
      <div v-if="$slots.btn" class="form-group-btn">
        <slot name="btn"></slot>
      </div>
    </div>

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
import VueMultiselect from "vue-multiselect";
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";
import InfoInputIcon from "../icons/InfoInputIcon.vue";
import InfoSuccessIcon from "../icons/InfoSuccessIcon.vue";

export default {
  name: "BaseSelect",
  inheritAttrs: false,
  components: {
    VueMultiselect,
    InfoInputIcon,
    InfoSuccessIcon,
    InfoErrorIcon,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    borda: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["md", "lg"].includes(value);
      },
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      default: "Selecione um valor",
    },
    noResult: {
      type: String,
      default: "Não foram encontrados itens com esta pesquisa",
    },
    noOptions: {
      type: String,
      default: "Digite sua pesquisa",
    },
    modelValue: {
      type: Object,
    },
    trackBy: {
      type: String,
    },
    textBy: {
      type: String,
    },
    options: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: true,
    },
    empty: {
      type: Boolean,
      default: false,
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
    remover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        input: this.updateValue,
      };
    },
  },
  methods: {
    remove() {
      this.$emit("update:modelValue", null);
      this.$emit("change", null);
    },
    updateValue(event) {
      this.$emit("update:modelValue", event);
      this.$emit("change", event);
    },
  },
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


  --label-color: var(--gray-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--second-color-500);

  /* espaçamento do texto/label */
  --padding-text: 16px;
}

:deep(label) {
  line-height: 24px;
  font-weight: 400;
  font-size: 12px;

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
  fill: var(--focus-color)
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
  border: var(--border) solid var(--gray-400);
  border-radius: 8px;
}

.form-group-container:not(.borda) {
  background: var(--gray-100);
  border-bottom: var(--border) solid var(--gray-800);
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
  border-top: var(--border) solid var(--primary-color-300);
  border-bottom: var(--border) solid var(--primary-color-300);
  border-left: var(--border) solid var(--primary-color-300);
  border-right: var(--border) solid var(--primary-color-300);
}

.form-group-container.borda:focus-within {
  border-top: var(--border) solid var(--focus-color);
  border-bottom: var(--border) solid var(--focus-color);
  border-left: var(--border) solid var(--focus-color);
  border-right: var(--border) solid var(--focus-color);

  box-shadow: var(--focus-color) 0px 0px 0px var(--border);
}

.form-group-container.borda.btn:focus-within {
  border-right: 3px solid var(--focus-color);
}

.form-group-container:not(.borda):hover {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;
  border-bottom: var(--border) solid var(--primary-color-300);
  border-left: var(--border) solid transparent;;
  border-right: var(--border) solid transparent;;
}

.form-group-container:not(.borda):focus-within {
  border-radius: 8px 8px 0 0;
  border-top: var(--border) solid transparent;;
  border-bottom: var(--border) solid var(--focus-color);
  border-left: var(--border) solid transparent;;
  border-right: var(--border) solid transparent;;
}


.disabled .form-group-container,
.disabled .form-group-container:hover,
.disabled .form-group-container:focus {
  background: var(--gray-100) !important;
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
/*    border: 1px solid var(--error-color-500) !important;*/
/*}*/

input {
  cursor: inherit;
  font-size: 14px;
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
  font-size: 16px;
}

input:focus {
  outline: 0;
}


input::placeholder {
  font-size: 16px;
  color: var(--gray-400);
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

.legenda:deep(*) {
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

.errorMessage:deep(*) {
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

.successMessage:deep(*) {
  margin: 0;
}

.successMessage > svg {
  display: block;
  width: 14px;
  margin-right: 2px;
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
  background: var(--primary-color-400);
  color: #fff;

  border-radius: 0 8px 8px 0;
}


.form-group-btn :deep(button:hover) {
  background: var(--primary-color-300);
}


.form-group-btn :deep(button:focus) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-color-300);
  background: var(--primary-color-300);
}

.form-group-btn :deep(button:active) {
  box-shadow: none;
  background: var(--primary-color-700);
}

.form-group-btn :deep(button:disabled) {
  cursor: not-allowed;
  background: var(--gray-400);
}


.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:not(:active)) {
  box-shadow: var(--primary-color-400) 0px 0px 0px var(--border);
}

.form-group-container.borda:focus-within ~ .form-group-btn :deep(button:hover) {
  box-shadow: var(--primary-color-300) 0px 0px 0px var(--border);
}


.btn-remover-select {
  all: unset;
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 9;
  background: var(--error-color-600);
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


.md :deep(.multiselect),
.md :deep(.multiselect__input),
.md :deep(.multiselect__single) {
  font-size: 14px !important;
}

.lg :deep(.multiselect),
.lg :deep(.multiselect__input),
.lg :deep(.multiselect__single) {
  font-size: 16px !important;
}

:deep(.multiselect__content-wrapper) {
  width: calc(100% + 0px);
}

.md :deep(.multiselect__tags) {
  min-height: var(--md-min-height-input);
  border: 0;
  background: transparent;
  padding: 8px 40px 0px 12px;
}

.lg :deep(.multiselect__tags) {
  min-height: var(--lg-min-height-input);
  border: 0;
  background: transparent;
  padding: 12px 40px 0px 12px;
}

:deep(.multiselect__tag) {
  margin-bottom: 0;
}

.md :deep(.multiselect) {
  min-height: var(--md-min-height-input);
}

.lg :deep(.multiselect) {
  min-height: var(--lg-min-height-input);
}

:deep(.multiselect--disabled .multiselect__current),
:deep(.multiselect--disabled .multiselect__select) {
  background: transparent;
}

:deep(.multiselect__input),
:deep(.multiselect__single) {
  background: transparent;
  line-height: initial;
  min-height: initial;
}

.md :deep(.multiselect__select) {
  height: var(--md-min-height-input);
  right: 1px;
  top: 0px;
}

.lg :deep(.multiselect__select) {
  height: var(--lg-min-height-input);
  right: 1px;
  top: 0px;
}

:deep(.multiselect__placeholder) {
  font-size: 14px;
  color: var(--gray-400);
}

:deep(.custom-tag){
  box-sizing: border-box;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid var(--gray-400);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 4px;
}
</style>
