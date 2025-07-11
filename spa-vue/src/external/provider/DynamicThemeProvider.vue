<template>
  <div class="themeprovider">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, onBeforeMount, watch, provide, ref } from 'vue'
import { shade, tint, readableColor, getContrast } from 'polished'

type Thema = {
  primaryColor: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
  escalaPrimaryColorPrincipal: number
  escalaPrimaryColorPrincipalHover: number
  escalaPrimaryColorPrincipalActive: number
  escalaPrimaryColorPrincipalFocus: number
}

const props = withDefaults(
  defineProps<{
    corThemaPrincipal?: string
    themeConfig?: Thema
    autoEscala?: boolean
  }>(),
  {
    corThemaPrincipal: undefined,
    themeConfig: undefined,
    autoEscala: true,
  }
)

const dados = reactive({
  corThemaPrincipal: props.corThemaPrincipal
})

const theme = ref({
  primaryColor: {
    50: '#b9cffc',
    100: '#a3c4f8',
    200: '#7baaf2',
    300: '#3e94da',
    400: '#007dc2',
    500: '#0d6495',
    600: '#1a4b69',
    700: '#0b2c40',
    800: '#071e29',
    900: '#05171e'
  },
  escalaPrimaryColorPrincipal: 600,
  escalaPrimaryColorPrincipalHover: 500,
  escalaPrimaryColorPrincipalActive: 400,
  escalaPrimaryColorPrincipalFocus: 500
})

provide('themaProps', {
  corThemaPrincipal: props.corThemaPrincipal,
  autoEscala: props.autoEscala,
  theme: theme.value,
  escalaPrimaryColorPrincipal: theme.value.escalaPrimaryColorPrincipal,
  escalaPrimaryColorPrincipalHover: theme.value.escalaPrimaryColorPrincipalHover,
  escalaPrimaryColorPrincipalActive: theme.value.escalaPrimaryColorPrincipalActive,
  escalaPrimaryColorPrincipalFocus: theme.value.escalaPrimaryColorPrincipalFocus,
  primaryColorPrincipal: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipal],
  primaryColorPrincipalHover: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalHover],
  primaryColorPrincipalActive: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalActive],
  primaryColorPrincipalFocus: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalFocus]
})

provide('thema', {
  theme: theme.value,
  escalaPrimaryColorPrincipal: theme.value.escalaPrimaryColorPrincipal,
  escalaPrimaryColorPrincipalHover: theme.value.escalaPrimaryColorPrincipalHover,
  escalaPrimaryColorPrincipalActive: theme.value.escalaPrimaryColorPrincipalActive,
  escalaPrimaryColorPrincipalFocus: theme.value.escalaPrimaryColorPrincipalFocus,
  primaryColorPrincipal: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipal],
  primaryColorPrincipalHover: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalHover],
  primaryColorPrincipalActive: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalActive],
  primaryColorPrincipalFocus: theme.value.primaryColor[theme.value.escalaPrimaryColorPrincipalFocus]
})

function gerarEscala(cor: string) {
  const corDireta = cor

  const corMaisEscura = shade(0.4, corDireta)

  const corEscuraReforcada = readableColor(corMaisEscura) === '#fff' ? corMaisEscura : corMaisEscura

  const contrasteRuim = getContrast(corDireta, '#fff') < 3 ? true : false

  const corSelecionada = contrasteRuim ? corEscuraReforcada : corDireta

  let novaEscala = {
    primaryColor: {
      50: tint(0.6, corSelecionada),
      100: tint(0.5, corSelecionada),
      200: tint(0.4, corSelecionada),
      300: tint(0.3, corSelecionada),
      400: tint(0.2, corSelecionada),
      500: tint(0.1, corSelecionada),
      600: corSelecionada,
      700: shade(0.1, corSelecionada),
      800: shade(0.2, corSelecionada),
      900: shade(0.3, corSelecionada)
    }
  }

  Object.assign(theme.value, novaEscala)
}

function configurarThema() {
  if (props.autoEscala && props.corThemaPrincipal) {
    gerarEscala(props.corThemaPrincipal)
  }

  if (props.themeConfig) {
    Object.assign(theme.value, props.themeConfig)
  }
}

watch(
  () => props.corThemaPrincipal,
  () => {
    if (props.corThemaPrincipal) {
      dados.corThemaPrincipal = props.corThemaPrincipal
      configurarThema()
    }
  }
)

onBeforeMount(() => {
  configurarThema()
})
</script>
<style scoped lang="scss">
.themeprovider {
  height: 100%;
}

$primary-colors: (
  50: v-bind('theme.primaryColor[50]'),
  100: v-bind('theme.primaryColor[100]'),
  200: v-bind('theme.primaryColor[200]'),
  300: v-bind('theme.primaryColor[300]'),
  400: v-bind('theme.primaryColor[400]'),
  500: v-bind('theme.primaryColor[500]'),
  600: v-bind('theme.primaryColor[600]'),
  700: v-bind('theme.primaryColor[700]'),
  800: v-bind('theme.primaryColor[800]'),
  900: v-bind('theme.primaryColor[900]')
);

// FUNÇÃO que cria variaveis CSS com as cores
@mixin create-color-variables($prefix, $color-map) {
  @each $value, $color in $color-map {
    --color-#{"" + $prefix}-#{$value}: #{$color};
  }
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

//   incluir variaveis no CSS
:root {
  @include create-color-variables(primary, $primary-colors);

  --color-primary-principal: v-bind('theme.primaryColor[theme.escalaPrimaryColorPrincipal]');
  --color-primary-principal-hover: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalHover]'
  );
  --color-primary-principal-active: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalActive]'
  );
  --color-primary-principal-focus: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalFocus]'
  );

  @include create-color-classes(primary, $primary-colors);
}

.themeprovider {
  @include create-color-variables(primary, $primary-colors);

  --color-primary-principal: v-bind('theme.primaryColor[theme.escalaPrimaryColorPrincipal]');
  --color-primary-principal-hover: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalHover]'
  );
  --color-primary-principal-active: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalActive]'
  );
  --color-primary-principal-focus: v-bind(
    'theme.primaryColor[theme.escalaPrimaryColorPrincipalFocus]'
  );

  @include create-color-classes(primary, $primary-colors);
}
</style>
