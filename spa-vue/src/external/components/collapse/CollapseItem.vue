<template>
  <CollapseBox :aberto="aberto" @toggle="toggle()">
    <template #header>
      <div class="row">
        <div class="col-sm-3 mr-auto">
          <p>Template de Email</p>
        </div>
        <div class="col-sm-3">
          <p>Criado: 23/12/2021</p>
        </div>
        <div class="col-sm-2">
          <p>Envios: 30</p>
        </div>
      </div>
    </template>
    <template #conteudo>
      <div v-if="aberto && !loading">
        <div class="row">
          <div class="col-sm-3 mr-auto">
            <p>Teste</p>
          </div>
          <div class="col-sm-3">
            <p>Teste</p>
          </div>
          <div class="col-sm-2">
            <p>Teste</p>
          </div>
        </div>
      </div>
      <Loader v-else :corPrincipal="true" height="30px" width="30px" />
    </template>
    <template #action>
      <button class="btn-no-icon">
        <img alt="" src="/img/icons/pesquisa-azul.svg" style="height: 20px; width: 20px" />
      </button>
    </template>
  </CollapseBox>
</template>

<script lang="ts">
import CollapseBox from './CollapseBox.vue'

export default {
  name: 'CollapseItem',
  components: { CollapseBox },
  data() {
    return {
      loading: false,
      aberto: false
    }
  },
  methods: {
    toggle() {
      this.aberto = !this.aberto
      if (this.aberto) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    }
  }
}
</script>

<style scoped></style>
