<template>
  <BaseModal
    :aberta="modalExcluirContatoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.exclusao_contato") }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
      <p v-else>{{ $t('textos.confirmar_excluir_contato') }} <strong>{{
          modalExcluirContatoState.payload.nome
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

import api from "../../services/api";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import BaseSelectAjax from "../../external/components/form/BaseSelectAjax";
import BaseInput from "../../external/components/form/BaseInput";
import BaseDate from "../../external/components/form/BaseDate";
import {modalExcluirContatoStore} from "../../stores/contato";
import BaseButtonDanger from "../../external/components/buttons/BaseButtonDanger";
import { ref, computed } from 'vue';
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";

const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $emit = defineEmits(["onClose","onReload"]);

// Data
const loading = ref(false);
const loadingDados = ref(false);

// Computed
const modalExcluirContatoState = modalExcluirContatoStore();

// Methods
const carregarFormulario = async function() {

}

const fecharModal = function() {
	modalExcluirContatoState.fechar()
	$emit("onClose");
}

const submit = async function() {
	try {
		loading.value = true;
		await api.delete(`/contato/${modalExcluirContatoState.payload.id}`);

		fecharModal();
		modalExcluirContatoState.onReload();

	} catch (e) {
    backendToastError(e, $t('textos.erro_excluir_contato'))
	} finally {
		loading.value = false;
	}
}


// Created

</script>

<style scoped>

</style>
