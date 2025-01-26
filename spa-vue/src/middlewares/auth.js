import { i18n } from '@/lang/index.js'
import { usuarioStore } from '@/stores/usuario.js'
import { useToast } from 'vue-toast-notification'

/**
 * Middleware de permissão
 */
export const auth = async (to, from, next) => {
  const usuarioState = usuarioStore()

  const toRouteIsPrivate = to.matched.some((record) => record.meta.privado)

  const fromRouteIsPublic = from.matched.some((record) => !record.meta.privado);

  const betweenPublic = fromRouteIsPublic && !toRouteIsPrivate;


  if(!usuarioState.usuario && !to.query.logout && !betweenPublic) {
    try {
      await usuarioState.carregarUsuarioLogado();
    } catch (error) {
      console.error(error);
    }
  }

  if (toRouteIsPrivate && !usuarioState.usuario) {
    return next({
      name: 'login',
      query: {
        logout: 1
      }
    })
  }

  if (usuarioState.usuario && !toRouteIsPrivate && !to.name.includes('logout')) {
    return next({ name: 'dashboard' })
  }

  /**
   * Se rota é privada e está logado, verifica se tem permissão para acess
   */

  const permissoesUsuario = usuarioState.permissoes

  //verifica se rota contém um meta indicando que a lista de permissões
  /**
   * meta: {
   *  permissoes: ['xpto']
   * }
   */
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean)

  const usuarioTemPermissao = permissoesRotas.filter((permissao) => {
    return permissoesUsuario.includes(permissao)
  })

  if (usuarioTemPermissao.length || permissoesRotas.length === 0) {
    return next()
  } else {
    const toast = useToast()
    toast.open({
      type: 'error',
      message: i18n.global.t('message.rota_sem_permissao')
    })

    return next({ name: 'dashboard' })
  }
}
