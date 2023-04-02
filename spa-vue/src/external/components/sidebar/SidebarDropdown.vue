<template>
  <button class="dropdown-sidebar" @click="toggle" :class="{active: aberto,'url-open': aberto}">
    <div class="sidebar-item" :class="{active: aberto}">
      <div class="sidebar-item-corpo">
        <div class="sidebar-item-badge" v-if="$slots.badge">
          <slot name="badge"></slot>
        </div>
        <div class="icon-menu">
          <slot name="icone"></slot>
        </div>
        <div class="sidebar-item-texto">
          <slot name="texto"></slot>
        </div>
        <ArrowDownSolidIcon class="dropdown-sidebar-icon" size="16px"/>
      </div>
    </div>
    <div class="dropdown-sidebar-content" @click.stop="">
      <slot name="conteudo"></slot>
    </div>
  </button>
</template>

<script>

import ArrowDownSolidIcon from "../icons/ArrowDownSolidIcon.vue";

export default {
  name: "SidebarDropdown",
  components: {ArrowDownSolidIcon},
  inject: ['sidenavAberta'],
  props: {
    abertoInicial: {
      default: false
    },
    sidebarAberta: {
      default: false
    }
  },
  data() {
    return {
      aberto: this.abertoInicial,
    }
  },
  computed: {},
  methods: {
    toggle() {
      this.aberto = !this.aberto;

      this.$emit("toggle", this.aberto);
    },
  },
  watch: {
    abertoInicial(valor) {
      this.aberto = valor;
    },
    sidenavAberta(valor) {
      if (!valor) {
        this.aberto = false;
      }
    }
  }

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

.sidebar-item .icone-normal {
  display: flex;
}

.sidebar-item:hover .icone-normal {
  display: none;
}

.sidebar-item:hover .icone-hover {
  display: flex;
}


.sidebar-item {
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 8px;

  text-decoration: none;
  display: flex;
  border: 1px solid transparent;
  outline: 0;
  color: var(--primary-color-400);
}

.sidebar-item:hover {
  background: var(--primary-color-50);
  color: var(--primary-color-400);
}

.sidebar-item:focus, .dropdown-sidebar:focus .sidebar-item {
  color: var(--primary-color-400);
  border: 1px solid var(--primary-color-400);
  background: var(--primary-color-50);
}

.sidebar-item.active, .dropdown-sidebar.active .sidebar-item {
  background: var(--primary-color-200);
  color: #fff;
}


.sidebar-item :deep(svg path) {
  fill: var(--primary-color-400);
}

.sidebar-item.stroke-icon :deep(svg path) {
  fill: none;
  stroke: var(--primary-color-400);
}


.sidebar-item:hover :deep(svg path) {
  fill: var(--primary-color-400);
}

.sidebar-item.active :deep(svg path) {
  fill: #fff;
}

.sidebar-item.stroke-icon:hover :deep(svg path) {
  fill: none;
  stroke: var(--primary-color-400);
}

.sidebar-item.active.stroke-icon :deep(svg path) {
  fill: none;
  stroke: var(--primary-color-400);
}

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
  grid-template-columns: 46px 1fr 20px;
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
}

.sidebar-item.active .sidebar-item-texto {
  color: #fff;
}

.open .sidebar-item-texto {
  visibility: visible;
}


.sidebar-item-corpo {
  position: relative;
}

.sidebar-item-corpo .sidebar-item-badge {
  position: absolute;
  top: 2px;
  right: -7px;
  height: 24px;
  width: 24px;
}


.dropdown-sidebar {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 6px;
  border: 0;
  padding: 0;
  line-height: 0;
}


.open .sidebar-item-texto {
  visibility: visible;
}


.dropdown-sidebar.active .sidebar-item .sidebar-item-texto {
  color: #fff !important;
}


.dropdown-sidebar .dropdown-sidebar-content > :deep(a.active) {
  color: var(--primary-color-400);
  background: #f4f4f4;
}

.dropdown-sidebar {
  position: relative;
  height: auto !important;
}

.dropdown-sidebar-content {
  display: none;
  width: 100%;
  background: #f2f2f2;
  border: none;
  box-shadow: none;
  border-radius: 8px;
}

.dropdown-sidebar-content > :deep(a) {
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 12px;
  text-decoration: none;
  color: var(--primary-color-400);
  font-weight: 500;
}

.dropdown-sidebar-content > :deep(a):hover:hover {
  color: var(--primary-color-400);
}

.dropdown-sidebar-icon {
  display: block;
}

.active .dropdown-sidebar-icon {
  transform: rotate(-180deg);
}

.open .active .dropdown-sidebar-content {
  display: block;
}

</style>
