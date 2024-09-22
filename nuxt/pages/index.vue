<template>
  <div class="login">
    <h3>Login</h3>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <BaseInput label="E-mail" v-model="email" :error="errors.email" />
      </div>
      <div class="mb-3">
        <BaseInput label="Senha" v-model="senha" :error="errors.senha" />
      </div>

      <div class="separador"></div>

      <div>
        <BaseButtonPrimary :loading="loading" style="width: 100%" class="mb-3" type="submit">
          Entrar
        </BaseButtonPrimary>

        <div class="mx-auto link">
          <RouterLinkInline to="/esqueci-senha">Esqueci minha Senha</RouterLinkInline>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>

import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'publico'
})

useSeoMeta({
  title: 'CRM - Login',
})

const { backendAlertError } = useBackendAlert()
const $router = useRouter()

const loading = ref(false)

const { errors, validate, defineField, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('Informe o e-mail'),
    senha: yup.string().required('Informe a senha')
  }),
  initialValues: {
    email: '',
    senha: ''
  }
})
const [email] = defineField('email')
const [senha] = defineField('senha')

const submit = async function () {
  try {
    loading.value = true

    const result = await validate()
    if (!result.valid) {
      return false;
    }

    await useNuxtApp().$fetchApi('login', {
      method: 'post',
      body: values
    });

    $router.push('/painel/dashboard');

  } catch (e) {
    backendAlertError(e, 'Login inválido')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  max-width: 360px;
  width: 100%;
  background: #fff;
  box-shadow:
    rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
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

.link {
  text-align: center;
}

.separador {
  height: 1px;
  width: 100%;
  background: #e0e0e0;
  margin: 24px 0px;
}
</style>