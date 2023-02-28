<template>
    <div class="check-container" :class="{error: error, checked: checked, disabled: disabled}">
        <div class="label-container" v-if="$slots.label">
            <slot name="label" v-if="$slots.label" @click.stop=""></slot>
        </div>
        <div class="label-container" v-if="label">
            <label>{{ label }}</label>
        </div>

        <input
            ref="checkbox"
            v-bind="$attrs"
            :checked="checkedNormalizado"
            :disabled="disabled"
            class="check"
            type="checkbox"
            @change="updateValue"
        >

        <label class="checktoggle" @click="updateValue">
            <span :class="{visible: checkedNormalizado}" class="on">{{ on }}</span>
            <span :class="{visible: !checkedNormalizado}" class="off">{{ off }}</span>
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
        <div v-if="$slots.error || error"  class="errorMessage">
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
    name: "BaseToggle",
    inheritAttrs: false,
    components: {InfoInputIcon, InfoSuccessIcon, InfoErrorIcon},
    model: {
        prop: "checked",
        event: "change"
    },
    props: {
        error: {
            type: String,
        },
        success: {
            type: String,
        },
        legenda: {
            type: String,
        },
        checked: {
            type: [Boolean, String]
        },
        disabled: Boolean,
        label: String,
        on: {
            type: String,
            default: "ON"
        },
        off: {
            type: String,
            default: "OFF"
        },
    },
    computed: {
        checkedNormalizado() {
            if ((typeof this.checked === "string" && this.checked === "S") || (typeof this.checked === "boolean" && this.checked)) {
                return true;
            }
            return false;
        }
    },
    methods: {
        updateValue() {
            if (this.disabled)
                return;
            let valor = !this.$refs.checkbox.checked;
            console.log(valor);
            this.$emit("change", valor);
        },
        normalizaPrimeiroValor() {
            if (typeof this.checked === "string" && this.checked === "S") {
                this.$emit("change", true);
            }
            if (typeof this.checked === "string" && this.checked === "N") {
                this.$emit("change", true);
            }
        }
    },
    created() {
        // console.log('base', this.checked);
        this.normalizaPrimeiroValor();
    },
}
</script>

<style scoped>
:deep(.label-container label) {
    line-height: 24px;
    font-weight: 400;
    font-size: 12px;

    color: var(--gray-400);
    margin-bottom: 2px;
    display: block;
    padding-left: 16px;
}

.legenda {
    display: flex;
    align-items: center;

    padding-left: 16px;
    font-size: 12px;
    color: var(--gray-400);
    line-height: 24px;
}

.legenda > svg {
    display: block;
    width: 14px;
    margin-right: 2px;
}


.errorMessage {
    display: flex;
    align-items: center;

    padding-left: 16px;
    font-size: 12px;
    color: var(--error-color-600);
    line-height: 24px;
}

.errorMessage > svg {
    display: block;
    width: 14px;
    margin-right: 2px;
}

.successMessage {
    display: flex;
    align-items: center;

    padding-left: 16px;
    font-size: 12px;
    color: var(--success-color-600);
    line-height: 24px;
}

.successMessage > svg {
    display: block;
    width: 14px;
    margin-right: 2px;
}


.check-container {
    position: relative;
}

.check-container .on {
    visibility: hidden;
    color: #BBBFC4;
    font-size: 12px;
    line-height: 0;
    user-select: none;
    margin-left: 12px;
}

.check-container .off {
    visibility: hidden;
    color: #BBBFC4;
    font-size: 12px;
    line-height: 0;
    user-select: none;
    margin-right: 12px;
}

.check {
    display: block;
    margin: 0;
    padding: 0;
    width: 0;
    height: 0;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    position: absolute;
}

.check:disabled + .checktoggle {
    opacity: 0.4;
    cursor: not-allowed;
}

.check:checked + .checktoggle {
    background-color: var(--primary-color-500);
    box-shadow: none;
}

.checktoggle {
    box-shadow: inset 0px 3px 6px #00000029;
    background-color: #F5F5F5;
    color: #BBBFC4;
    border-radius: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 0;
    min-height: 36px;
    margin-bottom: 0;
    position: relative;
    min-width: 82px;

    max-width: max-content;

    justify-content: space-between;
}

.checktoggle:after {
    content: ' ';
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(5px, -50%);
    width: 32px;
    height: 32px;
    background-color: var(--primary-color-500);
    border-radius: 50%;
    transition: left 300ms ease, transform 300ms ease;
}


.check:checked + .checktoggle:after {
    background-color: #fff;
    left: 100%;
    transform: translate(calc(-100% - 5px), -50%);
}


.visible {
    visibility: visible !important;
}
</style>
