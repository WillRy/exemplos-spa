import { jsonBackend } from 'src/types'

/**
 * Composable para obter dados da response caso exista
 * @returns
 */
export function useResponse() {
  /**
   * Retorna os dados da response caso existam
   * @param objeto
   * @returns
   */
  function getResponse(objeto: any): jsonBackend | null {
    let data: (jsonBackend & { statusCode?: number }) | null = null

    if (objeto && objeto.response && objeto.response.data) {
      data = objeto.response.data
    }

    if (data) {
      data.statusCode = objeto.response.status
    }

    return data
  }

  return {
    getResponse
  } as {
    getResponse: (objeto: any) => jsonBackend | null
  }
}
