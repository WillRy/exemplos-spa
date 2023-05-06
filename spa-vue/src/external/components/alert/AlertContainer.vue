<template>
  <div class="alert-container" :class="{shakeContainer: temAlertQueDeveTremer}" @click="clickContainer">
    <Alert
        v-for="alert in alertState.alerts"
        :key="alert.id"
        :alert="alert"
    />
  </div>
</template>

<script>
import {useAlertStore} from "../../store/alert";
import Alert from "./Alert.vue";

export default {
  name: "AlertContainer",
  components: {Alert},
  setup() {
    const alertState = useAlertStore();
    return {alertState};
  },
  data() {
    return {
      shake: false
    }
  },
  computed: {
    temAlertQueDeveTremer() {
      return this.alertState.alerts.filter((a) => a.tipo === 'error').length > 0
    }
  },
  methods: {
    clickContainer() {

      if (!this.temAlertQueDeveTremer) {
        return false;
      }


      //necessario por bug de animação
      const alertError = document.querySelectorAll('.alert-container .error');
      Array.from(alertError).forEach((el) => {
        el.classList.add("shaking")

        el.addEventListener("animationend", (event) => {
          event.currentTarget.classList.remove('shaking')
        })
      })

    }
  }
}
</script>

<style scoped>
.alert-container {
  position: fixed;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-3);
  /* width: 100%; */
  left: 50%;
  transform: translate(-50%, 0%);
}

.shakeContainer {
  height: 100%;
  width: 100%;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(0, 0) rotate(0);
  }
}

.shaking {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>