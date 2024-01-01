import { createRouter, createWebHistory } from "vue-router";
import { usuarioStore } from "../stores/usuario";
import { configuraIdioma } from "../middlewares/configuraIdioma";
import { iniciaLoader, terminaLoader } from "../middlewares/loaders";
import { verificaPermissao } from "../middlewares/verificaPermissao";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/lang/:lang",
      name: "lang",
      //se eu estiver logado, envia para a dashboard
      async beforeEnter(from, to, next) {
        const lang = to.params.lang ?? from.params.lang;

        window.localStorage.setItem("@lang", lang);

        if (from.fullPath !== to.fullPath) {
          return next({
            name: "login",
          });
        }

        return next(from);
      },
    },
    {
      path: "/",
      component: () => import("../layouts/Publico"),
      name: "publico",
      children: [
        {
          path: "",
          name: "login",
          component: () => import('../views/auth/Login'),
          async beforeEnter(from, to, next) {

            //indica que foi logout forçado, nao precisa tentar carregar dados do usuario
            if(from?.redirectedFrom?.name === 'logout') {
              return next();
            }

            const usuarioState = usuarioStore();
            const logado = await usuarioState.carregarUsuarioLogado();

            if (logado) {
              return next({ name: "dashboard" });
            }
            return next();
          },
        },
        {
          path: "esqueci-senha",
          name: "esqueci-senha",
          component: () => import("../views/auth/EsqueciSenha"),
        },
        {
          path: "redefinir-senha",
          name: "redefinir-senha",
          component: () => import("../views/auth/RedefinirSenha"),
        },
      ],
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import('../views/auth/Login'),
      async beforeEnter(from, to, next) {
        const usuarioState = usuarioStore();
        await usuarioState.logout();
        return next({ name: "login"});
      },
    },
    {
      path: "/painel",
      component: () => import("../layouts/Privado"),
      meta: {
        permissoes: [],
      },
      async beforeEnter(from, to, next) {
        const usuarioState = usuarioStore();
        const logado = await usuarioState.carregarUsuarioLogado();
        if (logado) {
          return next();
        }
        return next('/')
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/Dashboard"),
        },
        {
          path: "organizacoes",
          name: "organizacoes",
          component: () => import("../views/Organizacoes"),
        },
        {
          path: "contatos",
          name: "contatos",
          component: () => import("../views/Contatos"),
        },
        {
          path: "tags",
          name: "tags",
          component: () => import("../views/Tags"),
        },
        {
          path: "sem-permissao",
          name: "sem-permissao",
          meta: {
            permissoes: ["permissao-qualquer"],
          },
          component: () => import("../views/Contatos"),
        },
      ],
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../views/NaoEncontrado") },
  ],
});


router.beforeEach(configuraIdioma);


router.beforeEach(iniciaLoader);


router.afterEach(terminaLoader);


router.beforeEach(verificaPermissao);

export default router;
