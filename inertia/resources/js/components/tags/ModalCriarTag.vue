<template>
    <BaseModal
        :aberta="modalCriarTagState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>{{ $t("textos.criacao_tag") }}</h3>
        </template>
        <template #body>
            <form @submit.prevent="submit">
                <div class="row mb-3 gy-3">
                    <div class="col-12 ">
                        <BaseInput
                            v-model="form.nome"
                            :label="$t('palavras.nome') + '*'"
                            :placeholder="$t('palavras.nome') + '*'"
                        >
                            <template v-slot:error v-if="v$.form.nome.$error">
                                <p>
                                    {{ v$.form.nome.$errors[0].$message }}
                                </p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 ">
                        <BaseInput
                            v-model="form.cor_fundo"
                            :label="$t('palavras.cor_fundo') + '*'"
                            :placeholder="$t('palavras.cor_fundo') + '*'"
                            type="color"
                        >
                            <template v-slot:error v-if="v$.form.cor_fundo.$error">
                                <p>
                                    {{ v$.form.cor_fundo.$errors[0].$message }}
                                </p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 ">
                        <BaseInput
                            v-model="form.cor_texto"
                            :label="$t('palavras.cor_texto') + '*'"
                            :placeholder="$t('palavras.cor_texto') + '*'"
                            type="color"
                        >
                            <template v-slot:error v-if="v$.form.cor_texto.$error">
                                <p>
                                    {{ v$.form.cor_texto.$errors[0].$message }}
                                </p>
                            </template>
                        </BaseInput>
                    </div>
                </div>

            </form>
        </template>
        <template #footerDireito>
            <BaseButtonTertiary @click.prevent="fecharModal">
                {{ $t('palavras.cancelar') }}
            </BaseButtonTertiary>
            <BaseButtonPrimary @click.prevent="submit" :loading="loading">
                {{ $t('palavras.salvar') }}
            </BaseButtonPrimary>
        </template>
    </BaseModal>
</template>

<script>
import api from "../../services/api";
import BaseButtonPrimary from "../../external/components/buttons/BaseButtonPrimary";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import BaseSelectAjax from "../../external/components/form/BaseSelectAjax";
import BaseInput from "../../external/components/form/BaseInput";
import {email, helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import {modalCriarTagStore} from "../../stores/tag";

export default {
    name: "ModalCriarTag",
    setup() {
        const modalCriarTagState = modalCriarTagStore();
        return {
            modalCriarTagState,
            v$: useVuelidate(),
        };
    },
    components: {
        BaseInput,
        BaseSelectAjax,
        BaseModal,
        BaseButtonTertiary,
        BaseButtonPrimary,
    },
    data() {
        return {
            form: {
                nome: "",
                cor_fundo: "#000",
                cor_texto: "#fff",
            },
            loading: false,
        };
    },
    validations() {
        return {
            form: {
                nome: {
                    required: helpers.withMessage(this.$t("validacao.required", {field: this.$t("palavras.nome")}), required)
                },
                cor_fundo: {
                    required: helpers.withMessage(this.$t("validacao.required", {field: this.$t("palavras.cor_fundo")}), required)
                },
                cor_texto: {
                    required: helpers.withMessage(this.$t("validacao.required", {field: this.$t("palavras.cor_texto")}), required)
                },
            },
        };
    },
    computed: {},
    methods: {
        carregarFormulario() {
            Object.assign(this.form, {
                nome: "",
                cor_fundo: "#000000",
                cor_texto: "#ffffff",
            });
        },
        fecharModal() {
            this.v$.$reset();
            this.modalCriarTagState.fechar();
            this.$emit("onClose");
        },
        async submit() {
            try {
                this.loading = true;

                const result = await this.v$.$validate();
                if (result) {
                    const data = {
                        ...this.form,
                    };

                    await api.post(`/tag`, data);

                    this.fecharModal();
                    this.modalCriarTagState.onReload();
                    this.loading = false;
                }
            } catch (e) {
                this.$laravelError(e, this.$t('textos.erro_cadastrar_tag'));
            } finally {
                this.loading = false;
            }
        },
    },
    beforeUnmount() {
    },
    created() {
    },
};
</script>

<style scoped></style>
