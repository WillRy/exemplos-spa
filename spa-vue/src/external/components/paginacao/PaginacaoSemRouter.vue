<template>
  <div>
    <div class="separador" v-if="separador"></div>
    <div class="paginacao" v-if="total">
      <div class="total" v-html="textoPaginacao"></div>
      <div class="paginas">
        <div class="paginas-container" v-if="paginasTotal > 1">
          <button
            @click.prevent="query(1)"
            :disabled="paginaEstaAtiva(1)"
            title="Primeira"
            class="pagina pagina-arrow"
          >
            <ArrowLeftIcon />
          </button>

          <ActionText
            v-for="pagina in paginas"
            :key="pagina"
            @click.prevent="query(pagina)"
            :class="{ active: paginaEstaAtiva(pagina) }"
            class="pagina"
          >
            {{ pagina }}
          </ActionText>
          <button
            @click.prevent="query(paginasTotal)"
            :disabled="paginaEstaAtiva(paginasTotal)"
            title="Última"
            class="pagina pagina-arrow"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useConfigStore } from "../../store/config";
import ArrowLeftIcon from "../icons/ArrowLeftIcon.vue";
import ArrowRightIcon from "../icons/ArrowRightIcon.vue";
import ActionText from "../text/ActionText.vue";

export default {
  name: "PaginacaoSemRouter",
  components: { ArrowRightIcon, ArrowLeftIcon, ActionText },
  props: {
    exibirTotal: {
        type: Boolean,
        default: false
    },
    porPagina: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    paginaAtual: {
      type: Number,
      default: 1,
    },
    separador: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const config = useConfigStore()
    return {
      config: config
    }
  },
  methods: {
    query(pagina) {
      this.$emit("onChange", pagina);
    },
    paginaEstaAtiva(pagina) {
      return pagina === this.paginaAtual;
    },
  },
  computed: {
    textoInformado() :string {
      const ptBr =
        "Exibindo [INICIO] a [FIM] de [TOTAL] [TXT_RESULTADO=resultado|resultados]";
      const en =
        "Displaying [INICIO] to [FIM] of [TOTAL] [TXT_RESULTADO=result|results]";

      let textoFinal = this.config.config.textoPaginacaoTabela || ptBr;

      const isBrowser = window !== undefined;
      if (isBrowser && !textoFinal) {
        const idioma = document.documentElement.lang;

        textoFinal = ptBr;

        if (idioma.includes("en")) {
          textoFinal = en;
        }

        if (idioma.includes("pt-BR")) {
          textoFinal = ptBr;
        }
      }

      return textoFinal;
    },
    textoPaginacao() {
      let textoSendoTradado = this.textoInformado
        .replace("[INICIO]", `<span>${this.numElementoInicial}</span>`)
        .replace("[FIM]", `<span>${this.numElementoFinal}</span>`)
        .replace("[TOTAL]", `<span>${this.total}</span>`);

      // Use regex para extrair o valor após o sinal de igual em [TXT_RESULTADO=resultado|resultados]
      let matchResultado = /\[TXT_RESULTADO=([^|\]]+)\|([^|\]]+)\]/.exec(
        textoSendoTradado
      );

      // Se houver uma correspondência, substitua [TXT_RESULTADO=resultado|resultados] pelo valor correto
      if (matchResultado) {
        let valorResultado = this.total <= 1 ? matchResultado[1] : matchResultado[2];
        textoSendoTradado = textoSendoTradado.replace(matchResultado[0],valorResultado);
      }

      return textoSendoTradado;
    },
    numElementoInicial() {
      const offsetNormalizado =
        this.paginaAtual * this.porPagina - this.porPagina;
      return offsetNormalizado + 1;
    },
    numElementoFinal() {
      if (this.paginasTotal === this.paginaAtual) {
        return this.total;
      }

      return this.paginaAtual * this.porPagina;
    },
    paginas() {
      const current = this.paginaAtual;
      const range = 9;
      const offset = Math.ceil(range / 2);
      const total = this.paginasTotal;
      const pagesArray: Array<number> = [];

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
  },
  created() {},
};
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
  flex-wrap: wrap;
  list-style: none;
}

.pagina {
  width: 42px;
  height: 42px;
  border: 1px solid #eff0f2;
  color: var(--primary-color-principal);
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
  background: var(--gray-color-200);
  color: var(--gray-color-300);
  cursor: not-allowed;
}

.pagina:hover:not(:disabled):not(.active) {
  background: var(--primary-color-principal-hover);
  color: #fff;
  border: none;
}

.pagina.router-link-exact-active,
.active {
  background: var(--primary-color-principal-active);
  color: #fff;
  border: none;
}

.pagina-arrow:first-of-type {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  font-weight: bold;
}

.pagina-arrow:first-of-type :deep(path) {
  fill: var(--primary-color-principal);
}

.pagina-arrow:first-of-type:hover:not(:disabled) :deep(path) {
  fill: #fff;
}

.pagina-arrow:first-of-type:disabled :deep(path) {
  fill: var(--gray-color-300);
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
  fill: var(--primary-color-principal);
}

.pagina-arrow:last-of-type:hover:not(:disabled) :deep(path) {
  fill: #fff;
}

.pagina-arrow:last-of-type:disabled :deep(path) {
  fill: var(--gray-color-300);
}

.pagina-arrow:last-of-type:disabled {
  border-left: 0;
}

.total:not(span) {
  color: var(--text-color);
}

.total span {
  color: var(--primary-color-900) !important;
  font-weight: bold;
}

.separador {
  height: 1px;
  background: #eff0f2;
  margin: 20px 0;
}
</style>
