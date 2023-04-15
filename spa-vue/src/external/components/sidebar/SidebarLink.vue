<template>
  <router-link
      class="sidebar-item"
      :to="route"
  >
    <div class="sidebar-item-corpo">
      <div class="icon-menu icone" v-if="$slots.icone">
        <slot name="icone"></slot>
      </div>
      <div class="icon-menu icone-normal" v-if="$slots['icone-normal']">
        <slot name="icone-normal"></slot>
      </div>
      <div class="icon-menu icone-hover" v-if="$slots['icone-hover']">
        <slot name="icone-hover"></slot>
      </div>
      <div class="icon-menu icone-active" v-if="$slots['icone-active']">
        <slot name="icone-active"></slot>
      </div>
      <span class="sidebar-item-texto">
        <slot name="texto"></slot>
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "SidebarLink",
  props: {
    route: {
      type: [Object, String]
    },
    active: {
      type: Boolean,
      default: false
    }
  },

}
</script>

<style scoped>

.icon-menu {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /*flex-grow: 1;*/
}

.open .icon-menu {
  flex-grow: 0;
}

.sidebar-item .icone-hover {
  display: none;
}

.sidebar-item .icone-active {
  display: none;
}

.sidebar-item .icone-normal {
  display: flex;
}

.sidebar-item:hover .icone-normal {
  display: none;
}

.sidebar-item:hover .icone-hover {
  display: flex;
}

.sidebar-item:hover .icone-active {
  display: none;

}

.router-link-exact-active .icone-hover,
.router-link-exact-active .icone-normal {
  display: none;
}

.router-link-exact-active .icone-active,
.sidebar-item.active .icone-active {
  display: flex;
}


/*
* INICIO DO BLOCO DE ESTILO DE LINK
*/
.sidebar-item {
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  text-decoration: none;
  display: flex;
  border: 1px solid transparent;
  outline: 0;
  color: #fff;

  margin-bottom: 6px;

  position: relative;
}

.sidebar-item :deep(svg path) {
  fill: #fff;
}


.sidebar-item:hover {
  background: rgba(196, 216, 255, 0.16);
  color: #fff;
}

.sidebar-item:hover :deep(svg path) {
  fill: #fff;
}


.sidebar-item.active,
.router-link-exact-active,
.dropdown-sidebar.active .sidebar-item {
  background: rgba(196, 216, 255, 0.16);
  color: #fff;
}

.sidebar-item.active::before,
.router-link-exact-active::before,
.dropdown-sidebar.active .sidebar-item::before {
  width: 4px;
  background: #fff;
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.sidebar-item.active :deep(svg path),
.router-link-exact-active:deep(svg path) {
  fill: #fff;
}


.sidebar-item:focus:not(.active):not(.router-link-exact-active),
.dropdown-sidebar:focus:not(.active):not(.router-link-exact-active) .sidebar-item {
  background: rgba(196, 216, 255, 0.16);
  color: #fff;
}


/*
* FIM DO BLOCO DE ESTILO DE LINK
*/


/** Icones **/
.sidebar-item img.icon-noactive {
  display: block;
}

.sidebar-item img.active {
  display: none;
}

.sidebar-item:hover img.icon-noactive,
.sidebar-item.url-open img.icon-noactive {
  display: none;
}

.sidebar-item:hover img.active,
.sidebar-item.url-open img.active {
  display: block;
}


.sidebar-item-corpo {
  width: 100%;
  display: grid;
  grid-template-columns: 66px 1fr 20px;
  align-items: center;
  height: 36px;
  padding: 0px 10px 0px 0px;
}

.sidebar-item-texto {
  font-size: 14px;
  vertical-align: middle;
  flex: 1;
  word-break: keep-all;
  white-space: nowrap;
  visibility: hidden;
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: 500;

  opacity: 0;

  transition: opacity 0.5s;
}

.sidebar-item.active .sidebar-item-texto {
  color: #fff;
}

.open .sidebar-item-texto {
  visibility: visible;

  opacity: 1;
}


</style>