<template>
  <BaseModal
    :aberta="modalCriarOrganizacaoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.criacao_organizacao") }}</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="row-xxs">
          <div class="col-12 mb-sm">
            <BaseInput
              v-model="form.nome"
              :label="$t('palavras.nome') + '*'"
              :placeholder="$t('palavras.nome') + '*'"
            >
              <template v-slot:error v-if="v$.form.nome.$error">
                <p v-if="v$.form.nome.required.$invalid">
                  {{ $t("validacao.required", { field: $t("palavras.nome") }) }}
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6 mb-sm">
            <BaseInput
              v-model="form.email"
              :label="$t('palavras.email') + '*'"
              :placeholder="$t('palavras.email') + '*'"
              type="email"
            >
              <template v-slot:error v-if="v$.form.email.$error">
                <p v-if="v$.form.email.required.$invalid">
                  {{
                    $t("validacao.required", { field: $t("palavras.email") })
                  }}
                </p>
                <p v-if="v$.form.email.email.$invalid">
                  {{
                    $t("validacao.required", { field: $t("palavras.email") })
                  }}
                </p>
              </template>
            </BaseInput>
          </div>
          <div class="col-md-6 mb-sm">
            <BaseInput
              v-model="form.telefone"
              :label="$t('palavras.telefone')"
              :placeholder="$t('palavras.telefone')"
              type="text"
              v-mask="`+55 (##) ####-####`"
            />
          </div>
        </div>
        <div class="row-xxs">
          <div class="col-md-12 mb-sm">
            <BaseInput
              v-model="form.cep"
              :label="$t('palavras.cep')"
              :placeholder="$t('palavras.cep')"
              type="text"
              @change="tratarCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.endereco"
              :label="$t('palavras.endereco')"
              :placeholder="$t('palavras.endereco')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.bairro"
              :label="$t('palavras.bairro')"
              :placeholder="$t('palavras.bairro')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.numero"
              :label="$t('palavras.numero')"
              :placeholder="$t('palavras.numero')"
              type="number"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.complemento"
              :label="$t('palavras.complemento')"
              :placeholder="$t('palavras.complemento')"
              type="text"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.cidade"
              :label="$t('palavras.cidade')"
              :placeholder="$t('palavras.cidade')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
          <div class="col-md-4 mb-sm">
            <BaseInput
              v-model="form.estado"
              :label="$t('palavras.estado')"
              :placeholder="$t('palavras.estado')"
              type="text"
              :disabled="!pesquisouCep"
            />
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <BaseButtonPrimary @click.prevent="submit" :loading="loading">
        {{$t('palavras.salvar')}}
      </BaseButtonPrimary>
      <BaseButtonTertiary @click.prevent="fecharModal">
        {{$t('palavras.cancelar')}}
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
import { modalCriarOrganizacaoStore } from "../../stores/organizacao";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import axios from "axios";

export default {
  name: "ModalCriarOrganizacao",
  setup() {
    const modalCriarOrganizacaoState = modalCriarOrganizacaoStore();
    return {
      modalCriarOrganizacaoState,
      v$: useVuelidate(),
    };
  },
  components: {
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
        nome: "",
        email: "",
        telefone: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        cidade: "",
        estado: "",
      },
      pesquisouCep: false,
      config: false,
      loading: false,
      resultadoPesquisaEmpresa: [],
    };
  },
  validations() {
    return {
      form: {
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
    };
  },
  computed: {},
  methods: {
    tratarCep() {
      this.pesquisouCep = false;
      if (this.form.cep.length === 8) {
        axios
          .get(`https://viacep.com.br/ws/${this.form.cep}/json/`)
          .then((r) => {
            const { data } = r;

            if (data.erro) {
              this.pesquisouCep = true;
              this.$toast.open({
                type: "error",
                message: this.$t('textos.erro_encontrar_cep'),
              });
            }

            this.form.endereco = data.logradouro;
            this.form.complemento = data.complemento;
            this.form.bairro = data.bairro;
            this.form.cidade = data.localidade;
            this.form.estado = data.uf;
          })
          .catch(() => {
            this.pesquisouCep = true;
          });
      }
    },
    pesquisarEmpresa(pesquisa) {
      api
        .get(`/organizacao`, { params: { pesquisa: pesquisa } })
        .then((response) => {
          this.resultadoPesquisaEmpresa = response.data.data.data;
        });
    },
    carregarFormulario() {
      Object.assign(this.form, {
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
    },
    fecharModal() {
      this.v$.$reset();
      this.modalCriarOrganizacaoState.fechar();
      this.$emit("onClose");
    },
    async submit() {
      try {
        this.loading = true;

        const result = await this.v$.$validate();
        if (result) {
          const data = {
            ...this.form,
          };

          await api.post(`/organizacao`, data);

          this.fecharModal();
          this.modalCriarOrganizacaoState.onReload();
          this.loading = false;
        }
      } catch (e) {
        this.$laravelError(e, this.$t('textos.erro_cadastrar_organizacao'));
      } finally {
        this.loading = false;
      }
    },
  },
  beforeUnmount() {},
  created() {},
};
</script>

<style scoped></style>
