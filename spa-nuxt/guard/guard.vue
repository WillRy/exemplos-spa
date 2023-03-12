<template>
  <div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { authStore } from "../store/auth";

const authState = authStore();


// Init profile on server
await useAsyncData("user", () => authState.carregarUsuarioLogado());

</script>
