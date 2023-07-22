<template>
  <div :class="{ 'table-responsive': responsive }">
    <table class="tabela" :class="{ loading: loading, listras: listras }">
      <thead>
        <HeadSort
          @onSort="sortBy(coluna.order ? coluna.order : coluna.nome)"
          v-for="(coluna, index) in colunas"
          :info="coluna.info"
          :key="index"
          :nome="coluna.nome"
          :texto="coluna.texto"
          :ordenando="sortName"
          :order="sortOrder"
          :disabled="coluna.disabled"
        />
        <slot name="acoes" v-if="$slots.acoes"> </slot>
      </thead>
      <tbody v-if="dados && dados.length">
        <slot name="colunas" :dados="dados"></slot>
      </tbody>
      <tbody
        v-if="(!dados && !loading) || (dados && dados.length === 0 && !loading)"
        class="tabela-vazia"
      >
        <tr v-if="!loading">
          <td colspan="99999">{{ textoEmpty }}</td>
        </tr>
      </tbody>
      <tbody v-if="loading">
        <tr class="overlay">
          <Loader width="3%" height="3%" :cor-principal="true" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import HeadSort from "./HeadSort.vue";
import Loader from "../Loader.vue";

export default {
  name: "Tabela",
  components: { Loader, HeadSort },
  props: {
    responsive: {
      type: Boolean,
      default: true,
    },
    listras: {
      type: Boolean,
      default: true,
    },
    textoEmpty: {
      type: String,
      default: "Não há dados",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    colunas: {
      type: Array,
      default: () => [],
    },
    dados: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    sortName: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: String,
      default: "asc",
    },
  },
  data() {
    return {};
  },
  methods: {
    sortBy(campo) {
      let sortName = campo;
      let sortOrder = this.sortOrder;

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
.table-responsive {
  min-height: 0.01%;
  overflow-x: auto;
}
</style>
