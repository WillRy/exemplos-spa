<template>
  <BaseModal
    :aberta="modalEditarContatoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>Edição de contato</h3>
    </template>
    <template #body>
      <Loader
        width="60px"
        height="60px"
        :cor-principal="true"
        v-if="loadingDados"
      ></Loader>
      <form @submit.prevent="submit" v-if="!loadingDados">
        <div class="row-xxs">
          <div class="col-12 mb-sm">
            <BaseSelectAjax
              label="Organização"
              placeholder="Pesquise as organizações"
              v-model="form.organizacao_id"
              track-by="id"
              text-by="nome"
              :options="resultadoPesquisaEmpresa"
              @search-change="pesquisarEmpresa"
              :clear="true"
              noOptions="Pesquise as organizações"
              :empty="false"
              :remover="true"
              :disabled="true"
            >
            </BaseSelectAjax>
          </div>
          <div class="col-12 mb-sm">
            <BaseInput v-model="form.nome" label="Nome *" placeholder="Nome">
              <template v-slot:error v-if="v$.nome.$error">
                <p v-if="v$.nome.required.$invalid">Informe o nome</p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6 mb-sm">
            <BaseInput
              v-model="form.email"
              label="E-mail *"
              placeholder="E-mail"
              type="email"
            >
              <template v-slot:error v-if="v$.email.$error">
                <p v-if="v$.email.required.$invalid">Informe o e-mail</p>
                <p v-if="v$.email.email.$invalid">
                  Informe um e-mail inválido
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6 mb-sm">
            <BaseInput
              v-model="form.telefone"
              label="Telefone"
              placeholder="Telefone"
              type="text"
              v-mask="`+55 (##) ####-####`"
            />
          </div>
        </div>
        <div class="row-xxs">
          <div class="col-md-12 mb-sm">
            <BaseInput
              v-model="form.cep"
              label="Cep "
              placeholder="cep"
              type="text"
              @change="tratarCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.endereco"
              label="Endereço"
              placeholder="endereco"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.bairro"
              label="Bairro"
              placeholder="bairro"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.numero"
              label="Numero"
              placeholder="numero"
              type="number"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.complemento"
              label="Complemento"
              placeholder="complemento"
              type="text"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.cidade"
              label="Cidade"
              placeholder="cidade"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.estado"
              label="Estado"
              placeholder="estado"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <BaseButtonPrimary @click.prevent="submit" :loading="loading">
        Editar
      </BaseButtonPrimary>
      <BaseButtonTertiary @click.prevent="fecharModal">
        Cancelar
      </BaseButtonTertiary>
    </template>
  </BaseModal>
</template>

<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { modalEditarContatoStore } from "../../store/contato";

const modalEditarContatoState = modalEditarContatoStore();

const form = reactive({
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
  organizacao_id: null,
});
const { value: v$ } = useVuelidate(
  {
    nome: { required },
    email: { email, required },
    telefone: {},
    cep: {},
    endereco: {},
    bairro: {},
    numero: {},
    complemento: {},
    cidade: {},
    estado: {},
    organizacao_id: {},
  },
  form
);

const pesquisouCep = ref(false);
const loading = ref(false);
const loadingDados = ref(false);

const resultadoPesquisaEmpresa = ref([]);

const $emit = defineEmits();

async function tratarCep() {
  try {
    pesquisouCep.value = false;

    if (form.cep.length === 8) {
      const data = await $fetch(`https://viacep.com.br/ws/${form.cep}/json/`);

      if (data.erro) {
        pesquisouCep = true;
        useCustomToast({
          type: "error",
          message: "Não foi possível encontrar o CEP",
        });
      }

      form.endereco = data.logradouro;
      form.complemento = data.complemento;
      form.bairro = data.bairro;
      form.cidade = data.localidade;
      form.estado = data.uf;
    }
  } catch (error) {
    pesquisouCep.value = true;
  }
}

async function pesquisarEmpresa(pesquisa) {
  try {
    const ajax = fetchApiProtected();
    const data = await ajax("/organizacao", {
      params: {
        pesquisa: pesquisa,
      },
    });
    resultadoPesquisaEmpresa = data.data.data;
  } catch (error) {
    useMessageApi(error, "Não foi possível listar as empresas");
  }
}

function fecharModal() {
  v$.$reset();
  modalEditarContatoState.fechar();
  $emit("onClose");
}

async function carregarFormulario() {
  try {
    loadingDados.value = true;

    const ajax = fetchApiProtected();
    const data = await ajax(`/contato/${modalEditarContatoState.payload.id}`);
    const dados = data.data;
    Object.assign(form, dados);
    form.organizacao_id = dados.organizacao;
  } catch (error) {
    useMessageApi(error, "Não foi possível carregar os dados");
    fecharModal();
  } finally {
    loadingDados.value = false;
  }
}

async function submit() {
  try {
    loading.value = true;

    const result = await v$.$validate();
    if (result) {
      const data = {
        ...form,
        organizacao_id: form.organizacao_id ? form.organizacao_id.id : null,
      };

      const ajax = fetchApiProtected();
      await ajax(`/contato/${modalEditarContatoState.payload.id}`, {
        method: 'put',
        body: data
      });

      fecharModal();
      modalEditarContatoState.onReload();
      loading.value = false;
    }
  } catch (error) {
    useMessageApi(error, "Não foi possível editar o contato!");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
