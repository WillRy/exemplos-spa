<template>
    <BaseButton class="btn-action" :size="size" :min="min" :loading="loading">
        <slot name="default"></slot>
    </BaseButton>
</template>

<script>
import BaseButton from "./BaseButton";

export default {
    name: "BaseButtonAction",
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
.btn-action {
    background: var(--second-color-600);
    color: #fff;
}

.btn-action:hover {
    background: var(--second-color-400);
    color: #fff;
}

.btn-action:focus-visible {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--second-color-400);
    background: var(--second-color-400);
}

.btn-action:active {
    background: var(--second-color-700);
}

.btn-action:disabled {
    background: var(--gray-200);
    color: var(--gray-300);
    cursor: not-allowed;
    border: none;
}
</style>
