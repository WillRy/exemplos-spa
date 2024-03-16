<template>
  <th
    style="{'max-width':width ;}"
  >
    <button @click="sortBy(nome)" v-if="!disabled" type="button">
      <slot></slot>

      <template v-if="!$slots.default">
        <span v-if="info" v-tooltip="{ content: info }">
          {{ texto }}
        </span>
        <span v-else>
          {{ texto }}
        </span>
      </template>

      <SortAscIcon
        v-if="
          (ordenando === nome || ordenando === order) &&
          ordenando &&
          orderMinuscula === 'asc'
        "
      />
      <SortDescIcon
        v-else-if="
          (ordenando === nome || ordenando === order) &&
          ordenando &&
          orderMinuscula === 'desc'
        "
      />

      <SortIcon v-else />
    </button>
    <span v-else-if="!$slots.default">
      {{ texto }}
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </th>
</template>

<script lang="ts">
import { VTooltip } from "floating-vue";

import SortAscIcon from "../icons/SortAscIcon.vue";
import SortDescIcon from "../icons/SortDescIcon.vue";
import SortIcon from "../icons/SortIcon.vue";

export default {
  name: "HeadSort",
  components: { SortIcon, SortDescIcon, SortAscIcon },
  props: ["nome", "order", "texto", "ordenando", "width", "info", "disabled"],
  computed: {
    orderMinuscula() {
      if (!this.order) return "sort";
      return this.order.toLowerCase();
    },
  },
  directives: {
    tooltip: VTooltip,
  },
  methods: {
    sortBy(campo) {
      let sortName = campo;
      let sortOrder = this.order;

      sortName = campo;
      if (sortName !== campo) {
        sortOrder = "asc";
      } else {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
      }

      this.$emit("onSort", {
        sortName: sortName,
        sortOrder: sortOrder,
      });
    },
  },
};
</script>

<style scoped>
th button,
th :deep(button) {
  color: var(--gray-color-700);
  white-space: nowrap;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

th span,
th :deep(span) {
  color: var(--gray-color-700);
  font-weight: 700;
  padding: 0.5rem;
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
