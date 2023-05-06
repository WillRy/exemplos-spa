<template>
<div class="box">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: "Box"
}
</script>

<style scoped>
.box {
  border: 1px solid #E1E2E6;
  border-radius: 8px;
  padding: 20px 8px;
  position: relative;

  background: #fff;
}
</style>