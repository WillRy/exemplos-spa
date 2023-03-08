<template>
  <div class="organizacoes text-primary-900">
    <HeaderPage titulo="Organizações">
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
              nome: 'qtd_contatos',
              texto: 'Qtde. Contatos',
            },
          ]"
          :dados="organizacoes && organizacoes.data"
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
              <ColunaTabela>{{ dado.qtd_contatos }}</ColunaTabela>
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
            v-if="organizacoes"
            :pagina-atual="organizacoes.current_page"
            :total="organizacoes.total"
            :porPagina="organizacoes.per_page"
            @onChange="updatePagina($event)"
          />
        </template>
      </ContentTable>
    </PageContent>
    <!-- <ModalCriarOrganizacao/>
        <ModalEditarOrganizacao/>
        <ModalExcluirOrganizacao/>
        <ModalDetalhesOrganizacao/> -->
  </div>
</template>

<script setup>
import useToast from "~/hooks/useToast";
import useFetchApi from "~~/hooks/useFetchApi";

// watch("modalCriarOrganizacaoState.reload", () => {
//   buscarDados();
// });
// watch("modalEditarOrganizacaoState.reload", () => {
//   buscarDados();
// });
// watch("modalExcluirOrganizacaoState.reload", () => {
//   buscarDados();
// });

const loaders = reactive({
  loading: false,
});

const form = reactive({
  pesquisa: "",
  empresa_id: "",
});

const sort = reactive({
  sortName: "id",
  sortOrder: "desc",
});

let page = ref(1);

let organizacoes = reactive({});


function abrirCriar() {
  modalCriarOrganizacaoState.abrir();
}
function abrirEdicao(usuario) {
  modalEditarOrganizacaoState.abrir(usuario);
}
function abrirExclusao(usuario) {
  modalExcluirOrganizacaoState.abrir(usuario);
}
function abrirDetalhes(usuario) {
  modalDetalhesOrganizacaoState.abrir(usuario);
}
function sortBy({ sortName, sortOrder }) {
  sort.sortName = sortName;
  sort.sortOrder = sortOrder;
  buscarDados();
}
function updatePagina(pagina) {
  page.value = pagina;
  buscarDados();
}
function pesquisar() {
  page.value = 1;
  buscarDados();
}



const { data, error, pending, refresh } = await useAsyncData(
  "organizacao",
  () => {
    const cookie = useCookie("token");

    return $fetch("http://localhost:8000/api/organizacao", {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(form.empresa_id ? { empresa_id: form.empresa_id.id } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sort.sortOrder,
        sortName: sort.sortName,
      },
      headers: {
        Authorization: `Bearer ${cookie.value}`
      }
    });
  }
);

watch(
  data,
  (data) => {
    if (!data) return;

    organizacoes = data.data;

    console.log(organizacoes);
  },
  { immediate: true }
);

watch(
  pending,
  (pending) => {
    loaders.loading = pending;
  },
  { immediate: true }
);

watch(
  error,
  (error) => {
    if (!error) return;

    useToast({
      type: "error",
      message:
        error.data && error.data.message
          ? error.data.message
          : "Não foi possível listar as organizações",
    });
  },
  { immediate: true }
);

function buscarDados() {
  refresh();
}

// function buscarDados() {
//   loaders.loading = true;

//   const fetch = fetchApiProtected();

//   fetch("/organizacao", {
//     params: {
//       ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
//       ...(form.empresa_id ? { empresa_id: form.empresa_id.id } : {}),
//       ...(page ? { page: page.value } : {}),
//       sortOrder: sort.sortOrder,
//       sortName: sort.sortName,
//     },
//     lazy: false
//   })
//     .then((r) => {
//       if (!r.success) return;

//       organizacoes = r.data;
//     })
//     .catch((e) => {
//       useToast({
//         type: "error",
//         message: "Não foi possível listar os dados"
//       });
//     })
//     .finally(() => {
//       loaders.loading = false;
//     });
// }


// onMounted(() => {
//   buscarDados();
// });
</script>

<style scoped></style>
