<template>
  <component :is="is" :class="[size, 'body-text']">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { PropType } from 'vue'

type TextSize = 'sm' | 'md' | 'lg'

export default {
  name: 'BodyText',
  props: {
    is: {
      type: String,
      default: 'p'
    },
    size: {
      type: String as PropType<TextSize>,
      default: 'md'
    }
  }
}
</script>

<style scoped>
.body-text {
  margin: 0;
  color: var(--text-color);
}

.lg {
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.5rem;
}

.md {
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.5rem;
}

.sm {
  font-weight: normal;
  font-size: 0.875rem;
  line-height: 1rem;
}
</style>
