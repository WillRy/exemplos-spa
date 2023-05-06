import {defineStore} from "pinia";

let idNotificacao = 1;

export const useAlertStore = defineStore("alert", {
    state: () => ({
        alerts: [],
    }),
    actions: {
        setAlert({tipo, title, mensagem, textoBtn = "Certo!", id = null}) {
            const idAlert = id ? id : idNotificacao++;

            const exists = this.alerts.find((alert) => alert.id === id);

            if (exists) return;

            this.alerts.push({
                tipo,
                title: title,
                mensagem,
                textoBtn: textoBtn,
                id: idAlert
            });
        },
        removeAlert(id) {
            this.alerts = this.alerts.filter((alert) => alert.id !== id);
        },
    },
});