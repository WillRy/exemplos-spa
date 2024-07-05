<template>
  <div class="tags">
    <HeaderPage :titulo="$t('palavras.tags')"> </HeaderPage>
    <PageContainer :container-fluido="true">
      <ListagemTag />
    </PageContainer>
  </div>
</template>

<script setup>
import HeaderPage from '../components/pages/HeaderPage'
import ListagemTag from '../components/tags/ListagemTag.vue'

import { useI18n } from 'vue-i18n'
import PageContainer from '@/external/components/estrutura/PageContainer.vue'

const { t: $t } = useI18n()
</script>
