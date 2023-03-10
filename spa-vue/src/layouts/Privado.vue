<template>
    <div class="layout" v-if="!loading && usuarioState.usuario">
        <Header/>
        <Sidebar/>
        <div class="home-section">
            <router-view></router-view>
        </div>

    </div>
    <div class="loader-overlay" v-if="loading">
        <Loader width="126px" height="126px" :corPrincipal="true"/>
    </div>
</template>

<script>
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import {usuarioStore} from "../stores/usuario";

export default {
    name: "Privado",
    components: {Sidebar, Header},
    setup() {
        const usuarioState = usuarioStore();
        return {
            usuarioState
        }
    },
    data() {
        return {
            loading: true
        }
    },
    async created() {
        this.loading = true;

        let token = window.localStorage.getItem("token");
        if (token) {

            await this.usuarioState.carregarUsuarioLogado()
                .catch(() => {
                    window.localStorage.removeItem("token");
                    this.$router.push({name: 'login'})
                })
        } else {
            await this.$router.push({name: 'login'})
        }

        this.loading = false;
    }
}
</script>

<style scoped>
.loader-overlay {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
