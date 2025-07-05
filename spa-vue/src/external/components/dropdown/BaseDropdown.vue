<template>
  <div class="dropdown-container" :class="{ open: open }">
    <VDropdown
      :triggers="[]"
      :shown="open"
      :hide="!open"
      :autoHide="false"
      :distance="4"
      placement="bottom-start"
    >
      <BaseButton
        class="btn-action dropdown-btn"
        @click="toggle"
        v-click-away="fechar"
        :size="size"
      >
        <slot name="botao"></slot>
        <ArrowDownSolidIcon size="12px" color="#fff" />
      </BaseButton>

      <!-- This will be the content of the popover -->
      <template #popper>
        <div class="dropdown-botao" @click.stop="fechar">
          <slot name="acoes"></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { Dropdown } from 'floating-vue'
import { directive } from '../../directives/click-away'
import BaseButton from '../buttons/BaseButton.vue'
import ArrowDownSolidIcon from '../icons/ArrowDownSolidIcon.vue'
import { PropType } from 'vue'
type SizeButton = 'sm' | 'md' | 'lg'

export default {
  name: 'BaseDropdown',
  emits: ['onOpen', 'onClose'],
  props: {
    size: {
      type: String as PropType<SizeButton>,
      default: 'md'
    }
  },
  components: {
    VDropdown: Dropdown,
    BaseButton,
    ArrowDownSolidIcon
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
    }
  }
}
</script>

<style scoped>
.dropdown-container {
  display: inline-block;
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
  max-width: 232px;
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

  color: var(--color-primary-principal);
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

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  border: 1px solid var(--color-primary-principal-hover);
  background: none;
  color: var(--color-primary-principal);
}

.dropdown-btn svg {
  transition: rotate 100ms;
}

.dropdown-btn svg :deep(path) {
  fill: var(--color-primary-principal) !important;
}

.dropdown-btn:hover {
  background: #eff0f2 0% 0%;
}

.open .dropdown-btn {
  background: var(--color-primary-principal-focus);
  border: 1px solid transparent;
  color: #fff;
}

.open .dropdown-btn svg {
  rotate: 180deg;
}

.open .dropdown-btn svg :deep(path) {
  fill: #fff !important;
}
</style>
