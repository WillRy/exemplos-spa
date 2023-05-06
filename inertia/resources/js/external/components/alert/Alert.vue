<template>
  <div class="alert" :class="{[classeTipo]: classeTipo}" ref="alert">
    <div class="alert-content" v-html="alert.mensagem"></div>
    <div class="alert-close" @click="fecharModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="22.81" height="19.958" viewBox="0 0 22.81 19.958">
        <path id="Icon_awesome-window-close" data-name="Icon awesome-window-close"
              d="M20.671,1.5H2.138A2.139,2.139,0,0,0,0,3.638V19.32a2.139,2.139,0,0,0,2.138,2.138H20.671A2.139,2.139,0,0,0,22.81,19.32V3.638A2.139,2.139,0,0,0,20.671,1.5ZM16.947,14.442a.549.549,0,0,1,0,.775l-1.8,1.8a.549.549,0,0,1-.775,0L11.4,14.032,8.442,17.021a.549.549,0,0,1-.775,0l-1.8-1.8a.549.549,0,0,1,0-.775l2.989-2.963L5.863,8.517a.549.549,0,0,1,0-.775l1.8-1.8a.549.549,0,0,1,.775,0L11.4,8.926l2.963-2.989a.549.549,0,0,1,.775,0l1.8,1.8a.549.549,0,0,1,0,.775l-2.989,2.963,2.989,2.963Z"
              transform="translate(0 -1.5)" fill="#fff"/>
      </svg>
    </div>
  </div>
</template>

<script>
import {useAlertStore} from "../../store/alert";

export default {
  name: "Alert",
  props: {
    alert: Object,
  },
  setup() {
    const alertState = useAlertStore();
    return {alertState};
  },
  computed: {
    classeTipo() {
      switch (this.alert.tipo) {
        case 'error':
          return 'error'
        case 'success':
          return 'success'
        case 'info':
          return 'info'
        default:
          return 'success'
      }
    }
  },
  methods: {
    fecharModal() {
      this.alertState.removeAlert(this.alert.id);
    },
  },
  mounted() {
    const anchors = this.$refs.alert.querySelectorAll('a') // Not iterable

    Array.from(anchors).forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        this.$router.push(anchor.getAttribute('href'));
      })

    })
  }
}
</script>

<style scoped>
.alert {
  min-width: 461px;
  min-height: 36px;
  padding: 8px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  font-size: 14px;
  border-radius: 8px;


}


.alert :deep(a:visited) {
  color: #fff;
  text-decoration: underline;
}

.alert :deep(a) {
  color: #fff;
  text-decoration: underline;
  font-weight: bold;
}

.alert.error {
  background: var(--error-color-600);
  color: #fff;
}

.alert.success {
  background: var(--success-color-800);
  color: #fff;
}

.alert.info {
  background: var(--primary-color-800);
  color: #fff;
}

.alert-item-container.error {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-3);
  /* width: 100%; */
  left: 50%;
  transform: translate(-50%, 0%);
}

.alert-close {
  cursor: pointer;
}

.alert-close svg {
  display: block;
}

.alert-close:hover {
  opacity: 0.8;
}

</style>