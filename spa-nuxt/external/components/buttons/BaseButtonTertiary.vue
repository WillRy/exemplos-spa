<template>
    <BaseButton class="btn-tertiary" :size="size" :min="min" :loading="loading">
        <slot></slot>
    </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
    name: "BaseButtonTertiary",
    components: {BaseButton},
    props: {
        size: {
            type: String,
            default: 'md'
        },
        min: {
            type: Boolean,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.btn-tertiary {
    background: none;
    color: var(--primary-color-400)
}

.btn-tertiary:hover {
    background: var(--primary-color-50);
    color: var(--primary-color-300);
}

.btn-tertiary:focus-visible {
    color: var(--primary-color-300);
    border: 1px solid var(--primary-color-300);
    background: var(--primary-color-50);
}

.btn-tertiary:active {
    background: var(--primary-color-200);
    color: #fff;
}

.btn-tertiary:disabled {
    background: var(--gray-200);
    color: var(--gray-300);
    cursor: not-allowed;
    border: none;
}
</style>
