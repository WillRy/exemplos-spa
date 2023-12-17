<template>
  <th style="{'max-width': width}">
    <button @click="$emit('onSort')" v-if="!disabled" type="button">
      <span v-if="info" v-tooltip="{content: info}">
        {{ texto }}
      </span>
      <span v-else>
        {{ texto }}
      </span>

      <!--      {{ texto }}-->

      <SortAscIcon v-if="(ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'asc'"/>
      <SortDescIcon
          v-else-if="(ordenando === nome || ordenando === order) && ordenando && orderMinuscula === 'desc'"/>

      <SortIcon v-else/>

      <!--      <InfoIcon v-if="info" class="info" v-tooltip="{content: info}"/>-->
    </button>
    <span v-else>{{ texto }}</span>
  </th>
</template>

<script>
import {
  VTooltip,
} from 'floating-vue'


import InfoIcon from "../icons/InfoIcon.vue";
import SortAscIcon from "../icons/SortAscIcon.vue";
import SortDescIcon from "../icons/SortDescIcon.vue";
import SortIcon from "../icons/SortIcon.vue";

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
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
}

th span {
  color: var(--gray-700);
  font-weight: bold;
  padding: 0.5rem 0.5rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1rem;
}

.info {
  width: 16px;
  height: 16px;
  margin-left: 6px;
}
</style>
