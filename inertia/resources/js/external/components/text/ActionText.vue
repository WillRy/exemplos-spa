<template>
    <component :is="is" :class="[size,'action-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
export default {
    name: "ActionText",
    props: {
        is: {
            type: String,
            default: 'p'
        },
        size: {
            type: String,
            default: 'sm',
            validator(value: string) {
                return ["sm", "lg"].includes(value);
            }
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
    font-size: 1rem;
    line-height: 1.5rem;
}

.sm {
    font-weight: normal;
    font-size: 0.875rem;
    line-height: 1.0063rem;
}
</style>
