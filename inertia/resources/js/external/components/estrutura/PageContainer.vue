<template>
  <div
    class="page-container"
    :class="{ 'container-fluid': containerFluido, container: !containerFluido }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageContainer',
  props: {
    containerFluido: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.page-container {
  margin-top: var(--spacing-4);
}
</style>
