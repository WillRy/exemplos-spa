import axios from "axios";
import type { Axios, AxiosError, AxiosResponse } from "axios";
import type { alertParams, errosBackend, errosTratados, jsonBackend } from "../types";
import { useToast } from "vue-toast-notification";
import type { ToastProps } from 'vue-toast-notification';

function getFormError(e: string|Error|AxiosError) {
  const erros: errosTratados = {};

  let response = axios.isAxiosError(e) ? e?.response : null;
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

type toastTypes = "success"|'error'|'warning';
interface openToast {
  type: toastTypes,
  message: string,
}

export function useBackendToast() {
  const toast = useToast();

  function open({ type, message, ...options }: openToast) {
    const config = {
      type: type,
      message: message,
      dismissible: true,
      ...options,
    };

    toast.open(config);
  }

  const toastObj = {
    success: (mensagem: string, options:ToastProps = {}) => open({ type: "success", message: mensagem, ...options } as openToast),
    error: (mensagem: string, options:ToastProps = {}) => open({ type: "error", message: mensagem, ...options } as openToast),
    warning: (mensagem: string, options:ToastProps = {}) => open({ type: "warning", message: mensagem, ...options } as openToast),
  };

  function backendToastError(e: string|Error|AxiosError, message:string|null = null) {

    debugger
    let response = axios.isAxiosError(e) ? e?.response : null;
    const data: errosBackend | null = response && response.data ? response.data as errosBackend : null;

    if (response && response.status === 422 && data && data.errors) {
      let erro = Object.keys(response.data.errors)[0];
      toast.open({
        message: response.data.errors[erro][0],
        type: "error",
      });
    } else if (response && response.status === 401 && response.data.message) {
      toast.open({
        message: response.data.message,
        type: "error",
      });
    } else if (response && response.data && response.data.message) {
      toast.open({
        message: response.data.message,
        type: "error",
      });
    } else if (e instanceof Error && e.message) {
      toast.open({
        message: e.message,
        type: "error",
      });
    } else if (typeof e === "string") {
      toast.open({
        message: e,
        type: "error",
      });
    } else if (message) {
      toast.open({
        message: message,
        type: "error",
      });
    }

    return getFormError(e);
  }

  function backendToastSuccess(e: string|AxiosResponse|null, message = null) {
    let response: AxiosResponse<jsonBackend>|null = typeof e !== 'string' ? e : null;

    if (response && response.data && response.data.message) {
      toast.open({
        message: response.data.message,
        type: "success",
      });
    } else if (e instanceof Error && e.message) {
      toast.open({
        message: e.message,
        type: "success",
      });
    } else if (typeof e === 'string') {
      toast.open({
        message: e,
        type: "success",
      });
    } else if (message) {
      toast.open({
        message: message,
        type: "success",
      });
    }
  }

  return {
    toastObj,
    backendToastError,
    backendToastSuccess,
  };
}
