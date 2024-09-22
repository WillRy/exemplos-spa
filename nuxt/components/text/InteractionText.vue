<template>
    <component :is="is" :class="[size,'interaction-text']">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { PropType } from 'vue';


type TextSize = "sm" |"md" | "lg";


export default {
    name: "InteractionText",
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
