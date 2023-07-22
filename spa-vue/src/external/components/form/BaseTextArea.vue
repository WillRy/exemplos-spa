<template>
    <div class="form-group" :class="{error: error, md: size==='md', lg: size==='lg', disabled: disabled}">
        <div class="label-container" v-if="$slots.label">
            <slot name="label" v-if="$slots.label" @click.stop=""></slot>
        </div>
        <div class="label-container" v-if="label">
            <label>{{ label }}</label>
        </div>


        <div style="display: flex; align-items: center" class="form-all-container">
            <div class="form-group-container" :class="{ borda: borda, btn: $slots.btn, icon: $slots.icon }">
                <textarea v-bind="attrs" :value="modelValue" @input="updateValue" :disabled="disabled"></textarea>
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
        <div v-if="$slots.error || error"  class="errorMessage">
            <InfoErrorIcon size="14px" class="icone-footer"/>
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
    name: "BaseTextArea",
    inheritAttrs: false,
    components: {InfoInputIcon, InfoSuccessIcon, InfoErrorIcon},
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        borda: {
            type: Boolean,
            default: true
        },
        label: {
            type: String,
            default: "",
        },
        modelValue: [String, Number],
        error: {
            type: String,
        },
        success: {
            type: String,
        },
        legenda: {
            type: String,
        },
        size: {
            type: String,
            default: "md",
            validator(value) {
                return ["md", "lg"].includes(value);
            }
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
        updateValue(event) {
            this.$emit("update:modelValue", event.target.value);
        },
    }
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

.form-group-container {
    box-sizing: border-box;
    border: var(--border) solid transparent;
    display: flex;
    align-items: center;
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


.form-group-btn > :deep(button) {
    height: 100%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/*.error .form-group-container {*/
/*    border: 1px solid var(--error-color-500) !important;*/
/*}*/

textarea {
    cursor: inherit;
    font-size: 14px;
    color: #444444;
    border: 0;
    width: 100%;
    background: transparent;
    border-radius: var(--radius-principal);
    padding: var(--padding-text);
    outline: none;
    resize: vertical;
}

textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
textarea:-webkit-autofill:active {
    -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
    -webkit-transition-delay: 9999s;
}


textarea:focus {
    outline: 0;
}


textarea::placeholder {
    font-size: 16px;
    color: var(--gray-400);
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.legenda {
    display: flex;
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
    flex-shrink: 0;
    margin-right: 8px;
    margin-top: 4px;
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