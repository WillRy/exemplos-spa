<template>
    <component :is="is" :class="[size,'heading-text']">
        <slot></slot>
    </component>
</template>

<script>
export default {
    name: "InteractionText",
    props: {
        is: {
            type: String,
            default: 'p'
        },
        size: {
            type: String,
            default: 'sm',
            validator(value) {
                return ["sm", "md", "lg"].includes(value);
            }
        },
    }
}
</script>

<style scoped>
.heading-text {
  margin: 0;
  color: var(--text-color);
}

.lg {
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;
}

.md {
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.0063rem;
}

.sm {
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 0.9975rem;
}
</style>
