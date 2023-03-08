<template>
  <div>
    <div class="layout" v-if="!loaders.loading">
      <Header />
      <Sidebar />
      <div class="home-section">
        <router-view></router-view>
      </div>
    </div>
    <div class="loader-overlay" v-if="loaders.loading">
      <Loader width="126px" height="126px" :corPrincipal="true" />
    </div>
  </div>
</template>

<script setup>
import { authStore } from "../store/auth";

definePageMeta({
  middleware: ["auth"],
});

let loaders = reactive({
  loading: true,
});

onMounted(async () => {
  try {
    let { value: token } = useCookie("token");

    const authState = authStore();

    if (token) {
      const response = await authState.carregarUsuarioLogado();

      authState.usuario = response.data;
    } else {
      await navigateTo("/login");
    }

    loaders.loading = false;
  } catch (e) {
    await navigateTo("/login");
  }
});
</script>

<style scoped>
.loader-overlay {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
