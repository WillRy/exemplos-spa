<template>
  <div
    class="check-container"
    :class="{ error: error, checked: checked, disabled: disabled }"
  >
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>

    <label>
      <ActionText size="sm" v-if="label">{{ label }}</ActionText>
      <input
        ref="checkbox"
        v-bind="$attrs"
        :checked="checkedNormalizado"
        :disabled="disabled"
        class="check"
        type="checkbox"
        @click.stop="updateValue"
      />

      <div class="checktoggle"></div>
    </label>

    <div v-if="$slots.legenda || legenda" class="legenda">
      <InfoInputIcon size="14px"  class="icone-footer"/>
      <slot name="legenda" v-if="$slots.legenda"></slot>
      <template v-else>{{ legenda }}</template>
    </div>
    <div v-if="$slots.success || success" class="successMessage">
      <InfoSuccessIcon size="14px"  class="icone-footer"/>
      <slot name="success" v-if="$slots.success"></slot>
      <template v-else>{{ success }}</template>
    </div>
    <div v-if="$slots.error || error" class="errorMessage">
      <InfoErrorIcon size="14px"  class="icone-footer"/>
      <slot name="error" v-if="$slots.error"></slot>
      <template v-else>{{ error }}</template>
    </div>
  </div>
</template>

<script>
import InfoErrorIcon from "../icons/InfoErrorIcon.vue";
import InfoInputIcon from "../icons/InfoInputIcon.vue";
import InfoSuccessIcon from "../icons/InfoSuccessIcon.vue";
import ActionText from "../text/ActionText.vue";

export default {
  name: "BaseToggle",
  inheritAttrs: false,
  emits: ['toggle'],
  components: { InfoInputIcon, InfoSuccessIcon, InfoErrorIcon, ActionText },
  props: {
    error: {
      type: String,
    },
    success: {
      type: String,
    },
    legenda: {
      type: String,
    },
    checked: {
      type: [Boolean, String],
    },
    disabled: Boolean,
    label: String,
    on: {
      type: String,
      default: "ON",
    },
    off: {
      type: String,
      default: "OFF",
    },
  },
  computed: {
    checkedNormalizado() {
      if (
        (typeof this.checked === "string" && this.checked === "S") ||
        (typeof this.checked === "boolean" && this.checked)
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    updateValue() {
      if (this.disabled) return;
      let valor = !this.checkedNormalizado;
      console.log(valor);
      this.$emit("toggle", valor);
    },
  },
  created() {
  },
};
</script>

<style scoped>
:deep(label) {
  line-height: 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}

.legenda {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--gray-400);
  padding-left: var(--padding-text);
}

.legenda > svg {
    flex-shrink: 0;
    width: 14px;
    margin-right: 8px;
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

.successMessage {
  display: flex;
  font-size: 0.75rem;
  line-height: 0.9975rem;
  font-weight: normal;
  margin: 0;
  font-style: italic;
  color: var(--success-color-600);
  padding-left: var(--padding-text);
}


.successMessage > svg {
    flex-shrink: 0;
    width: 14px;
    margin-right: 8px;
}

.check-container {
  position: relative;
}

.check-container .on {
  visibility: hidden;
  color: #fff;
  font-size: 0.75rem;
  line-height: 0;
  user-select: none;
  margin-left: 12px;
}

.check-container .off {
  visibility: hidden;
  color: #a3a3a3;
  font-size: 0.75rem;
  line-height: 0;
  user-select: none;
  margin-right: 12px;
}

.check {
  display: block;
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

.check:disabled + .checktoggle {
  opacity: 0.4;
  cursor: not-allowed;
}

.check:checked + .checktoggle {
  background-color: var(--primary-color-principal);
  box-shadow: none;
}

.checktoggle {
  background-color: var(--gray-300);
  color: #bbbfc4;
  border-radius: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0;

  margin-bottom: 0;
  position: relative;
  width: 52px;
  height: 28px;

  justify-content: space-between;
}

.checktoggle:after {
  box-shadow: 0px 3px 6px #00000029;

  content: " ";
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(5px, -50%);
  width: 22px;
  height: 22px;
  background-color: #fff;
  border-radius: 50%;
  transition: left 300ms ease, transform 300ms ease;
}

.check:checked + .checktoggle:after {
  background-color: #fff;
  left: 100%;
  transform: translate(calc(-100% - 5px), -50%);
}

.visible {
  visibility: visible !important;
}
</style>
