import {format, parseISO} from 'date-fns'
import mitt from 'mitt'
import axios from "axios";

let LaravelError = {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$laravelError = (e, message) => {
            console.log(app)
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
            } else {
                app.config.globalProperties.$toast.open({
                    message: message,
                    type: 'error'
                });
            }
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
                console.log(value);
                if (value === '0000-00-00 00:00:00' || !value) return ''
                return value ? format(parseISO(value), "dd/MM/yyyy HH:MM:ss") : '';
            },
            dinheiro(valor) {
                return (new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(valor));
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


const ckeditorupload = {
    install: (app, options) => {
        class UploadCustomizado {
            constructor(loader, url, vueInstance) {
                this.loader = loader;
                this.url = url;
                this.vueInstance = vueInstance;
            }

            upload() {
                return this.loader.file
                    .then(file => new Promise((resolve, reject) => {
                        const data = new FormData();
                        data.append('upload', file);

                        axios({
                            url: this.url,
                            method: 'post',
                            data,
                            headers: {
                                'Content-Type': 'multipart/form-data;'
                            },
                            withCredentials: true
                        })
                            .then(response => {
                                resolve({
                                    default: response.data.url
                                });
                            })
                            .catch(response => {
                                this.vueInstance.config.globalProperties.$laravelError(response)
                                reject();
                            });

                    }));
            }

            abort() {
            }
        }

        app.config.globalProperties.$ckeditorUpload = function (url = '/arquivos/upload') {
            return function (editor) {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    // Configure the URL to the upload script in your back-end here!
                    return new UploadCustomizado(
                        loader,
                        url,
                        app
                    );
                };
            }
        }
    }
}


export {
    filters,
    EventBus,
    LaravelError,
    ckeditorupload
}
