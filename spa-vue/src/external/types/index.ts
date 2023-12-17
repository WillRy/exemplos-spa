export interface erroUnicoBackend {
  [fieldName: string]: string[];
}
export interface errosBackend {
  errors: erroUnicoBackend;
  message: string | null;
}

export interface errosTratados {
  [key: string]: string | null;
}

export interface jsonBackend {
  success: boolean;
  message: string | null;
  errors: Array<any>;
  error_code?: any;
  data: Array<any> | object;
}

export interface alertParams {
  tipo?: "success" | "error" | "warning" | "info" | null;
  title?: string | null;
  mensagem?: string | null;
  id?: any | null;
  acoes?:
    | {
        click: () => void;
        identificador: string;
      }[]
    | null;
}

export interface RootState {
  alerts: alertParams[];
}
