<template>
    <component :is="is" :class="[size,'body-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';


type TextSize = "sm" | "md" | "lg";

export default {
    name: "BodyText",
    props: {
        is: {
            type: String,
            default: 'p'
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
