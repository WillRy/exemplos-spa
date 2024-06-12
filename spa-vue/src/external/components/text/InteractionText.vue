<template>
    <component :is="is" :class="[size,'interaction-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';


type TextSize = "sm" |"md" | "lg";


export default {
    name: "InteractionText",
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
.interaction-text {
  margin: 0;
  color: var(--text-color);
}

.lg {
    font-weight: 500;
    font-size: 1.125rem;
    line-height: 1.5rem;
}

.md {
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;
}

.sm {
    font-weight: 500;
    font-size: 0.875rem; 
    line-height: 1rem;
}
</style>
