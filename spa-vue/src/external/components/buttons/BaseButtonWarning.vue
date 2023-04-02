<template>
    <BaseButton class="btn-warning" :size="size" :min="min" :loading="loading">
        <slot></slot>
    </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton.vue";

export default {
    name: "BaseButtonWarning",
    components: {BaseButton},
    props: {
        size: {
            type: String,
            default: 'md'
        },
        min: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.btn-warning {
    background: var(--warning-color-600);
    color: #000;
}

.btn-warning:hover {
    background: var(--warning-color-300);
    color: #000;
}

.btn-warning:focus-visible {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--warning-color-300);
    background: var(--warning-color-300);
}

.btn-warning:active {
    color: #000;
    background: var(--warning-color-700);
}

.btn-warning:disabled {
    background: var(--gray-200);
    color: var(--gray-300);
    cursor: not-allowed;
    border: none;
}
</style>
