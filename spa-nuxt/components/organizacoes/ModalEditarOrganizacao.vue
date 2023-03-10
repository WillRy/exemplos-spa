<template>
    <BaseModal
        :aberta="modalEditarOrganizacaoState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>Edição de organizacao</h3>
        </template>
        <template #body>
            <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
            <form @submit.prevent="submit" v-if="!loadingDados">
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
                Editar
            </BaseButtonPrimary>
            <BaseButtonTertiary @click.prevent="fecharModal">
                Cancelar
            </BaseButtonTertiary>
        </template>
    </BaseModal>
</template>

<script>
import {modalEditarOrganizacaoStore} from "../../store/organizacao";
import {email, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
    name: "ModalEditarOrganizacao",
    setup() {
        const modalEditarOrganizacaoState = modalEditarOrganizacaoStore();
        return {
            modalEditarOrganizacaoState,
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
                estado: '',
                organizacao_id: null,
            },
            pesquisouCep: false,
            config: false,
            loading: false,
            loadingDados: false,
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
                this.fetch(`https://viacep.com.br/ws/${this.form.cep}/json/`).then((r) => {

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
        async carregarFormulario() {
            this.loadingDados = true;

            const response = await fetch(`/organizacao/${this.modalEditarOrganizacaoState.payload.id}`);
            const dados = response.data;
            Object.assign(this.form, dados);

            this.loadingDados = false;
        },
        fecharModal() {
            this.v$.$reset();
            this.modalEditarOrganizacaoState.fechar()
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

                    await this.fetch(`/organizacao/${this.modalEditarOrganizacaoState.payload.id}`, {
                        body: data,
                        method: 'PUT'
                    });

                    this.fecharModal();
                    this.modalEditarOrganizacaoState.onReload();
                    this.loading = false;
                }
            } catch (e) {
                useMessageApi(e, 'Não foi possível editar o organizacao!');
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
