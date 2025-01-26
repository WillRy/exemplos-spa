<template>
  <div class="errorMessage" :class="{ 'input-mode': inputMode }">
    <InfoErrorIcon size="14px" class="icone-footer" v-if="exibirIcone" />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";

export default {
  name: "ActionText",
  components: {
    InfoErrorIcon,
  },
  props: {
    exibirIcone: {
      type: Boolean,
      default: true,
    },
    inputMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.info {
  display: flex;
}

.errorMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--error-color-600);
  padding-left: var(--padding-text);
}

.errorMessage > svg {
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
