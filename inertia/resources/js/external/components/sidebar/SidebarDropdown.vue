<template>
  <button class="dropdown-sidebar" @click="toggle" :class="{ active: aberto, 'url-open': aberto }">
    <div class="sidebar-item" :class="{ active: aberto }">
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
        <ArrowDownIcon class="dropdown-sidebar-icon" size="16px" />
      </div>
    </div>
    <div class="dropdown-sidebar-content" @click.stop="">
      <slot name="conteudo"></slot>
    </div>
  </button>
</template>

<script>
import ArrowDownIcon from '../icons/ArrowDownIcon.vue'

export default {
  name: 'SidebarDropdown',
  components: { ArrowDownIcon },
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
      aberto: this.abertoInicial
    }
  },
  computed: {},
  methods: {
    toggle() {
      this.aberto = !this.aberto

      this.$emit('toggle', this.aberto)
    }
  },
  watch: {
    abertoInicial(valor) {
      this.aberto = valor
    },
    sidenavAberta(valor) {
      if (!valor) {
        this.aberto = false
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

  text-decoration: none;
  display: flex;
  border: 1px solid transparent;
  outline: 0;
  color: #fff;

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
  grid-template-columns: 60px 1fr 20px;
  align-items: center;
  height: 36px;
  padding: 0px 10px 0px 0px;
}

.sidebar-item-texto {
  font-size: 0.875rem;
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
  color: var(--primary-color-principal);
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
}

.dropdown-sidebar-content > :deep(a) {
  padding-left: 66px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 0.75rem;
  text-decoration: none;
  color: var(--primary-color-principal);
  font-weight: 500;
}

.dropdown-sidebar-content > :deep(a):hover {
  color: var(--primary-color-principal);
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
