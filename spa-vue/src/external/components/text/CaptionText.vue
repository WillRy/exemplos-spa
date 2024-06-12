<template>
    <component :is="is" class="caption-text">
        <slot></slot>
    </component>
</template>

<script lang="ts">
export default {
    name: "CaptionText",
    props: {
        is: {
            type: String,
            default: 'span'
        }
    }
}
</script>

<style scoped>
.caption-text {
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1rem;
    margin: 0;
    font-style: italic;

    color: var(--text-color);
}
</style>
