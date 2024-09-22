<template>
<div :class="`p-${size}`">
    <slot></slot>
</div>
</template>
<script lang="ts">
import { PropType } from 'vue';

type Size = '0' | '1' | '2' | '3' | '4' | '5' | '6';

export default {
    name: 'Spacing',
    props: {
        size: {
            type: String as PropType<Size>,
            default: '2',
        }
    }
}
</script>
