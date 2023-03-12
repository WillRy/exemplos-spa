<template>
  <div class="layout-publico">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "publico"
}
</script>

<style scoped>
.layout-publico {
  height: 100vh;
  background: #f2f2f2;

  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
