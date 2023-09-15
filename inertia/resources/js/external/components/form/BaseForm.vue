<template>
    <form class="base-form">
        <div class="campos">
            <slot name="campos"></slot>
        </div>
        <div class="botoes mt-3">
            <slot name="botoes"></slot>
        </div>
    </form>

</template>

<script>
export default {
    name: "BaseForm"
}
</script>

<style scoped>
.botoes {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-2);
}


</style>
