<template>
  <div class="legenda">
    <InfoSuccessIcon size="14px" class="icone-footer" v-if="exibirIcone" />
    <slot></slot>
  </div>
</template>

<script>
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";
import InfoInputIcon from "../icons/InfoInputIcon.vue";
import InfoSuccessIcon from "../icons/InfoSuccessIcon.vue";
import CaptionText from "../text/CaptionText.vue";

export default {
  name: "ActionText",
  components: {
    InfoSuccessIcon,
    CaptionText,
  },
  props: {
    exibirIcone: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.info {
  display: flex;
}

.legenda {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--success-color-600);
  padding-left: var(--padding-text);
}

.legenda > svg {
  flex-shrink: 0;
  width: 14px;
  margin-right: 8px;
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}
</style>
