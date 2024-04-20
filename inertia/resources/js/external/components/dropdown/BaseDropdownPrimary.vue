<template>
  <div class="dropdown-container" :class="{ open: open, 'dropdown-block': full }">
    <VDropdown
      :triggers="triggers"
      :shown="open"
      :hide="!open"
      :autoHide="false"
      :distance="4"
      placement="bottom-start"
      :auto-size="autoSize"
      v-bind="$attrs"
    >
      <div class="label-container" v-if="$slots.label">
        <slot name="label" v-if="$slots.label" @click.stop=""></slot>
      </div>
      <div class="label-container" v-if="label">
        <label>{{ label }}</label>
      </div>
      <BaseButtonPrimary
        class="btn-primary dropdown-btn"
        @click.stop.prevent="toggle"
        :size="size"
        :disabled="disabled"
        :full="full"
      >
        <slot name="botao"></slot>
        <svg
          v-if="icone"
          viewBox="0 0 330 330"
          xml:space="preserve"
          :style="{ height: '12px', width: '12px' }"
        >
          <path
            d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
            fill="#fff"
          />
        </svg>
      </BaseButtonPrimary>

      <!-- This will be the content of the popover -->
      <template #popper>
        <div
          v-if="$slots.acoes"
          class="dropdown-botao"
          @click.stop="fechar"
          :style="{ maxHeight: maxHeight }"
        >
          <slot name="acoes"></slot>
        </div>

        <div
          class="dropdown-conteudo"
          @click.stop=""
          v-if="$slots.conteudo"
          :style="{ maxHeight: maxHeight }"
        >
          <slot name="conteudo"></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { Dropdown } from 'floating-vue'
import { directive } from '../../directives/click-away'
import BaseButtonPrimary from '../buttons/BaseButtonPrimary.vue'
import { PropType } from 'vue'

type TriggerEvent = 'hover' | 'click' | 'focus' | 'touch'

export default {
  name: 'BaseDropdownPrimary',
  emits: ['onOpen', 'onClose'],
  inheritAttrs: false,
  props: {
    triggers: {
      type: Array as PropType<TriggerEvent[]>,
      default: () => []
    },
    size: {
      type: String,
      default: 'md'
    },
    icone: {
      type: Boolean,
      default: true
    },
    disabled: {
      default: false
    },
    maxHeight: {
      type: String,
      default: '400px'
    },
    label: {
      type: String,
      default: ''
    },
    full: {
      type: Boolean,
      default: false
    },
    autoSize: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VDropdown: Dropdown,
    BaseButtonPrimary
  },
  directives: {
    'click-away': directive
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    toggle() {
      this.open = !this.open

      this.$emit(this.open ? 'onOpen' : 'onClose')
    },
    fechar() {
      this.open = false
      this.$emit('onClose')
    },
    handleClick(event) {
      if (this.triggers.length > 0) return

      const clickNoBotao = event.target.closest('dropdown-btn')
      const clickNoDropdownAcoes = event.target.closest('dropdown-acoes')
      const clickDropdownConteudo = event.target.closest('dropdown-conteudo')

      if (clickNoBotao) this.open = false

      if (clickNoDropdownAcoes) this.open = false

      if (clickDropdownConteudo) return

      this.open = false
    }
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.handleClick)
  },
  mounted() {
    document.body.addEventListener('click', this.handleClick)
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;

  --label-color: var(--gray-color-400);
  --label-margin-bottom: 2px;

  /* cor usada para destaque no focus */
  --focus-color: var(--primary-color-principal-focus);

  /* espaçamento do texto/label */
  --padding-text: 16px;
}

:deep(label) {
  line-height: 24px;
  font-weight: 400;
  font-size: 0.75rem;

  color: var(--label-color);
  margin-bottom: var(--label-margin-bottom);
  display: block;
  padding-left: var(--padding-text);
}

.dropdown-container {
  display: inline-block;
}

.dropdown-block {
  display: block;
}

img {
  height: 24px;
  min-width: 24px;
  display: block;
  cursor: pointer;
}

.dropdown-botao {
  width: auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.dropdown-conteudo {
  overflow: auto;
}

.dropdown-botao::v-deep button,
.dropdown-botao::v-deep a {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  text-decoration: none;
  color: #444444;
  margin: 0;
  width: 100%;
  text-align: left;

  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--primary-color-principal);
  border-radius: 8px;
  outline: 0;
  flex-shrink: 0;
}

.dropdown-botao::v-deep button:hover,
.dropdown-botao::v-deep a:hover {
  background: #f2f2f2;
}

.dropdown-botao::v-deep button:focus-within,
.dropdown-botao::v-deep a:focus-within {
  background: #f2f2f2;
}

.dropdown-botao::v-deep button:disabled,
.dropdown-botao::v-deep a:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.dropdown-botao::v-deep img {
  height: 24px;
  width: 24px;
  margin-right: 8px;
  display: block;
}

.v-popper--shown .dropdown-btn > svg {
  transform: rotate(-180deg);
}

.btn {
  all: 'unset';
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  outline: 0;
  gap: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  position: relative;
}

.btn[data-loading='true'] {
  cursor: progress !important;
}

.btn :deep(.loader) {
  position: absolute;
  left: -21px;
  top: 50%;
  transform: translateY(-50%);
}

.btn-sm {
  font-size: 0.875rem;
  padding: 6px;
}

.btn-md {
  font-size: 0.875rem;
  padding: 10px 20px;
  min-height: 36px;
}

.btn-lg {
  font-size: 1rem;
  padding: 10px 20px;
  min-height: 42px;
}

.btn-min-width {
  min-width: 100px;
}

.btn-full {
  width: 100%;
}

.btn > span {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  outline: 0;
  gap: 10px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background: var(--primary-color-principal);
  color: #fff;
  border: 1px solid transparent;
}

.dropdown-btn svg {
  transition: rotate 100ms;
}

:global(.v-popper__inner) {
  background: #fff;
  color: black;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
}
</style>
