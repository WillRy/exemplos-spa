<template>
  <div class="dropdown-header" @click="toggle" v-click-away="() => clickFora()">
    <div class="dropdown-header-texto">
      {{ $i18n.locale }}
      <img src="../../assets/arrow-down-branca.svg" />
    </div>
    <div class="dropdown-header-corpo" :class="{ aberto: aberto }">
      <ul>
        <li>
          <button @click="mudarIdioma('pt-BR')">Português</button>
        </li>
        <li>
          <button @click="mudarIdioma('en')">Inglês</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { usuarioStore } from '../../stores/usuario'

export default {
  name: 'DropdownIdioma',
  setup() {
    const usuarioState = usuarioStore()
    return {
      usuarioState
    }
  },
  data() {
    return {
      aberto: false
    }
  },
  methods: {
    toggle() {
      this.aberto = !this.aberto
    },

    clickFora() {
      this.aberto = false
    },
    mudarIdioma(lang) {
      // const route = this.$router.resolve({
      //   params: {
      //     lang: lang
      //   }
      // });
      // window.location.href = route.fullPath;

      this.$router.push({
        params: {
          lang: lang
        }
      })
    }
  }
}
</script>

<style scoped>
.dropdown-header {
  height: 100%;
  display: flex;
  position: relative;
  /* padding: 12px; */
  justify-content: center;
  padding: 12px;
  cursor: pointer;
}

.dropdown-header:hover .dropdown-header-texto {
}

.dropdown-header-texto {
  color: #fff;
  display: flex;
  align-items: center;
  align-self: center;
  /* justify-content: space-between; */
  height: 100%;
  gap: 6px;
}

.dropdown-header-texto img {
  height: 24px;
  width: 24px;
}

.dropdown-header-corpo {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 6px #00000029;

  display: none;
  overflow: hidden;
}

.dropdown-header-corpo.aberto {
  display: block;
}

.dropdown-header-corpo ul {
  list-style: none;
}

.dropdown-header-corpo a,
.dropdown-header-corpo button {
  padding: 8px 12px;
  width: 100%;
  display: flex;
  align-items: center;
  height: 40px;
  color: #7e84a3;
  font-size: 14px;
  vertical-align: middle;
  flex: 1;
  word-break: keep-all;
  white-space: nowrap;
  /* visibility: hidden; */
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}
.dropdown-header-corpo button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-header-corpo a:hover,
.dropdown-header-corpo button:hover {
  background-color: #f2f2f2;
}
</style>
