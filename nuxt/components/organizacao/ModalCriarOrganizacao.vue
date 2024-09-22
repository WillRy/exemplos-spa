<template>
  <BaseModal :aberta="aberta" @onClose="fecharModal" @onOpen="carregarFormulario">
    <template #title>
      <h3>Criar Organização</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="row mb-3 gy-3">
          <div class="col-12">
            <BaseInput v-model="nome" label="Nome *" :error="errors.nome"></BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput v-model="email" label="E-mail" type="email" :error="errors.email"></BaseInput>
          </div>
          <div class="col-md-6">
            <BaseInput v-model="telefone" label="Telefone" type="text" v-mask="`+55 (##) ####-####`" />
          </div>
        </div>
        <div class="row mb-3 gy-3">
          <div class="col-md-12">
            <BaseInput v-model="cep" label="CEP" type="text" @change="tratarCep" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="endereco" label="Endereço" type="text" :disabled="!pesquisouCep" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="bairro" label="Bairro" type="text" :disabled="!pesquisouCep" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="numero" label="Número" type="number" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="complemento" label="Complemento" type="text" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="cidade" label="Cidade" type="text" :disabled="!pesquisouCep" />
          </div>
          <div class="col-md-4">
            <BaseInput v-model="estado" label="Estado" type="text" :disabled="!pesquisouCep" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <BaseSelectAjax label="Tags" v-model="tags" track-by="id" text-by="nome"
              :options="resultadoPesquisaTag.lista" @search-change="pesquisarTag" noOptions="Pesquisas as tags"
              :empty="true" :remover="true" :multiple="true">
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
        </div>
      </form>
    </template>
    <template #footerDireito>
      <BaseButtonTertiary @click.prevent="fecharModal">
        Cancelar
      </BaseButtonTertiary>
      <BaseButtonPrimary @click.prevent="submit" :loading="loading">
        Salvar
      </BaseButtonPrimary>
    </template>
  </BaseModal>
</template>

<script setup>
import * as yup from 'yup'
import { useForm } from 'vee-validate'

defineProps({
  aberta: {
    type: Boolean,
    default: false
  }
})

const $emit = defineEmits(['onClose', 'onReload'])
const { backendAlertError } = useBackendAlert()

const $fetchApi = useNuxtApp().$fetchApi;


const pesquisouCep = ref(false)
const loading = ref(false)
const resultadoPesquisaTag = reactive({
  lista: []
})

const { errors, validate, defineField, resetForm, values, setErrors } = useForm({
  validationSchema: yup.object({
    nome: yup.string().required('Informe o nome'),
    email: yup
      .string()
      .email('Informe um e-mail válido')
      .required('Informe o e-mail'),
  }),
  initialValues: {
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    teste: '',
    tags: []
  }
})
const [nome] = defineField('nome')
const [email] = defineField('email')
const [telefone] = defineField('telefone')
const [cep] = defineField('cep')
const [endereco] = defineField('endereco')
const [numero] = defineField('numero')
const [complemento] = defineField('complemento')
const [cidade] = defineField('cidade')
const [estado] = defineField('estado')
const [bairro] = defineField('bairro')
const [tags] = defineField('tags')

const carregarFormulario = function () {
  resetForm()
}

const tratarCep = function () {
  pesquisouCep.value = false
  if (cep.value.length === 8) {
    $fetchApi(`https://viacep.com.br/ws/${cep.value}/json/`)
      .then((r) => {
        const { data } = r

        if (data.erro) {
          pesquisouCep.value = true
          return false;
        }

        endereco.value = data.logradouro
        complemento.value = data.complemento
        bairro.value = data.bairro
        cidade.value = data.localidade
        estado.value = data.uf
      })
      .catch(() => {
        pesquisouCep.value = true
      })
  }
}

const pesquisarTag = function (pesquisa) {
  $fetchApi(`/tag`, { params: { pesquisa: pesquisa } }).then((response) => {
    resultadoPesquisaTag.lista = response.data.data.data
  })
}

const fecharModal = function () {
  resetForm()
  $emit('onClose')
}

const submit = async function () {
  try {
    loading.value = true

    const result = await validate()
    if (!result.valid) {
      return
    }

    const data = {
      ...values
    }

    await $fetchApi(`/organizacao`, {
      method: 'POST',
      body: data
    })

    fecharModal()


    $emit('onReload')
  } catch (e) {
    const errors = backendAlertError(e, 'Não foi possível salvar a organização!')
    setErrors(errors)
  } finally {
    loading.value = false
  }
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