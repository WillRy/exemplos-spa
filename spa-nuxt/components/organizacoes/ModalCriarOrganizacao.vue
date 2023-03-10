<template>
    <BaseModal
        :aberta="modalCriarOrganizacaoState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>Criação de organizacao</h3>
        </template>
        <template #body>
            <form @submit.prevent="submit">
                <div class="row-xxs">

                    <div class="col-12 mb-sm">
                        <BaseInput
                            v-model="form.nome"
                            label="Nome *"
                            placeholder="Nome"
                        >
                            <template v-slot:error v-if="v$.form.nome.$error">
                                <p v-if="v$.form.nome.required.$invalid">Informe o nome</p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 mb-sm">
                        <BaseInput
                            v-model="form.email"
                            label="E-mail *"
                            placeholder="E-mail"
                            type="email"
                        >
                            <template v-slot:error v-if="v$.form.email.$error">
                                <p v-if="v$.form.email.required.$invalid">Informe o e-mail</p>
                                <p v-if="v$.form.email.email.$invalid">Informe um e-mail inválido</p>
                            </template>
                        </BaseInput>
                    </div>
                    <div class="col-md-6 mb-sm">
                        <BaseInput
                            v-model="form.telefone"
                            label="Telefone"
                            placeholder="Telefone"
                            type="text"
                            v-mask="`+55 (##) ####-####`"
                        />
                    </div>
                </div>
                <div class="row-xxs">
                    <div class="col-md-12 mb-sm">
                        <BaseInput
                            v-model="form.cep"
                            label="Cep "
                            placeholder="cep"
                            type="text"
                            @change="tratarCep"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.endereco"
                            label="Endereço"
                            placeholder="endereco"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.bairro"
                            label="Bairro"
                            placeholder="bairro"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.numero"
                            label="Numero"
                            placeholder="numero"
                            type="number"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.complemento"
                            label="Complemento"
                            placeholder="complemento"
                            type="text"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.cidade"
                            label="Cidade"
                            placeholder="cidade"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                    <div class="col-md-4 mb-sm">
                        <BaseInput
                            v-model="form.estado"
                            label="Estado"
                            placeholder="estado"
                            type="text"
                            :disabled="!pesquisouCep"
                        />
                    </div>
                </div>
            </form>
        </template>
        <template #footer>
            <BaseButtonPrimary @click.prevent="submit" :loading="loading">
                Cadastrar
            </BaseButtonPrimary>
            <BaseButtonTertiary @click.prevent="fecharModal">
                Cancelar
            </BaseButtonTertiary>
        </template>
    </BaseModal>
</template>

<script>

import {modalCriarOrganizacaoStore} from "../../store/organizacao";
import {email, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
    name: "ModalCriarOrganizacao",
    setup() {
        const modalCriarOrganizacaoState = modalCriarOrganizacaoStore();
        return {
            modalCriarOrganizacaoState,
            v$: useVuelidate(),
            fetch: fetchApiProtected()
        };
    },
    data() {
        return {
            form: {
                nome: '',
                email: '',
                telefone: '',
                cep: '',
                endereco: '',
                numero: '',
                complemento: '',
                cidade: '',
                estado: ''
            },
            pesquisouCep: false,
            config: false,
            loading: false,
            resultadoPesquisaEmpresa: []
        }
    },
    validations() {
        return {
            form: {
                nome: {required},
                email: {email, required},
                telefone: {},
                cep: {},
                endereco: {},
                bairro: {},
                numero: {},
                complemento: {},
                cidade: {},
                estado: {},
                organizacao_id: {},
            }
        }
    },
    computed: {},
    methods: {
        tratarCep() {
            this.pesquisouCep = false;
            if (this.form.cep.length === 8) {
                this.fetch(`https://viacep.com.br/ws/${this.form.cep}/json/`).then((data) => {
                    

                    if(data.erro) {
                        this.pesquisouCep = true;
                        this.$toast.open({
                            type: 'error',
                            message: 'Não foi possível encontrar o CEP'
                        })
                    }

                    this.form.endereco = data.logradouro;
                    this.form.complemento = data.complemento;
                    this.form.bairro = data.bairro;
                    this.form.cidade = data.localidade;
                    this.form.estado = data.uf;
                }).catch(() => {
                    this.pesquisouCep = true;
                })
            }
        },
        pesquisarEmpresa(pesquisa) {
            fetch(`/organizacao`, {params: {pesquisa: pesquisa}}).then((response) => {
                this.resultadoPesquisaEmpresa = response.data;
            });
        },
        carregarFormulario() {
            Object.assign(this.form, {
                nome: '',
                email: '',
                telefone: '',
                cep: '',
                endereco: '',
                numero: '',
                complemento: '',
                cidade: '',
                estado: '',
                organizacao_id: null,
            });
        },
        fecharModal() {
            this.v$.$reset();
            this.modalCriarOrganizacaoState.fechar()
            this.$emit("onClose");
        },
        async submit() {
            try {
                this.loading = true;

                const result = await this.v$.$validate();
                if (result) {

                    const data = {
                        ...this.form
                    }

                    await this.fetch(`/organizacao`, {
                        body: data,
                        method: 'POST'
                    });

                    this.fecharModal();
                    this.modalCriarOrganizacaoState.onReload();
                    this.loading = false;
                }
            } catch (e) {
                useMessageApi(e, 'Não foi possível cadastrar o organizacao!');
            } finally {
                this.loading = false;
            }
        },
    },
    beforeUnmount() {
    },
    created() {
    },
}
</script>

<style scoped>

</style>
