<template>
    <component :is="is" :class="[size, 'overline-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';

type TextSize = "sm" | "md" | "lg";

export default {
    name: "OverlineText",
    props: {
        is: {
            type: String,
            default: 'span'
        },
        size: {
            type: String as PropType<TextSize>,
            default: 'md',
        },
    }
}
</script>

<style scoped>
.overline-text {
    vertical-align: super;
    margin: 0;
    color: var(--text-color);
}

.md {
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5rem;
}

.sm {
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>
