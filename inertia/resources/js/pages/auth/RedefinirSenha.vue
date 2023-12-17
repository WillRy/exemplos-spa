<template>
  <div class="login">
    <h3>{{ $t("login.redefinir_senha") }}</h3>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <BaseInput :label="$t('login.senha')" v-model="senha">
          <template v-slot:error v-if="errors.senha">
            <p>
              {{ errors.senha }}
            </p>
          </template>
        </BaseInput>
      </div>
      <div>
        <BaseButtonPrimary
          :loading="loading"
          style="width: 100%"
          class="mb-3"
          type="submit"
        >
          {{ $t("login.redefinir") }}
        </BaseButtonPrimary>
      </div>
    </form>
  </div>
</template>

<script setup>
import BaseInput from "../../external/components/form/BaseInput";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import axios from "axios";
import api, { axiosWeb } from "../../services/api";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";

import { ref } from "vue";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import Publico from "../../layouts/Publico.vue";
import { router, usePage } from "@inertiajs/vue3";

defineOptions({ layout: Publico })
// Data
const loading = ref(false);
const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const $router = useRouter();
const $route = useRoute();

const { errors, validate, defineField, resetForm, values } = useForm({
  validationSchema: yup.object({
    senha: yup
      .string()
      .required($t("validacao.required", { field: $t("login.senha") })),
  }),
  initialValues: {
    senha: "",
  },
});
const [senha] = defineField("senha");
const page = usePage();
const props = defineProps(['token'])

// Methods
const submit = async function () {
  try {
    loading.value = true;

    const result = await validate();
    if (result.valid) {
      const r = await axiosWeb.post("/redefinir-senha", {
        senha: senha.value,
        token: props.token,
      });

      backendToastSuccess(r, $t("textos.sucesso_redefinir_senha"));

      router.visit('/');
    }
  } catch (e) {
    backendToastError(e, $t("textos.erro_redefinir_senha"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login {
  max-width: 360px;
  width: 100%;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 20px;
  border-radius: 8px;
}

.login h3 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  text-align: center;
  color: var(--primary-color-500);
}

a {
  text-decoration: none;
  color: var(--primary-color-500);
  display: block;
  text-align: center;
}

a:visited {
  color: var(--primary-color-500);
}

a:hover {
  opacity: 0.6;
}
</style>
