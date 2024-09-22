<template>
    <BaseModal :aberta="organizacao" @onClose="fecharModal" @onOpen="carregarFormulario">
      <template #title>
        <h3>Detalhes da Organização</h3>
      </template>
      <template #body>
        <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
        <div v-if="!loadingDados">
          <div class="row gy-1">
            <div class="col-md-6">
              <p>
                <strong>Nome: </strong> {{ form.nome }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>E-mail: </strong>{{ form.email }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Telefone:</strong> {{ form.telefone }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>CEP: </strong> {{ form.cep }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Endereço</strong
                >: {{ form.endereco }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Bairro:</strong> {{ form.bairro }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Número:</strong> {{ form.numero }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Complemento:</strong> {{ form.complemento }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Cidade:</strong> {{ form.cidade }}
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Estado:</strong> {{ form.estado }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <template #footerDireito>
        <BaseButtonTertiary @click.prevent="fecharModal">
          Fechar
        </BaseButtonTertiary>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  
  const props = defineProps({
    organizacao: {
      default: null
    }
  })
  
  const $emit = defineEmits(['onClose', 'onReload'])
  
  
  const form = reactive({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    organizacao_id: null
  })
  const loadingDados = ref(false)
  
  const carregarFormulario = async function () {
    Object.assign(form, props.organizacao)
  }
  
  const fecharModal = function () {
    $emit('onClose')
  }
  </script>
  
  <style scoped></style>
  