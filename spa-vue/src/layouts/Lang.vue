<template>
    <RouterView/>
</template>

<script>
import {usuarioStore} from "../stores/usuario";

export default {
    name: "Publico",
    created(){
        
    }
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
