<template>
    <div class="layout-publico" v-if="!loading">
        <slot />
    </div>
    <div class="loader-overlay" v-if="loading">
        <Loader width="126px" height="126px" :corPrincipal="true"/>
    </div>
</template>

<script>

export default {
    name: "Publico",
    data() {
        return {
            loading: false
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
