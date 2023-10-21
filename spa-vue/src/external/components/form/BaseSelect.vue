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

        <div style="display: flex;">
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
                    :loading="loading"
                >
                    <template v-slot:option="{option}">
                    <div class="option-select">
                        <!-- <span v-tooltip="{content: option[textBy]}">{{ option[textBy] }}</span> -->
                        <span>{{ option[textBy] }}</span>
                    </div>
                    </template>
                    <template v-slot:tag="{option, remove}">
                    <div class="custom-tag">
                        <span>{{ option[textBy] }}</span>
                        <button class="custom-tag-excluir" @click="remove(option)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
                        </button>
                    </div>
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
            <InfoInputIcon size="14px" class="icone-footer"/>
            <slot name="legenda" v-if="$slots.legenda"></slot>
            <template v-else>{{ legenda }}</template>
        </div>
        <div v-if="$slots.success || success" class="successMessage">
            <InfoSuccessIcon size="14px" class="icone-footer"/>
            <slot name="success" v-if="$slots.success"></slot>
            <template v-else>{{ success }}</template>
        </div>
        <div v-if="$slots.error || error" class="errorMessage">
            <InfoErrorIcon size="14px" class="icone-footer"/>
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
import {
  VTooltip,
} from 'floating-vue'

export default {
    name: "BaseSelect",
    inheritAttrs: false,
    components: {
        VueMultiselect,
        InfoInputIcon,
        InfoSuccessIcon,
        InfoErrorIcon,
    },
    directives: {
        tooltip: VTooltip
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
        maxElements: {
            type: String,
            default: null,
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
            default: true,
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
        loading: {
            type: Boolean,
            default: false,
        }
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
    -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
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
    color: var(--gray-400);
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
    color: var(--gray-400);
    padding-left: var(--padding-text);
    margin-top: var(--spacing-1);
}

.legenda:deep(*){
    margin: 0;
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


.btn-remover-select {
    all: unset;
    position: absolute;
    right: 34px;
    top: 50%;
    transform: translate(0,-50%);
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
  background: var(--primary-color-principal);
  color: #fff;
  gap: 6px;
  max-width: 100%;
}

.custom-tag span {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>
