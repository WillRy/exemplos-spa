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

<style scoped>
.heading-text {
  margin: 0;
  color: var(--text-color);
}

.xxxl {
  font-size: 4rem;
  font-weight: bold;
  line-height: 5rem;
}

.xxl {
  font-size: 3rem;
  font-weight: bold;
  line-height: 3.75rem;
}

.xl {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 3rem;
}

.lg {
  font-size: 2rem;
  font-weight: bold;
  line-height: 2.5rem;
}

.md {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.995rem;
}

.sm {
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.5rem;
}

@media all and (max-width: 786px) {
  .xxxl {
    font-size: 3rem;
    font-weight: bold;
    line-height: 3.75rem;
  }

  .xxl {
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 3.125rem;
  }

  .xl {
    font-size: 2rem;
    font-weight: bold;
    line-height: 2.66rem;
  }

  .lg {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.8rem;
  }

  .md {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.5rem;
  }

  .sm {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.5rem;
  }
}
</style>
