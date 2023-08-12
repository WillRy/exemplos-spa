<template>
  <transition name="modal">
    <div
      v-if="aberta"
      :class="{ aberta: aberta, center: textCenter }"
      class="base-modal-container"
      @click.self="fecharModalClick"
    >
      <div
        class="base-modal"
        :class="tamanhoClass"
        data-modal=""
        v-drag="{ handle: '.base-modal-title' }"
      >
        <div
          v-if="$slots.title"
          class="base-modal-title"
          :style="{ padding: paddingHeader }"
        >
          <div
            v-if="exibirBtnFechar"
            class="btn-fechar-modal"
            @click="fecharModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="21"
              viewBox="0 0 24 21"
            >
              <path
                id="Icon_awesome-window-close"
                data-name="Icon awesome-window-close"
                d="M21.75,1.5H2.25A2.251,2.251,0,0,0,0,3.75v16.5A2.251,2.251,0,0,0,2.25,22.5h19.5A2.251,2.251,0,0,0,24,20.25V3.75A2.251,2.251,0,0,0,21.75,1.5ZM17.831,15.117a.577.577,0,0,1,0,.816l-1.9,1.9a.577.577,0,0,1-.816,0L12,14.686,8.883,17.831a.577.577,0,0,1-.816,0l-1.9-1.9a.577.577,0,0,1,0-.816L9.314,12,6.169,8.883a.577.577,0,0,1,0-.816l1.9-1.9a.577.577,0,0,1,.816,0L12,9.314l3.117-3.145a.577.577,0,0,1,.816,0l1.9,1.9a.577.577,0,0,1,0,.816L14.686,12l3.145,3.117Z"
                transform="translate(0 -1.5)"
                fill="#f55b5b"
              />
            </svg>
          </div>

          <slot name="title"></slot>
        </div>

        <div class="base-modal-breadcrumb" v-if="$slots.breadcrumb">
          <slot name="breadcrumb"></slot>
        </div>
        <div class="base-modal-separator" v-else></div>

        <div class="base-modal-body" :style="{ padding: paddingBody }">
          <slot name="body"></slot>
        </div>

        <div class="base-modal-footer" :style="{ padding: paddingFooter }">
          <div class="footerEsquerdo" v-if="$slots.footerEsquerdo">
            <slot name="footerEsquerdo"> </slot>
          </div>

          <div class="footerDireito" v-if="$slots.footerDireito">
            <slot name="footerDireito"> </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import CloseIcon from "../icons/CloseIcon.vue";

export default {
  name: "BaseModal",
  components: { CloseIcon },
  props: {
    paddingHeader: {
      type: String,
      default: "20px 20px 0px 20px",
    },
    paddingBody: {
      type: String,
      default: "0px 20px 20px 20px",
    },
    paddingFooter: {
      type: String,
      default: "20px",
    },
    aberta: {
      type: Boolean,
      default: false,
    },
    fecharClickOutside: {
      type: Boolean,
      default: true,
    },
    exibirBtnFechar: {
      type: Boolean,
      default: true,
    },
    textCenter: {
      type: Boolean,
      default: false,
    },
    tamanho: {
      default: "sm",
      validator(value) {
        return ["sm", "md", "lg", "xl", "xxl"].includes(value);
      },
    },
  },
  watch: {
    aberta(valor) {
      if (valor) {
        this.$emit("onOpen");
      }
    },
  },
  computed: {
    tamanhoClass() {
      switch (this.tamanho) {
        case "sm":
          return "modal-sm";
        case "md":
          return "modal-md";
        case "lg":
          return "modal-lg";
        case "xl":
          return "modal-xl";
        case "xxl":
          return "modal-xxl";
        default:
          return "modal-sm";
      }
    },
  },
  data() {
    return {
      handleClickOutside: null,
    };
  },
  methods: {
    fecharModal() {
      this.$emit("onClose");
    },
    fecharModalClick() {
      if (this.fecharClickOutside) {
        this.$emit("onClose");
      }
    },
    onEnter(e) {
      if (e.key === "Enter" && this.aberta) {
        this.$emit("onEnter");
      }
    },
    onEsc(e) {
      if ((e.key === "Escape" || e.key === "Esc") && this.aberta) {
        this.$emit("onEsc");
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onEnter);
    window.removeEventListener("keyup", this.onEsc);
  },
  created() {
    window.addEventListener("keyup", this.onEnter);
    window.addEventListener("keyup", this.onEsc);
  },
};
</script>
<style>
.footerEsquerdo {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-right: auto;
}

.footerDireito {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-left: auto;
}

.base-modal-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  z-index: var(--z-index-4);
  height: 100vh;
  width: 100vw;

  overflow-y: auto;
  overflow-x: hidden;

  background: rgba(51, 47, 47, 0.42);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border: 1px solid rgba(51, 47, 47, 0.31);
}

.base-modal {
  border-radius: 8px;
  background: #fff;
  /* width: 650px; */
  margin: 120px 0;
  max-width: 650px;
  width: 65vw;
}

.base-modal.modal-sm {
  max-width: 650px;
  width: 65vw;
}

.base-modal.modal-md {
  max-width: 850px;
  width: 85vw;
}

.base-modal.modal-lg {
  max-width: 950px;
  width: 95vw;
}

.base-modal.modal-xl {
  max-width: 1200px;
  width: 100%;
}

.base-modal.modal-xxl {
  max-width: 1600px;
  width: 100%;
}

.base-modal-container.lg .base-modal {
  max-width: 920px;
  width: 100%;
}

@media all and (max-width: 620px) {
  .base-modal {
    width: 90%;
  }
}

.base-modal-title {
  position: relative;
}

.base-modal-title h3 {
  margin: 0;
  color: var(--primary-color-principal);
  font-size: 20px;
  word-break: break-word;
  line-height: 24px;
  font-weight: bold;
}

.base-modal .base-modal-body {
  word-break: break-word;
}

.center .base-modal-body {
  text-align: center;
}

.base-modal .base-modal-footer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /*justify-content: center;*/

  /*display: grid;*/
  /*grid-template-columns: repeat(auto-fit, minmax(156px, max-content));*/
  /*justify-content: center;*/
  /*gap: 16px;*/
}

/* display: grid; */
/* grid-template-columns: repeat(auto-fit, minmax(156px, 33%));

}

/*.base-modal .base-modal-footer > *:not(:last-child) {*/
/*    margin-right: 16px;*/
/*}*/

/*.base-modal .base-modal-footer > * {*/
/*    margin-bottom: 16px;*/
/*}*/

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .base-modal {
  animation: modalEffect 0.3s;
}

@keyframes modalEffect {
  0% {
    opacity: 0;
    transform: translateZ(-20px);
  }

  to {
    opacity: 1;
    transform: translateZ(0px);
  }
}

.btn-fechar-modal {
  cursor: pointer;
  display: block;
  position: absolute;
  top: 15px;
  right: 15px;
  height: 20px;
  width: 20px;
}

.btn-fechar-modal:before {
  right: 6px;
  transform: rotate(45deg);
}

.btn-fechar-modal:hover {
  opacity: 0.6;
}

.base-modal-separator {
  margin: 0;
  height: 1px;
  width: 100%;
  background: #eff0f2;
  margin: 24px 0;
}

.base-modal-breadcrumb {
  padding-bottom: 20px;
  padding-top: 20px;
}
</style>
