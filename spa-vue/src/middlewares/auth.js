import { i18n } from '@/lang/index.js'
import { usuarioStore } from '@/stores/usuario.js'
import { useToast } from 'vue-toast-notification'

/**
 * Middleware de permissão
 */
export const auth = async (to, from, next) => {
  const usuarioState = usuarioStore()

  //verifica se rota contém um meta indicando que o grupo de rota é privado
  /**
   * meta: { privado: true }
   */
  let rotaEstaComoPrivada = to.matched.map((record) => record.meta.privado).find(Boolean)

  //se usuário não está carregado na store, carrega ele
  let logado = usuarioState.isLoggedIn
  if (!logado) {
    logado = await usuarioState.carregarUsuarioLogado()
  }

  //se está vindo de um login ou logout forçado, deixa entrar na rota (util para SSO)
  const fazendoNovoLogin = (to.query.logout && !logado) || to.query.k || to.query.token || to.name === 'logout'
  if (fazendoNovoLogin && !rotaEstaComoPrivada) {
    return next()
  }

  //se rota é privada e não to logado, redireciona para o login
  if (rotaEstaComoPrivada && !logado) {
    return next({
      name: 'login',
      query: {
        logout: Math.floor(Math.random() * 1000)
      },
    })
  }

  //se rota é publica e estou logado, envia para a home
  if (!rotaEstaComoPrivada && logado) {
    return next({
      name: 'dashboard'
    })
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
