<template>
  <div :class="{open: aberto}" class="collapse-box">
    <div class="collapse-header" @click="analizeAbrir">
      <div class="collapse-header-content">
        <slot name="header"></slot>
      </div>
      <div class="collapse-action" @click.stop="">
        <slot name="btn-esquerdo"></slot>
        <button class="collapse-toggle" @click.stop="toggle">
          <ArrowDownSolidIcon :size="'18px'"/>
        </button>
        <slot name="btn-direito"></slot>
      </div>
    </div>
    <div v-if="aberto" ref="content" class="collapse-content">
      <slot name="conteudo"></slot>
    </div>
  </div>
</template>

<script>
import ArrowDownSolidIcon from "../icons/ArrowDownSolidIcon.vue";

export default {
  name: "CollapseBox",
  props: {
    aberto: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    analizeAbrir(event) {
      if (event.target.href)
        return event.preventDefault();
      this.toggle();
    }
  },
  created() {
  },
  components: {ArrowDownSolidIcon}
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.collapse-box {
  max-height: 99999px;
  border-radius: 6px;
  margin-bottom: 20px;
}


.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  min-height: 60px;
  background: #FFFFFF;
  position: relative;
  cursor: pointer;

  border: 1px solid #70707029;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}


.open .collapse-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.collapse-header-content {
  flex: 1;
}

.collapse-content {
  padding: 20px;
  flex: 1;
  background: #F5F5F5;
  border-right: 1px solid #70707029;
  border-left: 1px solid #70707029;
  border-bottom: 1px solid #70707029;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.collapse-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 10px;
  gap: 10px;
}

.collapse-toggle {
  border: none;
  font-weight: normal;
  cursor: pointer;
  background: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.collapse-box.open .collapse-toggle {
  transform: rotate(-180deg);
}

.collapse-action:deep(button) {
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: bold;
}
</style>
