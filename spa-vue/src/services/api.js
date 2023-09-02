import axios, { Axios } from "axios";
import { i18n } from "../lang";
import { useToast } from "vue-toast-notification";
import router from "../router";
export let store = null;


export function injectStore(st) {
  store = st;
}

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.localStorage.setItem("refreshing", 0);


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
  window.localStorage.setItem("refreshing", "1");

  try {
    const response = await axios.post("/api/refresh");
    const token = response.data.token;

    window.localStorage.setItem("refreshing", "0");

    return true;

  } catch (refreshError) {
    window.localStorage.setItem("refreshing", "0");
    return false;
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
    debugger
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    const refreshing = window.localStorage.getItem("refreshing") === "1";

    //se deu erro de autenticação
    if (status === 401) {

      //verifica se outra aba ja esta fazendo refresh
      //se for primeira aba fazendo refresh: faz o refresh
      //se não: fica monitorando a outra aba terminar para prosseguir com a request
      if (!refreshing) {
        const refreshed = await refreshToken();

        if(!refreshed) {
          return await router.push({ name: "logout" });
        }

        return api(originalRequest);
      } else {
        return new Promise((resolve) => {
          monitorLocalStorage(
            "refreshing",
            () => {
              resolve(api(originalRequest));
            },
            "0"
          );
        });
      }


    }

    return Promise.reject(error);
  }
);

export default api;


export const apiWithoutInterceptors = axios.create({
  baseURL: "/api",
});
