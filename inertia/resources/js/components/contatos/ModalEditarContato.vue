<template>
    <BaseModal
        :aberta="modalEditarContatoState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>{{ $t("textos.edicao_contato") }}</h3>
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
                        <BaseSelectAjax
                            :label="$t('palavras.empresa')"
                            :placeholder="$t('textos.pesquise_as_empresas')"
                            v-model="form.organizacao_id"
                            track-by="id"
                            text-by="nome"
                            :options="resultadoPesquisaEmpresa"
                            @search-change="pesquisarEmpresa"
                            :clear="true"
                            :noOptions="$t('textos.pesquise_as_empresas')"
                            :empty="false"
                            :remover="true"
                            :disabled="true"
                        >
                        </BaseSelectAjax>
                    </div>
                    <div class="col-12 ">
                        <BaseInput
                            v-model="form.nome"
                            :label="$t('palavras.nome') + '*'"
                            :placeholder="$t('palavras.nome') + '*'"
                        >
                            <template
                                v-slot:error
                                v-if="v$.form.nome.$error"
                            >
                                <p>
                                    {{ v$.form.nome.$errors[0].$message }}
                                </p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 ">
                        <BaseInput
                            v-model="form.email"
                            label="E-mail *"
                            placeholder="E-mail"
                            type="email"
                        >
                            <template v-slot:error v-if="v$.form.email.$error">
                                <p>
                                    {{ v$.form.email.$errors[0].$message }}
                                </p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 ">
                        <BaseInput
                            v-model="form.telefone"
                            :label="$t('palavras.telefone')"
                            :placeholder="$t('palavras.telefone')"
                            type="text"
                            v-mask="`+55 (##) ####-####`"
                        />
                    </div>
                </div>
                <div class="row gy-3">
                    <div class="col-md-12 ">
                        <BaseInput
                            v-model="form.cep"
                            :label="$t('palavras.cep')"
                            :placeholder="$t('palavras.cep')"
                            type="text"
                            @change="tratarCep"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.endereco"
                            :label="$t('palavras.endereco')"
                            :placeholder="$t('palavras.endereco')"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.bairro"
                            :label="$t('palavras.bairro')"
                            :placeholder="$t('palavras.bairro')"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.numero"
                            :label="$t('palavras.numero')"
                            :placeholder="$t('palavras.numero')"
                            type="number"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.complemento"
                            :label="$t('palavras.complemento')"
                            :placeholder="$t('palavras.complemento')"
                            type="text"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.cidade"
                            :label="$t('palavras.cidade')"
                            :placeholder="$t('palavras.cidade')"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 ">
                        <BaseInput
                            v-model="form.estado"
                            :label="$t('palavras.estado')"
                            :placeholder="$t('palavras.estado')"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template #footerDireito>
            <BaseButtonTertiary @click.prevent="fecharModal">
                Cancelar
            </BaseButtonTertiary>
            <BaseButtonPrimary @click.prevent="submit" :loading="loading">
                Editar
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
import BaseDate from "../../external/components/form/BaseDate";
import {modalEditarContatoStore} from "../../stores/contato";
import {email, helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";

export default {
    name: "ModalEditarContato",
    setup() {
        const modalEditarContatoState = modalEditarContatoStore();
        return {
            modalEditarContatoState,
            v$: useVuelidate(),
        };
    },
    components: {
        BaseDate,
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
                email: "",
                telefone: "",
                cep: "",
                endereco: "",
                numero: "",
                complemento: "",
                cidade: "",
                estado: "",
                organizacao_id: null,
            },
            pesquisouCep: false,
            config: false,
            loading: false,
            loadingDados: false,
            resultadoPesquisaEmpresa: [],
        };
    },
    validations() {
        return {
            form: {
                nome: {
                    required: helpers.withMessage(this.$t("validacao.required", {field: this.$t("palavras.nome")}), required)
                },
                email: {
                    email: helpers.withMessage(this.$t("validacao.email", {field: this.$t("palavras.email")}), email),
                    required: helpers.withMessage(this.$t("validacao.required", {field: this.$t("palavras.email")}), required),
                },
                telefone: {},
                cep: {},
                endereco: {},
                bairro: {},
                numero: {},
                complemento: {},
                cidade: {},
                estado: {},
                organizacao_id: {},
            },
        };
    },
    computed: {},
    methods: {
        tratarCep() {
            this.pesquisouCep = false;
            if (this.form.cep.length === 8) {
                axios
                    .get(`https://viacep.com.br/ws/${this.form.cep}/json/`)
                    .then((r) => {
                        const {data} = r;

                        if (data.erro) {
                            this.pesquisouCep = true;
                            this.$toast.open({
                                type: "error",
                                message: "Não foi possível encontrar o CEP",
                            });
                        }

                        this.form.endereco = data.logradouro;
                        this.form.complemento = data.complemento;
                        this.form.bairro = data.bairro;
                        this.form.cidade = data.localidade;
                        this.form.estado = data.uf;
                    })
                    .catch(() => {
                        this.pesquisouCep = true;
                    });
            }
        },
        pesquisarEmpresa(pesquisa) {
            api
                .get(`/organizacao`, {params: {pesquisa: pesquisa}})
                .then((response) => {
                    this.resultadoPesquisaEmpresa = response.data.data.data;
                });
        },
        async carregarFormulario() {
            // this.loadingDados = true;

            // const response = await api.get(
            //   `/contato/${this.modalEditarContatoState.payload.id}`
            // );
            // const dados = response.data.data;
            // Object.assign(this.form, dados);
            // this.form.organizacao_id = dados.organizacao;

            // this.loadingDados = false;
            Object.assign(this.form, this.modalEditarContatoState.payload);
        },
        fecharModal() {
            this.v$.$reset();
            this.modalEditarContatoState.fechar();
            this.$emit("onClose");
        },
        async submit() {
            try {
                this.loading = true;

                const result = await this.v$.$validate();
                if (result) {
                    const data = {
                        ...this.form,
                        organizacao_id: this.form.organizacao_id
                            ? this.form.organizacao_id.id
                            : null,
                    };

                    await api.put(
                        `/contato/${this.modalEditarContatoState.payload.id}`,
                        data
                    );

                    this.fecharModal();
                    this.modalEditarContatoState.onReload();
                    this.loading = false;
                }
            } catch (e) {
                this.$laravelError(e, this.$t('textos.erro_editar_contato'));
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
