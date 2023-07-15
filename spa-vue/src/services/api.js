import axios, {Axios} from "axios";
import {i18n} from "../lang";
import {useToast} from 'vue-toast-notification'
import router from '../router'
export let store = null;

export function injectStore(st) {
  store = st;
}

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(function (config) {
  // config.headers.Authorization = 'Bearer ' + window.localStorage.getItem("token");
  config.headers["Accept-Language"] = i18n.global.locale;

  return config;
});

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.localStorage.setItem('refreshing', 0);

/**
 * DETECTA TOKEN EXPIRADO OU FALHA DE REFRESH TOKEN
 * E trata race conditions entre abas
 */

function monitorLocalStorage(key, callback, expectedValue) {

  const interval = setInterval(() => {
    const updatedValue = localStorage.getItem(key);
    if (updatedValue === expectedValue) {
      clearInterval(interval)
      callback();
    }
  }, 100); // Define o intervalo de verificação em milissegundos
}
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    const refreshing = window.localStorage.getItem('refreshing') === '1';


    if(refreshing) {
      return new Promise((resolve) => {
        monitorLocalStorage('refreshing', () => {
          resolve(api(originalRequest));
        }, '0');
      });

    }

    // config.retry -= 1;


    if (status === 401) {

      window.localStorage.setItem('refreshing', '1');


      try {
        await endpoint.post("/refresh")

        return api(originalRequest);
      } catch(refreshError) {
        window.localStorage.setItem('refreshing', '0');
        setTimeout(() => {
          console.log("Error refresh token", error)
          router.push({path: '/logout'})
        })
        return Promise.reject(refreshError);

      } finally {
        window.localStorage.setItem('refreshing', '0');
      }

    }

    return Promise.reject(error);
  }
);

export default api;

export const endpoint = axios.create({
  baseURL: "/api",
});
