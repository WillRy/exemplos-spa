import {createRouter, createWebHistory} from 'vue-router'
import Publico from "../layouts/Publico";
import Login from "../views/auth/Login";
import Privado from "../layouts/Privado";
import {defineAsyncComponent} from "vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Publico,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: Login
                },
                {
                    path: 'esqueci-senha',
                    name: 'esqueci-senha',
                    component: defineAsyncComponent(() => import("../views/auth/EsqueciSenha"))
                },
                {
                    path: 'redefinir-senha',
                    name: 'redefinir-senha',
                    component: defineAsyncComponent(() => import("../views/auth/RedefinirSenha"))
                }
            ]
        },
        {
            path: '/painel',
            component: Privado,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: defineAsyncComponent(() => import("../views/Dashboard"))
                },
                {
                    path: 'organizacoes',
                    name: 'organizacoes',
                    component: defineAsyncComponent(() => import("../views/Organizacoes"))
                },
                {
                    path: 'contatos',
                    name: 'contatos',
                    component: defineAsyncComponent(() => import("../views/Contatos"))
                },
            ]
        },
// {
//   path: '/about',
//   name: 'about',
//   // route level code-splitting
//   // this generates a separate chunk (About.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import('../views/AboutView.vue')
// }
    ]
})

export default router
