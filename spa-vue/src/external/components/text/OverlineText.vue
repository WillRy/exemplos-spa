<template>
    <component :is="is" :class="[size, 'overline-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
export default {
    name: "OverlineText",
    props: {
        is: {
            type: String,
            default: 'span'
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
.overline-text {
    vertical-align: super;
    margin: 0;
    color: var(--text-color);
}

.lg {
    font-weight: bold;
    font-size: 0.75rem;
    line-height: 0.9975rem;

}

.sm {
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 0.9975rem;
}
</style>
