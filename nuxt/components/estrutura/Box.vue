<template>
  <div
    class="box-container"
    :class="[`mb-${marginBottom}`, { 'ocupar-altura-maxima': ocuparAlturaMaxima }]"
    :style="{height: height, maxHeight: maxHeight}"
  >
    <OverlineText class="titulo">
      <template v-if="titulo">
        {{ titulo }}
      </template>
      <template v-else>
        &nbsp;
      </template>
    </OverlineText>

    <div :class="{ 'acesso-bloqueado': bloqueado }" class="acesso-bloqueado-container">
      <div class="acesso-bloqueado-box">
        <svg
          fill="#000000"
          height="30px"
          width="30px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 330 330"
          xml:space="preserve"
        >
          <g id="XMLID_509_">
            <path
              id="XMLID_510_"
              d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85
                    S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15
                    s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25
                    C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"
            />
          </g>
        </svg>

        <p>
          {{ mensagemPermissao }}
        </p>
      </div>
      <div class="box" :class="`p-${padding}`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import OverlineText from '../text/OverlineText.vue'
import { PropType } from 'vue'

type MarginBottomType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'padrao'
type PaddingType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'padrao'

export default {
  name: 'Box',
  props: {
    bloqueado: {
      type: Boolean,
      required: false,
      default: false
    },
    titulo: {
      type: String,
      required: false
    },
    mensagemPermissao: {
      type: String,
      default:
        'Entre em contato com administrador solicite a ativação das Permissões para este recurso'
    },
    padding: {
      type: String as PropType<PaddingType>,
      default: 'padrao'
    },
    marginBottom: {
      type: String as PropType<MarginBottomType>,
      default: '3'
    },
    ocuparAlturaMaxima: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      required: false,
      default: ""
    },
    maxHeight: {
      type: String,
      required: false,
      default: ""
    },
  },
  components: {
    OverlineText
  }
}
</script>

<style scoped>
.box-container {
  display: flex;
  flex-direction: column;
}

.box-container.ocupar-altura-maxima {
  height: 100%;
}

.box {
  border: 1px solid #e1e2e6;
  border-radius: 8px;
  position: relative;

  background: #fff;

  display: flex;
  flex-direction: column;
  flex: 1;
}

.titulo {
  margin-left: var(--spacing-3) !important;
}
.acesso-bloqueado {
  position: relative;
}

.acesso-bloqueado-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.acesso-bloqueado-box {
  display: none;
  border-radius: 8px;
}

.acesso-bloqueado .acesso-bloqueado-box {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  content: ' ';
  z-index: 99;
  background-color: rgba(51, 47, 47, 0.42);
  backdrop-filter: blur(1px);

  background-position: center;
  background-size: 10%;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  gap: 12px;

  color: #fff;
}

.acesso-bloqueado p {
  background: #f3f3f3;
  border-radius: 8px;
  color: var(--primary-color-principal);
  text-shadow: none;
  padding: 8px;
}

.acesso-bloqueado svg {
  height: 30px;
  width: 30px;
  display: flex;
  flex-shrink: 0;
}
.acesso-bloqueado svg path {
  fill: var(--primary-color-principal);
}
</style>
