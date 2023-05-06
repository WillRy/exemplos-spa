<template>
  <div
      class="sidebar custom-scroll"
      :class="{open: aberto}"
  >
    <div class="logo" @mouseenter.stop="">
      <div class="icon-menu-hamburguer" @click="toggle">
        <ArrowSidebar
            class="arrow-menu arrow-hamburguer"
            v-if="open"
        />
        <HamburguerSidebar
            src="/arrow-menu.svg"
            class="arrow-menu arrow-hamburguer"
            v-if="!open"
        />
      </div>
      <img :src="iconeEmresaSrc" class="logo-empresa"/>
    </div>

    <div class="separador"></div>

    <div class="sidebar-menu">
      <div class="mb-auto">
        <slot></slot>
      </div>

      <div class="menuBottom">
        <slot name="menuBottom"></slot>
      </div>


    </div>
  </div>
</template>

<script>


import SidebarLink from "./SidebarLink.vue";

import ArrowSidebar from "./ArrowSidebar.vue";
import HamburguerSidebar from "./HamburguerSidebar.vue";

import {computed} from "vue";
import MusicasIcon from "../icons/MusicasIcon.vue";

export default {
  name: "Sidebar",
  props: {
    open: {
      type: Boolean,
      default: false
    },
    iconeEmresaSrc: {
      type: String,
      default: '/imidiaapp.svg'
    }
  },
  provide() {
    return {
      sidenavAberta: computed(() => this.aberto)
    }
  },
  data() {
    return {
      aberto: this.open
    };
  },
  watch: {
    open() {
      this.aberto = this.open;
    }
  },
  components: {
    MusicasIcon,
    HamburguerSidebar,
    ArrowSidebar,
    SidebarLink
  },
  methods: {
    tratarDropdown(dropdownAbriu) {
      if (dropdownAbriu && !this.aberto) {
        this.aberto = true;
        this.$emit("change")
      }
    },
    toggle() {
      this.$emit("change")
    },
  },

};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.icon-menu-hamburguer {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px !important;
  flex-shrink: 0;
  height: 36px;
  border-radius: 8px;
}


.icon-menu-hamburguer:hover {
  background: rgba(196, 216, 255, 0.16);
  color: #fff;
}

.icon-menu-hamburguer:focus {
  background: rgba(196, 216, 255, 0.16);
  color: #fff;
}

.sidebar {
  width: 70px;
  background-color: var(--primary-color-principal);
  height: auto;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  box-shadow: 0 3px 6px #00000029;
  overflow-x: hidden;
  overflow-y: overlay;
  display: flex;
  flex-direction: column;

  z-index: 999;

  transition: all 0.5s ease;
}

.sidebar.open {
  width: 250px;
}

.logo {
  display: flex;
  align-items: center;
  text-align: left;
  /* height: 56px; */
  flex-shrink: 0;
  gap: 8px;
  /* padding: 24px 12px 24px 12px; */
  /* margin: 0 auto; */
  margin-left: 12px;
  /* margin-bottom: 5px; */
  /* margin-top: 5px; */
  user-select: none;
  height: 60px;
}

.logo-empresa {
  visibility: hidden;
  user-select: none;
}

.open .logo-empresa {

  visibility: visible;
}

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

.hamburguer:hover {
  opacity: 0.6;
  cursor: pointer;
}

.sidebar-menu {
  text-align: left;
  flex-shrink: 0;
  flex-grow: 1;
  padding: 0;

  display: flex;
  flex-direction: column;
}

.sidebar-menu > div {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.custom-scroll {
  scrollbar-width: 6px;
  scrollbar-color: #a2a2a2 #e6e6e6
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px
}

.custom-scroll::-webkit-scrollbar:horizontal {
  height: 10px
}

.custom-scroll::-webkit-scrollbar-track {
  background: #e6e6e6;
  background-clip: content-box
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #a2a2a2;
  border-radius: 6px
}

.separador {
  height: 1px;
  background: #eff0f2;
  flex-shrink: 0;
  margin-bottom: 40px;
}

.sidebar-item {
  margin-bottom: 6px;
}


.menuBottom {
}

.mb-auto {
  margin-bottom: auto !important;
}
</style>
