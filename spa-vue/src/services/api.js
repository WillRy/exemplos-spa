import axios from "axios";
import { i18n } from "../lang";
import { useToast } from "vue-toast-notification";
import router from "../router";

// Constante para o estado "refreshing"


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
  window.localStorage.setItem("refreshing", 1);

  try {
    const response = await axios.post("/api/refresh");
    const token = response.data.token;

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

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(function (config) {
  config.headers["Accept-Language"] = i18n.global.locale;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    const refreshing = window.localStorage.getItem("refreshing") === '1';

    if (status === 401) {
      if (!refreshing) {
        const refreshed = await refreshToken();

        if (!refreshed) {
          await router.push({ name: "logout" });
          return Promise.reject(error);
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
