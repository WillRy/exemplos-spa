<template>
  <transition name="modal">
    <div v-if="aberta"
      :class="[{ aberta: aberta, 'center-modal': textCenter, 'full-h': ocuparAlturaMaxima,  }, mode]"
      class="base-modal-container" @click.self="fecharModalClick" ref="modal">
      <div class="base-modal" :class="tamanhoClass" data-modal="" :style="[]">
        <div v-if="$slots.title" class="base-modal-title" :style="{ padding: paddingHeader }">
          <div v-if="exibirBtnFechar" class="btn-fechar-modal" @click="fecharModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21">
              <path id="Icon_awesome-window-close" data-name="Icon awesome-window-close"
                d="M21.75,1.5H2.25A2.251,2.251,0,0,0,0,3.75v16.5A2.251,2.251,0,0,0,2.25,22.5h19.5A2.251,2.251,0,0,0,24,20.25V3.75A2.251,2.251,0,0,0,21.75,1.5ZM17.831,15.117a.577.577,0,0,1,0,.816l-1.9,1.9a.577.577,0,0,1-.816,0L12,14.686,8.883,17.831a.577.577,0,0,1-.816,0l-1.9-1.9a.577.577,0,0,1,0-.816L9.314,12,6.169,8.883a.577.577,0,0,1,0-.816l1.9-1.9a.577.577,0,0,1,.816,0L12,9.314l3.117-3.145a.577.577,0,0,1,.816,0l1.9,1.9a.577.577,0,0,1,0,.816L14.686,12l3.145,3.117Z"
                transform="translate(0 -1.5)" fill="#f55b5b" />
            </svg>
          </div>

          <slot name="title"></slot>
        </div>

        <div class="base-modal-breadcrumb" v-if="$slots.breadcrumb">
          <slot name="breadcrumb"></slot>
        </div>
        <div class="base-modal-separator" v-else-if="$slots.title"></div>

        <div class="base-modal-body" :style="[{ padding: paddingBody }, ]">
          <slot name="body"></slot>
        </div>

        <div class="base-modal-footer" :style="{ padding: paddingFooter }"
          v-if="$slots.footerEsquerdo || $slots.footerDireito">
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
<script lang="ts">
import { PropType } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type ModalMode = 'scroll-body' | 'scroll-body-full' | 'full-no-scroll' | 'scroll-outside'

export default {
  name: 'BaseModal',
  components: {},
  inheritAttrs: false,
  props: {
    paddingHeader: {
      type: String,
      default: '20px 20px 20px 20px'
    },
    paddingBody: {
      type: String,
      default: '20px 20px 20px 20px'
    },
    paddingFooter: {
      type: String,
      default: '20px'
    },
    aberta: {
      default: false,
      type: [Boolean, String, Number, Object]
    },
    fecharClickOutside: {
      type: Boolean,
      default: true
    },
    exibirBtnFechar: {
      type: Boolean,
      default: true
    },
    textCenter: {
      type: Boolean,
      default: false
    },
    tamanho: {
      type: String as PropType<ModalSize>,
      default: 'sm'
    },
    autoFocusSelector: {
      default: () => ['.autofocus'],
      required: false,
      type: Array as PropType<Array<string>>
    },
    ocuparAlturaMaxima: {
      type: Boolean,
      default: false
    },
    scrollAutomaticoAlturaMaxima: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String  as PropType<ModalMode>,
      default: 'scroll-body'
    }
  },
  watch: {
    aberta(foiAberta) {
      if (foiAberta) {
        this.$emit('onOpen')

        setTimeout(() => {
          this.autoFocusSelector.forEach((value: string) => {
            const autoFocus: HTMLElement | null = (this.$refs.modal as HTMLElement).querySelector(
              value
            )
            if (autoFocus) {
              autoFocus.focus()
            }
          })
        })

        const document = window.document

        if (!document) {
          return null
        }

        // if (foiAberta) {
        //   document.body.style.overflow = 'hidden';
        // } else {
        //   document.body.style.overflow = 'auto';
        // }
      }
    }
  },
  computed: {
    tamanhoClass() {
      switch (this.tamanho) {
        case 'sm':
          return 'modal-sm'
        case 'md':
          return 'modal-md'
        case 'lg':
          return 'modal-lg'
        case 'xl':
          return 'modal-xl'
        case 'xxl':
          return 'modal-xxl'
        default:
          return 'modal-sm'
      }
    },
    styleFullH() {
      return this.ocuparAlturaMaxima ? 'flex: 1' : ''
    },
    overflowBody() {
      if (this.ocuparAlturaMaxima && this.scrollAutomaticoAlturaMaxima) {
        return 'overflow: auto'
      } else if (this.ocuparAlturaMaxima && !this.scrollAutomaticoAlturaMaxima) {
        return 'overflow: hidden'
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      handleClickOutside: null
    }
  },
  methods: {
    fecharModal() {
      this.$emit('onClose')
    },
    fecharModalClick() {
      if (this.fecharClickOutside) {
        this.$emit('onClose')
      }
    },
    onEnter(e) {
      if (e.key === 'Enter' && this.aberta) {
        this.$emit('onEnter')
      }
    },
    onEsc(e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && this.aberta) {
        this.$emit('onEsc')
      }
    }
  },
  beforeUnmount() {
    if(window !== undefined) {
      window.removeEventListener('keyup', this.onEnter)
      window.removeEventListener('keyup', this.onEsc)
    }
    
  },
  created() {
    if(window !== undefined) {
      window.addEventListener('keyup', this.onEnter)
      window.addEventListener('keyup', this.onEsc)
    }
    
  }
}
</script>
<style scoped>
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
  flex-direction: column;
  align-items: center;
  justify-content: start;
  left: 0;
  position: fixed;
  top: 0;
  z-index: 1060;
  height: 100vh;
  width: 100vw;
  overflow-y: hidden;
  overflow-x: hidden;
  background: rgba(51, 47, 47, 0.42);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  border: 1px solid rgba(51, 47, 47, 0.31);
  padding: 20px;
}

.base-modal {
  border-radius: 8px;
  background: #fff;
  margin: 60px 0;
  max-width: 650px;
  width: 65vw;
  overscroll-behavior: contain;
  max-width: 650px;
  width: 65vw;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* .base-modal-container.full-h .base-modal {
flex: 1;
}


.base-modal-container.full-h  .base-modal-body {
flex: 1;
} */

.base-modal-body {
  overflow: auto;
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
  overflow: visible;
}

.base-modal-title :deep(*) {
  margin: 0;
  color: var(--primary-color-principal);
  font-size: 1.25rem;
  word-break: break-word;
  line-height: 24px;
  font-weight: bold;
}

.base-modal .base-modal-body {
  word-break: break-word;
  flex: 1;
  padding: 0px 20px 20px;
  /* max-height: calc(100vh - 440px); */
  /* height: 100%; */
  /* max-height: 100%;
}

.center-modal .base-modal-body {
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

.base-modal-footer {
  display: flex;
  overflow: visible;
  flex-shrink: 0;
}

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
}

.base-modal-breadcrumb {
  padding-bottom: 20px;
  padding-top: 20px;
}

.preview-imagem {
  object-fit: cover;
  max-width: 100%;
  display: block;
}

:global(:root:has(.aberta.base-modal-container)) {
  overflow: hidden;
}

:global(:root:has(.scroll-body .aberta.base-modal-container)) {
  overflow-y: hidden;
  overflow-x: hidden;
}

.scroll-body .base-modal-body {
  overflow: auto;
}

.scroll-body-full .base-modal{
  flex: 1;
}

.scroll-body-full .base-modal-body {
  flex: 1;
}

.full-no-scroll.base-modal-container {
  overflow: hidden
}

.full-no-scroll .base-modal {
  overflow: hidden;
  flex: 1;
}

.full-no-scroll .base-modal-body {
  overflow: hidden;
  flex: 1;
}

.scroll-outside.base-modal-container {
  overflow-y: auto;
}

.scroll-outside .base-modal {
  overflow: initial;
}

.scroll-outside .base-modal-body {
  overflow: initial;
}
</style>
