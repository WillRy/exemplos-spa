<template>
  <div class="dropdown-container">
    <VDropdown
      :triggers="[]"
      :distance="6"
      :shown="open"
      :hide="!open"
      :autoHide="false"
    >
      <BaseButtonSecondary @click="open = !open" class="dropdown-btn" v-click-away="fechar" :size="size">
        <slot name="botao"></slot>
        <ArrowDownIcon size="12px"/>
      </BaseButtonSecondary>

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
import { Dropdown } from "floating-vue";
import BaseButtonSecondary from "../buttons/BaseButtonSecondary.vue";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import {directive} from '../../directives/click-away'
export default {
  name: "BaseDropdown",
  props: {
    size: {
        type: String,
        default: 'md'
    }
  },
  components: {
    VDropdown: Dropdown,
    BaseButtonSecondary,
    ArrowDownIcon,
  },
  directives: {
    'click-away': directive
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    fechar() {
      this.open = false;
    },
    emitir() {
      this.$emit("remover");
      this.fechar();
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
}

.dropdown-botao::v-deep button:hover,
.dropdown-botao::v-deep a:hover {
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
</style>
