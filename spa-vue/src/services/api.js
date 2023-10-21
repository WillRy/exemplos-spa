import axios from "axios";
import { i18n } from "../lang";
import { useToast } from "vue-toast-notification";
import router from "../router";

export let store = null;

export function injectStore(st) {
  store = st;
}

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";


let refreshing = false;
window.localStorage.setItem("refreshing", '0');

let refreshSubscribers = [];
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => {
  console.log("refreshing ", refreshSubscribers.length, " subscribers");
      refreshSubscribers.map(cb => cb(token));
      refreshSubscribers = [];
};

function monitorLocalStorage(key, callback, expectedValue) {
  const interval = setInterval(() => {
    const updatedValue = localStorage.getItem(key);
    if (updatedValue === expectedValue) {
      clearInterval(interval);
      callback();
    }
  }, 100); // Define o intervalo de verificação em milissegundos
}


async function refreshToken() {
  window.localStorage.setItem("refreshing", '1');

  try {
    await api.post("/refresh");


    window.localStorage.setItem("refreshing", "0");



    return true;
  } catch (error) {
    console.error("Erro durante o refresh do token:", error);
    window.localStorage.setItem("refreshing", "0");
    return false;
  } finally {
    window.localStorage.setItem("refreshing", "0");
  }
}

export const apiPublic = axios.create({
  baseURL: "/api",
});

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(function (config) {
  config.headers["Accept-Language"] = i18n.global.locale;
  return config;
});


// Response interceptor for API calls
api.interceptors.response.use((response) => {
  return response
}, function (error) {
  const originalRequest = error.config;
  const errorFromRefresh = error.config.url.includes('refresh');
  const refreshing = window.localStorage.getItem('refreshing') === '1'

  //erro de refresh token deve sofrer logout
  if(errorFromRefresh) {
    refreshSubscribers = [];
    router.push({ name: "logout" });
    return Promise.reject(error);
  }

  if (error.response.status === 401 && !originalRequest._retry) {
    //monitorar que o refresh token acabou para refazer requests
    monitorLocalStorage(
      "refreshing",
      () => {
        onRefreshed();
      },
      "0"
    );

    originalRequest._retry = true;

    if (!refreshing) {
      refreshToken();
    }

    //enfileirar requests para serem executadas novamente depois do refresh
    return new Promise(resolve => {
      subscribeTokenRefresh(token => {
        resolve(api(originalRequest));
      });
    });
  }

  //request que está sendo executada novamente por erro de autenticação e deu erro novamente, deve causar logout
  if (error.response.status === 401 && originalRequest._retry) {
    refreshSubscribers = [];
      router.push({ name: "logout" });
      return Promise.reject(error);
  }

  return Promise.reject(error);
});


export default api;

