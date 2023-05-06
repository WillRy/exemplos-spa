<template>
    <div class="content-table">
        <div class="p-sm">
            <slot name="header">

            </slot>
        </div>

        <div class="tabela-container" :class="{loading: loading}">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script>
export default {
    name: "ContentTable",
    props: [
        'loading'
    ]
}
</script>

<style scoped>
.content-table {
    padding: 20px 0;
    background: #fff;
    border-radius: var(--radius-principal);
}
</style>
