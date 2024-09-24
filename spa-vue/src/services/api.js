import axios from 'axios'
import { i18n } from '../lang'
import router from '../router'
import { usuarioStore } from '@/stores/usuario.js';



class BaseHttp {
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/api/',
      withCredentials: true
    });

    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    this.instance.interceptors.request.use(async (config) => {
      config.headers['Accept-Language'] = i18n.global.locale;
      config.headers['CSRF-TOKEN'] = ('; ' + document.cookie).split(`; CSRF-TOKEN=`).pop().split(';')[0] ?? null;
      return config;
    });

    this.isRefreshing = false
    this.failedRequestsQueue = []

  }

  async redirectLogout() {
    await usuarioStore().logout();
    return router.push({
      name: 'login',
      query: {
        logout: 1
      },
    })
  }

  interceptorRefresh(error, shouldRedirectLogout = true) {
    const status = error.response.status
    // const shouldRefresh = error.response.data?.code === 'token.expired';
    const shouldRefresh = !error.response.config.url.includes('/refresh')

    if (status === 401) {
      if (shouldRefresh) {
        const originalConfig = error.config

        if (!this.isRefreshing) {
          this.isRefreshing = true

          apiPublic
            .post('/refresh')
            .then((response) => {
              const { token } = response.data

              // api.defaults.headers['Authorization'] = `Bearer ${token}`;

              this.failedRequestsQueue.forEach((request) => request.onSuccess(token))
              this.failedRequestsQueue = []
            })
            .catch(() => {
              this.failedRequestsQueue.forEach((request) => request.onFailure(error))
              this.failedRequestsQueue = []

              if (shouldRedirectLogout) {
                return this.redirectLogout(1)
              }
            })
            .finally(() => {
              this.isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          this.failedRequestsQueue.push({
            // eslint-disable-next-line no-unused-vars
            onSuccess: (token) => {
              // originalConfig.headers['Authorization'] = `Bearer ${token}`

              resolve(this.instance(originalConfig))
            },
            onFailure: (err) => {
              reject(err)
            }
          })
        })
      } else {
        if (shouldRedirectLogout) {
          this.redirectLogout(2)
        }
        return Promise.reject(new Error('Sessão expirada'))
      }
    }

    return Promise.reject(error)
  }

  async get(url, config) {
    return new Promise((resolve, reject) => {
      this.instance.get(url, config)
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
  }

  async post(url, data, config) {
    return new Promise((resolve, reject) => {
      this.instance.post(url,data, config)
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
  }

  async put(url, data, config) {
    return new Promise((resolve, reject) => {
      this.instance.put(url,data, config)
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
  }

  async delete(url, config) {
    return new Promise((resolve, reject) => {
      this.instance.delete(url, config)
        .then(response => resolve(response))
        .catch(error => reject(error))
    });
  }

}
class ApiPublic  extends BaseHttp {
  constructor() {
    super();
  }
}

class ApiSemLogout  extends BaseHttp {
  constructor() {
    super();

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => this.interceptorRefresh(error, false)
    )
  }
}

class Api extends BaseHttp {
  constructor() {
    super();

    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => this.interceptorRefresh(error, true)
    )
  }
}


const apiPublic = new ApiPublic();
const apiSemLogout = new ApiSemLogout();
const api = new Api();

export { apiPublic, apiSemLogout }

export default api;
