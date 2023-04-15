<template>
  <div class="container-fluid page-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "PageContainer"
}
</script>

<style scoped>
.page-container {
  margin-top: var(--spacing-4);
}
</style>