<template>
  <div class="notfound">
    <p>Página não encontrada</p>
    <router-link to="/">Voltar</router-link>
  </div>
</template>

<script>
export default {
  name: 'NaoEncontrado'
}
</script>

<style scoped>
.notfound {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
