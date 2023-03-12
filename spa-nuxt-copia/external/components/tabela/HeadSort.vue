<template>
    <th style="{'max-width': width}">
        <button @click="$emit('onSort')" v-if="!disabled" type="button">
            <SortAscIcon v-if="(ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'asc'"/>
            <SortDescIcon
                v-else-if="(ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'desc'"/>

            <SortIcon v-else/>
            {{ texto }}

            <InfoIcon v-if="info" class="info" v-tooltip="{content: info}"/>
        </button>
        <span v-else>{{ texto }}</span>
    </th>
</template>

<script>
import {
  VTooltip,
} from 'floating-vue'


import InfoIcon from "../icons/InfoIcon";
import SortAscIcon from "../icons/SortAscIcon";
import SortDescIcon from "../icons/SortDescIcon";
import SortIcon from "../icons/SortIcon";

export default {
    name: "HeadSort",
    components: {SortIcon, SortDescIcon, SortAscIcon, InfoIcon},
    props: ['nome', 'order', 'texto', "ordenando", 'width', 'info', 'disabled'],
    computed: {
        orderMinuscula() {
            if (!this.order) return "sort";
            return this.order.toLowerCase();
        }
    },
    directives: {
        tooltip: VTooltip
    }
}
</script>

<style scoped>
th button {
    color: rgb(75 85 99);
    font-weight: 500;
    font-size: .875rem;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
}

th span {
    color: rgb(75 85 99);
    font-weight: 500;
    font-size: .875rem;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
    white-space: nowrap;
    display: flex;
    align-items: center;
    background: none;
    border: none;
}

.info {
    width: 16px;
    height: 16px;
    margin-left: 6px;
}
</style>
