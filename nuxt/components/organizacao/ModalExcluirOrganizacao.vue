<template>
    <BaseModal :aberta="organizacao" @onClose="fecharModal" @onOpen="carregarFormulario">
      <template #title>
        <h3>Excluir Organização</h3>
      </template>
      <template #body>
        <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
        <p v-else>
          Deseja realmente excluir a organização <strong>{{ organizacao.nome }}</strong>?
        </p>
      </template>
      <template #footerDireito>
        <BaseButtonTertiary @click.prevent="fecharModal">
          Cancelar
        </BaseButtonTertiary>
        <BaseButtonDanger @click.prevent="submit" :loading="loading">
          Excluir
        </BaseButtonDanger>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  
  const props = defineProps({
    organizacao: {
      type: Object,
      default: null
    }
  })
  
  const $emit = defineEmits(['onClose', 'onReload'])
  
  const $fetchApi = useNuxtApp().$fetchApi;
  
  const { backendAlertError } = useBackendAlert()
  
  const loading = ref(false)
  
  const loadingDados = ref(false)
  
  const carregarFormulario = async function () {}
  
  const fecharModal = function () {
    $emit('onClose')
  }
  
  const submit = async function () {
    try {
      loading.value = true
      await $fetchApi(`/organizacao/${props.organizacao.id}`, {method: 'DELETE'})
  
      fecharModal()
  
      $emit('onReload')
    } catch (e) {
        backendAlertError(e, 'Erro ao excluir organização')
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped></style>
  