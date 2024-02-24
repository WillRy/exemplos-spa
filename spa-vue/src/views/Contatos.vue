<template>
    <div class="contatos">
        <HeaderPage :titulo="$t('palavras.contatos')">
            <BaseButtonPrimary @click="abrirCriar">
                {{ $t("palavras.criar") }}
            </BaseButtonPrimary>
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
                        <div class="col-md-4">
                            <BaseSelectAjax
                                :label="$t('palavras.empresa')"
                                :placeholder="$t('textos.pesquise_as_empresas')"
                                v-model="form.empresa_id"
                                track-by="id"
                                text-by="nome"
                                :options="resultadoPesquisaEmpresa.dados"
                                @search-change="pesquisarEmpresa"
                                :noOptions="$t('textos.pesquise_as_empresas')"
                                :empty="true"
                                :remover="true"
                            >
                            </BaseSelectAjax>
                        </div>
                        <div class="col-auto">
                            <BaseButtonPrimary :loading="loading" type="submit">
                                {{ $t("palavras.pesquisar") }}
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
                            width: '80px',
                        },
                        {
                            nome: 'nome',
                            texto: $t('palavras.nome'),
                        },
                        {
                            nome: 'email',
                            texto: $t('palavras.email'),
                        },
                        {
                            nome: 'telefone',
                            texto: $t('palavras.telefone'),
                        },
                        {
                            nome: 'organizacao',
                            texto: $t('palavras.empresa'),
                            disabled: true,
                        },
                        {
                            nome: 'acoes',
                            texto: '',
                            disabled: true,
                            width: '50px',
                        },
                    ]"
                    :dados="contatos.dados && contatos.dados.data"
                    :sort-name="sortName"
                    :sort-order="sortOrder"
                    @onSort="sortBy"
                    texto-empty="Não há dados"
                >
                    <template v-slot:colunas="{ dados }">
                        <tr v-for="(dado, index) in dados" :key="index">
                            <ColunaTabela>{{ dado.id }}</ColunaTabela>
                            <ColunaTabela>{{ dado.nome }}</ColunaTabela>
                            <ColunaTabela>{{ dado.email }}</ColunaTabela>
                            <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
                            <ColunaTabela>{{ dado.organizacao?.nome }}</ColunaTabela>
                            <ColunaTabela
                              justify="flex-end"
                              class="coluna-acoes"
                            >
                                <DropdownAcoes :fundoClaro="true">
                                    <button @click="abrirEdicao(dado)">
                                        {{ $t("palavras.editar") }}
                                    </button>
                                    <button @click="abrirExclusao(dado)">
                                        {{ $t("palavras.excluir") }}
                                    </button>
                                    <button @click="abrirDetalhes(dado)">
                                        {{ $t("palavras.detalhes") }}
                                    </button>
                                </DropdownAcoes>
                              </ColunaTabela>
                        </tr>
                      </template>
                </Tabela>
                <PaginacaoSemRouter
                    class="mt-3"
                    :exibir-total="true"
                    :pagina-atual="contatos.dados.current_page"
                    :total="contatos.dados.total"
                    :porPagina="contatos.dados.per_page"
                    @onChange="updatePagina($event)"
                    :textoTotal="$t('palavras.total')"
                    :textoResultados="
                        $t('palavras.resultados', contatos.dados.total)
                    "
                    :tituloPrimeiraPagina="$t('palavras.primeira')"
                    :tituloUltimaPagina="$t('palavras.ultima')"
                />
            </Box>
        </div>
        <ModalCriarContato/>
        <ModalEditarContato/>
        <ModalExcluirContato/>
        <ModalDetalhesContato/>
    </div>
</template>

<script setup>
import HeaderPage from "../components/pages/HeaderPage";
import BaseButtonPrimary from "../external/components/buttons/BaseButtonPrimary";
import BaseInput from "../external/components/form/BaseInput";
import BaseSelectAjax from "../external/components/form/BaseSelectAjax";
import BaseCheckbox from "../external/components/form/BaseCheckbox";
import Tabela from "../external/components/tabela/Tabela";
import ColunaTabela from "../external/components/tabela/ColunaTabela";
import DropdownAcoes from "../external/components/dropdown/BaseDropdownAction";
import PaginacaoSemRouter from "../external/components/paginacao/PaginacaoSemRouter";
import Box from "../external/components/estrutura/Box";
import api from "../services/api";
import {
    modalCriarContatoStore,
    modalEditarContatoStore,
    modalDetalhesContatoStore,
    modalExcluirContatoStore,
} from "../stores/contato";
import ModalCriarContato from "../components/contatos/ModalCriarContato";
import ModalEditarContato from "../components/contatos/ModalEditarContato";
import ModalExcluirContato from "../components/contatos/ModalExcluirContato";
import ModalDetalhesContato from "../components/contatos/ModalDetalhesContato";

import { reactive, ref, watch } from 'vue';
import { useBackendToast } from "../external/hooks/useBackendToast";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const { backendToastError, backendToastSuccess, toastObj } = useBackendToast();
const modalCriarContatoState = modalCriarContatoStore();
const modalEditarContatoState = modalEditarContatoStore();
const modalDetalhesContatoState = modalDetalhesContatoStore();
const modalExcluirContatoState = modalExcluirContatoStore();

// Data
const form = reactive({
	pesquisa: "",
	empresa_id: null,
});
const loading = ref(false);
const sortName = ref('id');
const sortOrder = ref('desc');
const page = ref(1);
const contatos = reactive({
  dados: []
});
const resultadoPesquisaEmpresa = reactive({
  dados: []
});

// Methods
const pesquisarEmpresa = function(pesquisa) {
	api.get(`/organizacao`, {params: {pesquisa: pesquisa}}).then(
		(response) => {
			resultadoPesquisaEmpresa.dados = response.data.data.data;
		}
	);
}

const abrirCriar = function() {
	modalCriarContatoState.abrir();
}

const abrirEdicao = function(usuario) {
	modalEditarContatoState.abrir(usuario);
}

const abrirExclusao = function(usuario) {
	modalExcluirContatoState.abrir(usuario);
}

const abrirDetalhes = function(usuario) {
	modalDetalhesContatoState.abrir(usuario);
}

const sortBy = function (ordem) {
  sortName.value = ordem.sortName;
  sortOrder.value = ordem.sortOrder;
  buscarDados();
};

const updatePagina = function(pagina) {
	page.value = pagina;
	buscarDados();
}

const pesquisar = function() {
	page.value = 1;
	buscarDados();
}

const buscarDados = function() {
	loading.value = true;
	return api
		.get("/contato", {
			params: {
				...(form.pesquisa
					? {pesquisa: form.pesquisa}
					: {}),
				...(form.empresa_id
					? {empresa_id: form.empresa_id.id}
					: {}),
				...(page.value ? {page: page.value} : {}),
				sortOrder: sortOrder.value,
				sortName: sortName.value,
			},
		})
		.then((r) => {
			contatos.dados = r.data.data;
		})
		.catch((e) => {
			backendToastError(e, $t("texto.erro_listar_dados"));
		})
		.finally(() => {
			loading.value = false;
		});
}


// Watch
watch(() => modalCriarContatoState.reload, function () {
	buscarDados();
})

watch(() => modalEditarContatoState.reload, function () {
	buscarDados();
})

watch(() => modalExcluirContatoState.reload, function () {
	buscarDados();
})


// Created
buscarDados();
</script>

<style scoped></style>
