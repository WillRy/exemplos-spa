<template>
  <div class="contatos text-primary-900">
    <HeaderPage titulo="Contatos">
      <BaseButtonPrimary @click="abrirCriar"> Criar </BaseButtonPrimary>
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
                <BaseButtonPrimary :loading="loaders.loading">
                  Pesquisar
                </BaseButtonPrimary>
              </div>
            </div>
          </form>
        </template>
        <Tabela
          :loading="loaders.loading"
          :colunas="[
            {
              nome: 'id',
              texto: 'ID',
            },
            {
              nome: 'nome',
              texto: 'nome',
            },
            {
              nome: 'email',
              texto: 'email',
            },
            {
              nome: 'telefone',
              texto: 'telefone',
            },
            {
              nome: 'organizacao',
              texto: 'Organização',
              disabled: true,
            },
          ]"
          :dados="contatos && contatos.data"
          :sort-name="sort.sortName"
          :sort-order="sort.sortOrder"
          @onSort="sortBy"
          texto-empty="Não há dados"
        >
          <template v-slot:colunas="{ dados }">
            <tr v-for="(dado, index) in dados" :key="index">
              <ColunaTabela>{{ dado.id }}</ColunaTabela>
              <ColunaTabela>{{ dado.nome }}</ColunaTabela>
              <ColunaTabela>{{ dado.email }}</ColunaTabela>
              <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
              <ColunaTabela>{{ dado.organizacao }}</ColunaTabela>
              <th class="coluna-acoes">
                <BaseDropdownAction :fundoClaro="true">
                  <button @click="abrirEdicao(dado)">Editar</button>
                  <button @click="abrirExclusao(dado)">Excluir</button>
                  <button @click="abrirDetalhes(dado)">Detalhes</button>
                </BaseDropdownAction>
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
    <ClientOnly>
      <div>
        <ModalCriarContato />
        <ModalEditarContato />
        <ModalExcluirContato />
        <ModalDetalhesContato />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import {
  modalCriarContatoStore,
  modalEditarContatoStore,
  modalDetalhesContatoStore,
  modalExcluirContatoStore,
} from "../../store/contato";

const modalCriarContatoState = modalCriarContatoStore();
const modalEditarContatoState = modalEditarContatoStore();
const modalExcluirContatoState = modalExcluirContatoStore();
const modalDetalhesContatoState = modalDetalhesContatoStore();

const { reload: modalCriarContatoReload } = storeToRefs(modalCriarContatoState);
const { reload: modalEditarContatoReload } = storeToRefs(
  modalEditarContatoState
);
const { reload: modalExcluirContatoReload } = storeToRefs(
  modalExcluirContatoState
);

watch(modalCriarContatoReload, () => buscarDados());
watch(modalEditarContatoReload, () => buscarDados());
watch(modalExcluirContatoReload, () => buscarDados());

const form = reactive({
  pesquisa: "",
  empresa_id: null,
});

const loaders = reactive({
  loading: false,
});

const sort = reactive({
  sortName: "id",
  sortOrder: "desc",
});

let page = ref(1);

let contatos = reactive({});

let resultadoPesquisaEmpresa = ref([]);

async function pesquisarEmpresa(pesquisa) {
  const ajax = fetchApiProtected();
  const data = await ajax("/organizacao", {
    params: {
      pesquisa: pesquisa,
    },
  });

  resultadoPesquisaEmpresa.value = data.data.data;
}

function abrirCriar() {
  modalCriarContatoState.abrir();
}
function abrirEdicao(usuario) {
  modalEditarContatoState.abrir(usuario);
}
function abrirExclusao(usuario) {
  modalExcluirContatoState.abrir(usuario);
}
function abrirDetalhes(usuario) {
  modalDetalhesContatoState.abrir(usuario);
}

function sortBy({ sortName, sortOrder }) {
  sort.sortName = sortName;
  sort.sortOrder = sortOrder;
  page.value = 1;
  buscarDados();
}

function updatePagina(pagina) {
  page = pagina;
  buscarDados();
}

function pesquisar() {
  page = 1;
  buscarDados();
}

async function buscarDados() {
  try {
    loaders.loading = true;

    const ajax = fetchApiProtected();
    const data = await ajax("/contato", {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(form.empresa_id ? { empresa_id: form.empresa_id.id } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sort.sortOrder,
        sortName: sort.sortName,
      },
    });

    contatos = data.data;
  } catch (error) {
    useMessageApi(error, "Não foi possível listar os contatos");
  } finally {
    loaders.loading = false;
  }
}

onMounted(() => {
  buscarDados();
});
</script>

<style scoped></style>
