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
      return !!state.usuario
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
        await apiSemLogout.post('/logout')

        return true
      } catch (error) {
        return true
      } finally {
        //se fosse usar localstorage ao invés de cookie
        // window.localStorage.removeItem("token");
        // window.localStorage.removeItem("refresh_token");

        this.usuario = null
      }
    }
  }
})
