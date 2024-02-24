<template>
  <BaseModal
    :aberta="modalExcluirOrganizacaoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.exclusao_organizacao") }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
      <p v-else>{{ $t('textos.confirmar_excluir_organizacao') }} <strong>{{
          modalExcluirOrganizacaoState.payload.nome
        }}</strong>?</p>
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

import axiosWeb from "../../services/axiosWeb";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import BaseSelectAjax from "../../external/components/form/BaseSelectAjax";
import BaseInput from "../../external/components/form/BaseInput";
import BaseDate from "../../external/components/form/BaseDate";
import {modalExcluirOrganizacaoStore} from "../../stores/organizacao";
import BaseButtonDanger from "../../external/components/buttons/BaseButtonDanger";
import { ref, computed } from 'vue';
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";


// Data
const loading = ref(false);
const loadingDados = ref(false);

const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();
const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $emit = defineEmits(["onClose","onReload"]);
// Computed

// Methods
const carregarFormulario = async function() {
	loadingDados.value = true;

	await axiosWeb.get(`/organizacao/${modalExcluirOrganizacaoState.payload.id}`);

	loadingDados.value = false;
}

const fecharModal = function() {
	modalExcluirOrganizacaoState.fechar()
	$emit("onClose");
}

const submit = async function() {
	try {
		loading.value = true;
		await axiosWeb.delete(`/organizacao/${modalExcluirOrganizacaoState.payload.id}`);

		fecharModal();
		modalExcluirOrganizacaoState.onReload();

	} catch (e) {
		backendToastError(e, $t('textos.erro_excluir_organizacao'));
	} finally {
		loading.value = false;
	}
}


// Created

</script>

<style scoped>

</style>
