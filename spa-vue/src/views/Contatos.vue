<template>
    <div class="contatos text-primary-900">
        <HeaderPage titulo="Contatos">
            <BaseButtonPrimary @click="abrirCriar">
                Criar
            </BaseButtonPrimary>
        </HeaderPage>
        <PageContent>
            <ContentTable>
                <template #header>
                    <form @submit.prevent="pesquisar">
                        <div class="row-xs align-items-end">
                            <div class="col-md-4">
                                <BaseInput
                                    label="Pesquisa"
                                    name="pesquisa"
                                    v-model="form.pesquisa"
                                />
                            </div>
                            <div class="col-md-4">
                                <BaseSelectAjax
                                    label="Empresa"
                                    placeholder="Pesquise as empresas"
                                    v-model="form.empresa_id"
                                    track-by="id"
                                    text-by="nome"
                                    :options="resultadoPesquisaEmpresa"
                                    @search-change="pesquisarEmpresa"
                                    noOptions="Pesquise as empresas"
                                    :empty="true"
                                    :remover="true"
                                >
                                </BaseSelectAjax>
                            </div>
                            <div class="col-auto">
                                <BaseButtonPrimary :loading="loading">
                                    Pesquisar
                                </BaseButtonPrimary>
                            </div>
                        </div>
                    </form>
                </template>
                <Tabela
                    :loading="loading"
                    :colunas="[
                        {
                            nome: 'id',
                            texto: 'ID'
                        },
                        {
                            nome: 'nome',
                            texto: 'nome'
                        },
                        {
                            nome: 'email',
                            texto: 'email'
                        },
                        {
                            nome: 'telefone',
                            texto: 'telefone'
                        },
                        {
                            nome: 'organizacao',
                            texto: 'Organização',
                            disabled: true
                        },
                    ]"
                    :dados="contatos && contatos.data"
                    :sort-name="sortName"
                    :sort-order="sortOrder"
                    @onSort="sortBy"
                    texto-empty="Não há dados"
                >
                    <template v-slot:colunas="{ dados }">
                        <tr v-for="(dado,index) in dados" :key="index">
                            <ColunaTabela>{{ dado.id }}</ColunaTabela>
                            <ColunaTabela>{{ dado.nome }}</ColunaTabela>
                            <ColunaTabela>{{ dado.email }}</ColunaTabela>
                            <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
                            <ColunaTabela>{{ dado.organizacao }}</ColunaTabela>
                            <th class="coluna-acoes">
                                <DropdownAcoes :fundoClaro="true">
                                    <button @click="abrirEdicao(dado)">Editar</button>
                                    <button @click="abrirExclusao(dado)">Excluir</button>
                                    <button @click="abrirDetalhes(dado)">Detalhes</button>
                                </DropdownAcoes>
                            </th>
                        </tr>
                    </template>
                </Tabela>
                <template #footer>
                    <PaginacaoSemRouter
                        :exibir-total="true"
                        v-if="contatos"
                        :pagina-atual="contatos.current_page"
                        :total="contatos.total"
                        :porPagina="contatos.per_page"
                        @onChange="updatePagina($event)"
                    />
                </template>
            </ContentTable>
        </PageContent>
        <ModalCriarContato/>
        <ModalEditarContato/>
        <ModalExcluirContato/>
        <ModalDetalhesContato/>
    </div>
</template>

<script>

import HeaderPage from "../components/pages/HeaderPage";
import BaseButtonPrimary from "../external/components/buttons/BaseButtonPrimary";
import PageContent from "../components/pages/PageContent";
import ContentTable from "../components/pages/ContentTable";
import BaseInput from "../external/components/form/BaseInput";
import BaseSelectAjax from "../external/components/form/BaseSelectAjax";
import Tabela from "../external/components/tabela/Tabela";
import ColunaTabela from "../external/components/tabela/ColunaTabela";
import DropdownAcoes from "../external/components/dropdown/BaseDropdownAction";
import PaginacaoSemRouter from "../external/components/paginacao/PaginacaoSemRouter";
import api from '../services/api'
import {
    modalCriarContatoStore,
    modalEditarContatoStore,
    modalDetalhesContatoStore,
    modalExcluirContatoStore
} from '../stores/contato'
import ModalCriarContato from "../components/contatos/ModalCriarContato";
import useVuelidate from "@vuelidate/core";
import ModalEditarContato from "../components/contatos/ModalEditarContato";
import ModalExcluirContato from "../components/contatos/ModalExcluirContato";
import ModalDetalhesContato from "../components/contatos/ModalDetalhesContato";

export default {
    name: "Contatos",
    components: {
        ModalDetalhesContato,
        ModalExcluirContato,
        ModalEditarContato,
        ModalCriarContato,
        PaginacaoSemRouter,
        DropdownAcoes,
        ColunaTabela,
        Tabela, BaseSelectAjax, BaseInput, ContentTable, PageContent, BaseButtonPrimary, HeaderPage
    },
    setup() {

        const modalCriarContatoState = modalCriarContatoStore();
        const modalEditarContatoState = modalEditarContatoStore();
        const modalExcluirContatoState = modalExcluirContatoStore();
        const modalDetalhesContatoState = modalDetalhesContatoStore();

        return {modalDetalhesContatoState, modalCriarContatoState, modalEditarContatoState, modalExcluirContatoState};
    },
    watch: {
        'modalCriarContatoState.reload': {
            handler() {
                this.buscarDados();
            }
        },
        'modalEditarContatoState.reload': {
            handler() {
                this.buscarDados();
            }
        },
        'modalExcluirContatoState.reload': {
            handler() {
                this.buscarDados();
            }
        },
    },
    data() {
        return {
            form: {
                pesquisa: '',
                empresa_id: null,
            },
            loading: false,
            sortName: 'id',
            sortOrder: 'desc',
            page: 1,
            contatos: null,
            resultadoPesquisaEmpresa: []
        }
    },
    methods: {
        pesquisarEmpresa(pesquisa) {
            api.get(`/organizacao`, {params: {pesquisa: pesquisa}}).then((response) => {
                this.resultadoPesquisaEmpresa = response.data.data.data;
            });
        },
        abrirCriar() {
            this.modalCriarContatoState.abrir();
        },
        abrirEdicao(usuario) {
            this.modalEditarContatoState.abrir(usuario);
        },
        abrirExclusao(usuario) {
            this.modalExcluirContatoState.abrir(usuario);
        },
        abrirDetalhes(usuario) {
            this.modalDetalhesContatoState.abrir(usuario);
        },
        sortBy({sortName, sortOrder}) {
            console.log(sortName, sortOrder)
            this.sortName = sortName;
            this.sortOrder = sortOrder;
            this.buscarDados();
        },
        updatePagina(pagina) {
            this.page = pagina;
            this.buscarDados()
        },
        pesquisar() {
            this.page = 1;
            this.buscarDados()
        },
        buscarDados() {
            this.loading = true;
            api.get('/contato', {
                params: {
                    ...(this.form.pesquisa ? {pesquisa: this.form.pesquisa} : {}),
                    ...(this.form.empresa_id ? {empresa_id: this.form.empresa_id.id} : {}),
                    ...(this.page ? {page: this.page} : {}),
                    sortOrder: this.sortOrder,
                    sortName: this.sortName,
                }
            }).then((r) => {
                if (!r.data.success) return;

                this.contatos = r.data.data;
            })
                .catch((e) => {
                    this.$laravelError(e, 'Não foi possível listar os dados');
                })
                .finally(() => {
                    this.loading = false;
                })
        }
    },
    beforeUnmount() {

    },
    created() {
        this.buscarDados();
    }
}
</script>

<style scoped>

</style>
