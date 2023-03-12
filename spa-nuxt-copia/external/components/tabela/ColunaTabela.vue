<template>
    <td :style="{width: width }" class="td-oculta-texto">
        <div class="item" :style="{width: width }">
            <div class="item-query">
                <span class="overflow">
                    <slot></slot>
                </span>
                <button class="btn-no-icon" @click="click" v-if="btn">
                    <EyeIcon/>
                </button>
            </div>
        </div>
    </td>
</template>

<script>
import EyeIcon from "../icons/EyeIcon";

export default {
    name: "ColunaTabela",
    components: {EyeIcon},
    emits: ['onVer'],
    props: {
        width: {
            default: null
        },
        btn: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        click() {
            this.$emit('onVer');
        }
    }
}
</script>

<style scoped>

.td-oculta-texto .item {
    display: block;
}

.td-oculta-texto .overflow {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.overflow {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.item-query {
    display: flex;
    align-items: center;
    gap: 10px;
}

.item-query .btn-no-icon {
    /* width: 18px; */
    flex-shrink: 0;
}


.btn-no-icon {
    border: none;
    font-weight: normal;
    cursor: pointer;

    background: none;

    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    outline: none;
}

.btn-no-icon:hover {
    opacity: 0.6;
}

.btn-no-icon img {
    height: 18px;
    width: 18px
}
</style>
