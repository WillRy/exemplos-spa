<template>
    <DynamicThemeProvider :theme-config="{
        primaryColor: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b'
        },
        escalaPrimaryColorPrincipal: 700,
    }">
        <div class="layout">
            <HomeContainer v-if="usuario">
                <template #sidebar>
                    <Sidebar :open="sidebarAberta" @change="mudarSidebar">
                        <template #logo> </template>
                        <SidebarLink to="/painel/dashboard">
                            <template #texto> Dashboard </template>
                            <template #icone>
                                <HomeIcon />
                            </template>
                        </SidebarLink>
                        <SidebarLink to="/painel/organizacoes">
                            <template #texto>
                                Organizações
                            </template>
                            <template #icone>
                                <OrganizacaoIcon />
                            </template>
                        </SidebarLink>
                        <!-- <SidebarLink to="/painel/contatos">
                        <template #texto>
                            Contatos
                        </template>
                        <template #icone>
                            <ContatoIcon />
                        </template>
                    </SidebarLink>
                    <SidebarLink to="/painel/tags">
                        <template #texto>
                            Tags
                        </template>
                        <template #icone>
                            <TagIcon />
                        </template>
                    </SidebarLink> -->
                    </Sidebar>
                </template>

                <template #header>
                    <Header :containerFluido="true">
                        <template #boxDireito>
                            <div class="row">
                                <div class="col">
                                    <BaseDropdownPrimary>
                                        <template #botao>
                                            {{ usuario.nome }}
                                        </template>
                                        <template #acoes>
                                            <button @click="logout">Logout</button>

                                        </template>
                                    </BaseDropdownPrimary>
                                </div>
                            </div>
                        </template>
                    </Header>
                </template>

                <slot />

            </HomeContainer>
        </div>
    </DynamicThemeProvider>
</template>

<script setup>
import DynamicThemeProvider from "~/provider/DynamicThemeProvider.vue";

const sidebarAberta = ref(false)

const { usuario } = useUsuario();

function mudarSidebar() {
    sidebarAberta.value = !sidebarAberta.value
}

function logout() {
    useNuxtApp().$fetchApi('logout', {
        method: 'post'
    }).then(() => {
        useRouter().push('/?logout=4')
    })
}
</script>

<style>
body {
    background: #f3f3f3;
}

.loader-overlay {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.col-count {
    display: flex;
    align-items: center;
}
</style>