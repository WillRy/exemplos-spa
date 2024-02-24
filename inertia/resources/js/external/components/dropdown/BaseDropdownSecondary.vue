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
      <div class="label-container" v-if="$slots.label">
        <slot name="label" v-if="$slots.label" @click.stop=""></slot>
      </div>
      <div class="label-container" v-if="label">
        <label>{{ label }}</label>
      </div>
      <BaseButtonSecondary
        class="btn-primary dropdown-btn"
        @click.stop.prevent="toggle"
        :size="size"
        :disabled="disabled"
      >
        <slot name="botao"></slot>
        <ArrowDownSolidIcon size="12px" color="#fff" v-if="icone" />
      </BaseButtonSecondary>

      <!-- This will be the content of the popover -->
      <template #popper="{ hide }" v-if="$slots.acoes">
        <div
          class="dropdown-botao"
          @click.stop="fechar"
          :style="{ maxHeight: maxHeight }"
        >
          <slot name="acoes"></slot>
        </div>
      </template>

      <template
        #popper="{ hide }"
        v-if="$slots.conteudo"
        :style="{ maxHeight: maxHeight }"
      >
        <div class="dropdown-conteudo" @click.stop="">
          <slot name="conteudo"></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { Dropdown } from "floating-vue";
import BaseButtonSecondary from "../buttons/BaseButtonSecondary.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import { directive } from "../../directives/click-away";
import BaseButton from "../buttons/BaseButton.vue";
import ArrowDownSolidIcon from "../icons/ArrowDownSolidIcon.vue";
import { PropType } from "vue";

type TriggerEvent = 'hover' | 'click' | 'focus' | 'touch';

export default {
  name: "BaseDropdownSecondary",
  emits: ["onOpen", "onClose"],
  inheritAttrs: false,
  props: {
    triggers: {
      type: Array as PropType<TriggerEvent[]>,
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
      default: false,
    },
    maxHeight: {
      type: String,
      default: "400px",
    },
    label: {
      type: String,
      default: "",
    },
  },
  components: {
    VDropdown: Dropdown,
    BaseButtonSecondary,
    ArrowDownIcon,
    BaseButton,
    ArrowDownSolidIcon,
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

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  background: none;
  color: var(--primary-color-principal);
  border: 1px solid var(--primary-color-principal);
}

.dropdown-btn svg {
  transition: rotate 100ms;
}


:global(.v-popper__inner) {
  background: #fff;
  color: black;
  border-radius: 8px !important;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
}
</style>
