<template>
  <BaseModal
      :aberta="modalExcluirTagState.open"
      @onClose="fecharModal"
      @onOpen="carregarFormulario"
  >
    <template #title>
      <h3>{{ $t("textos.exclusao_tag") }}</h3>
    </template>
    <template #body>
      <Loader width="60px" height="60px" :cor-principal="true" v-if="loadingDados"/>
      <p v-else>
        {{ $t('textos.confirmar_excluir_tag') }}
        <strong>{{ modalExcluirTagState.payload.nome }}</strong>?
      </p>
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
import BaseButtonDanger from "../../external/components/buttons/BaseButtonDanger";
import {modalExcluirTagStore} from "../../stores/tag";

export default {
  name: "ModalExcluirOrganizacao",
  setup() {
    const modalExcluirTagState = modalExcluirTagStore();
    return {
      modalExcluirTagState
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
      this.loadingDados = true;

      await api.get(`/tag/${this.modalExcluirTagState.payload.id}`);

      this.loadingDados = false;
    },
    fecharModal() {
      this.modalExcluirTagState.fechar()
      this.$emit("onClose");
    },
    async submit() {
      try {
        this.loading = true;
        await api.delete(`/tag/${this.modalExcluirTagState.payload.id}`);

        this.fecharModal();
        this.modalExcluirTagState.onReload();
        this.loading = false;

      } catch (e) {
        this.$laravelError(e, $t('textos.erro_excluir_tag'));
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
