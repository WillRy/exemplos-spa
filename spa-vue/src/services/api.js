import axios, { Axios } from "axios";
import { i18n } from "../lang";
import { useToast } from "vue-toast-notification";
import router from "../router";
export let store = null;


//controlar fila de requests aguardando refresh token
let refreshSubscribers = [];
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => {
  console.log("refreshing ", refreshSubscribers.length, " subscribers");
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

export function injectStore(st) {
  store = st;
}

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.localStorage.setItem("refreshing", 0);


async function refreshToken() {
  window.localStorage.setItem("refreshing", "1");

  try {
    const response = await api.post("/api/refresh");
    const token = response.data.token;

    return onRefreshed(token);

  } catch (refreshError) {
    window.localStorage.setItem("refreshing", "0");
  } finally {
    window.localStorage.setItem("refreshing", "0");
  }
}

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(function (config) {
  // config.headers.Authorization = 'Bearer ' + window.localStorage.getItem("token");
  config.headers["Accept-Language"] = i18n.global.locale;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    const refreshing = window.localStorage.getItem("refreshing") === "1";

    //se deu erro no refresh, faz logout do usuário
    if (error.config.url.includes('refresh')) {
      console.log('REDIRECT TO LOGIN');
      return await router.push({ name: "logout" });
    }


    if (status === 401) {

      if (!refreshing) {
        refreshToken();
      }

      //se deu erro na request, coloca em uma fila para processar após o refresh token
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          // originalRequest.headers["Authorization"] = "Bearer " + token;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;


export const apiWithoutInterceptors = axios.create({
  baseURL: "/api",
});
