<template>
    <component :is="is" :class="[size, 'overline-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';

type TextSize = "sm" | "md" | "lg";

export default {
    name: "OverlineText",
    props: {
        is: {
            type: String,
            default: 'span'
        },
        size: {
            type: String as PropType<TextSize>,
            default: 'md',
        },
    }
}
</script>

<style scoped>

</style>
