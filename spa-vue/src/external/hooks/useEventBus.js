import mitt from 'mitt'

const emitter = mitt()

const $eventBus = {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}

export function useEventBus() {
  return {
    eventBus: $eventBus
  }
}
