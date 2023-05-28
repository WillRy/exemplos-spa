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
      <BaseButtonTertiary
        class="dropdown-btn"
        @click.stop.prevent="toggle"
        :size="size"
        :disabled="disabled"
      >
        <slot name="botao"></slot>
        <ArrowDownSolidIcon size="12px" color="#fff" v-if="icone" />
      </BaseButtonTertiary>

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
import  BaseButtonTertiary  from "../buttons/BaseButtonTertiary.vue";

export default {
  name: "BaseDropdownTertiary",
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
    BaseButtonTertiary
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

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background: var(--tertiary-button-background);
  color: var(--tertiary-button-color);
  border: 1px solid var(--tertiary-button-border);
}

.dropdown-btn svg {
  transition: rotate 100ms;
}

.dropdown-btn svg :deep(path) {
  fill: var(--primary-color-principal);
}

.dropdown-btn:hover {
  background: var(--primary-color-50);
  color: var(--primary-color-principal-hover);
  border: 1px solid transparent;
}

.dropdown-btn:focus-within {
  color: var(--primary-color-principal-hover);
  border: 1px solid var(--primary-color-principal-hover);
  background: var(--primary-color-50);
}

.dropdown-btn:active {
  background: var(--tertiary-button-active-background);
  color: #fff;
  border: 1px solid transparent;
}

.dropdown-btn:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.dropdown-btn:deep(path) {
  fill: var(--tertiary-button-color);
}

.dropdown-btn:hover :deep(path) {
  fill: var(--tertiary-button-color);
}

.dropdown-btn.active :deep(path) {
  fill: #fff;
}

:global(.v-popper__inner) {
  background: #fff;
  color: black;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
}
</style>
