import axios from 'axios';
import {app} from '../main'

export let store = null;

export function injectStore(st) {
    store = st;
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem("token");

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
        await app.config.globalProperties.$router.push({name: 'login'});
    }
    return Promise.reject(error);
});
export default api;


export const endpoint = axios.create({
    baseURL: 'http://localhost:8000/api'
});
