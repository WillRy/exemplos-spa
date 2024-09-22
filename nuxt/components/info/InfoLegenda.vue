<template>
    <div class="legenda">
        <InfoInputIcon size="14px" class="icone-footer" v-if="exibirIcone"/>
        <slot></slot>
    </div>
</template>

<script>
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
       }
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

.legenda > svg {
    flex-shrink: 0;
    width: 14px;
    margin-right: 8px;
}

.icone-footer {
  flex-shrink: 0;
  margin-right: 8px;
}
</style>
