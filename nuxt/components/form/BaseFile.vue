<template>
    <div class="form-group" :class="{ error: error, md: size === 'md', lg: size === 'lg', disabled: disabled }">
        <BaseLabel :label="label" :padding="true" v-if="label" />
        <BaseLabel :padding="true" v-if="$slots.label">
            <slot name="label" />
        </BaseLabel>



        <div style="display: flex; align-items: center" class="form-all-container">
            <div class="form-group-container" :class="{ borda: borda, btn: true, icon: $slots.icon }">
                <div v-if="$slots.icon" class="form-group-icon">
                    <slot name="icon"></slot>
                </div>
                <div v-if="$slots.prefix" class="form-group-prefix">
                    <slot name="prefix"></slot>
                </div>
                <input v-bind="$attrs" type="file" style="display: none;" ref="input" @change="updateValue"
                    :multiple="multiple">
                <input :value="nomesArquivos" @input="updateValue" :disabled="disabled" readonly
                    @click="abrirSelecaoArquivo" />
                <div class="form-group-btn-flutuante" v-if="nomesArquivos">
                    <button class="btn-remover-select" @click="removerArquivos">
                        x
                    </button>
                </div>
            </div>
            <div class="form-group-btn">
                <BaseButtonPrimary @click="abrirSelecaoArquivo">Selecionar</BaseButtonPrimary>
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
import { computed, ref, watch } from 'vue'
import BaseButtonPrimary from '../buttons/BaseButtonPrimary.vue';
import InfoLegenda from "../info/InfoLegenda.vue";
import InfoSuccess from "../info/InfoSuccess.vue";
import InfoError from "../info/InfoError.vue";
import BaseLabel from "./BaseLabel.vue";

type SizeInput = 'md' | 'lg'

const emit = defineEmits(["update:modelValue"])

defineOptions({
    inheritAttrs: false,
})

const input = ref<HTMLInputElement | null>(null)

defineExpose({
    focusInput: () => {
        if (!input.value) return
        input.value.focus()
    },
    clear() {
        emit("update:modelValue", null);
        if (!input.value) return
        input.value.value = "";
    }
})

const props = withDefaults(defineProps<{
    disabled?: boolean,
    borda?: boolean,
    label?: string,
    modelValue?: FileList | null,
    error?: string,
    success?: string,
    legenda?: string,
    size?: SizeInput,
    multiple?: boolean
}>(), {
    disabled: false,
    borda: true,
    label: "",
    modelValue: null,
    error: "",
    success: "",
    legenda: "",
    size: "md" as SizeInput,
    multiple: false
})

const nomesArquivos = computed(() => {
    if (!props.modelValue) return "";

    const arquivos = props.modelValue as FileList;
    const arrayArquivos = Array.from(arquivos);


    return arrayArquivos.map(arquivo => arquivo.name).join(", ");
})

watch(() => props.modelValue, () => {
    const arquivos = props.modelValue as FileList;

    if (arquivos && arquivos.length === 0 && input.value) {
        input.value.value = "";
    }

    if (!arquivos && input.value) {
        input.value.value = "";
    }
})


function updateValue(event: Event) {
    emit("update:modelValue", (event.target as HTMLInputElement).files)
}

function abrirSelecaoArquivo() {
    if (!input.value) return;

    input.value.click();
}

function removerArquivos() {
    emit("update:modelValue", null)
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


    --label-color: var(--gray-color-400);
    --label-margin-bottom: 2px;

    /* cor usada para destaque no focus */
    --focus-color: var(--primary-color-principal-focus);

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

.form-group-icon> :deep(img) {
    height: 18px;
    width: 18px;
}

.form-group-icon> :deep(svg) {
    height: 18px;
    width: 18px;
}

.form-group-container:focus-within .form-group-icon> :deep(svg path) {
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
    border: var(--border) solid var(--gray-color-400);
    border-radius: 8px;
}

.form-group-container:not(.borda) {
    background: var(--gray-color-100);
    border-bottom: var(--border) solid var(--gray-color-800);
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
    border-left: var(--border) solid transparent;
    ;
    border-right: var(--border) solid transparent;
    ;
}

.form-group-container:not(.borda):focus-within {
    border-radius: 8px 8px 0 0;
    border-top: var(--border) solid transparent;
    ;
    border-bottom: var(--border) solid var(--focus-color);
    border-left: var(--border) solid transparent;
    ;
    border-right: var(--border) solid transparent;
    ;
}


.disabled .form-group-container,
.disabled .form-group-container:hover,
.disabled .form-group-container:focus {
    background: var(--gray-color-100) !important;
    cursor: not-allowed;
}

.form-group-container.btn {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.form-group-btn {
    flex-shrink: 0;
}

.form-group-btn> :deep(button) {
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
    color: var(--gray-color-400);
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

.form-group-btn-flutuante {
    display: flex;
    align-items: center;
    position: absolute;
    right: 8px;
    gap: 12px;
}

.btn-remover-select {
    all: unset;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 3;
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
</style>
