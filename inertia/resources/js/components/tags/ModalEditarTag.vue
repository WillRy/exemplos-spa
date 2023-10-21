<template>
    <BaseModal
        :aberta="modalEditarTagState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>{{ $t("textos.edicao_tag") }}</h3>
        </template>
        <template #body>
            <Loader
                width="60px"
                height="60px"
                :cor-principal="true"
                v-if="loadingDados"
            ></Loader>
            <form @submit.prevent="submit" v-if="!loadingDados">
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
import {modalEditarTagStore} from "../../stores/tag";

export default {
    name: "ModalEditarTag",
    setup() {
        const modalEditarTagState = modalEditarTagStore();
        return {
            modalEditarTagState,
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
            loadingDados: false,
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
        async carregarFormulario() {
            this.loadingDados = true;

            const response = await api.get(
                `/tag/${this.modalEditarTagState.payload.id}`
            );
            const dados = response.data.data;
            Object.assign(this.form, dados);

            this.loadingDados = false;
        },
        fecharModal() {
            this.v$.$reset();
            this.modalEditarTagState.fechar();
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

                    await api.put(`/tag/${this.modalEditarTagState.payload.id}`, data);

                    this.fecharModal();
                    this.modalEditarTagState.onReload();
                    this.loading = false;
                }
            } catch (e) {
                this.$laravelError(e, this.$t('textos.erro_editar_tag'));
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
