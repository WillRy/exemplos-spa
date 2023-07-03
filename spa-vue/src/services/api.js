import axios from 'axios';
import { i18n } from '../lang';

export let store = null;

export function injectStore(st) {
    store = st;
}

const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use(function (config) {
    // config.headers.Authorization = 'Bearer ' + window.localStorage.getItem("token");
    config.headers['Accept-Language'] = i18n.global.locale;

    return config;
});

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * @important
 *
 * Detecta automaticamente a expiração do token
 * e leva o usuário para a tela de login
 */
api.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (401 === error.response.status) {
        window.localStorage.removeItem("token");
        window.location.href = "/logout"
    }
    return Promise.reject(error);
});
export default api;


export const endpoint = axios.create({
    baseURL: '/api'
});
