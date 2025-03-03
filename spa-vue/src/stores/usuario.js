import { defineStore } from 'pinia'
import api, { apiPublic } from '../services/api'

export const usuarioStore = defineStore('usuarioStore', {
  state: () => {
    return {
      usuario: null,
      permissoes: []
    }
  },
  getters: {
    temPermissao: (state) => {
      return (permissao) => state.permissoes.includes(permissao)
    },
    isLoggedIn: (state) => {
      return state.usuario
    }
  },
  actions: {
    async carregarUsuarioLogado() {
      try {
        const response = await api.get('/usuario?ignoreRedirect=1')
        this.usuario = response.data.data

        return true
      } catch (error) {
        this.usuario = null
        return false
      }
    },
    async logout() {
      try {
        await api.get('/logout')

        this.usuario = null

        return true
      } catch (error) {
        this.usuario = null
        return true
      }
    }
  }
})
