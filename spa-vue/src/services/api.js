import axios from 'axios'
import { i18n } from '../lang'
import router from '../router'

let isRefreshing = false
let failedRequestsQueue = []

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/** requests sem refresh token */
export const apiPublic = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
})

/** requests com refresh token, mas SEM redirect automatico para login ao expirar acesso */
export const apiSemLogout = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
})

/** requests com refresh token, mas COM REDIRECT PARA O LOGIN ao expirar acesso*/
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true
})

function redirectLogout() {
  return router.push({
    name: 'login',
    query: {
      logout: 1
    }
  })
}

const interceptors = async (config) => {
  config.headers['Accept-Language'] = i18n.global.locale
  config.headers['CSRF-TOKEN'] =
    ('; ' + document.cookie).split(`; CSRF-TOKEN=`).pop().split(';')[0] ?? null
  return config
}

const interceptorRefresh = (error, shouldRedirectLogout = true) => {
  const status = error.response.status
  // const shouldRefresh = error.response.data?.code === 'token.expired';
  const shouldRefresh = !error.response.config.url.includes('/refresh')

  if (status === 401) {
    if (shouldRefresh) {
      const originalConfig = error.config

      if (!isRefreshing) {
        isRefreshing = true

        apiPublic
          .post('/refresh')
          .then((response) => {
            const { token } = response.data

            // api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestsQueue.forEach((request) => request.onSuccess(token))
            failedRequestsQueue = []
          })
          .catch((err) => {
            failedRequestsQueue.forEach((request) => request.onFailure(err))
            failedRequestsQueue = []

            if (shouldRedirectLogout) {
              return redirectLogout(1)
            }
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          // eslint-disable-next-line no-unused-vars
          onSuccess: (token) => {
            // originalConfig.headers['Authorization'] = `Bearer ${token}`

            resolve(api(originalConfig))
          },
          onFailure: (err) => {
            reject(err)
          }
        })
      })
    } else {
      if (shouldRedirectLogout) {
        redirectLogout(2)
      }
      return Promise.reject(new Error('Sessão expirada'))
    }
  }

  return Promise.reject(error)
}

//enviar idioma ou token da localstorage(caso use)
api.interceptors.request.use(interceptors)

apiPublic.interceptors.request.use(interceptors)

apiSemLogout.interceptors.request.use(interceptors)
apiSemLogout.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => interceptorRefresh(error, false)
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => interceptorRefresh(error, true)
)

export default api
