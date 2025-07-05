import axios from 'axios'

export function useGetError() {
  function getError(e, mensagemReserva = '') {
    let response = axios.isAxiosError(e) ? e?.response : null
    const data = response && response.data ? response.data : null

    if (response && response.status === 422 && data && data.errors) {
      let erro = Object.keys(response.data.errors)[0]
      return data.errors[erro][0]
    } else if (response && response.status === 401 && response.data.message) {
      return response.data.message
    } else if (response && response.data && response.data.message) {
      return response.data.message
    } else if (e instanceof Error && e.message) {
      return e.message
    } else if (typeof e === 'string') {
      return e
    } else if (message) {
      return message
    }

    return mensagemReserva
  }

  return {
    getError
  }
}
