<template>
  <BaseModal
    :aberta="modalExcluirContatoState.open"
    @onClose="fecharModal"
    @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.exclusao_contato") }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"></Loader>
      <p v-else>{{ $t('textos.confirmar_excluir_contato') }} <strong>{{
          modalExcluirContatoState.payload.nome
        }}</strong>?</p>
    </template>
    <template #footerDireito>
      <BaseButtonTertiary @click.prevent="fecharModal">
        {{ $t('palavras.cancelar') }}
      </BaseButtonTertiary>
      <BaseButtonDanger @click.prevent="submit" :loading="loading">
        {{ $t('palavras.excluir') }}
      </BaseButtonDanger>
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
import {modalExcluirContatoStore} from "../../stores/contato";
import BaseButtonDanger from "../../external/components/buttons/BaseButtonDanger";

export default {
  name: "ModalExcluirContato",
  setup() {
    const modalExcluirContatoState = modalExcluirContatoStore();
    return {
      modalExcluirContatoState
    };
  },
  components: {
    BaseButtonDanger,
    BaseDate,
    BaseInput,
    BaseSelectAjax,
    BaseModal,
    BaseButtonTertiary,
    BaseButtonPrimary,
  },
  data() {
    return {
      loading: false,
      loadingDados: false
    }
  },
  computed: {},
  methods: {
    async carregarFormulario() {
      // this.loadingDados = true;

      // await api.get(`/contato/${this.modalExcluirContatoState.payload.id}`);

      // this.loadingDados = false;
      Object.assign(this.form, this.modalEditarContatoState.payload);
    },
    fecharModal() {
      this.modalExcluirContatoState.fechar()
      this.$emit("onClose");
    },
    async submit() {
      try {
        this.loading = true;
        await api.delete(`/contato/${this.modalExcluirContatoState.payload.id}`);

        this.fecharModal();
        this.modalExcluirContatoState.onReload();
        this.loading = false;

      } catch (e) {
        this.$laravelError(e, this.$t('textos.erro_excluir_contato'));
      } finally {
        this.loading = false;
      }
    },
  },
  beforeUnmount() {
  },
  created() {
  },
}
</script>

<style scoped>

</style>
