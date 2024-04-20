<template>
  <BaseModal :aberta="organizacao" @onClose="fecharModal" @onOpen="carregarFormulario">
    <template #title>
      <h3>{{ $t('textos.exclusao_organizacao') }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
      <p v-else>
        {{ $t('textos.confirmar_excluir_organizacao') }} <strong>{{ organizacao.nome }}</strong
        >?
      </p>
    </template>
    <template #footerDireito>
      <BaseButtonTertiary @click.prevent="fecharModal">
        {{ $t('palavras.cancelar') }}
      </BaseButtonTertiary>
      <BaseButtonDanger @click.prevent="submit" :loading="loading">
        {{ $t('palavras.excluir') }}
      </BaseButtonDanger>
    </template>
  </BaseModal>
</template>

<script setup>
import axiosWeb from '../../services/axiosWeb'
import BaseButtonTertiary from '../../external/components/buttons/BaseButtonTertiary'
import BaseModal from '../../external/components/modal/BaseModal'
import { modalExcluirOrganizacaoStore } from '../../stores/organizacao'
import BaseButtonDanger from '../../external/components/buttons/BaseButtonDanger'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackendToast } from '../../external/hooks/useBackendToast'

const props = defineProps({
  organizacao: {
    type: Object,
    default: null
  }
})

const $emit = defineEmits(['onClose', 'onReload'])

const { t: $t } = useI18n()

const { backendToastError } = useBackendToast()

const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore()

const loading = ref(false)

const loadingDados = ref(false)

const carregarFormulario = async function () {}

const fecharModal = function () {
  $emit('onClose')
}

const submit = async function () {
  try {
    loading.value = true
    await axiosWeb.delete(`/organizacao/${props.organizacao.id}`)

    fecharModal()

    modalExcluirOrganizacaoState.onReload()

    $emit('onReload')
  } catch (e) {
    backendToastError(e, $t('textos.erro_excluir_organizacao'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
