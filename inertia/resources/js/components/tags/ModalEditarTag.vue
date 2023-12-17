<template>
  <BaseModal
    :aberta="modalEditarTagState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.edicao_tag") }}</h3>
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
              v-model="cor_fundo"
              :label="$t('palavras.cor_fundo') + '*'"
              :placeholder="$t('palavras.cor_fundo') + '*'"
              type="color"
            >
              <template v-slot:error v-if="errors.cor_fundo">
                <p>
                  {{ errors.cor_fundo }}
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="cor_texto"
              :label="$t('palavras.cor_texto') + '*'"
              :placeholder="$t('palavras.cor_texto') + '*'"
              type="color"
            >
              <template v-slot:error v-if="errors.cor_texto">
                <p>
                  {{ errors.cor_texto }}
                </p>
              </template>
            </BaseInput>
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
import { modalEditarTagStore } from "../../stores/tag";
import { reactive, ref, computed } from "vue";

import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import { useForm } from "vee-validate";
import * as yup from "yup";

const modalEditarTagState = modalEditarTagStore();
const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $emit = defineEmits(["onClose", "onReload"]);

const loading = ref(false);
const loadingDados = ref(false);

// Data
const { errors, validate, defineField, resetForm, values, setValues } = useForm(
  {
    validationSchema: yup.object({
      nome: yup
        .string()
        .required($t("validacao.required", { field: $t("palavras.nome") })),
      cor_fundo: yup
        .string()
        .required(
          $t("validacao.required", { field: $t("palavras.cor_fundo") })
        ),
      cor_texto: yup
        .string()
        .required(
          $t("validacao.required", { field: $t("palavras.cor_texto") })
        ),
    }),
    initialValues: {
      nome: "",
      cor_fundo: "#000",
      cor_texto: "#fff",
    },
  }
);
const [nome] = defineField("nome");
const [cor_fundo] = defineField("cor_fundo");
const [cor_texto] = defineField("cor_texto");

// Computed

// Methods
const carregarFormulario = async function () {
  loadingDados.value = true;

  const response = await api.get(`/tag/${modalEditarTagState.payload.id}`);
  const dados = response.data.data;

  setValues({...dados}, false);

  loadingDados.value = false;
};

const fecharModal = function () {
  resetForm();
  modalEditarTagState.fechar();
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

    await api.put(`/tag/${modalEditarTagState.payload.id}`, data);

    fecharModal();
    modalEditarTagState.onReload();
  } catch (e) {
    backendToastError(e, $t("textos.erro_editar_tag"));
  } finally {
    loading.value = false;
  }
};

// Created
</script>

<style scoped></style>
