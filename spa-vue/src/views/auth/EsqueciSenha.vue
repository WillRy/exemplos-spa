<template>
    <div class="login">
        <h3>{{$t("login.esqueci_senha")}}</h3>
        <form @submit.prevent="submit">
            <div class="mb-3">
                <BaseInput
                    label="E-mail"
                    v-model="email"
                >
                    <template v-slot:error v-if="v$.email.$error">
                        <p v-if="v$.email.$error">
                          {{$t("validacao.required",{field: $t('login.email')})}}
                        </p>
                    </template>
                </BaseInput>
            </div>
            <div>
                <BaseButtonPrimary :loading="loading" style="width: 100%;" class="mb-3">{{ $t('login.recuperar') }}</BaseButtonPrimary>

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
import api, {apiWithoutLogoutRedirect} from "../../services/api";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import {i18n} from "../../lang";

export default {
    name: "Login",
    components: {BaseButtonTertiary, BaseButtonPrimary, BaseInput},
    setup: () => ({v$: useVuelidate()}),
    data() {
        return {
            loading: false,
            email: ''
        }
    },
    validations() {
        return {
            email: {email, required},
        }
    },
    methods: {
        async submit() {
            try {
                this.loading = true;

                const result = await this.v$.$validate();
                if (result) {

                    await apiWithoutLogoutRedirect.post('/esqueci-senha', {
                        email: this.email,
                        "url": window.location.origin + "/" + this.$i18n.locale +'/' + "redefinir-senha"
                    });

                    this.$toast.open({
                        message: this.$t('textos.sucesso_solicitar_reset_senha'),
                        type: 'success'
                    });

                }
            } catch (e) {
                this.$laravelError(e, this.$t('textos.erro_solicitar_reset_senha'))
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
