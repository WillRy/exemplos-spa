<template>
  <component :is="is" :class="[size, 'subtitle-text']">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { PropType } from 'vue'

type TextSize = 'sm' | 'lg'

export default {
  name: 'SubtitleText',
  props: {
    is: {
      type: String,
      default: 'span'
    },
    size: {
      type: String as PropType<TextSize>,
      default: 'sm'
    }
  }
}
</script>

<style scoped>
.subtitle-text {
  margin: 0;
  color: var(--text-color);
}

.lg {
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: normal;
}

.sm {
  font-size: 1.5rem;
  line-height: 1.995rem;
  font-weight: normal;
}

@media all and (max-width: 786px) {
  .lg {
    font-size: 1.5rem;
    font-weight: normal;
    line-height: 1.995rem;
  }

  .sm {
    font-size: 1.25rem;
    font-weight: normal;
    line-height: 1.5rem;
  }
}
</style>
