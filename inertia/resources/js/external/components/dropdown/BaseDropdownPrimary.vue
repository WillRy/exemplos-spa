<template>
  <div class="dropdown-container" :class="{ open: open }">
    <VDropdown
      :triggers="triggers"
      :shown="open"
      :hide="!open"
      :autoHide="false"
      :distance="4"
      placement="bottom-start"
      v-bind="$attrs"
    >
      <BaseButtonPrimary
        class="btn-primary dropdown-btn"
        @click.stop.prevent="toggle"
        :size="size"
        :disabled="disabled"
      >
        <slot name="botao"></slot>
        <ArrowDownSolidIcon size="12px" color="#fff" v-if="icone" />
      </BaseButtonPrimary>

      <!-- This will be the content of the popover -->
      <template #popper="{ hide }" v-if="$slots.acoes">
        <div class="dropdown-botao" @click.stop="fechar">
          <slot name="acoes"></slot>
        </div>
      </template>

      <template #popper="{ hide }" v-if="$slots.conteudo">
        <div class="dropdown-conteudo" @click.stop="">
          <slot name="conteudo"></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script>
import { Dropdown } from "floating-vue";
import BaseButtonSecondary from "../buttons/BaseButtonSecondary.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import { directive } from "../../directives/click-away";
import BaseButton from "../buttons/BaseButton.vue";
import ArrowDownSolidIcon from "../icons/ArrowDownSolidIcon.vue";
import  BaseButtonPrimary  from "../buttons/BaseButtonPrimary.vue";

export default {
  name: "BaseDropdownPrimary",
  emits: ["onOpen", "onClose"],
  inheritAttrs: false,
  props: {
    triggers: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: "md",
    },
    icone: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VDropdown: Dropdown,
    BaseButtonSecondary,
    ArrowDownIcon,
    BaseButton,
    ArrowDownSolidIcon,
    BaseButtonPrimary
},
  directives: {
    "click-away": directive,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;

      this.$emit(this.open ? "onOpen" : "onClose");
    },
    fechar() {
      this.open = false;
      this.$emit("onClose");
    },
    handleClick(event) {
      if (this.triggers.length > 0) return;

      const clickNoBotao = event.target.closest("dropdown-btn");
      const clickNoDropdownAcoes = event.target.closest("dropdown-acoes");
      const clickDropdownConteudo = event.target.closest("dropdown-conteudo");

      if (clickNoBotao) this.open = false;

      if (clickNoDropdownAcoes) this.open = false;

      if (clickDropdownConteudo) return;

      this.open = false;
    },
  },
  beforeUnmount() {
    document.body.removeEventListener("click", this.handleClick);
  },
  mounted() {
    document.body.addEventListener("click", this.handleClick);
  },
};
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

  color: var(--primary-color-principal);
  border-radius: 8px;
  outline: 0;
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
  all: "unset";
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

.btn[data-loading="true"] {
  cursor: progress !important;
}

.btn :deep(.loader) {
  position: absolute;
  left: -21px;
  top: 50%;
  transform: translateY(-50%);
}

.btn-sm {
  font-size: 14px;
  padding: 6px;
}

.btn-md {
  font-size: 14px;
  padding: 10px 20px;
  min-height: 36px;
}

.btn-lg {
  font-size: 16px;
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

  background: var(--primary-button-background);
  color: var(--primary-button-color);
  border: 1px solid transparent;
}

.dropdown-btn svg {
  transition: rotate 100ms;
}

.dropdown-btn svg :deep(path) {
  fill: #fff !important;
}

.dropdown-btn:hover {
  background: var(--primary-button-hover-background);
  color: var(--primary-button-hover-color);
}

.dropdown-btn:focus:not(:active) {
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px var(--primary-button-focus-shadow);
  background: var(--primary-button-focus-background);
  color: var(--primary-button-focus-color);
}

.dropdown-btn:active {
  background: var(--primary-button-active-background);
  color: var(--primary-button-active-color);
}

.dropdown-btn:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.dropdown-btn :deep(.fill path) {
  fill: #fff;
}

.dropdown-btn:hover :deep(.fill path) {
  fill: #fff;
}

.dropdown-btn :deep(.stroke path) {
  stroke: #fff;
}

.dropdown-btn:hover :deep(.stroke path) {
  stroke: #fff;
}

:global(.v-popper__inner) {
  background: #fff;
  color: black;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
}
</style>
