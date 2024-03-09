<template>
  <BaseModal
    :aberta="organizacao"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.edicao_organizacao") }}</h3>
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
              :label="$t('palavras.email') + '*'"
              :placeholder="$t('palavras.email') + '*'"
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
        <div class="row mb-3 gy-3">
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

        <div class="row">
          <div class="col">
            <BaseSelectAjax
              :label="$t('palavras.tags')"
              :placeholder="$t('textos.pesquise_as_tags')"
              v-model="tags"
              track-by="id"
              text-by="nome"
              :options="resultadoPesquisaTag.lista"
              @search-change="pesquisarTag"
              :noOptions="$t('textos.pesquise_as_tags')"
              :empty="true"
              :remover="true"
              :multiple="true"
            >
              <template v-slot:option="{ option }">
                <div
                  class="custom-tag"
                  :style="{
                    background: option['cor_fundo'],
                    color: option['cor_texto'],
                  }"
                >
                  {{ option["nome"] }}
                </div>
              </template>
              <template v-slot:tag="{ option }">
                <div
                  class="custom-tag"
                  :style="{
                    background: option['cor_fundo'],
                    color: option['cor_texto'],
                  }"
                >
                  {{ option["nome"] }}
                </div>
              </template>
            </BaseSelectAjax>
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
import axios from "axios";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import * as yup from "yup";
import { useForm } from "vee-validate";

const props = defineProps({
  organizacao: {
    type: Object,
    default: null
  }
});

const $emit = defineEmits(["onClose","onReload"]);

const { t: $t } = useI18n();

const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();


const pesquisouCep = ref(false);
const loading = ref(false);
const loadingDados = ref(false);
const resultadoPesquisaTag = reactive({
  lista: [],
});


const { errors, validate, defineField, resetForm, values, setValues, setErrors } = useForm(
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
      teste: "",
      tags: [],
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
const [tags] = defineField("tags");

const carregarFormulario = async function () {
  loadingDados.value = true;

  const response = await api.get(
    `/organizacao/${props.organizacao.id}`
  );
  const dados = response.data.data;

  setValues(
    {
      ...dados,
      tags: props.organizacao.tags
    },
    false
  );

  loadingDados.value = false;
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

const pesquisarTag = function (pesquisa) {
  api.get(`/tag`, { params: { pesquisa: pesquisa } }).then((response) => {
    resultadoPesquisaTag.lista = response.data.data.data;
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
    };

    await api.put(
      `/organizacao/${props.organizacao.id}`,
      data
    );

    $emit("onReload");

    fecharModal();
  } catch (e) {
    const errors = backendToastError(e, $t("textos.erro_editar_organizacao"));
    setErrors(errors);
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped></style>
