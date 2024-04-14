<template>
  <BaseModal
    :aberta="organizacao"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.detalhes_organizacao") }}</h3>
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
            <p><strong>{{ $t('palavras.endereco') }}</strong>: {{ form.endereco }}</p>
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
        {{ $t("palavras.fechar") }}
      </BaseButtonTertiary>
    </template>
  </BaseModal>
</template>

<script setup>

import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import { reactive, ref } from 'vue';
import { useI18n } from "vue-i18n";

const props = defineProps({
  organizacao: {
    type: Object,
    default: null
  }
});

const $emit = defineEmits(["onClose","onReload"]);

const { t: $t } = useI18n();



const form = reactive({
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
});
const loadingDados = ref(false);

const carregarFormulario = async function() {
	Object.assign(form, props.organizacao);
}

const fecharModal = function() {
	$emit("onClose");
}


</script>

<style scoped>

</style>
