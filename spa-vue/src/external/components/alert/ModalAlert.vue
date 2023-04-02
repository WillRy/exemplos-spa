<template>
  <BaseModal
      :aberta="alert"
      @onClose="fecharModal"
      @onOpen=""
      :class="{ alertError: alert.tipo === 'error' }"
  >
    <template #title>
      <h3 v-html="alert.title"></h3>
    </template>
    <template #body>
      <div v-html="alert.mensagem"></div>
    </template>
    <template #footerDireito>
      <BaseButtonPrimary
          :min="true"
          @click.prevent="fecharModal"
          v-if="alert.tipo !== 'error'"
      >
        {{ alert.textoBtn }}
      </BaseButtonPrimary>
      <BaseButtonDanger
          :min="true"
          @click.prevent="fecharModal"
          v-if="alert.tipo == 'error'"
      >
        {{ alert.textoBtn }}
      </BaseButtonDanger>
    </template>
  </BaseModal>
</template>

<script>
import {useAlertStore} from "../../store/alert";
import BaseButtonDanger from "../buttons/BaseButtonDanger.vue";
import BaseButtonPrimary from "../buttons/BaseButtonPrimary.vue";
import BaseModal from "../modal/BaseModal.vue";

export default {
  name: "ModalAlert",
  components: {
    BaseModal,
    BaseModal,
    BaseButtonPrimary,
    BaseButtonDanger,
    BaseButtonDanger,
  },
  props: {
    alert: Object,
  },
  setup() {
    const alertState = useAlertStore();
    return {alertState};
  },
  data() {
    return {};
  },
  methods: {
    fecharModal() {
      this.alertState.removeAlert(this.alert.id);
    },
  },
};
</script>

<style scoped>
.alertError :deep(.base-modal-title h3) {
  color: var(--error-color-500);
}
</style>
