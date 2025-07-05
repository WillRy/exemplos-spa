<template>
  <DynamicThemeProvider
    :theme-config="{
      primaryColor: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b'
      },
      escalaPrimaryColorPrincipal: 700
    }"
  >
    <div class="layout-publico" v-if="!loading">
      <RouterView />
    </div>
    <div class="loader-overlay" v-if="loading">
      <Loader width="126px" height="126px" :corPrincipal="true" />
    </div>
  </DynamicThemeProvider>
</template>

<script setup>
import { ref } from 'vue'
import DynamicThemeProvider from '@/external/provider/DynamicThemeProvider.vue'

const loading = ref(false)
</script>

<style scoped>
.layout-publico {
  height: 100vh;
  background: #f2f2f2;

  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-overlay {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
