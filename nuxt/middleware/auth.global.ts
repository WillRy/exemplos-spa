import type { Usuario } from "~/composables/useUsuario";
export default defineNuxtRouteMiddleware(async (to, from) => {
  

  const { usuario } = useUsuario();

  const isPrivate = to.path.includes("/painel");

  const haveLogout = to.fullPath.includes("logout");

  if(import.meta.server) {
    await useNuxtApp().$getCsrf();
    await useApi('/login', {
      method: 'POST'
    })
  }

  if (haveLogout) {
    usuario.value = null;
    return;
  }

  if (!usuario.value && !haveLogout) {
    const { data } = await useApi<{
      data: Usuario;
    }>("/usuario");

    if (data.value?.data) {
      usuario.value = data.value?.data;
    }
  }

  if (usuario.value && !isPrivate && !haveLogout) {
    return navigateTo("/painel/dashboard");
  }

  if (!usuario.value && isPrivate && !haveLogout) {
    await useNuxtApp().$cleanCsrf();
    return navigateTo("/?logout=3");
  }
});
