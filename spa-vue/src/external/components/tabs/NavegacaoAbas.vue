<template>
  <div class="navegacao-abas-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'NavegacaoAbas'
}
</script>

<style scoped>
.navegacao-abas-container {
  gap: 4px;
  background: var(--primary-color-principal);
  box-shadow: inset 0px 2px 4px #00000029;
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  padding: 4px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
}
</style>
