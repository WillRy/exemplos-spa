<template>
  <component :is="is" :class="[size, 'body-text']">
    <slot></slot>
  </component>
</template>

<script lang="ts">
export default {
  name: 'BodyText',
  props: {
    is: {
      type: String,
      default: 'p'
    },
    size: {
      type: String,
      default: 'sm',
      validator(value: string) {
        return ['sm', 'lg'].includes(value)
      }
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
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: normal;
}

.sm {
  font-size: 0.875rem;
  line-height: 1.4875rem;
  font-weight: normal;
}
</style>
