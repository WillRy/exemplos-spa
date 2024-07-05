import { defineStore } from 'pinia'
import type { ConfigState } from '../types'

export const useConfigStore = defineStore('useConfigStore', {
  state: () => ({
    config: {
      current_timezone: 'America/Sao_Paulo',
      default_timezone: 'America/Sao_Paulo',
      is24hr: true,
      locale: 'pt-BR',
      textoPaginacaoTabela: null
    } as ConfigState
  }),
  actions: {
    setConfig(config: ConfigState) {
      this.config = {
        ...this.config,
        ...config
      }
    }
  }
})
