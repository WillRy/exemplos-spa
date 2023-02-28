<template>
    <div class="login">
        <h3>Contatos</h3>
        <form @submit.prevent="submit">
            <div class="mb-xs">
                <BaseInput
                    label="E-mail"
                    v-model="login.email"
                >
                    <template v-slot:error v-if="v$.login.email.$error">
                        <p v-if="v$.login.email.required.$invalid">Informe seu e-mail</p>
                    </template>
                </BaseInput>
            </div>
            <div class="mb-md">
                <BaseInput
                    label="Senha"
                    v-model="login.senha"
                    type="password"
                >
                    <template v-slot:error v-if="v$.login.senha.$error">
                        <p v-if="v$.login.senha.required.$invalid">Informe sua senha</p>
                    </template>
                </BaseInput>
            </div>
            <div>
                <BaseButtonPrimary :loading="loading" style="width: 100%;" class="mb-xs">Entrar</BaseButtonPrimary>
                <router-link to="esqueci-senha">Esqueci minha senha</router-link>
            </div>
        </form>
    </div>
</template>

<script>
import BaseInput from "../../external/components/form/BaseInput";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import useVuelidate from '@vuelidate/core'
import {required, email} from '@vuelidate/validators'
import axios from "axios";
import api, {endpoint} from "../../services/api";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import {usuarioStore} from "../../stores/usuario";

export default {
    name: "Login",
    components: {BaseButtonTertiary, BaseButtonPrimary, BaseInput},
    setup: () => {
        const usuarioState = usuarioStore();

        return {
            v$: useVuelidate()
        }
    },
    data() {
        return {
            loading: false,
            login: {
                email: '',
                senha: '',
            }
        }
    },
    validations() {
        return {
            login: {
                email: {email, required},
                senha: {required}
            }
        }
    },
    methods: {
        async submit() {
            try {
                this.loading = true;

                const result = await this.v$.$validate();
                if (result) {

                    let response = await endpoint.post('/login', this.login);

                    window.localStorage.setItem("token", response.data.data.token);

                    await this.$router.push({name: 'dashboard'});

                }
            } catch (e) {
                this.$toast.open({
                    message: 'Não foi possível realizar o login!',
                    type: 'error'
                });
            } finally {
                this.loading = false;
            }
        }
    },
}
</script>

<style scoped>
.login {
    max-width: 360px;
    width: 100%;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
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
