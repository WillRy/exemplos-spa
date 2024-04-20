<template>
  <div class="login">
    <h3>{{ $t("login.esqueci_senha") }}</h3>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <BaseInput label="E-mail" v-model="email">
          <template v-slot:error v-if="errors.email">
            <p>
              {{ errors.email }}
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
          >{{ $t("login.recuperar") }}</BaseButtonPrimary
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import BaseInput from "../../external/components/form/BaseInput";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import axiosWeb from "../../services/axiosWeb";

import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useBackendToast } from "../../external/hooks/useBackendToast";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Publico from "../../layouts/Publico.vue";

defineOptions({ layout: Publico })

const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess } = useBackendToast();

const loading = ref(false);

const { errors, validate, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required($t("validacao.required", { field: $t("login.email") })),
  }),
  initialValues: {
    email: "",
  },
});
const [email] = defineField("email");

const submit = async function () {
  try {
    loading.value = true;

    const result = await validate();
    if (result.valid) {
      const r = await axiosWeb.post("/esqueci-senha", {
        email: email.value,
        url: window.location.origin + "/" + "redefinir-senha",
      });

      backendToastSuccess(r, $t("textos.sucesso_solicitar_reset_senha"));
    }
  } catch (e) {
    backendToastError(e, $t("textos.erro_solicitar_reset_senha"));
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
