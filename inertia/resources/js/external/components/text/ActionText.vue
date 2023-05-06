<template>
    <component :is="is" :class="[size,'action-text']">
        <slot></slot>
    </component>
</template>

<script>
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
            validator(value) {
                return ["sm", "lg"].includes(value);
            }
        },
    }
}
</script>

<style scoped>

.action-text {
  margin: 0;
}

.lg {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.5rem;
}

.sm {
    font-size: 0.875rem;
    line-height: 1.0063rem;
    font-weight: normal;
}
</style>
