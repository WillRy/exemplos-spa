<template>
    <BaseButton class="btn-action" :size="size" :min="min" :loading="loading" :is="is">
        <slot name="default"></slot>
    </BaseButton>
</template>

<script lang="ts">
import BaseButton from "./BaseButton.vue";

export default {
    name: "BaseButtonAction",
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
.btn-action {
    background: var(--second-color-600);
    color: #fff;
}

.btn-action:hover {
    background: var(--second-color-400);
    color: #fff;
}

.btn-action:focus:not(:active) {
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--second-color-400);
    background: var(--second-color-400);
}

.btn-action:active {
    background: var(--second-color-700);
}

.btn-action:disabled {
    background: var(--gray-color-200);
    color: var(--gray-color-300);
    cursor: not-allowed;
    border: none;
}

.btn-action :deep(.fill path) {
  fill: #fff;
}

.btn-action:hover :deep(.fill path) {
  fill: #fff;
}

.btn-action :deep(.stroke path) {
  stroke: var(--second-color-400);
}

.btn-action:hover :deep(.stroke path) {
  stroke: #fff;
}
</style>
