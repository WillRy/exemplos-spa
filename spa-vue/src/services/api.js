import axios, {Axios} from "axios";
import {i18n} from "../lang";

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


/**
 * DETECTA TOKEN EXPIRADO OU FALHA DE REFRESH TOKEN
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      const refreshingLocalStorage = window.localStorage.getItem('refreshing');
      const refreshingNow = parseInt(refreshingLocalStorage) === 1;

      if (!refreshingNow) {
        window.localStorage.setItem('refreshing', '1');
        return endpoint
          .post("/refresh")
          .then(() => {
            return axios.request(error.config);
          })
          .catch((error) => {
            console.log("Error refresh token", error)
            window.location.href = "/logout";
          }).finally(() => {
            window.localStorage.setItem('refreshing', '0');
          });
      }


    }

    return Promise.reject(error);
  }
);

export default api;

export const endpoint = axios.create({
  baseURL: "/api",
});
