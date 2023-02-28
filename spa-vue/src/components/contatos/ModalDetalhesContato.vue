<template>
    <BaseModal
        :aberta="modalDetalhesContatoState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>Detalhes do contato</h3>
        </template>
        <template #body>
            <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
            <div v-if="!loadingDados">
                <div class="row-xxs">
                    <div class="col-md-6 mb-xs">
                        <p><strong>Nome: </strong> {{ form.nome }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Email: </strong>{{ form.email }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Telefone:</strong> {{ form.telefone }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>CEP: </strong> {{ form.cep }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Endereço</strong>: {{ form.endereco }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Bairro:</strong> {{ form.bairro }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Número:</strong> {{ form.numero }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Complemento:</strong> {{ form.complemento }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Cidade:</strong> {{ form.cidade }}</p>
                    </div>
                    <div class="col-md-6 mb-xs">
                        <p><strong>Estado:</strong> {{ form.estado }}</p>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <BaseButtonTertiary @click.prevent="fecharModal">
                Fechar
            </BaseButtonTertiary>
        </template>
    </BaseModal>
</template>

<script>

import api from "../../services/api";
import BaseButtonTertiary from "../../external/components/buttons/BaseButtonTertiary";
import BaseModal from "../../external/components/modal/BaseModal";
import {modalDetalhesContatoStore} from "../../stores/contato";

export default {
    name: "ModalDetalhesContato",
    setup() {
        const modalDetalhesContatoState = modalDetalhesContatoStore();
        return {
            modalDetalhesContatoState
        };
    },
    components: {
        BaseModal,
        BaseButtonTertiary,
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
    computed: {},
    methods: {
        async carregarFormulario() {
            this.loadingDados = true;

            const response = await api.get(`/contato/${this.modalDetalhesContatoState.payload.id}`);
            const dados = response.data.data;
            Object.assign(this.form, dados);
            this.form.organizacao_id = dados.organizacao;

            this.loadingDados = false;
        },
        fecharModal() {
            this.modalDetalhesContatoState.fechar()
            this.$emit("onClose");
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
