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
    (error) => {
        const status = error.response.status;
        // const shouldRefresh = error.response.data?.code === 'token.expired';
        const shouldRefresh = !error.response.config.url.includes("/refresh");

        if (status === 401) {
            if (shouldRefresh) {
                const originalConfig = error.config;

                if (!isRefreshing) {
                    isRefreshing = true;

                    api.post("/refresh")
                        .then((response) => {
                            const { token } = response.data;

                            // api.defaults.headers['Authorization'] = `Bearer ${token}`;

                            failedRequestsQueue.forEach((request) =>
                                request.onSuccess(token)
                            );
                            failedRequestsQueue = [];
                        })
                        .catch((err) => {
                            failedRequestsQueue.forEach((request) =>
                                request.onFailure(err)
                            );
                            failedRequestsQueue = [];

                            // if (process.browser) {
                            //   signOut()
                            // }

                            return redirectLogout(1);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }

                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        // eslint-disable-next-line no-unused-vars
                        onSuccess: (token) => {
                            // originalConfig.headers['Authorization'] = `Bearer ${token}`

                            resolve(api(originalConfig));
                        },
                        onFailure: (err) => {
                            reject(err);
                        },
                    });
                });
            } else {
                // if (process.browser) {
                //   signOut()
                // } else {
                //   return Promise.reject(new AuthTokenError())
                // }
                redirectLogout(2);
                return Promise.reject(new Error("Sessão expirada"));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
