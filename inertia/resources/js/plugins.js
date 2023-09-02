import {format, parseISO} from 'date-fns'
import mitt from 'mitt'
import {useAlertStore} from './external/store/alert'

let LaravelError = {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$laravelError = (e, message) => {
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                app.config.globalProperties.$toast.open({
                    message: response.data.errors[erro][0],
                    type: 'error'
                });
            } else if (response && response.status === 401 && response.data.message) {
                app.config.globalProperties.$toast.open({
                    message: response.data.message,
                    type: 'error'
                });
            } else if (response && response.data.message) {
                app.config.globalProperties.$toast.open({
                    message: response.data.message,
                    type: 'error'
                });
            } else if (!response && e.message) {
                app.config.globalProperties.$toast.open({
                    message: e.message,
                    type: 'error'
                });
            } else {
                app.config.globalProperties.$toast.open({
                    message: message,
                    type: 'error'
                });
            }
        }

        app.config.globalProperties.$laravelSuccess = (e, message) => {
            let response = e;
            if (response && response.data && response.data.message) {
                app.config.globalProperties.$toast.open({
                    message: response.data.message,
                    type: 'success'
                });
            } else if (!response && e.message) {
                app.config.globalProperties.$toast.open({
                    message: e.message,
                    type: 'success'
                });
            } else {
                app.config.globalProperties.$toast.open({
                    message: message,
                    type: 'success'
                });
            }
        }
    }
}

let LaravelAlert = {
    install: (app, options) => {

        // inject a globally available $translate() method
        app.config.globalProperties.$laravelAlert = (e, message, objAlert = {}) => {
            const alertState = useAlertStore();
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.errors[erro][0]
                })
            } else if (response && response.status === 401 && response.data.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.message
                })
            } else if (response && response.data.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.message
                })
            } else if (!response && e.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: e.message,
                })
            } else {
                alertState.error({
                    ...objAlert,
                    mensagem: message,
                })
            }
        }

        app.config.globalProperties.$laravelAlertError = (e, message, objAlert = {}) => {
            const alertState = useAlertStore();
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.errors[erro][0]
                })
            } else if (response && response.status === 401 && response.data.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.message
                })
            } else if (response && response.data.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: response.data.message
                })
            } else if (!response && e.message) {
                alertState.error({
                    ...objAlert,
                    mensagem: e.message,
                })
            } else {
                alertState.error({
                    ...objAlert,
                    mensagem: message,
                })
            }
        }

        app.config.globalProperties.$laravelAlertSuccess = (e, message, objAlert = {}) => {
            const alertState = useAlertStore();
            let response = e;
            if (response && response.data && response.data.message) {
                alertState.success({
                    ...objAlert,
                    mensagem: response.data.message
                })
            } else if (!response && e.message) {
                alertState.success({
                    ...objAlert,
                    mensagem: e.message,
                })
            } else {
                alertState.success({
                    ...objAlert,
                    mensagem: message,
                })
            }
        }
    }
}

let getError = {
    install: (app, options) => {
        app.config.globalProperties.$getError = (e, message) => {
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                return response.data.errors[erro][0];
            }else if (response && response.status === 422 && response.data.message) {
                return response.data.message;
            } else if (response && response.status === 401 && response.data.message) {
               return response.data.message;
            } else if (response && response.data.message) {
                return response.data.message;
            } else if (!response && e.message) {
                return e.message;
            } else {
                return message;
            }
        }
    }
}

let toasts = {
    install: (app, options) => {
        function open({type, message, ...options}) {
            const config = {
                type: type,
                message: message,
                dismissible: true,
                ...options
            }

            app.config.globalProperties.$toast.open(config);
        }
        app.config.globalProperties.$toasts = {
            success: (mensagem,  options = {}) => open({type: 'success',message: mensagem, ...options}),
            error: (mensagem,  options = {}) => open({type: 'error',message: mensagem, ...options}),
            warning: (mensagem,  options = {}) => open({type: 'warning',message: mensagem, ...options})
        }
    }
}


let filters = {
    install: (app, options) => {
        app.config.globalProperties.$filters = {
            data(value) {
                if (value === '0000-00-00 00:00:00' || !value) return ''
                return value ? format(parseISO(value), "dd/MM/yyyy") : '';
            },
            dataHora(value) {
                if (value === '0000-00-00 00:00:00' || !value) return ''
                return value ? format(parseISO(value), "dd/MM/yyyy HH:MM:ss") : '';
            },
            dinheiro(valor, moeda = 'pt-BR', currency = 'BRL') {
                return (new Intl.NumberFormat(moeda, {style: 'currency', currency: currency}).format(valor));
            },
        }
    }
}


let EventBus = {
    install: (app, options) => {
        const emitter = mitt();
        app.config.globalProperties.$eventBus = {
            $on: (...args) => emitter.on(...args),
            $once: (...args) => emitter.once(...args),
            $off: (...args) => emitter.off(...args),
            $emit: (...args) => emitter.emit(...args),
        }
    }
}

let VerificaPermissao = {
    install: (app, options) => {
        app.config.globalProperties.$verificaPermissao = ($page, permissao) => {
            return $page.props.permissoes.find(
                (item) => item === permissao
            );
        }
    }
}

export {
    filters,
    EventBus,
    LaravelError,
    LaravelAlert,
    getError,
    toasts,
    VerificaPermissao
}
