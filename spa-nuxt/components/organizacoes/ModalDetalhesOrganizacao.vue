<template>
  <BaseModal
    :aberta="modalDetalhesOrganizacaoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>Detalhes do organizacao</h3>
    </template>
    <template #body>
      <Loader
        width="60px"
        height="60px"
        :cor-principal="true"
        v-if="loadingDados"
      ></Loader>
      <div v-if="!loadingDados">
        <div class="row-xxs">
          <div class="col-md-6 mb-xs">
            <p><strong>Nome: </strong> {{ form.nome }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Email: </strong>{{ form.email }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Telefone:</strong> {{ form.telefone }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>CEP: </strong> {{ form.cep }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Endereço</strong>: {{ form.endereco }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Bairro:</strong> {{ form.bairro }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Número:</strong> {{ form.numero }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Complemento:</strong> {{ form.complemento }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Cidade:</strong> {{ form.cidade }}</p>
          </div>
          <div class="col-md-6 mb-xs">
            <p><strong>Estado:</strong> {{ form.estado }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <BaseButtonTertiary @click.prevent="fecharModal">
        Fechar
      </BaseButtonTertiary>
    </template>
  </BaseModal>
</template>

<script setup>
import { modalDetalhesOrganizacaoStore } from "../../store/organizacao";
const modalDetalhesOrganizacaoState = modalDetalhesOrganizacaoStore();

const form = reactive({
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
  organizacao_id: null,
});

const loadingDados = ref(false);

function fecharModal() {
    modalDetalhesOrganizacaoState.open = false;
}
async function carregarFormulario() {
  loadingDados.value = true;

  const ajax = fetchApiProtected();

  const response = await ajax(
    `/organizacao/${modalDetalhesOrganizacaoState.payload.id}`
  );
  const dados = response.data;
  Object.assign(form, dados);
  form.organizacao_id = dados.organizacao;

  loadingDados.value = false;
}
</script>

<style scoped></style>
