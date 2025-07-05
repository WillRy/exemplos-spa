<template>
  <div class="check-container" :class="{ error: error, checked: modelValue, disabled: disabled }">
    <div class="label-container" v-if="$slots.label">
      <slot name="label" v-if="$slots.label" @click.stop=""></slot>
    </div>

    <label>
      <ActionText size="sm" v-if="label">{{ label }}</ActionText>
      <input
        ref="checkbox"
        v-bind="$attrs"
        :disabled="disabled"
        class="check"
        type="checkbox"
        v-model="valor"
      />

      <div class="checktoggle"></div>
    </label>

    <div v-if="$slots.legenda || legenda" class="legenda">
      <InfoInputIcon size="14px" class="icone-footer" />
      <slot name="legenda" v-if="$slots.legenda"></slot>
      <template v-else>{{ legenda }}</template>
    </div>
    <div v-if="$slots.success || success" class="successMessage">
      <InfoSuccessIcon size="14px" class="icone-footer" />
      <slot name="success" v-if="$slots.success"></slot>
      <template v-else>{{ success }}</template>
    </div>
    <div v-if="$slots.error || error" class="errorMessage">
      <InfoErrorIcon size="14px" class="icone-footer" />
      <slot name="error" v-if="$slots.error"></slot>
      <template v-else>{{ error }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InfoErrorIcon from '../icons/InfoErrorIcon.vue'
import InfoInputIcon from '../icons/InfoInputIcon.vue'
import InfoSuccessIcon from '../icons/InfoSuccessIcon.vue'
import ActionText from '../text/ActionText.vue'

defineOptions({
  name: 'BaseToggle',
  inheritAttrs: false
})

const props = defineProps({
  error: {
    type: String
  },
  success: {
    type: String
  },
  legenda: {
    type: String
  },
  disabled: Boolean,
  label: String,
  on: {
    type: String,
    default: 'ON'
  },
  off: {
    type: String,
    default: 'OFF'
  },
  modelValue: {
    type: [Boolean, String],
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const checkbox = ref<HTMLInputElement | null>(null)

const valor = computed({
  get() {
    if (
      (typeof props.modelValue === 'string' && props.modelValue === 'S') ||
      (typeof props.modelValue === 'boolean' && props.modelValue)
    ) {
      return true
    }
    return false
  },
  set(value: boolean) {
    if (props.disabled) return

    emit('update:modelValue', value)
  }
})

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
  color: var(--color-gray-400);
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
  color: var(--color-error-600);
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
  color: var(--color-success-600);
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
  background-color: var(--color-primary-principal);
  box-shadow: none;
}

.checktoggle {
  background-color: var(--color-gray-200);
  color: #bbbfc4;
  border-radius: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0;
  margin-bottom: 0;
  position: relative;
  width: 68px;
  height: 36px;
  justify-content: space-between;
}

.checktoggle:after {
  box-shadow: 0px 3px 6px #00000029;

  content: ' ';
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(5px, -50%);
  width: 22px;
  height: 22px;
  background-color: #fff;
  border-radius: 50%;
  transition:
    left 300ms ease,
    transform 300ms ease;
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
