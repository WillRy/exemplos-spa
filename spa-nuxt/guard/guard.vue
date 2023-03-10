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
//
// console.log(data.value, error.value);

// const authState = authStore();

// const { data, error } = await useAsyncData("user", () =>
//   authState.carregarUsuarioLogado()
// );

// console.log(data.value, error.value);

// onMounted(async () => {
//   let {value: token} = useCookie('token');

//   const authState = authStore();

//   if (token) {

//     const response = await authState.carregarUsuarioLogado();

//     authState.usuario = response.data;

//   } else {
//     await navigateTo('/login')
//   }

//   loaders.loading = false;
// })
</script>
