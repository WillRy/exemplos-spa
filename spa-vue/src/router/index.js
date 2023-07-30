import { createRouter, createWebHistory } from "vue-router";
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import NaoEncontrado from "../views/NaoEncontrado";
import Privado from "../layouts/Privado";
import { usuarioStore } from "../stores/usuario";
import { useToast } from "vue-toast-notification";
import NProgress from "nprogress";

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
      component: Publico,
      name: "publico",
      async beforeEnter(from, to, next) {
        debugger
        const usuarioState = usuarioStore();
        const logado = await usuarioState.carregarUsuarioLogado(false);
        if (logado) {
          return next({ name: "dashboard" });
        }
        return next();
      },
      children: [
        {
          path: "",
          name: "login",
          component: Login,
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
        {
          path: "logout",
          name: "logout",
          component: Login,
          async beforeEnter(from, to, next) {
            const usuarioState = usuarioStore();
            await usuarioState.logout();
            next({ path: "/" });
          },
        },
      ],
    },
    {
      path: "/painel",
      component: Privado,
      meta: {
        permissoes: [],
      },
      async beforeEnter(from, to, next) {
        debugger
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
    { path: "/:pathMatch(.*)*", name: "not-found", component: NaoEncontrado },
  ],
});


router.beforeEach(configuraIdioma);


router.beforeEach(iniciaLoader);


router.afterEach(terminaLoader);


router.beforeEach(verificaPermissao);

export default router;
