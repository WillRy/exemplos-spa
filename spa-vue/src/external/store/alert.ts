import { defineStore } from 'pinia'
import type { alertParams } from '../types'

let idNotificacao = 1

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: [] as alertParams[]
  }),
  actions: {
    setAlert({ tipo, title, mensagem, id = null, acoes = null, onClose = null }: alertParams) {
      const idAlert = id ? id : idNotificacao++

      const exists = this.alerts.find((alert) => alert.id === idAlert)

      if (exists) return

      this.alerts.push({
        tipo,
        title: title,
        mensagem,
        id: idAlert,
        acoes: acoes,
        onClose: onClose
      })
    },
    error({ title, mensagem, id = null, acoes = null, onClose = null }: alertParams) {
      const idAlert = id ? id : idNotificacao++

      const exists = this.alerts.find((alert) => alert.id === id)

      if (exists) return

      this.alerts.push({
        tipo: 'error',
        title: title,
        mensagem,
        id: idAlert,
        acoes: acoes,
        onClose: onClose
      })
    },
    success({ title, mensagem, id = null, acoes = null, onClose = null }: alertParams) {
      const idAlert = id ? id : idNotificacao++

      const exists = this.alerts.find((alert) => alert.id === id)

      if (exists) return

      this.alerts.push({
        tipo: 'success',
        title: title,
        mensagem,
        id: idAlert,
        acoes: acoes,
        onClose: onClose
      })
    },
    info({ title, mensagem, id = null, acoes = null, onClose = null }: alertParams) {
      const idAlert = id ? id : idNotificacao++

      const exists = this.alerts.find((alert) => alert.id === id)

      if (exists) return

      this.alerts.push({
        tipo: 'info',
        title: title,
        mensagem,
        id: idAlert,
        acoes: acoes,
        onClose: onClose
      })
    },
    warning({ title, mensagem, id = null, acoes = null, onClose = null }: alertParams) {
      const idAlert = id ? id : idNotificacao++

      const exists = this.alerts.find((alert) => alert.id === id)

      if (exists) return

      this.alerts.push({
        tipo: 'warning',
        title: title,
        mensagem,
        id: idAlert,
        acoes: acoes,
        onClose: onClose
      })
    },
    removeAlert(id: any) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id)
    }
  }
})
