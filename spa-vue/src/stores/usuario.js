import { defineStore } from 'pinia'
import { apiSemLogout } from '../services/api'

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
        const response = await apiSemLogout.get('/usuario')
        this.usuario = response.data.data

        return true
      } catch (error) {
        this.usuario = null
        return false
      }
    },
    async logout() {
      try {
        await apiSemLogout.get('/logout')

        this.usuario = null

        return true
      } catch (error) {
        this.usuario = null
        return true
      }
    }
  }
})
