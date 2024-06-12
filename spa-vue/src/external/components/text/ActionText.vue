<template>
    <component :is="is" :class="[size,'action-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';

type TextSize = "sm" | "md" | "lg";

export default {
    name: "ActionText",
    props: {
        is: {
            type: String,
            default: 'p'
        },
        size: {
            type: String as PropType<TextSize>,
            default: 'md',
        },
    }
}
</script>

<style scoped>

.action-text {
  margin: 0;
  color: var(--text-color);
}

.lg {
    font-weight: bold;
    font-size: 1.125rem;
    line-height: 1.5rem;
}

.md {
    font-weight: bold;
    font-size: 1rem; 
    line-height: 1.5rem;
}

.sm {
    font-weight: bold;
    font-size: 0.875rem; 
    line-height: 1rem;
}
</style>
