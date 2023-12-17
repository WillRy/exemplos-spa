<template>
  <div :class="{ 'table-responsive': responsive }">
      <table class="tabela" :class="{ loading: loading, listras: listras, 'auto': tableLayout === 'auto', 'fixed': tableLayout === 'fixed' }">
          <thead>
          <th v-if="checkbox" style="vertical-align: middle">
              <div style="display: flex;align-items: center; justify-content: center">
                  <BaseCheckbox v-model="checkedAll" @onCheckChange="notificaMarcacao"/>
              </div>
          </th>
          <HeadSort
              @onSort="sortBy(coluna.order ? coluna.order : coluna.nome)"
              v-for="(coluna, index) in colunasSemCheckbox"
              :info="coluna.info"
              :key="index"
              :nome="coluna.nome"
              :texto="coluna.texto"
              :ordenando="sortName"
              :order="sortOrder"
              :disabled="coluna.disabled"
          />
          <slot name="acoes" v-if="$slots.acoes"></slot>
          </thead>
          <tbody v-if="dados && dados.length">
          <slot name="colunas" :dados="dados" v-if="$slots.colunas"></slot>

          <template v-else>
              <tr v-for="(dado,index) in dadosAgrupados" :key="index">
                  <ColunaTabela
                      v-for="(col, index2) in dado.colunas"
                      :key="`colunas-${index2}`"
                      :width="col.width"
                      :justify="col.justify"
                  >
                      <template v-if="!$slots['table-row']">
                          {{col.dado}}
                      </template>
                      <slot name="table-row" :row="dado.row" :coluna="col" :index="index"></slot>
                  </ColunaTabela>
              </tr>
          </template>
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
              <Loader width="3%" height="3%" :cor-principal="true"/>
          </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
import HeadSort from "./HeadSort.vue";
import Loader from "../Loader.vue";
import ColunaTabela from "./ColunaTabela.vue";
import BaseCheckbox from "../form/BaseCheckbox.vue";

export default {
  name: "Tabela",
  components: {BaseCheckbox, ColunaTabela, Loader, HeadSort},
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
      checkbox: {
          type: Boolean,
          default: false
      },
      tableLayout: {
        type: String,
        default: "auto",
        validator(value) {
            return ["auto", "fixed"].includes(value);
        }
      }
  },
  data() {
      return {
          checkedAll: false
      };
  },
  computed: {
      colunasComCheckbox() {
         const colunas = this.colunas;

         if(this.checkbox) {
             colunas.unshift({
                 nome: 'checkbox',
                 texto: '',
                 width: '80px',
                 justify: 'center'
             })
         }

         return colunas;
      },
      colunasSemCheckbox() {
        return this.colunas.filter((col) => col.nome !== 'checkbox')
      },
      dadosAgrupados() {

          let resultado = [];
          this.dados.forEach((dado) => {
              let dadosRow = []

              for (const coluna of this.colunasComCheckbox) {

                  const valor = dado[coluna.nome]

                  dadosRow.push({
                      ...coluna,
                      dado: valor
                  });
              }

              resultado.push({
                  row: dado,
                  colunas: dadosRow
              });
          })

          return resultado;


      }
  },
  methods: {
      notificaMarcacao($event) {
          this.$emit('onCheckChange', $event)
      },
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
</style>