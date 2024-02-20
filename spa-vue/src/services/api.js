import axios from "axios";
import { i18n } from "../lang";
import router from "../router";

let isRefreshing = false;
let failedRequestsQueue = [];

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export const apiPublic = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.request.use(async function (config) {
  config.headers["Accept-Language"] = i18n.global.locale;
  // config.headers["Authorization"] = "Bearer " + window.localStorage.getItem("token");
  const requestMethod = config.method.toUpperCase();

  if(requestMethod !== 'GET') {
    //axios get csrf

    if(getCookie('XSRF-TOKEN')) {
      config.headers["X-XSRF-TOKEN"] = getCookie('XSRF-TOKEN');
    } else {
    const response = await api.get('/csrf');
    config.headers["X-XSRF-TOKEN"] = response.data.csrf;
}

  }
  return config;
});

function redirectLogout() {
  return router.push({
    name: "login",
    query: {
      logout: 1,
    },
  });
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const errorFromRefresh = error.config.url.includes("refresh");
    const status = error.response.status;

    if (errorFromRefresh) {
      await redirectLogout();
    }

    if (status === 401 && !errorFromRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post("/refresh")
          .then((response) => {
            const token = response.data.data.token;

            // api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestsQueue.forEach((request) => request.onSuccess(token));
            failedRequestsQueue = [];
          })
          .catch(async (err) => {
            failedRequestsQueue.forEach((request) => request.onFailure(err));
            failedRequestsQueue = [];

            await redirectLogout();
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token) => {
            // originalConfig.headers['Authorization'] = `Bearer ${token}`
            resolve(api(originalConfig));
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
