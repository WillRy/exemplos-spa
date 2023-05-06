<template>
  <div>
    <div class="separador"></div>
    <div class="paginacao" v-if="total">
      <div class="total">
        Exibindo de
        <span>{{ numElementoInicial }}</span>
        a
        <span>{{ numElementoFinal }}</span>
        de
        <span>{{ total }}</span>
        {{ total > 1 ? 'resultados' : 'resultado' }}
      </div>
      <div class="paginas">
        <div class="paginas-container" v-if="paginasTotal > 1">
          <button
              @click.prevent="query(1)"
              :disabled="paginaEstaAtiva(1)"
              title="Primeira"
              class="pagina pagina-arrow"
          >
            <ArrowLeftIcon/>
          </button>

          <button
              v-for="pagina in paginas" :key="pagina"
              @click.prevent="query(pagina)"
              :class="{active: paginaEstaAtiva(pagina)}"
              class="pagina"
          >
            {{ pagina }}
          </button>
          <button
              @click.prevent="query(paginasTotal)"
              :disabled="paginaEstaAtiva(paginasTotal)"
              title="Última"
              class="pagina pagina-arrow"
          >
            <ArrowRightIcon/>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ArrowLeftIcon from "../icons/ArrowLeftIcon.vue";
import ArrowRightIcon from "../icons/ArrowRightIcon.vue";

export default {
  name: "PaginacaoSemRouter",
  components: {ArrowRightIcon, ArrowLeftIcon},
  props: {
    exibirTotal: false,
    porPagina: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    paginaAtual: {
      type: Number,
      default: 1
    }
  },
  methods: {
    query(pagina) {
      this.$emit("onChange", pagina);
    },
    paginaEstaAtiva(pagina) {
      return pagina === this.paginaAtual;
    }
  },
  computed: {
    numElementoInicial() {
      const offset = (this.paginaAtual - 1);
      const offsetNormalizado = this.paginaAtual * this.porPagina - this.porPagina;
      return offsetNormalizado + 1;
    },
    numElementoFinal() {
      return this.paginaAtual * this.porPagina;
    },
    paginas() {
      const current = this.paginaAtual;
      const range = 9;
      const offset = Math.ceil(range / 2);
      const total = this.paginasTotal;
      const pagesArray = [];

      for (let i = 1; i <= total; i++) {
        pagesArray.push(i);
      }

      pagesArray.splice(0, current - offset);
      pagesArray.splice(range, total);

      return pagesArray;
    },
    paginasTotal() {
      const total = this.total / this.porPagina;
      return total !== Infinity ? Math.ceil(total) : 0;
    },
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.paginacao {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.paginas-container {
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  list-style: none;
}

.pagina {
  width: 42px;
  height: 42px;
  border: 1px solid #EFF0F2;
  color: var(--primary-color-principal-hover);
  cursor: pointer;
  padding: 10px;
  user-select: none;
  background: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.pagina:disabled {
  background: var(--gray-200);
  color: var(--gray-300);
  cursor: not-allowed;
}

.pagina.router-link-exact-active, .pagina:hover:not(:disabled), .active {
  background: var(--primary-color-principal-hover);
  color: #fff;
  border: none;
}

.pagina-arrow:first-of-type {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  font-weight: bold;
}

.pagina-arrow:first-of-type :deep(path) {
  fill: var(--primary-color-principal-hover);
}

.pagina-arrow:first-of-type:hover:not(:disabled) :deep(path) {
  fill: #fff;
}

.pagina-arrow:first-of-type:disabled :deep(path) {
  fill: var(--gray-300);
}

.pagina-arrow:first-of-type:disabled {
  border-right: 0;
}

.pagina-arrow:last-of-type {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  font-weight: bold;
}

.pagina-arrow:last-of-type :deep(path) {
  fill: var(--primary-color-principal-hover);
}

.pagina-arrow:last-of-type:hover:not(:disabled) :deep(path) {
  fill: #fff;
}

.pagina-arrow:last-of-type:disabled :deep(path) {
  fill: var(--gray-300);
}

.pagina-arrow:last-of-type:disabled {
  border-left: 0;
}


.total:not(span) {
  color: var(--primary-color-principal-active);
}

.total span {
  color: var(--primary-color-900) !important;
  font-weight: bold;
}

.separador {
  height: 1px;
  background: #EFF0F2;
  margin: 20px 0;
}

</style>
