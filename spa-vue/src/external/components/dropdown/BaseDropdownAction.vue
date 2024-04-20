<template>
  <div class="dropdown-action-container">
    <VDropdown :triggers="[]" :shown="open" :distance="4" placement="bottom">
      <button
        class="dropdown-acoes-btn"
        :class="{ 'disabled-btn': disabled }"
        @click.stop="toggle"
        :disabled="disabled"
      >
        <DotsIcon />
      </button>

      <!-- This will be the content of the popover -->
      <template #popper>
        <div v-click-away="() => (open = false)" class="dropdown-acoes" @click.stop="toggle">
          <slot></slot>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { Dropdown } from 'floating-vue'
import { directive } from '../../directives/click-away'
import DotsIcon from '../icons/DotsIcon.vue'

export default {
  name: 'DropdownAcoes',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VDropdown: Dropdown,
    DotsIcon
  },
  directives: {
    'click-away': directive
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    toggle() {
      if (this.disabled) return

      this.open = !this.open
    }
  }
}
</script>

<style scoped>
.dropdown-action-container {
  display: inline-block;
}

img {
  height: 22px;
  min-width: 28px;
  display: block;
}

.dropdown-acoes {
  width: auto;
  display: flex;
  flex-direction: column;
}

.dropdown-acoes::v-deep button,
.dropdown-acoes::v-deep a {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  text-decoration: none;
  color: #444444;
  margin: 0;
  width: 100%;
  text-align: left;

  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: var(--primary-color-principal);
  border-radius: 8px;
  outline: 0;
  font-size: 1rem;
  flex-shrink: 0;
}

.dropdown-acoes::v-deep button:hover,
.dropdown-acoes::v-deep a:hover {
  background: #f2f2f2;
}

.dropdown-acoes::v-deep button:focus-within,
.dropdown-acoes::v-deep a:focus-within {
  background: #f2f2f2;
}

.dropdown-acoes::v-deep button:disabled,
.dropdown-acoes::v-deep a:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.dropdown-acoes::v-deep img {
  height: 24px;
  width: 24px;
  margin-right: 8px;
  display: block;
}

.dropdown-acoes-btn {
  margin: 0;
  padding: 0;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  background: transparent;
  cursor: pointer;
}

.dropdown-acoes-btn :deep(svg path) {
  fill: var(--primary-color-principal);
}

.disabled-btn {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
