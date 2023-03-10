<template>
  <div class="login">
    <h3>Esqueci minha senha</h3>
    <form @submit.prevent="submit">
      <div class="mb-xs">
        <BaseInput label="E-mail" v-model="form.email">
          <template v-slot:error v-if="v$.email.$error">
            <p v-if="v$.email.$error">Informe seu e-mail</p>
          </template>
        </BaseInput>
      </div>
      <div>
        <BaseButtonPrimary
          :loading="loaders.loading"
          style="width: 100%"
          class="mb-xs"
        >
          Recuperar
        </BaseButtonPrimary>
        <NuxtLink to="login">Voltar para o login</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

definePageMeta({
  layout: "publico",
});

const loaders = reactive({
  loading: false,
});

const form = reactive({
  email: "",
});

const { value: v$ } = useVuelidate(
  {
    email: { email, required },
  },
  form
);

async function submit() {
  try {
    loaders.loading = true;

    const result = await v$.$validate();
    if (result) {
      const fetch = fetchApiPublic();

      await fetch("/esqueci-senha", {
        method: "post",
        body: {
          email: form.email,
          url: window.location.origin + "/" + "redefinir-senha",
        },
      });

      useCustomToast({
        message: "Verifique seu e-mail com as instruções de recuperação!",
        type: "success",
      });
    }
  } catch (e) {
    useMessageApi(e,  "Não foi possível enviar o e-mail de recuperação!");
  } finally {
    loaders.loading = false;
  }
}
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
