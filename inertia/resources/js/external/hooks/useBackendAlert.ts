import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { alertParams, errosBackend, errosTratados, jsonBackend } from '../types'
import { useAlertStore } from '../store/alert'

function getFormError(e: any) {
  const erros: errosTratados = {}

  const response = axios.isAxiosError(e) ? e?.response : null
  const json: errosBackend | null =
    response && response.data ? (response.data as errosBackend) : null

  if (response && response.status === 422) {
    if (json && json.errors) {
      for (const campo in json.errors) {
        if (json.errors[campo].length > 0) {
          erros[campo] = json.errors[campo][0]
        }
      }
    }
  }

  if (json && !json.errors && json.message) {
    erros.generico = json.message
  }

  return erros
}

function descobrirDadosBackend(e: any) {
  let data: jsonBackend | null = null

  if (axios.isAxiosError(e) && e.response) {
    data = e.response.data
  } else if (!(e instanceof Error) && !(typeof e === 'string') && e) {
    data = e.data
  }

  return data
}

function descobrirMensagem(
  e: any,
  defaultMessage: string | null = null
) {
  let response: AxiosResponse<any> | undefined | null

  const data: jsonBackend | null = descobrirDadosBackend(e)

  if (axios.isAxiosError(e) && e.response) {
    response = e.response
  } else if (!(e instanceof Error) && !(typeof e === 'string') && e) {
    response = e
  }

  if (response && response.status === 422 && data && data.errors.length) {
    const erro = Object.keys(response.data.errors)[0]
    return response.data.errors[erro][0]
  } else if (response && response.data && response.data.message) {
    return response.data.message
  } else if (e instanceof Error && e.message) {
    return e.message
  } else if (typeof e === 'string') {
    return e
  } else if (defaultMessage) {
    return defaultMessage
  }

  return null
}

export function useBackendAlert() {
  const alertState = useAlertStore()

  function backendAlertError(
    e: any,
    message: string | null,
    objAlert: alertParams = {}
  ) {
    const mensagem = descobrirMensagem(e, message)

    if (mensagem) {
      alertState.error({
        ...objAlert,
        mensagem
      })
    }

    return getFormError(e)
  }

  function backendAlertSuccess(
    e: any,
    message = null,
    objAlert: alertParams = {}
  ) {
    const mensagem = descobrirMensagem(e, message)

    if (mensagem) {
      alertState.success({
        ...objAlert,
        mensagem
      })
    }
  }

  return {
    backendAlertError,
    backendAlertSuccess
  }
}
