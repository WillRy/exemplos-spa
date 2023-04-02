<template>
    <component :is="is" class="overline-text">
        <slot></slot>
    </component>
</template>

<script>
export default {
    name: "OverlineText",
    props: {
        is: {
            type: String,
            default: 'span'
        }
    }
}
</script>

<style scoped>
.overline-text {
    vertical-align: super;
    font-size: 0.75rem;
    line-height: 0.9975rem;
    font-weight: bold;
    margin: 0;
}
</style>
