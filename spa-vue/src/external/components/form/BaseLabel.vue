<template>
  <div>
    <div class="label-container" :class="{ padding: padding }" v-if="$slots.default">
      <slot @click.stop=""></slot>
    </div>
    <div class="label-container" :class="{ padding: padding }" v-if="label">
      <label>{{ label }}</label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
type Types = {
  label?: string
  padding?: boolean
}

withDefaults(defineProps<Types>(), {
  label: '',
  padding: false
})
</script>
<style scoped>
:deep(.label-container),
.label-container {
  line-height: 24px;
  font-weight: 400;
  font-size: 0.75rem;

  color: var(--color-gray-400);
  margin-bottom: 2px;
  display: block;
}

.padding {
  padding-left: 16px;
}
</style>
