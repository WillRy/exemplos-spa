import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  alertParams,
  errosBackend,
  errosTratados,
  jsonBackend,
} from "../types";
import { useAlertStore } from "../store/alert";

function getFormError(e: any) {
  const erros: errosTratados = {};

  let json = {
    errors: {} as errosTratados,
  };

  if (e instanceof Object && "response" in e && e.response && e.response._data) {
    json = e.response._data;
  } else if (e instanceof Object && "response" in e && e.response) {
    json = e.response;
  } else if (e instanceof Object && "data" in e && e.data) {
    json = e.data;
  } else if (e instanceof Object && "_data" in e && e._data) {
    json = e._data;
  }


  if (json && "errors" in json) {
    for (const campo in json.errors) {
      if (json.errors[campo] && json.errors[campo].length > 0) {
        erros[campo] = json.errors[campo][0] as string;
      }
    }
  }

  if (json && "message" in json) {
    erros.generico = (json.message as string) ?? "";
  }

  return erros;
}

function descobrirDadosBackend(e: any) {
  let data: jsonBackend | null = null;

  if (e instanceof Object && "response" in e && e.response && e.response._data) {
    data = e.response._data;
  } else if (e instanceof Object && "response" in e && e.response && e.response.data) {
    data = e.response.data;
  } else if (e instanceof Object && "data" in e && e.data) {
    data = e.data;
  } else if (e instanceof Object && "_data" in e && e._data) {
    data = e._data;
  }

  return data;
}

function descobrirMensagem(e: any, defaultMessage: string | null = null) {
  let response: object | undefined | null

  const data: jsonBackend | null = descobrirDadosBackend(e)

  if (e && e.response) {
    response = e.response
  } else if (!(e instanceof Error) && !(typeof e === 'string') && e) {
    response = e
  }

  if (data && data?.message === '') {
    return null;
  } else if (data && data?.errors && Array.isArray(data?.errors)) {
    if(Object.keys(data.errors).length > 0) {
      const erro = Object.keys(data.errors)[0] as any;
      return data.errors[erro][0]
    }

    return data?.message || defaultMessage || null;
  }else if(data && data.message){
    return data.message;
  } else if (response && "message" in response && typeof response.message === "string") {
    return response.message;
  } else if (e instanceof Error && e.message) {
    return e.message;
  } else if (typeof e === "string") {
    return e;
  } else if (defaultMessage) {
    return defaultMessage;
  }

  return null
}

export function useBackendAlert() {
  const alertState = useAlertStore();

  function backendAlertError(
    e: any,
    message: string | null,
    objAlert: alertParams = {}
  ) {
    const mensagem = descobrirMensagem(e, message);

    if (mensagem) {
      alertState.error({
        ...objAlert,
        mensagem,
      });
    }

    return getFormError(e);
  }

  function backendAlertSuccess(
    e: any,
    message = null,
    objAlert: alertParams = {}
  ) {
    const mensagem = descobrirMensagem(e, message);

    if (mensagem) {
      alertState.success({
        ...objAlert,
        mensagem,
      });
    }
  }

  return {
    backendAlertError,
    backendAlertSuccess,
  };
}
