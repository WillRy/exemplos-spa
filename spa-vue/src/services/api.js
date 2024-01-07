import axios from "axios";
import { i18n } from "../lang";
import router from "../router";

let isRefreshing = false;

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

let refreshSubscribers = [];
const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => {
  console.log("refreshing ", refreshSubscribers.length, " subscribers");
      refreshSubscribers.map(cb => cb(token));
      refreshSubscribers = [];
};

async function refreshToken() {
  isRefreshing = 1

  try {
    const r = await api.post("/refresh");


    isRefreshing = 0

    // window.localStorage.setItem("token", r.data.data.token);
    // window.localStorage.setItem("refresh_token", r.data.data.refresh_token);
    onRefreshed(r.data.data.token);


    return true;
  } catch (error) {
    console.error("Erro durante o refresh do token:", error);
    isRefreshing = 0
    return false;
  } finally {
    isRefreshing = 0
  }
}

export const apiPublic = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true
});

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true
});

api.interceptors.request.use(function (config) {
  config.headers["Accept-Language"] = i18n.global.locale;
  // config.headers["Authorization"] = "Bearer " + window.localStorage.getItem("token");
  return config;
});


function redirectLogout() {
  return router.push({
    name: "login",
    query: {
      logout: 1
    }
  });
}
// Response interceptor for API calls
api.interceptors.response.use((response) => {
  return response
}, function (error) {
  const originalRequest = error.config;
  const errorFromRefresh = error.config.url.includes('refresh');

  //erro de refresh token deve sofrer logout
  if(errorFromRefresh) {
    refreshSubscribers = [];
    redirectLogout();
    return Promise.reject(error);
  }

  if (error.response.status === 401 && !originalRequest._retry) {

    originalRequest._retry = true;

    if (!isRefreshing) {
      refreshToken();
    }

    //enfileirar requests para serem executadas novamente depois do refresh
    return new Promise(resolve => {
      subscribeTokenRefresh(token => {
        // originalRequest.headers["Authorization"] = "Bearer " + token;
        resolve(api(originalRequest));
      });
    });
  }

  //request que está sendo executada novamente por erro de autenticação e deu erro novamente, deve causar logout
  if (error.response.status === 401 && originalRequest._retry) {
      refreshSubscribers = [];
      redirectLogout();
      return Promise.reject(error);
  }

  return Promise.reject(error);
});


export default api;

