<template>
  <div class="contatos">
    <HeaderPage :titulo="$t('palavras.contatos')"> </HeaderPage>
    <PageContainer :containerFluido="true">
      <ListagemContatos />
    </PageContainer>
  </div>
</template>

<script setup>
import PageContainer from '@/external/components/estrutura/PageContainer.vue'
import HeaderPage from '../components/pages/HeaderPage'
import ListagemContatos from '../components/contatos/ListagemContatos'

import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
</script>

<style scoped></style>
