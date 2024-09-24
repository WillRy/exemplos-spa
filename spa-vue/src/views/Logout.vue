<template>
  <div></div>
</template>
<script setup>
import { usuarioStore } from '@/stores/usuario.js';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const usuarioState = usuarioStore()

const router = useRouter();

onMounted(async () => {
  await usuarioState.logout()

  router.push({ name: 'login', query: { logout: 1 } })
})
</script>
