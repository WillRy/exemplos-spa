<template>
    <div class="login">
        <h3>Redefinir Senha</h3>
        <form @submit.prevent="submit">
            <div class="mb-3">
                <BaseInput label="Senha" v-model="senha" type="password" :error="errors.senha" />
            </div>
            <div>
                <BaseButtonPrimary :loading="loading" style="width: 100%" class="mb-3" type="submit">
                    Redefinir
                </BaseButtonPrimary>

                <div class="mx-auto link">
                    <RouterLinkInline to="/">Sair</RouterLinkInline>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
    title: 'Redefinir minha senha',
    layout: 'publico'
})

useSeoMeta({
  title: 'CRM - Redefinir senha',
})

const loading = ref(false)

const { backendAlertError, backendAlertSuccess } = useBackendAlert()
const $router = useRouter()
const $route = useRoute()

const { errors, validate, defineField, setErrors } = useForm({
    validationSchema: yup.object({
        senha: yup.string().required('Informe a senha').min(6, 'A senha deve ter no mínimo 6 caracteres')
    }),
    initialValues: {
        senha: ''
    }
})
const [senha] = defineField('senha')

const submit = async function () {
    try {
        loading.value = true

        const result = await validate()
        if (!result.valid) {
            return false;
        }

        const r = await useNuxtApp().$fetchApi('/redefinir-senha', {
            method: 'POST',
            body: {
                senha: senha.value,
                token: $route.query.token
            }
        })

        backendAlertSuccess(r)

        $router.push('/')
    } catch (e) {
        setErrors(backendAlertError(e, 'Não foi possível redefinir a senha'))
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