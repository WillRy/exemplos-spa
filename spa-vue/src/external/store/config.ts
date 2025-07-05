import { defineStore } from 'pinia'
import type { ConfigState } from '../types'

export const useConfigStore = defineStore('useConfigStore', {
  state: () => ({
    config: {
      current_timezone: 'America/Sao_Paulo',
      default_timezone: 'America/Sao_Paulo',
      is24hr: true,
      locale: 'pt-BR',
      textoPaginacaoTabela: null,
      mascaraData: '##/##/####',
      mascaraDataHora: '##/##/#### ##:##',
    } as ConfigState
  }),
  getters: {
    formatoData: (state) => {
      switch (state.config.locale) {
        case 'en-US':
        case 'en':
          return 'MM/dd/yyyy'
        case 'es':
          return 'dd/MM/yyyy'
        default:
          return 'dd/MM/yyyy'
      }
    },
    formatoMesAno: (state) => {
      switch (state.config.locale) {
        case 'en-US':
        case 'en':
          return 'MM/yyyy'
        case 'es':
          return 'MM/yyyy'
        default:
          return 'MM/yyyy'
      }
    },
    formatoDataHora: (state) => {
      switch (state.config.locale) {
        case 'en-US':
        case 'en':
          return 'MM/dd/yyyy HH:mm'
        case 'es':
          return 'dd/MM/yyyy HH:mm'
        default:
          return 'dd/MM/yyyy HH:mm'
      }
    },
    txtCancelar: (state) => {
      switch (state.config.locale) {
        case 'en-US':
        case 'en':
          return 'Cancel'
        case 'es':
          return 'Cancelar'
        default:
          return 'Cancelar'
      }
    },
    txtSelecionar: (state) => {
      switch (state.config.locale) {
        case 'en-US':
        case 'en':
          return 'Select'
        case 'es':
          return 'Seleccionar'
        default:
          return 'Selecionar'
      }
    }
  },
  actions: {
    setConfig(config: ConfigState) {
      this.config = {
        ...this.config,
        ...config
      }
    }
  }
})
