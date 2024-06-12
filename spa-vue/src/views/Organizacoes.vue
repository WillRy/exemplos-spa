<template>
  <div class="organizacoes">
    <HeaderPage :titulo="$t('palavras.organizacoes')">

    </HeaderPage>
    <PageContainer :container-fluido="true">
      <ListagemOrganizacao />
    </PageContainer>


  </div>
</template>

<script setup>
import HeaderPage from '../components/pages/HeaderPage'
import ListagemOrganizacao from '../components/organizacoes/ListagemOrganizacao'

import { useI18n } from 'vue-i18n'
import PageContainer from '@/external/components/estrutura/PageContainer.vue'

const { t: $t } = useI18n()
</script>

