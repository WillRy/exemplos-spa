<template>
    <div class="navegacao-abas-container">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "NavegacaoAbas"
}
</script>

<style scoped>
.navegacao-abas-container {
    display: flex;
    gap: 4px;
    background: var(--primary-color-400);
    box-shadow: inset 0px 2px 4px #00000029;
    overflow: hidden;
    border-radius: 8px;
    width: max-content;
    padding: 4px;
}


</style>
