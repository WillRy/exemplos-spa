<template>
  <div class="login">
    <h3>Contatos</h3>
    <form @submit.prevent="submit">
      <div class="mb-xs">
        <BaseInput label="E-mail" v-model="login.email">
          <template v-slot:error v-if="v$.email.$error">
            <p v-if="v$.email.$error">Informe seu e-mail</p>
          </template>
        </BaseInput>
      </div>
      <div class="mb-md">
        <BaseInput label="Senha" v-model="login.senha" type="password">
          <template v-slot:error v-if="v$.senha.$error">
            <p v-if="v$.senha.required.$invalid">Informe sua senha</p>
          </template>
        </BaseInput>
      </div>
      <div>
        <BaseButtonPrimary
          :loading="loaders.loading"
          style="width: 100%"
          class="mb-xs"
        >
          Entrar
        </BaseButtonPrimary>
        <NuxtLink to="esqueci-senha">Esqueci minha senha</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import useToast from "../hooks/useToast";
import { authStore } from "../store/auth";

definePageMeta({ layout: "publico", middleware: ["guest"] });

let loaders = reactive({
  loading: false,
});

let login = reactive({
  email: "",
  senha: "",
});

const { value: v$ } = useVuelidate(
  {
    email: { email, required },
    senha: { required },
  },
  login
);

const authState = authStore();

const submit = async () => {
  try {
    loaders.loading = true;

    const result = await v$.$validate();
    if (result) {
      let response = await authState.login(login);

      console.log(response);

      if (!response.success) {
        useToast({
          message: response.message ?? "Não foi possível realizar o login!",
          type: "error",
        });
      }

      if (response.success) {
        window.localStorage.setItem("token", response.data.token);
        await navigateTo("/painel/dashboard");
      }
    }
  } catch (e) {
    console.log(e);
    useToast({
      message: "Não foi possível realizar o login!",
      type: "error",
    });
  } finally {
    loaders.loading = false;
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
