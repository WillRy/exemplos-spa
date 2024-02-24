<template>
  <BaseModal
    :aberta="modalCriarTagState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.criacao_tag") }}</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
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
              v-model="cor_fundo"
              :label="$t('palavras.cor_fundo') + '*'"
              :placeholder="$t('palavras.cor_fundo') + '*'"
              type="color"
              :error="errors.cor_fundo"
            ></BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput
              v-model="cor_texto"
              :label="$t('palavras.cor_texto') + '*'"
              :placeholder="$t('palavras.cor_texto') + '*'"
              type="color"
              :error="errors.cor_texto"
            ></BaseInput>
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
import axiosWeb from "../../services/axiosWeb";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import BaseSelectAjax from "../../external/components/form/BaseSelectAjax";
import BaseInput from "../../external/components/form/BaseInput";
import axios from "axios";
import { modalCriarTagStore } from "../../stores/tag";

import { reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import { useForm } from "vee-validate";
import * as yup from "yup";

const modalCriarTagState = modalCriarTagStore();
const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $emit = defineEmits(["onClose", "onReload"]);

const loading = ref(false);

const { errors, validate, defineField, resetForm, values, setValues, setErrors} = useForm(
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
const carregarFormulario = function () {
  setValues(
    {
      nome: "",
      cor_fundo: "#000000",
      cor_texto: "#ffffff",
    },
    false
  );
};

const fecharModal = function () {
  resetForm();
  modalCriarTagState.fechar();
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

    await axiosWeb.post(`/tag`, data);

    fecharModal();
    modalCriarTagState.onReload();
  } catch (e) {
    const errors =  backendToastError(e, $t("textos.erro_cadastrar_tag"));
    setErrors(errors);
  } finally {
    loading.value = false;
  }
};

// Created
</script>

<style scoped></style>
