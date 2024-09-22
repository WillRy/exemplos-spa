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

</style>
