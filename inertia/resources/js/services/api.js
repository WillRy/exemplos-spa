import axios from 'axios';
import {i18n} from '../lang';

export let store = null;

export function injectStore(st) {
    store = st;
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const api = axios.create({
    baseURL: '/'
});

api.interceptors.request.use(function (config) {
    config.headers['Accept-Language'] = i18n.global.locale;

    return config;
});

api.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (401 === error.response.status) {
        window.location.href = "/"
    }
    return Promise.reject(error);
});

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
