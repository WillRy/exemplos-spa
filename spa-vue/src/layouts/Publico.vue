<template>
    <div class="layout-publico" v-if="!loading">
        <RouterView/>
    </div>
    <div class="loader-overlay" v-if="loading">
        <Loader width="126px" height="126px" :corPrincipal="true"/>
    </div>
</template>

<script>
import {usuarioStore} from "../stores/usuario";

export default {
    name: "Publico",
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
        try {
            let token = window.localStorage.getItem("token");
            if (token) {
                await this.$router.push({name: "dashboard"});
            }
        } catch (error) {

        } finally {
            this.loading = false;
        }
    },
}
</script>

<style scoped>
.layout-publico {
    height: 100vh;
    background: #f2f2f2;

    display: flex;
    align-items: center;
    justify-content: center;
}

.loader-overlay {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
