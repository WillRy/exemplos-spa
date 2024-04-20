import { useToast } from 'vue-toast-notification'
import { usuarioStore } from '../stores/usuario'
import { i18n } from '@/lang/index.js'

export function verificaPermissao(to, from, next) {
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean)

  const usuarioState = usuarioStore()
  const permissoesUsuario = usuarioState.permissoes

  const usuarioTemPermissao = permissoesRotas.every((elem) => {
    return permissoesUsuario.includes(elem)
  })

  if (usuarioTemPermissao || permissoesRotas.length === 0) {
    next()
  } else {
    const toast = useToast()
    toast.open({
      type: 'error',
      message: i18n.global.t('message.rota_sem_permissao')
    })
    next(from)
  }
}
