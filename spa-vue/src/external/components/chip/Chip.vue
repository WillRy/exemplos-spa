<template>
    <div class="chip" @click="emit('onClick')" :class="{ clickable: click }">
        <slot></slot>
        <button class="btn-excluir" v-if="showDelete">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click="deleteChip">
                <path
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z">
                </path>
            </svg></button>
    </div>
</template>
<script setup>
defineProps({
    showDelete: {
        type: Boolean,
        default: false
    },
    click: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['onDelete', 'onClick'])

const deleteChip = () => {
    emit('onDelete')
}
</script>
<style scoped>
.chip {
    box-sizing: border-box;
    padding: 6px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-primary-principal);
    color: #fff;
    gap: 6px;
    max-width: 100%;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1 !important;
    font-size: .875rem;
}

.chip.clickable {
    cursor: pointer;
}

.btn-excluir {
    color: #fff;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    width: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-excluir svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    fill: #fff;
}
</style>