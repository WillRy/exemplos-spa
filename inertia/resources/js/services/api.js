import axios from "axios";
import { i18n } from "../lang";

let isRefreshing = false;
let failedRequestsQueue = [];

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export const apiPublic = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

//enviar idioma ou token da localstorage(caso use)
api.interceptors.request.use(async function (config) {
    config.headers["Accept-Language"] = i18n.global.locale;
    // config.headers["Authorization"] = "Bearer " + window.localStorage.getItem("token");

    return config;
});

function redirectLogout() {
    return (window.location.href = "/logout");
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

                api.post("/refresh")
                    .then((response) => {
                        const token = response.data.data.token;

                        // api.defaults.headers['Authorization'] = `Bearer ${token}`;

                        failedRequestsQueue.forEach((request) =>
                            request.onSuccess(token)
                        );
                        failedRequestsQueue = [];
                    })
                    .catch(async (err) => {
                        failedRequestsQueue.forEach((request) =>
                            request.onFailure(err)
                        );
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

window.api = api;
window.apiPublic = apiPublic;
export default api;
