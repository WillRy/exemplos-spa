<template>
    <div class="legenda" :class="{ 'input-mode': inputMode }">
        <InfoInputIcon size="14px" class="icone-footer" v-if="exibirIcone" />
        <slot></slot>
    </div>
</template>

<script lang="ts">
import InfoInputIcon from '../icons/InfoInputIcon.vue';

export default {
    name: "ActionText",
    components: {
        InfoInputIcon,
    },
    props: {
        exibirIcone: {
            type: Boolean,
            default: true
        },
        inputMode: {
            type: Boolean,
            default: false,
        },
    }
}
</script>

<style scoped>
.info {
    display: flex;
}

.legenda {
    display: flex;
    font-size: 0.75rem;
    line-height: 0.9975rem;
    font-weight: normal;
    margin: 0;
    font-style: italic;
    color: var(--gray-color-400);
    padding-left: var(--padding-text);
}

.legenda>svg {
    flex-shrink: 0;
    width: 14px;
    margin-right: 8px;
}

.icone-footer {
    flex-shrink: 0;
    margin-right: 8px;
}

.input-mode {
  padding-left: 16px;
  margin-top: var(--spacing-1);
}
</style>
