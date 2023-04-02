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
          class="dropdown-btn"
          @click="toggle"
          v-click-away="fechar"
          :size="size"
      >
        <slot name="botao"></slot>
        <ArrowDownSolidIcon size="12px" color="#fff" v-if="icone"/>
      </BaseButton>

      <!-- This will be the content of the popover -->
      <template #popper="{ hide }">
        <div class="dropdown-botao" @click.stop="fechar">
          <slot name="acoes"></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script>
import {Dropdown} from "floating-vue";
import BaseButtonSecondary from "../buttons/BaseButtonSecondary.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon.vue";
import {directive} from "../../directives/click-away";
import BaseButton from "../buttons/BaseButton.vue";
import ArrowDownSolidIcon from "../icons/ArrowDownSolidIcon.vue";

export default {
  name: "BaseDropdownTertiary",
  emits: ["onOpen", "onClose"],
  props: {
    size: {
      type: String,
      default: "md",
    },
    icone: {
      type: Boolean,
      default: true,
    }
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

  color: var(--primary-color-400);
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

  background: none;
  color: var(--primary-color-400);
  border: 1px solid transparent;
}

.dropdown-btn svg {
  transition: rotate 100ms;
}

.dropdown-btn svg :deep(path) {
  fill: var(--primary-color-400);
}

.dropdown-btn:hover {
  background: var(--primary-color-50);
  color: var(--primary-color-300);
  border: 1px solid transparent;
}

.dropdown-btn:focus-within {
  color: var(--primary-color-300);
  border: 1px solid var(--primary-color-300);
  background: var(--primary-color-50);
}

.dropdown-btn:active {
  background: var(--primary-color-200);
  color: #fff;
  border: 1px solid transparent;
}


.dropdown-btn:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
  border: none;
}

.dropdown-btn:deep(.fill path) {
  fill: var(--primary-color-300);
}

.dropdown-btn:hover :deep(.fill path) {
  fill: #fff;
}

.dropdown-btn :deep(.stroke path) {
  stroke: var(--primary-color-300);
}

.dropdown-btn:hover :deep(.stroke path) {
  stroke: #fff;
}

.v-popper--theme-dropdown .v-popper__inner {
  background: #fff;
  color: black;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 30px rgba(0, 0, 0, .1);
}
</style>
