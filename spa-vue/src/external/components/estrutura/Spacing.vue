<template>
<div :class="`p-${size}`">
    <slot></slot>
</div>
</template>
<script>
export default {
    name: 'Spacing',
    props: {
        size: {
            type: String,
            default: '2',
            validator(value) {
                return ["0", "1", "2", "3", "4", "5", "6"].includes(value);
            }
        }
    }
}
</script>