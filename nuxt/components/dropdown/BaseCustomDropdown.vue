<template>
    <div class="dropdown-container">
      <VDropdown
        :triggers="triggers"
        :popper-triggers="popperTriggers"
        :distance="4"
        placement="bottom-start"
        :auto-size="autoSize"
        :disabled="disabled"
        :auto-hide="autoHide"
        v-bind="$attrs"
      >
        <div class="dropdown-btn">
            <slot name="trigger"></slot>
        </div>

        <!-- This will be the content of the popover -->
        <template #popper="{hide}">
          <div
            v-if="$slots.acoes"
            class="dropdown-botao"
            :style="{ maxHeight: maxHeight }"
          >
            <slot name="acoes" :hide="hide"></slot>
          </div>
          
          <div class="dropdown-conteudo" @click.stop="" v-if="$slots.conteudo" :style="{ maxHeight: maxHeight }">
            <slot name="conteudo" :hide="hide"></slot>
          </div>
        </template>
      </VDropdown>
    </div>
  </template>
  
  <script lang="ts">
  import { Dropdown } from "floating-vue";
  import { directive } from "../../directives/click-away";
  import { PropType } from "vue";
  
  type TriggerEvent = 'hover' | 'click' | 'focus' | 'touch';
  type ModoDropdown = 'click' | 'hover';
  
  export default {
    name: "BaseDropdownPrimary",
    emits: ["onOpen", "onClose"],
    inheritAttrs: false,
    props: {
      modo: {
        type: String as PropType<ModoDropdown>,
        default: "click",
      }, 
      autoHide: {
        type: Boolean as PropType<boolean>,
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
      autoSize: {
        type: Boolean,
        default: false,
      }
    },
    components: {
      VDropdown: Dropdown,
    },
    directives: {
      "click-away": directive,
    },
    data() {
      return {
        open: false,
      };
    },
    computed: {
      triggers(): TriggerEvent[] {
        if (this.modo === "click") {
          return ["click"];
        }
        return ["hover", "focus"];
      },
      popperTriggers(): TriggerEvent[] {
        if (this.modo === "click") {
          return ["click"];
        }
        return ["hover", "focus"];
      },
    },
    methods: {
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
  
  
  :global(.v-popper__inner) {
    background: #fff;
    color: black;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  }
  </style>
  