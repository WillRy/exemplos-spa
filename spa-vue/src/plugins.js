import { format, parseISO } from "date-fns";
import mitt from "mitt";

let LaravelError = {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$laravelError = (e, message) => {
            console.log(app);
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                app.config.globalProperties.$toast.open({
                    message: response.data.errors[erro][0],
                    type: "error",
                });
            } else if (
                response &&
                response.status === 401 &&
                response.data.message
            ) {
                app.config.globalProperties.$toast.open({
                    message: response.data.message,
                    type: "error",
                });
            } else if (response && response.data.message) {
                app.config.globalProperties.$toast.open({
                    message: response.data.message,
                    type: "error",
                });
            } else if (!response && e.message) {
                app.config.globalProperties.$toast.open({
                    message: e.message,
                    type: "error",
                });
            } else {
                app.config.globalProperties.$toast.open({
                    message: message,
                    type: "error",
                });
            }
        };
    },
};

let getError = {
    install: (app, options) => {
        app.config.globalProperties.$getError = (e, message) => {
            console.log(app);
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                return response.data.errors[erro][0];
            } else if (
                response &&
                response.status === 401 &&
                response.data.message
            ) {
                return response.data.message;
            } else if (response && response.data.message) {
                return response.data.message;
            } else if (!response && e.message) {
                return e.message;
            } else {
                return message;
            }
        };
    },
};

let toasts = {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$toasts = {
            success: (mensagem, onClick = null) =>
                app.config.globalProperties.$toast.open({
                    type: "success",
                    message: mensagem,
                    onClick: onClick,
                }),
            error: (mensagem, onClick = null) =>
                app.config.globalProperties.$toast.open({
                    type: "error",
                    message: mensagem,
                    onClick: onClick,
                }),
        };
    },
};

let filters = {
    install: (app, options) => {
        app.config.globalProperties.$filters = {
            data(value) {
                if (value === "0000-00-00 00:00:00" || !value) return "";
                return value ? format(parseISO(value), "dd/MM/yyyy") : "";
            },
            dataHora(value) {
                if (value === "0000-00-00 00:00:00" || !value) return "";
                return value
                    ? format(parseISO(value), "dd/MM/yyyy HH:MM:ss")
                    : "";
            },
            dinheiro(valor, moeda = "pt-BR", currency = "BRL") {
                return new Intl.NumberFormat(moeda, {
                    style: "currency",
                    currency: currency,
                }).format(valor);
            },
        };
    },
};

let EventBus = {
    install: (app, options) => {
        const emitter = mitt();
        app.config.globalProperties.$eventBus = {
            $on: (...args) => emitter.on(...args),
            $once: (...args) => emitter.once(...args),
            $off: (...args) => emitter.off(...args),
            $emit: (...args) => emitter.emit(...args),
        };
    },
};

let ajaxFormError = {
    install: (app, options) => {
        app.config.globalProperties.$ajaxFormError = (form, json = {}) => {
            json = json ? json : {};

            // analisa response do axios
            const response = json.response;
            json = response && response.data ? response.data : {}

            const data = Object.assign({}, form);

            delete data["errors"];

            const errors = {};

            for (const key in data) {
                const field = key;
                const error =
                    json.errors && json.errors[key] && json.errors[key].length
                        ? json.errors[key][0]
                        : null;
                errors[field] = error;
            }

            return errors
        };
    },
};

let VerificaPermissao = {
    install: (app, options) => {
        app.config.globalProperties.$verificaPermissao = ($page, permissao) => {
            return $page.props.permissoes.find(
                (item) => item === permissao
            );
        }
    }
}

export { filters, EventBus, LaravelError, getError, toasts, ajaxFormError, VerificaPermissao };
