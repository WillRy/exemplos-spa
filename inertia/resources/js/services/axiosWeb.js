import axios from 'axios'

import { i18n } from '../lang'

window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const axiosWeb = axios.create({
  baseURL: '/'
})

axiosWeb.interceptors.request.use(function (config) {
  config.headers['Accept-Language'] = i18n.global.locale

  return config
})

/**
 * @important
 *
 * Detecta automaticamente a expiração do token
 * e leva o usuário para a tela de login
 */
axiosWeb.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const statusCode = error && error.response && error.response.status
    if (401 === statusCode) {
      window.localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
export default axiosWeb
