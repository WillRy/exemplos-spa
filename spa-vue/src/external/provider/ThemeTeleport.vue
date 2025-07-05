<template>
  <DynamicThemeProvider
    :themeConfig="dados.theme"
    :autoEscala="dados.autoEscala"
    :escalaPrimaryColorPrincipal="dados.escalaPrimaryColorPrincipal"
    :escalaPrimaryColorPrincipalHover="dados.escalaPrimaryColorPrincipalHover"
    :escalaPrimaryColorPrincipalActive="dados.escalaPrimaryColorPrincipalActive"
    :escalaPrimaryColorPrincipalFocus="dados.escalaPrimaryColorPrincipalFocus"
  >
    <slot />
  </DynamicThemeProvider>
</template>
<script setup>
import { computed, inject } from 'vue'
import DynamicThemeProvider from './DynamicThemeProvider.vue'

const dados = inject('themaProps')
</script>
