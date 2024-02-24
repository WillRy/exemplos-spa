<template>
    <BaseButton class="btn-success" :size="size" :min="min" :loading="loading" :is="is">
        <slot></slot>
    </BaseButton>
</template>

<script lang="ts">
import BaseButton from "./BaseButton.vue";

export default {
    name: "BaseButtonSuccess",
    components: {BaseButton},
    props: {
        is: {
            type: String,
            default: 'button'
        },
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
.btn-success {
    background: var(--success-color-600);
    color: #fff;
}

.btn-success:hover {
    background: var(--success-color-400);
    color: #fff;
}

.btn-success:focus:not(:active) {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--success-color-400);
    background: var(--success-color-400);
}

.btn-success:active {
    background: var(--success-color-700);
}

.btn-success:disabled {
    background: var(--gray-color-200);
    color: var(--gray-color-300);
    cursor: not-allowed;
    border: none;
}
</style>
