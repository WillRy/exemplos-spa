import axios from 'axios'
import { i18n } from '../lang'
import router from '../router'
import { usuarioStore } from '@/stores/usuario.js';



class BaseHttp {
  constructor(executeLogoutFlow = false) {
    this.baseUrl  = 'http://localhost:8000/api/';

    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true
    });

    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    this.instance.interceptors.request.use(async (config) => {
      config.headers['Accept-Language'] = i18n.global.locale;
      const csrfCookie = ('; ' + document.cookie).split(`; CSRF-TOKEN=`).pop().split(';')[0] ?? null;
      if(csrfCookie) {
        config.headers['CSRF-TOKEN'] = csrfCookie;
      }


      if(!csrfCookie && !config.url.includes('/csrf')) {
        await axios.create({
          baseURL: this.baseUrl,
          withCredentials: true
        }).get('/csrf');
        config.headers['CSRF-TOKEN'] = ('; ' + document.cookie).split(`; CSRF-TOKEN=`).pop().split(';')[0] ?? null;
      }

      return config;
    });

    if(executeLogoutFlow) {
      this.instance.interceptors.response.use(
        (response) => {
          return response
        },
        (error) => this.interceptorRefresh(error, true)
      )
    }

    this.isRefreshing = false
    this.failedRequestsQueue = []

  }

  async redirectLogout(number = 1) {
    await usuarioStore().logout();
    return router.push({
      name: 'login',
      query: {
        logout: number
      },
    })
  }

  interceptorRefresh(error) {
    const status = error.response.status;

    const routeToIgnoreRedirect = [
      "/login",
      "/logout",
      "/cadastro",
      "/esqueci-senha",
      "/redefinir-senha",
      "/csrf"
    ];

    const urlParams = new URLSearchParams(error.config?.url?.split('?')[1] || '');
    const ignoreRedirect = error.config?.query?.ignoreRedirect || urlParams.has('ignoreRedirect');
    const shouldRedirectLogout = (!routeToIgnoreRedirect.includes(error.response.config.url) && !ignoreRedirect);

    const shouldRefresh = !error.response.config.url.includes('/refresh') && !routeToIgnoreRedirect.includes(error.response.config.url)


    if (status === 401) {
      if (shouldRefresh) {
        const originalConfig = error.config

        if (!this.isRefreshing) {
          this.isRefreshing = true

          api
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

        // if (shouldRedirectLogout) {
        //   this.redirectLogout(2)
        // }
        return Promise.reject(error)
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


const api = new BaseHttp(true);

export default api;
