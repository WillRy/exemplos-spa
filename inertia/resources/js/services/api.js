import axios from "axios";
import { i18n } from "../lang";

let isRefreshing = false;
let failedRequestsQueue = [];

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";


const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  config.headers["Accept-Language"] = i18n.global.locale;
  return config;
});

function redirectLogout() {
  return window.location.href = '/logout';
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalConfig = error.config;
    const errorFromRefresh = error.config.url.includes("refresh");
    const status = error?.response?.status;

    if (errorFromRefresh) {
      redirectLogout();
    }

    if (status === 401 && !errorFromRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;

        api
          .post("/api/refresh")
          .then((response) => {
            const token = response.data.data.token;


            failedRequestsQueue.forEach((request) => request.onSuccess(token));
            failedRequestsQueue = [];
          })
          .catch((err) => {
            failedRequestsQueue.forEach((request) => request.onFailure(err));
            failedRequestsQueue = [];

            redirectLogout();
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: () => {
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

window.api = api;

export default api;


const axiosWeb = axios.create();

axiosWeb.interceptors.request.use(function (config) {
    config.headers['Accept-Language'] = i18n.global.locale;

    return config;
});

axiosWeb.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (401 === error.response.status) {
        window.location.href = "/"
    }
    return Promise.reject(error);
});

export {
    axiosWeb
};
