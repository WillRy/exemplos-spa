<template>
    <div class="tags">
        <HeaderPage :titulo="$t('palavras.tags')">
            <BaseButtonPrimary @click="abrirCriar"> {{ $t("palavras.criar") }}</BaseButtonPrimary>
        </HeaderPage>
        <div class="container-fluid">
            <Box>
                <form @submit.prevent="pesquisar" class="mb-3">
                    <div class="row align-items-end gy-1">
                        <div class="col-md-4">
                            <BaseInput
                                :label="$t('palavras.pesquisar')"
                                name="pesquisa"
                                v-model="form.pesquisa"
                            />
                        </div>
                        <div class="col-auto">
                            <BaseButtonPrimary :loading="loading" type="submit">
                                {{ $t('palavras.pesquisar') }}
                            </BaseButtonPrimary>
                        </div>
                    </div>
                </form>
                <Tabela
                    :loading="loading"
                    :colunas="[
                        {
                          nome: 'id',
                          texto: $t('palavras.id'),
                        },
                        {
                          nome: 'nome',
                          texto: $t('palavras.nome'),
                        },
                        {
                          nome: 'cor_fundo',
                          texto: $t('palavras.cor_fundo'),
                        },
                        {
                          nome: 'cor_texto',
                          texto: $t('palavras.cor_texto'),
                        },
                        {
                          nome: 'acoes',
                          texto: '',
                          disabled: true,
                          width: '50px'
                        },
                      ]"
                    :dados="tags && tags.data"
                    :sort-name="sortName"
                    :sort-order="sortOrder"
                    @onSort="sortBy"
                    texto-empty="Não há dados"
                >
                    <template #table-row="{coluna, dado, row}">
                        <span v-if="coluna.nome === 'id'">
                          <span style="font-weight: bold; color: var(--primary-color-principal);">{{ row.id }}</span>
                        </span>

                        <div
                            v-else-if="coluna.nome === 'cor_fundo'"
                            class="tag-col"
                            :style="{background: row.cor_fundo, color: row.cor_texto}"
                        >
                            {{ row.cor_fundo }}
                        </div>

                        <div
                            v-else-if="coluna.nome === 'cor_texto'"
                            class="tag-col"
                            :style="{background: row.cor_fundo, color: row.cor_texto}"
                        >
                            {{ row.cor_texto }}
                        </div>

                        <DropdownAcoes :fundoClaro="true" v-else-if="coluna.nome === 'acoes'">
                            <button @click="abrirEdicao(row)">{{ $t('palavras.editar') }}</button>
                            <button @click="abrirExclusao(row)">{{ $t('palavras.excluir') }}</button>
                        </DropdownAcoes>
                        <span v-else>
                          {{ coluna.dado }}
                        </span>
                    </template>
                </Tabela>
                <PaginacaoSemRouter
                    class="mt-3"
                    :exibir-total="true"
                    v-if="tags"
                    :pagina-atual="tags.current_page"
                    :total="tags.total"
                    :porPagina="tags.per_page"
                    @onChange="updatePagina($event)"
                    :textoTotal="$t('palavras.total')"
                    :textoResultados="$tc('palavras.resultados', tags.total)"
                    :tituloPrimeiraPagina="$t('palavras.primeira')"
                    :tituloUltimaPagina="$t('palavras.ultima')"
                />
            </Box>
        </div>

        <ModalCriarTag/>
        <ModalEditarTag/>
        <ModalExcluirTag/>
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
import Box from "../external/components/estrutura/Box";
import api from "../services/api";
import {useHead} from "@unhead/vue";
import ModalCriarTag from "../components/tags/ModalCriarTag";
import {modalCriarTagStore, modalDetalhesTagStore, modalEditarTagStore, modalExcluirTagStore} from "../stores/tag";
import ModalEditarTag from "../components/tags/ModalEditarTag";
import ModalExcluirTag from "../components/tags/ModalExcluirTag";

export default {
    name: "Tags",
    components: {
        ModalEditarTag,
        ModalCriarTag,
        ModalExcluirTag,
        PaginacaoSemRouter,
        DropdownAcoes,
        ColunaTabela,
        Tabela,
        BaseSelectAjax,
        BaseInput,
        ContentTable,
        PageContent,
        BaseButtonPrimary,
        HeaderPage,
        Box
    },
    setup() {
        const modalCriarTagState = modalCriarTagStore();
        const modalEditarTagState = modalEditarTagStore();
        const ModalExcluirTagState = modalExcluirTagStore();
        const ModalDetalhesTagState = modalDetalhesTagStore();

        return {
            modalCriarTagState,
            modalEditarTagState,
            ModalExcluirTagState,
            ModalDetalhesTagState
        };
    },
    watch: {
        "modalCriarTagState.reload": {
            handler() {
                this.buscarDados();
            },
        },
        "modalEditarTagState.reload": {
            handler() {
                this.buscarDados();
            },
        },
        "ModalExcluirTagState.reload": {
            handler() {
                this.buscarDados();
            },
        },
    },
    data() {
        return {
            form: {
                pesquisa: "",
            },
            loading: false,
            sortName: "id",
            sortOrder: "desc",
            page: 1,
            tags: null,
        };
    },
    methods: {
        abrirCriar() {
            this.modalCriarTagState.abrir();
        },
        abrirEdicao(tag) {
            this.modalEditarTagState.abrir(tag);
        },
        abrirExclusao(tag) {
            this.ModalExcluirTagState.abrir(tag);
        },
        sortBy({sortName, sortOrder}) {
            console.log(sortName, sortOrder);
            this.sortName = sortName;
            this.sortOrder = sortOrder;
            this.buscarDados();
        },
        updatePagina(pagina) {
            this.page = pagina;
            this.buscarDados();
        },
        pesquisar() {
            this.page = 1;
            this.buscarDados();
        },
        buscarDados() {
            this.loading = true;
            api
                .get("/tag", {
                    params: {
                        ...(this.form.pesquisa ? {pesquisa: this.form.pesquisa} : {}),
                        ...(this.page ? {page: this.page} : {}),
                        sortOrder: this.sortOrder,
                        sortName: this.sortName,
                    },
                })
                .then((r) => {
                    this.tags = r.data.data;
                })
                .catch((e) => {
                    this.$laravelError(e, this.$t('texto.erro_listar_dados'));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    beforeUnmount() {
    },
    created() {
        this.buscarDados();
    },
};
</script>

<style scoped>
.tag-col {
    padding: 6px;
    border-radius: 8px;
    border: 1px solid var(--gray-400);
}
</style>
