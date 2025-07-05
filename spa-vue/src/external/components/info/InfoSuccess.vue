<template>
  <div class="successMessage" :class="{ 'input-mode': inputMode }">
    <InfoSuccessIcon size="14px" class="icone-footer" v-if="exibirIcone" />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue'

export default {
  name: 'ActionText',
  components: {
    InfoSuccessIcon
  },
  props: {
    exibirIcone: {
      type: Boolean,
      default: true
    },
    inputMode: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.info {
  display: flex;
}

.successMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--color-success-600);
  padding-left: var(--padding-text);
}

.successMessage > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.input-mode {
  padding-left: 16px;
  margin-top: var(--spacing-1);
}
</style>
