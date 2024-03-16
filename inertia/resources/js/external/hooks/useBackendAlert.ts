import axios from "axios";
import type {  AxiosError, AxiosResponse } from "axios";
import type { alertParams, errosBackend, errosTratados, jsonBackend } from "../types";
import { useAlertStore } from "../store/alert";


function getFormError(e: string|Error|AxiosError) {
  const erros: errosTratados = {};

  const response = axios.isAxiosError(e) ? e?.response : null;
  const json: errosBackend | null = response && response.data ? response.data as errosBackend : null;
  

  if (response && response.status === 422) {
    if (json && json.errors) {
      for (const campo in json.errors) {
        if (json.errors[campo].length > 0) {
          erros[campo] = json.errors[campo][0];
        }
      }
    }
  }

  if (json && !json.errors && json.message) {
    erros.generico = json.message;
  }

  return erros;
}

export function useBackendAlert() {
  const alertState = useAlertStore();
  
  function backendAlertError(e: string|Error|AxiosError, message:string|null, objAlert: alertParams = {}) {
    const response = axios.isAxiosError(e) ? e?.response : null;
    const data: errosBackend | null = response && response.data ? response.data as errosBackend : null;
    
    if (response && response.status === 422 && data && data.errors.length) {
      const erro: string = Object.keys(response.data.errors)[0];
      alertState.error({
        ...objAlert,
        mensagem: data.errors[erro][0],
      });
    } else if (response && response.status === 401 && response.data.message) {
      alertState.error({
        ...objAlert,
        mensagem: response.data.message,
      });
    } else if (response && response.data && response.data.message) {
      alertState.error({
        ...objAlert,
        mensagem: response.data.message,
      });
    } else if (e instanceof Error && e.message) {
      alertState.error({
        ...objAlert,
        mensagem: e.message,
      });
    } else if (typeof e === "string") {
      alertState.error({
        ...objAlert,
        mensagem: e,
      });
    } else if (message) {
      alertState.error({
        ...objAlert,
        mensagem: message,
      });
    }

    return getFormError(e);
  }

  function backendAlertSuccess(e: string|AxiosResponse|null, message = null, objAlert: alertParams = {}) {

    const response: AxiosResponse<jsonBackend>|null = typeof e !== 'string' ? e : null;

    if (response && response.data && response.data.message) {
      alertState.success({
        ...objAlert,
        mensagem: response.data.message,
      });
    } else if (typeof e === 'string') {
      alertState.success({
        ...objAlert,
        mensagem: e
      });
    } else if (e instanceof Error && e.message) {
      alertState.success({
        ...objAlert,
        mensagem: e.message,
      });
    } else if (message) {
      alertState.success({
        ...objAlert,
        mensagem: message,
      });
    }
  }

  return {
    backendAlertError,
    backendAlertSuccess,
  }
}
