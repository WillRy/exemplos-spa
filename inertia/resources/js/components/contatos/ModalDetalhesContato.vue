<template>
  <BaseModal
    :aberta="modalDetalhesContatoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.detalhes_contato") }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
      <div v-if="!loadingDados">
        <div class="row gy-1">
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.nome') }}: </strong> {{ form.nome }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.email') }}: </strong>{{ form.email }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.telefone') }}:</strong> {{ form.telefone }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.cep') }}: </strong> {{ form.cep }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.endereco') }}:</strong>: {{ form.endereco }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.bairro') }}:</strong> {{ form.bairro }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.numero') }}:</strong> {{ form.numero }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.complemento') }}:</strong> {{ form.complemento }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.cidade') }}:</strong> {{ form.cidade }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>{{ $t('palavras.estado') }}:</strong> {{ form.estado }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #footerDireito>
      <BaseButtonTertiary @click.prevent="fecharModal">
        {{ $t('palavras.fechar') }}
      </BaseButtonTertiary>
    </template>
  </BaseModal>
</template>

<script>

import api from "../../services/api";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import {modalDetalhesContatoStore} from "../../stores/contato";

export default {
  name: "ModalDetalhesContato",
  setup() {
    const modalDetalhesContatoState = modalDetalhesContatoStore();
    return {
      modalDetalhesContatoState
    };
  },
  components: {
    BaseModal,
    BaseButtonTertiary,
  },
  data() {
    return {
      form: {
        nome: '',
        email: '',
        telefone: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: '',
        organizacao_id: null,
      },
      loadingDados: false
    }
  },
  computed: {},
  methods: {
    async carregarFormulario() {
      // this.loadingDados = true;

      // const response = await api.get(`/contato/${this.modalDetalhesContatoState.payload.id}`);
      // const dados = response.data.data;
      // Object.assign(this.form, dados);
      // this.form.organizacao_id = dados.organizacao;

      // this.loadingDados = false;
      Object.assign(this.form, this.modalDetalhesContatoState.payload);
    },
    fecharModal() {
      this.modalDetalhesContatoState.fechar()
      this.$emit("onClose");
    },
  },
  beforeUnmount() {
  },
  created() {
  },
}
</script>

<style scoped>

</style>
