<template>
  <component :is="is" :class="[size, 'heading-text']">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { PropType } from 'vue'

type TextSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

export default {
  name: 'HeadingText',
  props: {
    is: {
      type: String,
      default: 'h2'
    },
    size: {
      type: String as PropType<TextSize>,
      default: 'md'
    }
  }
}
</script>

<style scoped></style>
