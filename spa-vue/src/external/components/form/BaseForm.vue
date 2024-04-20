<template>
  <form class="base-form">
    <div class="row">
      <slot name="campos"></slot>
    </div>
    <div class="footer">
      <div class="botoesEsquerdo mt-3" v-if="$slots.botoesEsquerdo">
        <div class="row">
          <slot name="botoesEsquerdo"></slot>
        </div>
      </div>
      <div class="botoesDireito mt-3" v-if="$slots.botoesDireito">
        <div class="row">
          <slot name="botoesDireito"></slot>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  name: 'BaseForm'
}
</script>

<style scoped>
.botoesEsquerdo {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.botoesDireito {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.footer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  /*justify-content: center;*/

  /*display: grid;*/
  /*grid-template-columns: repeat(auto-fit, minmax(156px, max-content));*/
  /*justify-content: center;*/
  /*gap: 16px;*/
}
</style>
