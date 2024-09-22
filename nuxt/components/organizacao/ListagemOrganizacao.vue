<template>
  <Box padding="0">
    <form @submit.prevent="pesquisar" class="mb-3 p-2">
      <div class="row align-items-end gy-1">
        <div class="col-md-4">
          <BaseInput label="Pesquisar" name="pesquisa" v-model="form.pesquisa" />
        </div>
        <div class="col-md-4">
          <BaseSelectAjax label="Tags" placeholder="Pesquisar por tags" v-model="form.tag_id" track-by="id"
            text-by="nome" :options="resultadoPesquisaTag.dados" @search-change="pesquisarEmpresa"
            noOptions="Pesquisa as suas tags" :empty="true" :remover="true" :multiple="true">
            <template v-slot:option="{ option }">
              <div class="custom-tag" :style="{
                background: option['cor_fundo'],
                color: option['cor_texto']
              }">
                {{ option['nome'] }}
              </div>
            </template>
            <template v-slot:tag="{ option }">
              <div class="custom-tag" :style="{
                background: option['cor_fundo'],
                color: option['cor_texto']
              }">
                {{ option['nome'] }}
              </div>
            </template>
          </BaseSelectAjax>
        </div>
        <div class="col-auto">
          <BaseButtonPrimary :loading="loading" type="submit">
            Pesquisar
          </BaseButtonPrimary>
        </div>
        <div class="col-auto ms-auto">
          <BaseButtonPrimary @click="abrirCriar"> Criar</BaseButtonPrimary>
        </div>
      </div>
    </form>

    <pre>
</pre>

    <Tabela :loading="loading" :colunas="[
      {
        nome: 'id',
        texto: 'ID'
      },
      {
        nome: 'nome',
        texto: 'Nome'
      },
      {
        nome: 'email',
        texto: 'E-mail'
      },
      {
        nome: 'telefone',
        texto: 'Telefone'
      },
      {
        nome: 'qtd_contatos',
        texto: 'Qtd. Contatos'
      },
      {
        nome: 'tags',
        texto: 'Tags',
        disabled: true
      },
      {
        nome: 'acoes',
        texto: '',
        disabled: true
      }
    ]" :dados="organizacoes.dados && organizacoes.dados.data" :sort-name="sortName" :sort-order="sortOrder"
      :total="organizacoes.dados && organizacoes.dados.total"
      :per-page="organizacoes.dados && organizacoes.dados.per_page"
      :current-page="organizacoes.dados && organizacoes.dados.current_page" :exibirPaginacao="true" @onSort="sortBy"
      @onPage="updatePagina" texto-empty="Não há dados">
      <template v-slot:colunas="{ dados }">
        <tr v-for="(dado, index) in dados" :key="index">
          <ColunaTabela>
            <span style="font-weight: bold; color: var(--primary-color-principal)">
              {{ dado.id }}
            </span>
          </ColunaTabela>
          <ColunaTabela>{{ dado.nome }}</ColunaTabela>
          <ColunaTabela>{{ dado.email }}</ColunaTabela>
          <ColunaTabela>{{ dado.telefone }}</ColunaTabela>
          <ColunaTabela>{{ dado.qtd_contatos }}</ColunaTabela>
          <ColunaTabela>
            <span class="custom-tag" v-for="tag in dado.tags" :key="tag.id" :style="{
              background: tag['cor_fundo'],
              color: tag['cor_texto']
            }">
              {{ tag.nome }}
            </span>
          </ColunaTabela>
          <ColunaTabela justify="flex-end" class="coluna-acoes">
            
            <BaseDropdownAction>
              <button @click="abrirEdicao(dado)">
                Editar
              </button>
              <button @click="abrirExclusao(dado)">
                Excluir
              </button>
              <button @click="abrirDetalhes(dado)">
                Detalhes
              </button>
            </BaseDropdownAction>
          </ColunaTabela>
        </tr>
      </template>
    </Tabela>

    <ModalCriarOrganizacao :aberta="criarOrganizacaoAberto" @onClose="criarOrganizacaoAberto = null"
      @onReload="buscarDados" />

    <ModalEditarOrganizacao :organizacao="organizacaoSendoEditado" @onClose="organizacaoSendoEditado = null"
      @onReload="buscarDados" />

    <ModalExcluirOrganizacao :organizacao="organizacaoSendoExcluido" @onClose="organizacaoSendoExcluido = null"
      @onReload="buscarDados" />

    <ModalDetalhesOrganizacao :organizacao="detalhesOrganizacao" @onClose="detalhesOrganizacao = null" />
  </Box>
</template>
<script setup>

const { backendAlertError } = useBackendAlert()


const form = reactive({
  pesquisa: '',
  tag_id: []
})
const sortName = ref('id')
const sortOrder = ref('desc')
const page = ref(1)
const organizacoes = reactive({
  dados: []
})
const resultadoPesquisaTag = reactive({
  dados: []
})

const detalhesOrganizacao = ref(false)
const criarOrganizacaoAberto = ref(false)
const organizacaoSendoEditado = ref(null)
const organizacaoSendoExcluido = ref(null)

const $fetchApi = useNuxtApp().$fetchApi



const id_tags = computed(() => form.tag_id ? form.tag_id.map((tag) => tag.id) : [])

const { data, status, error, refresh } = await useAsyncData(
  'organizacoes',
  () => {
    return $fetchApi('/organizacao', {
      params: {
        ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
        ...(id_tags.value ? { 'id_tags[]': id_tags.value } : {}),
        ...(page.value ? { page: page.value } : {}),
        sortOrder: sortOrder.value,
        sortName: sortName.value
      }
    })
  },
)

const loading = computed(() => status.value === 'pending')

watch(() => data.value, (value) => {
  if(!value) return;
  organizacoes.dados = value.data
}, { immediate: true });

watch(() => error.value, (value) => {
  if(!value) return;
  backendAlertError(value, 'Não foi possível exibir os dados!', null, {
    id: 'erro-organizacao'
  })
}, { immediate: true });




const pesquisarEmpresa = function (pesquisa) {
  $fetchApi(`/tag`, { params: { pesquisa: pesquisa } }).then((response) => {
    resultadoPesquisaTag.dados = response.data.data
  })
}

const abrirCriar = function () {
  criarOrganizacaoAberto.value = true
}

const abrirEdicao = function (usuario) {
  organizacaoSendoEditado.value = usuario
}

const abrirExclusao = function (usuario) {
  organizacaoSendoExcluido.value = usuario
}

const abrirDetalhes = function (usuario) {
  detalhesOrganizacao.value = usuario
}

const sortBy = function (ordem) {
  page.value = 1
  sortName.value = ordem.sortName
  sortOrder.value = ordem.sortOrder
  buscarDados()
}

const updatePagina = function (pagina) {
  page.value = pagina
  buscarDados()
}

const pesquisar = function () {
  page.value = 1
  buscarDados()
}

const buscarDados = function () {
  // loading.value = true

  refresh();

  // const id_tags = form.tag_id ? form.tag_id.map((tag) => tag.id) : []
  // $fetchApi('/organizacao', {
  //   params: {
  //     ...(form.pesquisa ? { pesquisa: form.pesquisa } : {}),
  //     ...(id_tags ? { 'id_tags[]': id_tags } : {}),
  //     ...(page.value ? { page: page.value } : {}),
  //     sortOrder: sortOrder.value,
  //     sortName: sortName.value
  //   }
  // })
  //   .then((r) => {
  //     organizacoes.dados = r.data
  //   })
  //   .catch((e) => {
  //     backendAlertError(e, 'Não foi possível exibir os dados!')
  //   })
  //   .finally(() => {
  //     loading.value = false
  //   })
}

</script>
<style scoped>
.custom-tag {
  box-sizing: border-box;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid var(--gray-400);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 4px;
}
</style>