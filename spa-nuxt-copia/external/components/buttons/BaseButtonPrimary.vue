<template>
    <BaseButton class="btn-primary" :size="size" :min="min" :loading="loading">
        <slot></slot>
    </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
    name: "BaseButtonPrimary",
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
.btn-primary {
    background: var(--primary-color-400);
    color: #fff;
}

.btn-primary:hover {
    background: var(--primary-color-300);
    color: #fff;
}

.btn-primary:focus-visible {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-color-300);
    background: var(--primary-color-300);
}

.btn-primary:active {
    background: var(--primary-color-700);
}

.btn-primary:disabled {
    background: var(--gray-200);
    color: var(--gray-300);
    cursor: not-allowed;
    border: none;
}
</style>
