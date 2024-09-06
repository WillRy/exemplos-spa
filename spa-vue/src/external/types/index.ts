import type { ToastProps } from 'vue-toast-notification'

type toastTypes = 'success' | 'error' | 'warning'

export interface openToast {
  type: toastTypes
  message: string
}

export interface erroUnicoBackend {
  [fieldName: string]: string[]
}
export interface errosBackend {
  errors: erroUnicoBackend
  message: string | null
}

export interface errosTratados {
  [key: string]: string | null
}

export interface jsonBackend {
  success: boolean
  message: string | null
  errors: erroUnicoBackend
  error_code?: any
  data: Array<any> | object
}

export interface alertParams {
  tipo?: 'success' | 'error' | 'warning' | 'info' | null
  title?: string | null
  mensagem?: string | null
  id?: any | null
  onClose?: null | (() => void)
  acoes?:
    | {
        click: () => void
        identificador: string
      }[]
    | null
}

export interface ToastParams extends ToastProps {
  message?: string | null
  defaultMessage?: string | null
}

export interface RootState {
  alerts: alertParams[]
}

export interface ConfigState {
  current_timezone: string
  default_timezone: string
  is24hr: boolean
  locale: string
  textoPaginacaoTabela: string | null
}
