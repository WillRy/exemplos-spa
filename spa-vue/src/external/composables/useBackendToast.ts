import axios from 'axios'
import { AxiosResponse } from 'axios'
import type { ToastParams, errosBackend, errosTratados, jsonBackend, openToast } from '../types'
import { useToast } from 'vue-toast-notification'
import type { ToastProps, ToastPropsWithMessage } from 'vue-toast-notification'

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

  if (axios.isAxiosError(e) && e?.response) {
    data = e.response?.data
  } else if (!(e instanceof Error) && !(typeof e === 'string') && e) {
    data = e.data
  }

  return data
}

function descobrirMensagem(e: any, defaultMessage: string | null = null) {
  const data: jsonBackend | null = descobrirDadosBackend(e)

  if (data && data?.message === '') {
    return null
  } else if (data && data?.errors && Array.isArray(data?.errors)) {
    if (Object.keys(data.errors).length > 0) {
      const erro = Object.keys(data.errors)[0]
      return data.errors[erro][0]
    }

    return data?.message || defaultMessage || null
  } else if (data && data?.message) {
    return data.message
  } else if (e instanceof Error && e.message) {
    return e.message
  } else if (typeof e === 'string') {
    return e
  } else if (defaultMessage) {
    return defaultMessage
  }

  return null
}

export function useBackendToast() {
  const toast = useToast()

  function open({ type, message, ...options }: openToast) {
    const config = {
      type: type,
      message: message,
      dismissible: true,
      duration: 5000,
      ...options
    } as ToastPropsWithMessage

    toast.open(config)
  }

  const toastObj = {
    success: (mensagem: string, options: ToastProps = {}) =>
      open({ message: mensagem, ...options, type: 'success' } as openToast),
    error: (mensagem: string, options: ToastProps = {}) =>
      open({ message: mensagem, ...options, type: 'error' } as openToast),
    warning: (mensagem: string, options: ToastProps = {}) =>
      open({ message: mensagem, ...options, type: 'warning' } as openToast),
    open: (mensagem: string, options: ToastProps = {}) =>
      open({ message: mensagem, ...options } as openToast)
  }

  function backendToastError(
    e: any,
    defaultMessage: string | null = null,
    params = {} as ToastParams
  ) {
    const mensagem = descobrirMensagem(e, defaultMessage)

    if (mensagem) {
      toastObj.error(mensagem, params)
    }

    return getFormError(e)
  }

  function backendToastSuccess(
    e: any,
    defaultMessage: string | null = null,
    params = {} as ToastParams
  ) {
    const mensagem = descobrirMensagem(e, defaultMessage)

    if (mensagem) {
      toastObj.success(mensagem, params)
    }
  }

  function backendAutoToast(
    e: any,
    defaultMessage: string | null = null,
    params = {} as ToastParams
  ) {
    const isError = axios.isAxiosError(e) || e instanceof Error || params?.type === 'error'

    if (!params?.type) {
      params.type = isError ? 'error' : 'success'
    }

    const mensagem = descobrirMensagem(e, defaultMessage)

    const toastToUse = toastObj[params.type as string]

    if (!toastToUse) {
      return false
    }

    toastToUse(mensagem)

    return getFormError(e)
  }

  function backendToast(
    e: any,
    params = {} as ToastParams
  ) {
    if (!params?.type) {
      params.type = 'success'
    }

    const mensagem = descobrirMensagem(e, params.defaultMessage)

    const toastToUse = toastObj[params.type as string]

    if (!toastToUse) {
      return false
    }

    toastToUse(mensagem)

    return getFormError(e)
  }

  return {
    toastObj,
    backendToastError,
    backendToastSuccess,
    backendAutoToast,
    backendToast
  }
}
