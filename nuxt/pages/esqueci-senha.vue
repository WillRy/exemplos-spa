<template>
    <div class="login">
        <h3>Redefinir senha</h3>
        <form @submit.prevent="submit">
            <div class="mb-3">
                <BaseInput label="E-mail" v-model="email" :error="errors.email" />
            </div>
            <div>
                <BaseButtonPrimary :loading="loading" style="width: 100%" class="mb-3" type="submit">
                    Recuperar
                </BaseButtonPrimary>
                <div class="mx-auto link">
                    <RouterLinkInline to="/">Entrar</RouterLinkInline>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
    title: 'Esqueci minha senha',
    layout: 'publico'
})

useSeoMeta({
  title: 'CRM - Esqueci senha',
})

const { backendAlertError, backendAlertSuccess } = useBackendAlert()

const loading = ref(false)

const { errors, validate, defineField } = useForm({
    validationSchema: yup.object({
        email: yup.string().required('Informe o e-mail').email('E-mail inválido')
    }),
    initialValues: {
        email: ''
    }
})
const [email] = defineField('email')

const submit = async function () {
    try {
        loading.value = true

        const result = await validate()
        if (!result.valid) {
            return;
        }

        const r = await useNuxtApp().$fetchApi('/esqueci-senha', {
            method: 'POST',
            body: {
                email: email.value,
                url: window.location.origin + '/' + 'redefinir-senha'
            }
        })

        backendAlertSuccess(r)
    } catch (e) {
        backendAlertError(e, 'Erro ao solicitar redefinição de senha')
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
</style>