<template>
  <div class="themeprovider">
    <slot :thema="thema"></slot>
  </div>
</template>

<script setup>
import { defineProps, reactive, onBeforeMount, watch } from 'vue'
import { shade, tint, readableColor, getContrast } from 'polished'

const props = defineProps({
  corThemaPrincipal: {
    type: String,
    required: false
  }
})

const dados = reactive({
  corThemaPrincipal: props.corThemaPrincipal
})

const thema = reactive({
  primaryColor: {
    50: '#c4d8ff',
    100: '#abc7ff',
    200: '#8caff5',
    300: '#678edb',
    400: '#4871c2',
    500: '#2d57a8',
    600: '#18408f',
    700: '#082d75',
    800: '#001f5c',
    900: '#001642'
  }
})

function gerarEscala(cor) {
  const corDireta = cor

  const corMaisEscura = shade(0.4, corDireta)

  const corEscuraReforcada = readableColor(corMaisEscura) === '#fff' ? corMaisEscura : corMaisEscura

  const contrasteRuim = getContrast(corDireta, '#fff') < 3 ? true : false

  const corSelecionada = contrasteRuim ? corEscuraReforcada : corDireta

  let novaEscala = {
    primaryColor: {
      50: tint(0.4, corSelecionada),
      100: tint(0.3, corSelecionada),
      200: tint(0.2, corSelecionada),
      300: tint(0.1, corSelecionada),
      400: corSelecionada,
      500: shade(0.1, corSelecionada),
      600: shade(0.2, corSelecionada),
      700: shade(0.3, corSelecionada),
      800: shade(0.4, corSelecionada),
      900: shade(0.5, corSelecionada)
    }
  }

  Object.assign(thema, novaEscala)
}

watch(
  () => props.corThemaPrincipal,
  () => {
    if (props.corThemaPrincipal) {
      dados.corThemaPrincipal = props.corThemaPrincipal
      gerarEscala(props.corThemaPrincipal)
    }
  }
)

onBeforeMount(() => {
  if (props.corThemaPrincipal) {
    dados.corThemaPrincipal = props.corThemaPrincipal
    gerarEscala(props.corThemaPrincipal)
  }
})
</script>
<style scoped lang="scss">
$primary-colors: (
  50: v-bind('thema.primaryColor[50]'),
  100: v-bind('thema.primaryColor[100]'),
  200: v-bind('thema.primaryColor[200]'),
  300: v-bind('thema.primaryColor[300]'),
  400: v-bind('thema.primaryColor[400]'),
  500: v-bind('thema.primaryColor[500]'),
  600: v-bind('thema.primaryColor[600]'),
  700: v-bind('thema.primaryColor[700]'),
  800: v-bind('thema.primaryColor[800]'),
  900: v-bind('thema.primaryColor[900]')
);

// FUNÇÃO que cria variaveis CSS com as cores
@mixin create-color-variables($prefix, $color-map) {
  @each $value, $color in $color-map {
    --#{"" + $prefix}-color-#{$value}: #{$color};
  }
}

//   incluir variaveis no CSS
:deep(*) {
  @include create-color-variables(primary, $primary-colors);

  --primary-color-principal: var(--primary-color-400);
  --primary-color-principal-hover: var(--primary-color-300);
  --primary-color-principal-active: var(--primary-color-700);
  --primary-color-principal-focus: var(--primary-color-300);
}

// cria classes de texto e background com as cores
@mixin create-color-classes($prefix, $color-map) {
  @each $value, $color in $color-map {
    .text-#{'' + $prefix}-#{$value} {
      color: #{$color};
    }

    .bg-#{'' + $prefix}-#{$value} {
      background: #{$color};
    }
  }
}

@include create-color-classes(primary, $primary-colors);
</style>
