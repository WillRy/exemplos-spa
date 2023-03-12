import { createRouter, createWebHistory } from "vue-router";
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import Privado from "../layouts/Privado";
import { defineAsyncComponent } from "vue";
import { usuarioStore } from "../stores/usuario";
import { useToast } from "vue-toast-notification";
import NProgress from "nprogress";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Publico,
      children: [
        {
          path: "",
          name: "login",
          component: Login,
        },
        {
          path: "esqueci-senha",
          name: "esqueci-senha",
          component: defineAsyncComponent(() =>
            import("../views/auth/EsqueciSenha")
          ),
        },
        {
          path: "redefinir-senha",
          name: "redefinir-senha",
          component: defineAsyncComponent(() =>
            import("../views/auth/RedefinirSenha")
          ),
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
        try {
          const usuarioState = usuarioStore();
          await usuarioState.carregarUsuarioLogado();

          next();
        } catch (error) {
          console.log(error);
          const toast = useToast();
          toast.open({
            type: "error",
            message: "Erro ao carregar dados do usuario",
          });
          window.localStorage.removeItem("token");
          next({ path: "/" });
        }
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: defineAsyncComponent(() => import("../views/Dashboard")),
        },
        {
          path: "organizacoes",
          name: "organizacoes",
          component: defineAsyncComponent(() =>
            import("../views/Organizacoes")
          ),
        },
        {
          path: "contatos",
          name: "contatos",
          component: defineAsyncComponent(() => import("../views/Contatos")),
        },
        {
          path: "sem-permissao",
          name: "sem-permissao",
          meta: {
            permissoes: ["permissao-qualquer"],
          },
          component: defineAsyncComponent(() => import("../views/Contatos")),
        },
      ],
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

router.beforeEach((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
  }
  next();
});

router.beforeEach((to, from, next) => {
  let permissoesRotas = to.matched
    .map((record) => record.meta.permissoes)
    .reduce((a, b) => a.concat(b), [])
    .filter(Boolean);

  const usuarioState = usuarioStore();
  const permissoesUsuario = usuarioState.permissoes;

  const usuarioTemPermissao = permissoesRotas.every((elem) => permissoesUsuario.includes(elem));

  if (usuarioTemPermissao || permissoesRotas.length === 0) {
    next();
  } else {
    const toast = useToast();
    toast.open({
      type: "error",
      message: "Não tem permissão para acessar esse recurso!",
    });
    next(from);
  }
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
