<template>
    <BaseButton class="btn-success" :size="size" :min="min" :loading="loading">
        <slot></slot>
    </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
    name: "BaseButtonSuccess",
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
.btn-success {
    background: var(--success-color-600);
    color: #fff;
}

.btn-success:hover {
    background: var(--success-color-400);
    color: #fff;
}

.btn-success:focus-visible {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--success-color-400);
    background: var(--success-color-400);
}

.btn-success:active {
    background: var(--success-color-700);
}

.btn-success:disabled {
    background: var(--gray-200);
    color: var(--gray-300);
    cursor: not-allowed;
    border: none;
}
</style>
