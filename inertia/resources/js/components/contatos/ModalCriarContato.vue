<template>
  <BaseModal
    :aberta="modalCriarContatoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.criacao_contato") }}</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="row mb-3 gy-3">
          <div class="col-12">
            <BaseSelectAjax
              :label="$t('palavras.empresa')"
              :placeholder="$t('textos.pesquise_as_empresas')"
              v-model="organizacao_id"
              track-by="id"
              text-by="nome"
              :options="resultadoPesquisaEmpresa.lista"
              @search-change="pesquisarEmpresa"
              :clear="true"
              :noOptions="$t('textos.pesquise_as_empresas')"
              :empty="false"
              :remover="true"
            >
            </BaseSelectAjax>
          </div>
          <div class="col-12">
            <BaseInput
              v-model="nome"
              :label="$t('palavras.nome') + '*'"
              :placeholder="$t('palavras.nome') + '*'"
            >
              <template v-slot:error v-if="errors.nome">
                <p>
                  {{ errors.nome }}
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="email"
              :label="$t('palavras.email') + '*'"
              :placeholder="$t('palavras.email') + '*'"
              type="email"
            >
              <template v-slot:error v-if="errors.email">
                <p>
                  {{ errors.email }}
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="telefone"
              :label="$t('palavras.telefone')"
              :placeholder="$t('palavras.telefone')"
              type="text"
              v-mask="`+55 (##) ####-####`"
            />
          </div>
        </div>
        <div class="row gy-3">
          <div class="col-md-12">
            <BaseInput
              v-model="cep"
              :label="$t('palavras.cep')"
              :placeholder="$t('palavras.cep')"
              type="text"
              @change="tratarCep"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="endereco"
              :label="$t('palavras.endereco')"
              :placeholder="$t('palavras.endereco')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="bairro"
              :label="$t('palavras.bairro')"
              :placeholder="$t('palavras.bairro')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="numero"
              :label="$t('palavras.numero')"
              :placeholder="$t('palavras.numero')"
              type="number"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="complemento"
              :label="$t('palavras.complemento')"
              :placeholder="$t('palavras.complemento')"
              type="text"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="cidade"
              :label="$t('palavras.cidade')"
              :placeholder="$t('palavras.cidade')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4">
            <BaseInput
              v-model="estado"
              :label="$t('palavras.estado')"
              :placeholder="$t('palavras.estado')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
        </div>
      </form>
    </template>
    <template #footerDireito>
      <BaseButtonTertiary @click.prevent="fecharModal">
        {{ $t("palavras.cancelar") }}
      </BaseButtonTertiary>
      <BaseButtonPrimary @click.prevent="submit" :loading="loading">
        {{ $t("palavras.salvar") }}
      </BaseButtonPrimary>
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
import { useBackendToast } from "../../external/hooks/useBackendToast";
import { modalCriarContatoStore } from "../../stores/contato";
import * as yup from "yup";
import { useForm } from "vee-validate";

import axios from "axios";

import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";

// Data
const pesquisouCep = ref(false);
const loading = ref(false);
const resultadoPesquisaEmpresa = reactive({
  lista: [],
});

const modalCriarContatoState = modalCriarContatoStore();
const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $emit = defineEmits(["onClose","onReload"]);

const { errors, validate, defineField, resetForm, values } = useForm({
  validationSchema: yup.object({
    nome: yup
      .string()
      .required($t("validacao.required", { field: $t("palavras.nome") })),
    email: yup
      .string()
      .email($t("validacao.required", { field: $t("palavras.email") }))
      .required($t("validacao.required", { field: $t("palavras.email") })),
  }),
  initialValues: {
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    bairro: "",
    organizacao_id: null,
  },
});
const [nome] = defineField("nome");
const [email] = defineField("email");
const [telefone] = defineField("telefone");
const [cep] = defineField("cep");
const [endereco] = defineField("endereco");
const [numero] = defineField("numero");
const [complemento] = defineField("complemento");
const [cidade] = defineField("cidade");
const [estado] = defineField("estado");
const [bairro] = defineField("bairro");
const [organizacao_id] = defineField("organizacao_id");

const carregarFormulario = function () {
  resetForm();
};
// Computed

// Methods
const tratarCep = function () {
  pesquisouCep.value = false;
  if (cep.value.length === 8) {
    axios
      .get(`https://viacep.com.br/ws/${cep.value}/json/`)
      .then((r) => {
        const { data } = r;

        if (data.erro) {
          pesquisouCep.value = true;
          toastObj.error($t("textos.erro_encontrar_cep"));
        }

        endereco.value = data.logradouro;
        complemento.value = data.complemento;
        bairro.value = data.bairro;
        cidade.value = data.localidade;
        estado.value = data.uf;
      })
      .catch(() => {
        pesquisouCep.value = true;
      });
  }
};

const pesquisarEmpresa = function (pesquisa) {
  api
    .get(`/organizacao`, { params: { pesquisa: pesquisa } })
    .then((response) => {
      resultadoPesquisaEmpresa.lista = response.data.data.data;
    });
};

const fecharModal = function () {
  resetForm();
  modalCriarContatoState.fechar();
  $emit("onClose");
};

const submit = async function () {
  try {
    loading.value = true;

    const result = await validate();
    if (!result.valid) {
      return;
    }

    const data = {
      ...values,
      organizacao_id: values.organizacao_id ? values.organizacao_id.id : null,
    };

    await api.post(`/contato`, data);

    fecharModal();
    modalCriarContatoState.onReload();
  } catch (e) {
    backendToastError(e, $t("textos.erro_cadastrar_contato"));
  } finally {
    loading.value = false;
  }
};

// Created
</script>

<style scoped></style>
