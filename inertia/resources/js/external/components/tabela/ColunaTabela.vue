<template>
    <td :style="{width: width, padding: paddingColuna }" class="td-oculta-texto">
        <div class="item" :style="{width: width }" v-if="esconderTexto">
            <div class="item-query" :style="{justifyContent: justify}">
                <span class="overflow">
                    <slot></slot>
                </span>
                <button class="btn-no-icon" @click="click" v-if="btn">
                    <EyeIcon/>
                </button>
            </div>
        </div>
        <div v-else>
            <slot></slot>
        </div>
    </td>
</template>

<script>
import EyeIcon from "../icons/EyeIcon.vue";

export default {
    name: "ColunaTabela",
    components: {EyeIcon},
    emits: ['onVer'],
    props: {
        paddingColuna: {
            default: '0.5rem 0.5rem'
        },
        width: {
            default: null
        },
        btn: {
            type: Boolean,
            default: false
        },
        justify: {
            type: String,
            default: 'flex-start'
        },
        esconderTexto: {
            type: Boolean,
            default: true
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

td {
    vertical-align: middle;
}

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
