<template>
  <div class="alert-container">
    <ModalAlert v-for="alert in alertState.alerts" :key="alert.id" :alert="alert" />
  </div>
</template>

<script>
import ModalAlert from './ModalAlert.vue'
import { useAlertStore } from '../../store/alert'

export default {
  name: 'ModalAlertContainer',
  components: { ModalAlert },
  setup() {
    const alertState = useAlertStore()
    return { alertState }
  }
}
</script>

<style scoped></style>
