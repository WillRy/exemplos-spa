import { format, parseISO } from 'date-fns'

export function useDataHora() {
  function dataHora(value) {
    if (value === '0000-00-00 00:00:00' || !value) return ''
    return value ? format(parseISO(value), 'dd/MM/yyyy HH:MM:ss') : ''
  }

  return {
    dataHora
  }
}
