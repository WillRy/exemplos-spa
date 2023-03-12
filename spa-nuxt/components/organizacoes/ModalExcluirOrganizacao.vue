<template>
  <BaseModal
    :aberta="modalExcluirOrganizacaoState.open"
    @onClose="fecharModal"
  >
    <template #title>
      <h3>Exclusão de organizacao</h3>
    </template>
    <template #body>
      <Loader
        width="60px"
        height="60px"
        :cor-principal="true"
        v-if="loadingDados"
      ></Loader>
      <p v-else>
        Deseja excluir o organizacao
        <strong>{{ modalExcluirOrganizacaoState.payload.nome }}</strong
        >?
      </p>
    </template>
    <template #footer>
      <BaseButtonDanger @click.prevent="submit" :loading="loading">
        Excluir
      </BaseButtonDanger>
      <BaseButtonTertiary @click.prevent="fecharModal">
        Cancelar
      </BaseButtonTertiary>
    </template>
  </BaseModal>
</template>

<script setup>
import { modalExcluirOrganizacaoStore } from "../../store/organizacao";

const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();

const emit = defineEmits();

const loadingDados = ref(false);
const loading = ref(false);

async function fecharModal() {
  modalExcluirOrganizacaoState.fechar();
  emit("onClose");
}

async function submit() {
  try {
    loading.value = true;
    const ajax = fetchApiProtected();
    await ajax(
      `/organizacao/${modalExcluirOrganizacaoState.payload.id}`,
      {
        method: 'delete'
      }
    );

    fecharModal();
    modalExcluirOrganizacaoState.onReload();
    loading.value = false;
  } catch (e) {
    useMessageApi(e, "Não foi possível excluir a organização!");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
