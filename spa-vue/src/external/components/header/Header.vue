<template>
  <div class="header" >
    <div class="container-fluid paddingSidebar">
      <div class="header-box">
        <div class="box-direito">
          <slot name="boxDireito"></slot>
        </div>
        <div class="box-esquerdo">
          <slot name="boxEsquerdo"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    paddingLeft: {
      type: String,
      default: '250px'
    }
  }
};
</script>

<style scoped>
.header {
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 2px 2px #00000029;
  width: 100%;

  display: flex;
  align-items: stretch;
  position: fixed;
  top: 0;
  z-index: var(--z-index-2);

}

.header-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.box-esquerdo {
  margin-left: auto;
}

.paddingSidebar {
  transition: all 0.5s ease;
}
</style>
