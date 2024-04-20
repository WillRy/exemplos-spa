<template>
  <div id="loader" class="loader">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :style="{ height: height, width: width, padding: padding }"
      viewBox="0 0 24 24"
    >
      <path
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        class="spinner_aj0A"
        :class="{ 'fill-principal': corPrincipal }"
        :style="{ fill: !corPrincipal }"
      />
    </svg>
    <p v-if="$slots.default">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    height: {
      default: '20px'
    },
    width: {
      default: '20px'
    },
    fill: {
      default: '#fff'
    },
    padding: {
      default: '0px'
    },
    corPrincipal: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
svg * {
  width: 100%;
  height: 100%;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.fill-principal {
  fill: var(--primary-color-principal);
}

.spinner_aj0A {
  transform-origin: center;
  animation: spinner_KYSC 0.75s infinite linear;
}
@keyframes spinner_KYSC {
  100% {
    transform: rotate(360deg);
  }
}

p {
  font-size: 1rem;
  text-align: center;
  margin: 12px 0;
}
</style>
