<template>
    <BaseModal
        :aberta="modalExcluirOrganizacaoState.open"
        @onClose="fecharModal"
        @onOpen="carregarFormulario"
    >
        <template #title>
            <h3>Exclusão de organizacao</h3>
        </template>
        <template #body>
            <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
            <p v-else>Deseja excluir o organizacao <strong>{{ modalExcluirOrganizacaoState.payload.nome }}</strong>?</p>
        </template>
        <template #footer>
            <BaseButtonDanger @click.prevent="submit" :loading="loading">
                Excluir
            </BaseButtonDanger>
            <BaseButtonTertiary @click.prevent="fecharModal">
                Cancelar
            </BaseButtonTertiary>
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
import {modalExcluirOrganizacaoStore} from "../../stores/organizacao";
import BaseButtonDanger from "../../external/components/buttons/BaseButtonDanger";

export default {
    name: "ModalExcluirOrganizacao",
    setup() {
        const modalExcluirOrganizacaoState = modalExcluirOrganizacaoStore();
        return {
            modalExcluirOrganizacaoState
        };
    },
    components: {
        BaseButtonDanger,
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

            await api.get(`/organizacao/${this.modalExcluirOrganizacaoState.payload.id}`);

            this.loadingDados = false;
        },
        fecharModal() {
            this.modalExcluirOrganizacaoState.fechar()
            this.$emit("onClose");
        },
        async submit() {
            try {
                this.loading = true;
                await api.delete(`/organizacao/${this.modalExcluirOrganizacaoState.payload.id}`);

                this.fecharModal();
                this.modalExcluirOrganizacaoState.onReload();
                this.loading = false;

            } catch (e) {
                this.$laravelError(e, 'Não foi possível excluir o organizacao!');
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
