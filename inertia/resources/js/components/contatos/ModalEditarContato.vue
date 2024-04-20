<template>
  <BaseModal
    :aberta="contato"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.edicao_contato") }}</h3>
    </template>
    <template #body>
      <Loader
        width="60px"
        height="60px"
        :cor-principal="true"
        v-if="loadingDados"
      ></Loader>
      <form @submit.prevent="submit" v-if="!loadingDados">
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
              :disabled="true"
            >
            </BaseSelectAjax>
          </div>
          <div class="col-12">
            <BaseInput
              v-model="nome"
              :label="$t('palavras.nome') + '*'"
              :placeholder="$t('palavras.nome') + '*'"
              :error="errors.nome"
            ></BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="email"
              label="E-mail *"
              placeholder="E-mail"
              type="email"
              :error="errors.email"
            ></BaseInput>
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
        Cancelar
      </BaseButtonTertiary>
      <BaseButtonPrimary @click.prevent="submit" :loading="loading">
        Editar
      </BaseButtonPrimary>
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
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import * as yup from "yup";
import { useForm } from "vee-validate";

import { reactive, ref } from "vue";

const props = defineProps({
  contato: {
    type: Object,
    default: null
  },
});

const $emit = defineEmits(["onClose","onReload"]);

const { t: $t } = useI18n();

const { backendToastError, toastObj } = useBackendToast();


const pesquisouCep = ref(false);
const loading = ref(false);
const loadingDados = ref(false);
const resultadoPesquisaEmpresa = reactive({
  lista: [],
});


const { errors, validate, defineField, resetForm, values, setValues,setErrors } = useForm(
  {
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
  }
);
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
  setValues(
    {
      ...props.contato,
      organizacao_id: props.contato?.organizacao || null
    },
    false
  );
};


const tratarCep = function () {
  pesquisouCep.value = false;
  if (cep.value.length === 8) {
    axios
      .get(`https://viacep.com.br/ws/${cep.value}/json/`)
      .then((r) => {
        const { data } = r;

        if (data.erro) {
          pesquisouCep.value = true;
          toastObj.error("Não foi possível encontrar o CEP");
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
  axiosWeb
    .get(`/organizacao`, { params: { pesquisa: pesquisa } })
    .then((response) => {
      resultadoPesquisaEmpresa.lista = response.data.data.data;
    });
};

const fecharModal = function () {
  resetForm();
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

    await axiosWeb.put(`/contato/${props.contato.id}`, data);

    fecharModal();

    $emit("onReload");
  } catch (e) {
    const errors = backendToastError(e, $t("textos.erro_editar_contato"));
    setErrors(errors);
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped></style>
