<template>
  <div class="login">
    <h3>{{ $t('login.titulo') }}</h3>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <BaseInput :label="$t('login.email')" v-model="email">
          <template v-slot:error v-if="errors.email">
            <p>
              {{ errors.email }}
            </p>
          </template>
        </BaseInput>
      </div>
      <div class="mb-3">
        <BaseInput :label="$t('login.senha')" v-model="senha" type="password">
          <template v-slot:error v-if="errors.senha">
            <p>
              {{ errors.senha }}
            </p>
          </template>
        </BaseInput>
      </div>

      <div class="separador"></div>

      <div>
        <BaseButtonPrimary :loading="loading" style="width: 100%" class="mb-3" type="submit">
          {{ $t('login.login') }}
        </BaseButtonPrimary>

        <div class="mx-auto link">
          <RouterLinkInline to="/esqueci-senha">{{ $t('login.esqueci_senha') }}</RouterLinkInline>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import BaseInput from '../../external/components/form/BaseInput'
import BaseButtonPrimary from '../../external/components/buttons/BaseButtonPrimary'
import api, { apiPublic } from '../../services/api'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackendToast } from '../../external/hooks/useBackendToast'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import RouterLinkInline from '@/external/components/links/RouterLinkInline.vue'

const { t: $t } = useI18n()
const { backendToastError } = useBackendToast()
const $router = useRouter()

const loading = ref(false)

const { errors, validate, defineField, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required($t('validacao.required', { field: $t('login.email') })),
    senha: yup.string().required($t('validacao.required', { field: $t('login.senha') }))
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
    if (result.valid) {
      await api.post('/login', values)

      $router.push({ name: 'dashboard' })
    }
  } catch (e) {
    backendToastError(e, $t('login.invalido'))
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
