<template>
    <component :is="is" :class="[size,'subtitle-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';

type TextSize = "sm" | "lg";

export default {
    name: "SubtitleText",
    props: {
        is: {
            type: String,
            default: 'span'
        },
        size: {
            type: String as PropType<TextSize>,
            default: 'sm',
        },
    }
}
</script>

<style scoped>

</style>
