<template>
  <BaseModal
    :aberta="modalExcluirContatoState.open"
    @onClose="fecharModal"
  >
    <template #title>
      <h3>Exclusão de contato</h3>
    </template>
    <template #body>
      <Loader
        width="60px"
        height="60px"
        :cor-principal="true"
        v-if="loadingDados"
      ></Loader>
      <p v-else>
        Deseja excluir o contato
        <strong>{{ modalExcluirContatoState.payload.nome }}</strong
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
import { modalExcluirContatoStore } from "../../store/contato";
const modalExcluirContatoState = modalExcluirContatoStore();

const $emit = defineEmits();

const loadingDados = ref(false);
const loading = ref(false);

function fecharModal() {
  modalExcluirContatoState.fechar();
  $emit("onClose");
}
async function submit() {
  try {
    loading.value = true;
    const ajax = fetchApiProtected();
    await ajax(`/contato/${modalExcluirContatoState.payload.id}`, {
      method: "DELETE",
    });

    fecharModal();
    modalExcluirContatoState.onReload();
    loading.value = false;
  } catch (error) {
    useMessageApi(error, "Não foi possível excluir o contato!");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
